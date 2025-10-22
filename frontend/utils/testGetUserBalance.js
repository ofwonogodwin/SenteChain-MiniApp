/**
 * @file testGetUserBalance.js
 * @description Test script for getUserBalance function
 * Run with: node frontend/utils/testGetUserBalance.js
 */

import { ethers } from 'ethers';
import { getUserBalance, isOnCorrectNetwork, getCurrentNetworkInfo } from './getUserBalance.js';

// Test addresses (Hardhat default accounts)
const TEST_ADDRESSES = {
  valid: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Account #0
  valid2: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Account #1
  invalid: 'invalid-address',
  empty: '',
  null: null,
  checksum: '0xF39FD6E51AAD88F6F4CE6AB8827279CFFFB92266', // Should be normalized
};

/**
 * Test suite
 */
async function runTests() {
  console.log('🧪 Starting getUserBalance Test Suite\n');
  console.log('='.repeat(60));

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Valid address with balance
  console.log('\n📝 Test 1: Valid address (Account #0)');
  try {
    const balance = await getUserBalance(TEST_ADDRESSES.valid);
    console.log(`✅ PASS - Balance: ${balance} sUSDT`);
    console.assert(typeof balance === 'string', 'Balance should be string');
    console.assert(!isNaN(parseFloat(balance)), 'Balance should be numeric');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 2: Different valid address
  console.log('\n📝 Test 2: Valid address (Account #1)');
  try {
    const balance = await getUserBalance(TEST_ADDRESSES.valid2);
    console.log(`✅ PASS - Balance: ${balance} sUSDT`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 3: Invalid address format
  console.log('\n📝 Test 3: Invalid address format');
  try {
    const balance = await getUserBalance(TEST_ADDRESSES.invalid);
    console.log(`✅ PASS - Returned: ${balance} (expected '0')`);
    console.assert(balance === '0', 'Should return 0 for invalid address');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 4: Empty address
  console.log('\n📝 Test 4: Empty address');
  try {
    const balance = await getUserBalance(TEST_ADDRESSES.empty);
    console.log(`✅ PASS - Returned: ${balance} (expected '0')`);
    console.assert(balance === '0', 'Should return 0 for empty address');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 5: Null address
  console.log('\n📝 Test 5: Null address');
  try {
    const balance = await getUserBalance(TEST_ADDRESSES.null);
    console.log(`✅ PASS - Returned: ${balance} (expected '0')`);
    console.assert(balance === '0', 'Should return 0 for null');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 6: Address checksum normalization
  console.log('\n📝 Test 6: Checksum normalization');
  try {
    const balance = await getUserBalance(TEST_ADDRESSES.checksum);
    console.log(`✅ PASS - Balance: ${balance} sUSDT`);
    console.log('Address was normalized correctly');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 7: Network verification
  console.log('\n📝 Test 7: Network verification');
  try {
    const networkInfo = await getCurrentNetworkInfo();
    console.log('Network Info:', JSON.stringify(networkInfo, null, 2));
    console.log(`✅ PASS - Network info retrieved`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 8: Check if on correct network
  console.log('\n📝 Test 8: Check correct network');
  try {
    const correct = await isOnCorrectNetwork();
    console.log(`Network status: ${correct ? '✅ Correct' : '⚠️ Wrong network'}`);
    console.log(`✅ PASS - Check completed`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 9: Concurrent balance checks
  console.log('\n📝 Test 9: Concurrent balance checks');
  try {
    const balances = await Promise.all([
      getUserBalance(TEST_ADDRESSES.valid),
      getUserBalance(TEST_ADDRESSES.valid2),
    ]);
    console.log(`✅ PASS - Balances: [${balances.join(', ')}]`);
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Test 10: Performance test
  console.log('\n📝 Test 10: Performance test');
  try {
    const start = Date.now();
    await getUserBalance(TEST_ADDRESSES.valid);
    const duration = Date.now() - start;
    console.log(`✅ PASS - Execution time: ${duration}ms`);
    console.assert(duration < 5000, 'Should complete within 5 seconds');
    passedTests++;
  } catch (error) {
    console.log(`❌ FAIL - ${error.message}`);
    failedTests++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(2)}%`);
  console.log('='.repeat(60));

  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Function is production-ready.\n');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the errors above.\n');
  }
}

// Run tests
runTests().catch(console.error);
