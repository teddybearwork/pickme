#!/usr/bin/env python3
"""
PickMe Intelligence - Signzy API Integration
Handles premium phone verification and identity services
"""

import aiohttp
import logging
import json
from typing import Dict, Any, Optional
import os

logger = logging.getLogger(__name__)

class SignzyAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://preproduction.signzy.app/api/v3"
        self.headers = {
            'Authorization': api_key,
            'Content-Type': 'application/json'
        }
    
    async def verify_phone_number(self, phone_number: str) -> Dict[str, Any]:
        """Verify phone number and get owner details"""
        
        endpoint = f"{self.base_url}/identity/phone"
        payload = {
            "phone": phone_number,
            "country": "IN"  # Default to India
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint,
                    headers=self.headers,
                    json=payload
                ) as response:
                    
                    result = {
                        'status_code': response.status,
                        'success': False,
                        'data': {},
                        'error': None,
                        'credits_used': 2
                    }
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get('result', {}).get('status') == 'success':
                            result['success'] = True
                            result['data'] = {
                                'phone_number': phone_number,
                                'name': data.get('result', {}).get('name', 'Unknown'),
                                'operator': data.get('result', {}).get('operator', 'Unknown'),
                                'circle': data.get('result', {}).get('circle', 'Unknown'),
                                'location': data.get('result', {}).get('location', 'Unknown'),
                                'type': data.get('result', {}).get('type', 'Unknown'),
                                'verified': True,
                                'last_updated': data.get('result', {}).get('last_updated'),
                                'confidence_score': data.get('result', {}).get('confidence', 0)
                            }
                        else:
                            result['error'] = data.get('result', {}).get('message', 'Verification failed')
                    
                    elif response.status == 401:
                        result['error'] = 'Invalid API key'
                        result['credits_used'] = 0
                    
                    elif response.status == 429:
                        result['error'] = 'Rate limit exceeded'
                        result['credits_used'] = 0
                    
                    else:
                        error_data = await response.text()
                        result['error'] = f'API error: {error_data}'
                    
                    return result
        
        except aiohttp.ClientError as e:
            logger.error(f"Signzy API connection error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Connection error: {str(e)}',
                'credits_used': 0
            }
        
        except Exception as e:
            logger.error(f"Signzy API unexpected error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Unexpected error: {str(e)}',
                'credits_used': 0
            }
    
    async def verify_email(self, email: str) -> Dict[str, Any]:
        """Verify email address"""
        
        endpoint = f"{self.base_url}/identity/email"
        payload = {
            "email": email
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint,
                    headers=self.headers,
                    json=payload
                ) as response:
                    
                    result = {
                        'status_code': response.status,
                        'success': False,
                        'data': {},
                        'error': None,
                        'credits_used': 1
                    }
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get('result', {}).get('status') == 'success':
                            result['success'] = True
                            result['data'] = {
                                'email': email,
                                'valid': data.get('result', {}).get('valid', False),
                                'deliverable': data.get('result', {}).get('deliverable', False),
                                'domain': data.get('result', {}).get('domain', ''),
                                'provider': data.get('result', {}).get('provider', ''),
                                'risk_score': data.get('result', {}).get('risk_score', 0),
                                'disposable': data.get('result', {}).get('disposable', False)
                            }
                        else:
                            result['error'] = data.get('result', {}).get('message', 'Verification failed')
                    
                    else:
                        error_data = await response.text()
                        result['error'] = f'API error: {error_data}'
                    
                    return result
        
        except Exception as e:
            logger.error(f"Signzy email verification error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Error: {str(e)}',
                'credits_used': 0
            }
    
    async def get_phone_details(self, phone_number: str) -> Dict[str, Any]:
        """Get detailed phone number information"""
        
        endpoint = f"{self.base_url}/phone/details"
        payload = {
            "phone": phone_number,
            "country": "IN"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    endpoint,
                    headers=self.headers,
                    json=payload
                ) as response:
                    
                    result = {
                        'status_code': response.status,
                        'success': False,
                        'data': {},
                        'error': None,
                        'credits_used': 3
                    }
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        if data.get('result', {}).get('status') == 'success':
                            result['success'] = True
                            result['data'] = {
                                'phone_number': phone_number,
                                'owner_name': data.get('result', {}).get('owner_name', 'Unknown'),
                                'operator': data.get('result', {}).get('operator', 'Unknown'),
                                'circle': data.get('result', {}).get('circle', 'Unknown'),
                                'state': data.get('result', {}).get('state', 'Unknown'),
                                'city': data.get('result', {}).get('city', 'Unknown'),
                                'address': data.get('result', {}).get('address', 'Unknown'),
                                'alternate_numbers': data.get('result', {}).get('alternate_numbers', []),
                                'email_addresses': data.get('result', {}).get('email_addresses', []),
                                'social_profiles': data.get('result', {}).get('social_profiles', []),
                                'verification_date': data.get('result', {}).get('verification_date'),
                                'confidence_level': data.get('result', {}).get('confidence_level', 'Low')
                            }
                        else:
                            result['error'] = data.get('result', {}).get('message', 'Details not found')
                    
                    else:
                        error_data = await response.text()
                        result['error'] = f'API error: {error_data}'
                    
                    return result
        
        except Exception as e:
            logger.error(f"Signzy phone details error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Error: {str(e)}',
                'credits_used': 0
            }

# Mock Signzy API for development/testing
class MockSignzyAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def verify_phone_number(self, phone_number: str) -> Dict[str, Any]:
        """Mock phone verification"""
        
        # Simulate API delay
        import asyncio
        await asyncio.sleep(1)
        
        # Mock successful response for valid phone numbers
        if len(phone_number.replace('+', '').replace('-', '').replace(' ', '')) >= 10:
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'phone_number': phone_number,
                    'name': 'John Doe',
                    'operator': 'Airtel',
                    'circle': 'Tamil Nadu',
                    'location': 'Chennai',
                    'type': 'Mobile',
                    'verified': True,
                    'last_updated': '2024-01-01T00:00:00Z',
                    'confidence_score': 85
                },
                'error': None,
                'credits_used': 2
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid phone number format',
                'credits_used': 0
            }
    
    async def verify_email(self, email: str) -> Dict[str, Any]:
        """Mock email verification"""
        
        import asyncio
        await asyncio.sleep(1)
        
        if '@' in email and '.' in email:
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'email': email,
                    'valid': True,
                    'deliverable': True,
                    'domain': email.split('@')[1],
                    'provider': 'Gmail' if 'gmail' in email else 'Other',
                    'risk_score': 10,
                    'disposable': False
                },
                'error': None,
                'credits_used': 1
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid email format',
                'credits_used': 0
            }
    
    async def get_phone_details(self, phone_number: str) -> Dict[str, Any]:
        """Mock detailed phone information"""
        
        import asyncio
        await asyncio.sleep(2)
        
        if len(phone_number.replace('+', '').replace('-', '').replace(' ', '')) >= 10:
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'phone_number': phone_number,
                    'owner_name': 'John Doe',
                    'operator': 'Airtel',
                    'circle': 'Tamil Nadu',
                    'state': 'Tamil Nadu',
                    'city': 'Chennai',
                    'address': '123 Main Street, Chennai, Tamil Nadu',
                    'alternate_numbers': ['+91-9876543210'],
                    'email_addresses': ['john.doe@email.com'],
                    'social_profiles': ['https://facebook.com/johndoe'],
                    'verification_date': '2024-01-01T00:00:00Z',
                    'confidence_level': 'High'
                },
                'error': None,
                'credits_used': 3
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid phone number format',
                'credits_used': 0
            }

# Factory function to create appropriate API instance
def create_signzy_api(api_key: str, use_mock: bool = False) -> SignzyAPI:
    """Create Signzy API instance"""
    if use_mock or not api_key or api_key == 'mock':
        logger.info("Using Mock Signzy API")
        return MockSignzyAPI(api_key)
    else:
        logger.info("Using Real Signzy API")
        return SignzyAPI(api_key)

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def test_signzy():
        # Test with mock API
        api = create_signzy_api('mock', use_mock=True)
        
        # Test phone verification
        result = await api.verify_phone_number('+91-9791103607')
        print("Phone verification result:", json.dumps(result, indent=2))
        
        # Test email verification
        result = await api.verify_email('test@example.com')
        print("Email verification result:", json.dumps(result, indent=2))
        
        # Test detailed phone info
        result = await api.get_phone_details('+91-9791103607')
        print("Phone details result:", json.dumps(result, indent=2))
    
    asyncio.run(test_signzy())