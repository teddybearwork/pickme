#!/usr/bin/env python3
"""
PickMe Intelligence - Telegram Bot
Handles officer authentication, query processing, and result delivery
"""

import os
import asyncio
import logging
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

import aiohttp
import asyncpg
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command, Text
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram import F

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/telegram_bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class PickMeBot:
    def __init__(self):
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.api_base_url = os.getenv('API_BASE_URL', 'http://localhost:3001/api')
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.bot_token:
            raise ValueError("TELEGRAM_BOT_TOKEN environment variable is required")
        
        self.bot = Bot(token=self.bot_token)
        self.dp = Dispatcher()
        self.db_pool = None
        
        # Rate limiting storage (in production, use Redis)
        self.rate_limits = {}
        
        # Register handlers
        self.register_handlers()
    
    async def init_database(self):
        """Initialize database connection pool"""
        try:
            # Extract database URL from Supabase URL
            db_url = self.supabase_url.replace('https://', 'postgresql://postgres:')
            db_url = db_url.replace('.supabase.co', '.supabase.co:5432/postgres')
            
            self.db_pool = await asyncpg.create_pool(
                db_url,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("Database connection pool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise
    
    def register_handlers(self):
        """Register bot command and message handlers"""
        
        # Command handlers
        self.dp.message(Command("start"))(self.cmd_start)
        self.dp.message(Command("help"))(self.cmd_help)
        self.dp.message(Command("register"))(self.cmd_register)
        self.dp.message(Command("status"))(self.cmd_status)
        self.dp.message(Command("credits"))(self.cmd_credits)
        self.dp.message(Command("history"))(self.cmd_history)
        
        # Query handlers
        self.dp.message(Command("osint"))(self.cmd_osint)
        self.dp.message(Command("pro"))(self.cmd_pro)
        
        # Natural language handler (catch-all)
        self.dp.message(F.text)(self.handle_natural_language)
        
        # Callback query handlers
        self.dp.callback_query(F.data.startswith("confirm_"))(self.handle_confirmation)
    
    async def cmd_start(self, message: Message):
        """Handle /start command"""
        user_id = message.from_user.id
        username = message.from_user.username
        
        logger.info(f"Start command from user {user_id} (@{username})")
        
        welcome_text = """
🚔 **Welcome to PickMe Intelligence**

Your advanced OSINT and investigation platform for law enforcement.

**Available Commands:**
• `/register` - Register as an officer
• `/osint <query>` - Free OSINT search
• `/pro <query>` - Premium API search
• `/status` - Check your account status
• `/credits` - View credit balance
• `/history` - View query history
• `/help` - Show detailed help

**Natural Language Queries:**
You can also type natural language queries like:
• "Find owner of 9791103607"
• "Search social media for john.doe@email.com"
• "Verify AADHAAR 123456789012"

🔒 **Secure • Encrypted • Compliant**
        """
        
        await message.answer(welcome_text, parse_mode="Markdown")
    
    async def cmd_help(self, message: Message):
        """Handle /help command"""
        help_text = """
📖 **PickMe Intelligence - Help Guide**

**🔍 Query Types:**

**OSINT Queries (Free):**
• Social media searches
• Email/username lookups
• Basic phone number info
• Public records search

**PRO Queries (Credits Required):**
• Phone number verification (Signzy)
• Identity verification (Surepass)
• Advanced background checks
• Financial verification

**📱 Query Formats:**

**Command Format:**
• `/osint phone:9791103607`
• `/pro aadhaar:123456789012`
• `/osint email:john@example.com`

**Natural Language:**
• "Find owner of this number 9791103607"
• "Verify this Aadhaar 123456789012"
• "Search social media for john.doe"

**⚡ Quick Commands:**
• `/status` - Account information
• `/credits` - Credit balance
• `/history` - Last 10 queries

**🛡️ Security:**
All queries are logged and encrypted. Use responsibly and in accordance with law enforcement guidelines.

**📞 Support:**
Contact your system administrator for technical issues.
        """
        
        await message.answer(help_text, parse_mode="Markdown")
    
    async def cmd_register(self, message: Message):
        """Handle officer registration"""
        user_id = message.from_user.id
        username = message.from_user.username
        
        # Check if already registered
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        if officer:
            await message.answer(
                f"✅ You are already registered as **{officer['name']}**\n"
                f"Credits: {officer['credits_remaining']}/{officer['total_credits']}\n"
                f"Status: {officer['status']}",
                parse_mode="Markdown"
            )
            return
        
        registration_text = """
📝 **Officer Registration**

To register, please contact your system administrator with:
• Your Telegram username: @{username}
• Your mobile number
• Your badge number
• Your department

Once registered, you'll receive confirmation and can start using the system.

**Note:** Only authorized law enforcement personnel can be registered.
        """.format(username=username)
        
        await message.answer(registration_text, parse_mode="Markdown")
    
    async def cmd_status(self, message: Message):
        """Show officer status and account info"""
        username = message.from_user.username
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        
        if not officer:
            await message.answer("❌ You are not registered. Use /register to get started.")
            return
        
        # Get recent query count
        recent_queries = await self.get_recent_query_count(officer['id'])
        
        status_text = f"""
👮 **Officer Status**

**Name:** {officer['name']}
**Badge:** {officer.get('badge_number', 'N/A')}
**Department:** {officer.get('department', 'N/A')}
**Status:** {officer['status']}

**💳 Credits:**
• Remaining: {officer['credits_remaining']}
• Total: {officer['total_credits']}
• Used: {officer['total_credits'] - officer['credits_remaining']}

**📊 Statistics:**
• Total Queries: {officer['total_queries']}
• Queries Today: {recent_queries}
• Last Active: {officer.get('last_active', 'Never')}

**⚡ Rate Limit:** {officer.get('rate_limit_per_hour', 100)} queries/hour
        """
        
        await message.answer(status_text, parse_mode="Markdown")
    
    async def cmd_credits(self, message: Message):
        """Show credit balance and recent transactions"""
        username = message.from_user.username
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        
        if not officer:
            await message.answer("❌ You are not registered. Use /register to get started.")
            return
        
        # Get recent credit transactions
        transactions = await self.get_recent_transactions(officer['id'])
        
        credits_text = f"""
💳 **Credit Balance**

**Current Balance:** {officer['credits_remaining']} credits
**Total Allocated:** {officer['total_credits']} credits
**Used:** {officer['total_credits'] - officer['credits_remaining']} credits

**Recent Transactions:**
        """
        
        for tx in transactions[:5]:  # Show last 5 transactions
            action_emoji = "➕" if tx['credits'] > 0 else "➖"
            credits_text += f"\n{action_emoji} {tx['action']}: {tx['credits']} credits ({tx['created_at'][:10]})"
        
        if not transactions:
            credits_text += "\nNo recent transactions."
        
        credits_text += f"""

**💰 Credit Costs:**
• OSINT Queries: Free
• PRO Queries: 1-3 credits each
• Phone Verification: 2 credits
• Identity Verification: 3 credits
        """
        
        await message.answer(credits_text, parse_mode="Markdown")
    
    async def cmd_history(self, message: Message):
        """Show recent query history"""
        username = message.from_user.username
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        
        if not officer:
            await message.answer("❌ You are not registered. Use /register to get started.")
            return
        
        # Get recent queries
        queries = await self.get_recent_queries(officer['id'])
        
        if not queries:
            await message.answer("📝 No recent queries found.")
            return
        
        history_text = "📋 **Recent Query History**\n\n"
        
        for query in queries[:10]:  # Show last 10 queries
            status_emoji = "✅" if query['status'] == 'Success' else "❌" if query['status'] == 'Failed' else "⏳"
            type_emoji = "🔍" if query['type'] == 'OSINT' else "💎"
            
            history_text += f"{status_emoji} {type_emoji} **{query['type']}** - {query['input'][:30]}...\n"
            history_text += f"   Source: {query['source']} | Credits: {query['credits_used']} | {query['created_at'][:16]}\n\n"
        
        await message.answer(history_text, parse_mode="Markdown")
    
    async def cmd_osint(self, message: Message):
        """Handle OSINT query command"""
        username = message.from_user.username
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        
        if not officer:
            await message.answer("❌ You are not registered. Use /register to get started.")
            return
        
        if officer['status'] != 'Active':
            await message.answer("❌ Your account is not active. Contact your administrator.")
            return
        
        # Extract query from command
        query_text = message.text.replace('/osint', '').strip()
        if not query_text:
            await message.answer("❌ Please provide a query. Example: `/osint phone:9791103607`")
            return
        
        # Check rate limiting
        if not await self.check_rate_limit(officer['id']):
            await message.answer("⚠️ Rate limit exceeded. Please wait before making another query.")
            return
        
        await self.process_query(message, officer, 'OSINT', query_text)
    
    async def cmd_pro(self, message: Message):
        """Handle PRO query command"""
        username = message.from_user.username
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        
        if not officer:
            await message.answer("❌ You are not registered. Use /register to get started.")
            return
        
        if officer['status'] != 'Active':
            await message.answer("❌ Your account is not active. Contact your administrator.")
            return
        
        if not officer.get('pro_access_enabled', True):
            await message.answer("❌ PRO access is disabled for your account.")
            return
        
        # Extract query from command
        query_text = message.text.replace('/pro', '').strip()
        if not query_text:
            await message.answer("❌ Please provide a query. Example: `/pro phone:9791103607`")
            return
        
        # Check credits
        estimated_cost = self.estimate_query_cost(query_text)
        if officer['credits_remaining'] < estimated_cost:
            await message.answer(f"❌ Insufficient credits. Required: {estimated_cost}, Available: {officer['credits_remaining']}")
            return
        
        # Check rate limiting
        if not await self.check_rate_limit(officer['id']):
            await message.answer("⚠️ Rate limit exceeded. Please wait before making another query.")
            return
        
        # Show confirmation for PRO queries
        keyboard = InlineKeyboardBuilder()
        keyboard.add(InlineKeyboardButton(
            text=f"✅ Confirm ({estimated_cost} credits)",
            callback_data=f"confirm_pro_{officer['id']}_{estimated_cost}"
        ))
        keyboard.add(InlineKeyboardButton(
            text="❌ Cancel",
            callback_data="cancel_query"
        ))
        
        await message.answer(
            f"💎 **PRO Query Confirmation**\n\n"
            f"Query: `{query_text}`\n"
            f"Estimated Cost: {estimated_cost} credits\n"
            f"Your Balance: {officer['credits_remaining']} credits\n\n"
            f"Proceed with this query?",
            reply_markup=keyboard.as_markup(),
            parse_mode="Markdown"
        )
        
        # Store query for confirmation
        self.pending_queries = getattr(self, 'pending_queries', {})
        self.pending_queries[f"pro_{officer['id']}_{estimated_cost}"] = {
            'officer': officer,
            'query_text': query_text,
            'message': message
        }
    
    async def handle_confirmation(self, callback_query: types.CallbackQuery):
        """Handle query confirmation callbacks"""
        data = callback_query.data
        
        if data.startswith("confirm_pro_"):
            # Extract officer_id and cost from callback data
            parts = data.replace("confirm_pro_", "").split("_")
            officer_id = parts[0]
            estimated_cost = int(parts[1])
            
            # Get pending query
            pending_key = f"pro_{officer_id}_{estimated_cost}"
            pending_query = getattr(self, 'pending_queries', {}).get(pending_key)
            
            if not pending_query:
                await callback_query.answer("❌ Query expired. Please try again.")
                return
            
            await callback_query.answer("✅ Processing PRO query...")
            await self.process_query(
                pending_query['message'],
                pending_query['officer'],
                'PRO',
                pending_query['query_text']
            )
            
            # Clean up pending query
            del self.pending_queries[pending_key]
        
        elif data == "cancel_query":
            await callback_query.answer("❌ Query cancelled.")
            await callback_query.message.edit_text("❌ Query cancelled.")
    
    async def handle_natural_language(self, message: Message):
        """Handle natural language queries"""
        username = message.from_user.username
        officer = await self.get_officer_by_telegram_id(f"@{username}")
        
        if not officer:
            await message.answer("❌ You are not registered. Use /register to get started.")
            return
        
        if officer['status'] != 'Active':
            await message.answer("❌ Your account is not active. Contact your administrator.")
            return
        
        query_text = message.text.strip()
        
        # Parse natural language to determine query type and extract data
        query_type, parsed_query = self.parse_natural_language(query_text)
        
        if not parsed_query:
            await message.answer(
                "❓ I couldn't understand your query. Try:\n"
                "• `/osint phone:9791103607`\n"
                "• `/pro aadhaar:123456789012`\n"
                "• \"Find owner of 9791103607\"\n"
                "• \"Verify Aadhaar 123456789012\""
            )
            return
        
        # Check rate limiting
        if not await self.check_rate_limit(officer['id']):
            await message.answer("⚠️ Rate limit exceeded. Please wait before making another query.")
            return
        
        if query_type == 'PRO':
            # Check credits and show confirmation for PRO queries
            estimated_cost = self.estimate_query_cost(parsed_query)
            if officer['credits_remaining'] < estimated_cost:
                await message.answer(f"❌ Insufficient credits. Required: {estimated_cost}, Available: {officer['credits_remaining']}")
                return
            
            # Show confirmation
            keyboard = InlineKeyboardBuilder()
            keyboard.add(InlineKeyboardButton(
                text=f"✅ Confirm ({estimated_cost} credits)",
                callback_data=f"confirm_pro_{officer['id']}_{estimated_cost}"
            ))
            keyboard.add(InlineKeyboardButton(
                text="❌ Cancel",
                callback_data="cancel_query"
            ))
            
            await message.answer(
                f"💎 **PRO Query Detected**\n\n"
                f"Query: `{parsed_query}`\n"
                f"Estimated Cost: {estimated_cost} credits\n"
                f"Your Balance: {officer['credits_remaining']} credits\n\n"
                f"Proceed with this query?",
                reply_markup=keyboard.as_markup(),
                parse_mode="Markdown"
            )
            
            # Store query for confirmation
            self.pending_queries = getattr(self, 'pending_queries', {})
            self.pending_queries[f"pro_{officer['id']}_{estimated_cost}"] = {
                'officer': officer,
                'query_text': parsed_query,
                'message': message
            }
        else:
            # Process OSINT query directly
            await self.process_query(message, officer, 'OSINT', parsed_query)
    
    def parse_natural_language(self, text: str) -> Tuple[str, Optional[str]]:
        """Parse natural language query and determine type"""
        text_lower = text.lower()
        
        # Phone number patterns
        phone_patterns = [
            r'(?:phone|number|mobile|cell).*?(\+?[1-9]\d{9,14})',
            r'(\+?[1-9]\d{9,14}).*?(?:owner|details|info)',
            r'find.*?(\+?[1-9]\d{9,14})',
            r'(\d{10})',  # Simple 10-digit number
        ]
        
        # Email patterns
        email_patterns = [
            r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
        ]
        
        # Aadhaar patterns
        aadhaar_patterns = [
            r'(?:aadhaar|aadhar).*?(\d{12})',
            r'verify.*?(\d{12})',
        ]
        
        # Check for phone numbers
        for pattern in phone_patterns:
            match = re.search(pattern, text)
            if match:
                phone = match.group(1)
                # Determine if it's PRO or OSINT based on keywords
                if any(keyword in text_lower for keyword in ['verify', 'owner', 'details', 'signzy']):
                    return 'PRO', f"phone:{phone}"
                else:
                    return 'OSINT', f"phone:{phone}"
        
        # Check for emails
        for pattern in email_patterns:
            match = re.search(pattern, text)
            if match:
                email = match.group(1)
                return 'OSINT', f"email:{email}"
        
        # Check for Aadhaar
        for pattern in aadhaar_patterns:
            match = re.search(pattern, text)
            if match:
                aadhaar = match.group(1)
                return 'PRO', f"aadhaar:{aadhaar}"
        
        # Default to OSINT for general searches
        if len(text) > 3:
            return 'OSINT', f"general:{text}"
        
        return 'UNKNOWN', None
    
    def estimate_query_cost(self, query: str) -> int:
        """Estimate credit cost for a query"""
        query_lower = query.lower()
        
        if 'phone:' in query_lower:
            return 2  # Phone verification
        elif 'aadhaar:' in query_lower:
            return 3  # Identity verification
        elif 'pan:' in query_lower:
            return 2  # PAN verification
        elif 'email:' in query_lower:
            return 1  # Email verification
        else:
            return 1  # Default cost
    
    async def process_query(self, message: Message, officer: dict, query_type: str, query_text: str):
        """Process a query and return results"""
        start_time = datetime.now()
        
        # Send processing message
        processing_msg = await message.answer(f"🔍 Processing {query_type} query...")
        
        try:
            # Create request record
            request_data = {
                'officer_id': officer['id'],
                'type': query_type,
                'input': query_text,
                'status': 'Processing',
                'platform': 'telegram'
            }
            
            # Call backend API to process query
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.api_base_url}/queries/process",
                    json=request_data,
                    headers={'Authorization': f'Bearer {self.get_system_token()}'}
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        await self.send_query_result(message, result, processing_msg)
                    else:
                        error_text = await response.text()
                        logger.error(f"Query processing failed: {error_text}")
                        await processing_msg.edit_text("❌ Query processing failed. Please try again.")
        
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            await processing_msg.edit_text("❌ An error occurred while processing your query.")
        
        finally:
            # Log processing time
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.info(f"Query processed in {processing_time:.2f} seconds")
    
    async def send_query_result(self, message: Message, result: dict, processing_msg: Message):
        """Send formatted query results to user"""
        try:
            if result['status'] == 'Success':
                result_text = f"✅ **Query Successful**\n\n"
                result_text += f"**Type:** {result['type']}\n"
                result_text += f"**Source:** {result['source']}\n"
                result_text += f"**Credits Used:** {result['credits_used']}\n\n"
                result_text += f"**Results:**\n{result['result_summary']}\n\n"
                
                if result.get('response_time_ms'):
                    result_text += f"**Response Time:** {result['response_time_ms']}ms\n"
                
                result_text += f"**Query ID:** `{result['id']}`"
                
                await processing_msg.edit_text(result_text, parse_mode="Markdown")
                
                # Send additional files if available
                if result.get('files'):
                    for file_url in result['files']:
                        try:
                            await message.answer_document(file_url)
                        except Exception as e:
                            logger.error(f"Failed to send file {file_url}: {e}")
            
            else:
                error_text = f"❌ **Query Failed**\n\n"
                error_text += f"**Type:** {result['type']}\n"
                error_text += f"**Error:** {result.get('error_message', 'Unknown error')}\n"
                error_text += f"**Credits Used:** {result['credits_used']}\n\n"
                error_text += f"**Query ID:** `{result['id']}`"
                
                await processing_msg.edit_text(error_text, parse_mode="Markdown")
        
        except Exception as e:
            logger.error(f"Error sending result: {e}")
            await processing_msg.edit_text("❌ Error displaying results.")
    
    async def check_rate_limit(self, officer_id: str) -> bool:
        """Check if officer has exceeded rate limit"""
        now = datetime.now()
        hour_key = now.strftime("%Y%m%d%H")
        rate_key = f"{officer_id}_{hour_key}"
        
        current_count = self.rate_limits.get(rate_key, 0)
        
        # Get officer's rate limit (default 100 per hour)
        officer = await self.get_officer_by_id(officer_id)
        rate_limit = officer.get('rate_limit_per_hour', 100) if officer else 100
        
        if current_count >= rate_limit:
            return False
        
        # Increment counter
        self.rate_limits[rate_key] = current_count + 1
        
        # Clean up old entries
        cutoff_time = now - timedelta(hours=2)
        cutoff_key = cutoff_time.strftime("%Y%m%d%H")
        keys_to_remove = [k for k in self.rate_limits.keys() if k.endswith(cutoff_key)]
        for key in keys_to_remove:
            del self.rate_limits[key]
        
        return True
    
    def get_system_token(self) -> str:
        """Get system JWT token for API calls"""
        # In production, implement proper JWT token generation
        return "system_token_placeholder"
    
    # Database helper methods
    async def get_officer_by_telegram_id(self, telegram_id: str) -> Optional[dict]:
        """Get officer by Telegram ID"""
        if not self.db_pool:
            return None
        
        async with self.db_pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM officers WHERE telegram_id = $1",
                telegram_id
            )
            return dict(row) if row else None
    
    async def get_officer_by_id(self, officer_id: str) -> Optional[dict]:
        """Get officer by ID"""
        if not self.db_pool:
            return None
        
        async with self.db_pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM officers WHERE id = $1",
                officer_id
            )
            return dict(row) if row else None
    
    async def get_recent_query_count(self, officer_id: str) -> int:
        """Get today's query count for officer"""
        if not self.db_pool:
            return 0
        
        today = datetime.now().date()
        async with self.db_pool.acquire() as conn:
            count = await conn.fetchval(
                "SELECT COUNT(*) FROM requests WHERE officer_id = $1 AND DATE(created_at) = $2",
                officer_id, today
            )
            return count or 0
    
    async def get_recent_transactions(self, officer_id: str) -> List[dict]:
        """Get recent credit transactions for officer"""
        if not self.db_pool:
            return []
        
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM credit_transactions WHERE officer_id = $1 ORDER BY created_at DESC LIMIT 10",
                officer_id
            )
            return [dict(row) for row in rows]
    
    async def get_recent_queries(self, officer_id: str) -> List[dict]:
        """Get recent queries for officer"""
        if not self.db_pool:
            return []
        
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM requests WHERE officer_id = $1 ORDER BY created_at DESC LIMIT 10",
                officer_id
            )
            return [dict(row) for row in rows]
    
    async def start_bot(self):
        """Start the bot"""
        try:
            await self.init_database()
            logger.info("Starting PickMe Intelligence Telegram Bot...")
            await self.dp.start_polling(self.bot)
        except Exception as e:
            logger.error(f"Failed to start bot: {e}")
            raise
        finally:
            if self.db_pool:
                await self.db_pool.close()

# Main execution
async def main():
    bot = PickMeBot()
    await bot.start_bot()

if __name__ == "__main__":
    asyncio.run(main())