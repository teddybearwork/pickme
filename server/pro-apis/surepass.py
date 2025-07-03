#!/usr/bin/env python3
"""
PickMe Intelligence - Surepass API Integration
Handles premium identity verification services
"""

import aiohttp
import logging
import json
from typing import Dict, Any, Optional
import os

logger = logging.getLogger(__name__)

class SurepassAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://kyc-api.surepass.io/api/v1"
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    async def verify_aadhaar(self, aadhaar_number: str) -> Dict[str, Any]:
        """Verify Aadhaar number"""
        
        endpoint = f"{self.base_url}/aadhaar-verification"
        payload = {
            "id_number": aadhaar_number
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
                        
                        if data.get('status_code') == 200:
                            result['success'] = True
                            result['data'] = {
                                'aadhaar_number': aadhaar_number,
                                'name': data.get('data', {}).get('name', 'Unknown'),
                                'date_of_birth': data.get('data', {}).get('dob', 'Unknown'),
                                'gender': data.get('data', {}).get('gender', 'Unknown'),
                                'address': data.get('data', {}).get('address', 'Unknown'),
                                'state': data.get('data', {}).get('state', 'Unknown'),
                                'district': data.get('data', {}).get('district', 'Unknown'),
                                'pincode': data.get('data', {}).get('pincode', 'Unknown'),
                                'verified': True,
                                'verification_date': data.get('data', {}).get('verification_date'),
                                'status': data.get('data', {}).get('status', 'Active')
                            }
                        else:
                            result['error'] = data.get('message', 'Verification failed')
                    
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
            logger.error(f"Surepass API connection error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Connection error: {str(e)}',
                'credits_used': 0
            }
        
        except Exception as e:
            logger.error(f"Surepass API unexpected error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Unexpected error: {str(e)}',
                'credits_used': 0
            }
    
    async def verify_pan(self, pan_number: str) -> Dict[str, Any]:
        """Verify PAN number"""
        
        endpoint = f"{self.base_url}/pan-verification"
        payload = {
            "id_number": pan_number
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
                        
                        if data.get('status_code') == 200:
                            result['success'] = True
                            result['data'] = {
                                'pan_number': pan_number,
                                'name': data.get('data', {}).get('name', 'Unknown'),
                                'father_name': data.get('data', {}).get('father_name', 'Unknown'),
                                'date_of_birth': data.get('data', {}).get('dob', 'Unknown'),
                                'category': data.get('data', {}).get('category', 'Unknown'),
                                'status': data.get('data', {}).get('status', 'Unknown'),
                                'verified': True,
                                'last_updated': data.get('data', {}).get('last_updated')
                            }
                        else:
                            result['error'] = data.get('message', 'Verification failed')
                    
                    else:
                        error_data = await response.text()
                        result['error'] = f'API error: {error_data}'
                    
                    return result
        
        except Exception as e:
            logger.error(f"Surepass PAN verification error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Error: {str(e)}',
                'credits_used': 0
            }
    
    async def verify_driving_license(self, dl_number: str, date_of_birth: str) -> Dict[str, Any]:
        """Verify Driving License"""
        
        endpoint = f"{self.base_url}/driving-license-verification"
        payload = {
            "id_number": dl_number,
            "date_of_birth": date_of_birth
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
                        
                        if data.get('status_code') == 200:
                            result['success'] = True
                            result['data'] = {
                                'dl_number': dl_number,
                                'name': data.get('data', {}).get('name', 'Unknown'),
                                'father_name': data.get('data', {}).get('father_name', 'Unknown'),
                                'date_of_birth': data.get('data', {}).get('dob', 'Unknown'),
                                'address': data.get('data', {}).get('address', 'Unknown'),
                                'state': data.get('data', {}).get('state', 'Unknown'),
                                'rto_code': data.get('data', {}).get('rto_code', 'Unknown'),
                                'vehicle_class': data.get('data', {}).get('vehicle_class', []),
                                'issue_date': data.get('data', {}).get('issue_date', 'Unknown'),
                                'expiry_date': data.get('data', {}).get('expiry_date', 'Unknown'),
                                'status': data.get('data', {}).get('status', 'Unknown'),
                                'verified': True
                            }
                        else:
                            result['error'] = data.get('message', 'Verification failed')
                    
                    else:
                        error_data = await response.text()
                        result['error'] = f'API error: {error_data}'
                    
                    return result
        
        except Exception as e:
            logger.error(f"Surepass DL verification error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Error: {str(e)}',
                'credits_used': 0
            }
    
    async def verify_voter_id(self, voter_id: str) -> Dict[str, Any]:
        """Verify Voter ID"""
        
        endpoint = f"{self.base_url}/voter-id-verification"
        payload = {
            "id_number": voter_id
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
                        
                        if data.get('status_code') == 200:
                            result['success'] = True
                            result['data'] = {
                                'voter_id': voter_id,
                                'name': data.get('data', {}).get('name', 'Unknown'),
                                'father_name': data.get('data', {}).get('father_name', 'Unknown'),
                                'age': data.get('data', {}).get('age', 'Unknown'),
                                'gender': data.get('data', {}).get('gender', 'Unknown'),
                                'address': data.get('data', {}).get('address', 'Unknown'),
                                'state': data.get('data', {}).get('state', 'Unknown'),
                                'constituency': data.get('data', {}).get('constituency', 'Unknown'),
                                'polling_station': data.get('data', {}).get('polling_station', 'Unknown'),
                                'status': data.get('data', {}).get('status', 'Unknown'),
                                'verified': True
                            }
                        else:
                            result['error'] = data.get('message', 'Verification failed')
                    
                    else:
                        error_data = await response.text()
                        result['error'] = f'API error: {error_data}'
                    
                    return result
        
        except Exception as e:
            logger.error(f"Surepass Voter ID verification error: {e}")
            return {
                'status_code': 0,
                'success': False,
                'data': {},
                'error': f'Error: {str(e)}',
                'credits_used': 0
            }

# Mock Surepass API for development/testing
class MockSurepassAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def verify_aadhaar(self, aadhaar_number: str) -> Dict[str, Any]:
        """Mock Aadhaar verification"""
        
        import asyncio
        await asyncio.sleep(2)
        
        if len(aadhaar_number) == 12 and aadhaar_number.isdigit():
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'aadhaar_number': aadhaar_number,
                    'name': 'John Doe',
                    'date_of_birth': '01/01/1990',
                    'gender': 'Male',
                    'address': '123 Main Street, Chennai, Tamil Nadu',
                    'state': 'Tamil Nadu',
                    'district': 'Chennai',
                    'pincode': '600001',
                    'verified': True,
                    'verification_date': '2024-01-01T00:00:00Z',
                    'status': 'Active'
                },
                'error': None,
                'credits_used': 3
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid Aadhaar number format',
                'credits_used': 0
            }
    
    async def verify_pan(self, pan_number: str) -> Dict[str, Any]:
        """Mock PAN verification"""
        
        import asyncio
        await asyncio.sleep(1.5)
        
        if len(pan_number) == 10 and pan_number[:5].isalpha() and pan_number[5:9].isdigit() and pan_number[9].isalpha():
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'pan_number': pan_number,
                    'name': 'John Doe',
                    'father_name': 'Father Name',
                    'date_of_birth': '01/01/1990',
                    'category': 'Individual',
                    'status': 'Valid',
                    'verified': True,
                    'last_updated': '2024-01-01T00:00:00Z'
                },
                'error': None,
                'credits_used': 2
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid PAN number format',
                'credits_used': 0
            }
    
    async def verify_driving_license(self, dl_number: str, date_of_birth: str) -> Dict[str, Any]:
        """Mock Driving License verification"""
        
        import asyncio
        await asyncio.sleep(1.5)
        
        if len(dl_number) >= 10:
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'dl_number': dl_number,
                    'name': 'John Doe',
                    'father_name': 'Father Name',
                    'date_of_birth': date_of_birth,
                    'address': '123 Main Street, Chennai, Tamil Nadu',
                    'state': 'Tamil Nadu',
                    'rto_code': 'TN01',
                    'vehicle_class': ['LMV', 'MCWG'],
                    'issue_date': '01/01/2020',
                    'expiry_date': '01/01/2040',
                    'status': 'Valid',
                    'verified': True
                },
                'error': None,
                'credits_used': 2
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid DL number format',
                'credits_used': 0
            }
    
    async def verify_voter_id(self, voter_id: str) -> Dict[str, Any]:
        """Mock Voter ID verification"""
        
        import asyncio
        await asyncio.sleep(1.5)
        
        if len(voter_id) >= 8:
            return {
                'status_code': 200,
                'success': True,
                'data': {
                    'voter_id': voter_id,
                    'name': 'John Doe',
                    'father_name': 'Father Name',
                    'age': '34',
                    'gender': 'Male',
                    'address': '123 Main Street, Chennai, Tamil Nadu',
                    'state': 'Tamil Nadu',
                    'constituency': 'Chennai Central',
                    'polling_station': 'Government School',
                    'status': 'Active',
                    'verified': True
                },
                'error': None,
                'credits_used': 2
            }
        else:
            return {
                'status_code': 400,
                'success': False,
                'data': {},
                'error': 'Invalid Voter ID format',
                'credits_used': 0
            }

# Factory function to create appropriate API instance
def create_surepass_api(api_key: str, use_mock: bool = False) -> SurepassAPI:
    """Create Surepass API instance"""
    if use_mock or not api_key or api_key == 'mock':
        logger.info("Using Mock Surepass API")
        return MockSurepassAPI(api_key)
    else:
        logger.info("Using Real Surepass API")
        return SurepassAPI(api_key)

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def test_surepass():
        # Test with mock API
        api = create_surepass_api('mock', use_mock=True)
        
        # Test Aadhaar verification
        result = await api.verify_aadhaar('123456789012')
        print("Aadhaar verification result:", json.dumps(result, indent=2))
        
        # Test PAN verification
        result = await api.verify_pan('ABCDE1234F')
        print("PAN verification result:", json.dumps(result, indent=2))
        
        # Test DL verification
        result = await api.verify_driving_license('TN0120200001234', '01/01/1990')
        print("DL verification result:", json.dumps(result, indent=2))
        
        # Test Voter ID verification
        result = await api.verify_voter_id('ABC1234567')
        print("Voter ID verification result:", json.dumps(result, indent=2))
    
    asyncio.run(test_surepass())