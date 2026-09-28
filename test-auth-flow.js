/**
 * Тест полного flow авторизации
 */

const API_URL = 'http://localhost:3002';

async function testStudentLogin() {
  console.log('\n=== STUDENT LOGIN TEST ===\n');
  
  try {
    const response = await fetch(`${API_URL}/api/auth/student/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'student@test.com',
        password: 'test123',
      }),
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));
    
    const text = await response.text();
    console.log('Raw Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', JSON.stringify(data, null, 2));
      return data;
    } catch (e) {
      console.error('JSON Parse Error:', e.message);
      console.error('Response was:', text.substring(0, 200));
      return null;
    }
  } catch (error) {
    console.error('Request Error:', error.message);
    return null;
  }
}

async function testEmployeeLogin2FA() {
  console.log('\n=== EMPLOYEE LOGIN 2FA TEST ===\n');
  
  // Step 1: Request 2FA code
  console.log('Step 1: Requesting 2FA code...');
  try {
    const response = await fetch(`${API_URL}/api/auth/request-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@okurmen.kg',
        password: 'Admin123!LocalDev',
      }),
    });
    
    console.log('Status:', response.status);
    
    const text = await response.text();
    console.log('Raw Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', JSON.stringify(data, null, 2));
      
      if (!data.success) {
        console.error('2FA request failed:', data.error);
        return null;
      }
      
      console.log('\n✓ 2FA code requested successfully');
      console.log('Check Telegram for the code');
      
      return data;
    } catch (e) {
      console.error('JSON Parse Error:', e.message);
      console.error('Response was:', text.substring(0, 200));
      return null;
    }
  } catch (error) {
    console.error('Request Error:', error.message);
    return null;
  }
}

async function testVerify2FA(email, code) {
  console.log('\n=== VERIFY 2FA TEST ===\n');
  console.log('Email:', email);
  console.log('Code:', code);
  
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });
    
    console.log('Status:', response.status);
    
    const text = await response.text();
    console.log('Raw Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON:', JSON.stringify(data, null, 2));
      return data;
    } catch (e) {
      console.error('JSON Parse Error:', e.message);
      console.error('Response was:', text.substring(0, 200));
      return null;
    }
  } catch (error) {
    console.error('Request Error:', error.message);
    return null;
  }
}

// Запуск тестов
(async () => {
  console.log('OKURMEN API AUTHENTICATION FLOW TEST');
  console.log('=' .repeat(60));
  
  // Test 1: Student login
  await testStudentLogin();
  
  // Test 2: Employee login with 2FA
  await testEmployeeLogin2FA();
  
  // Note: To test verify, run this script again with code argument:
  // node test-auth-flow.js verify <code>
  if (process.argv[2] === 'verify' && process.argv[3]) {
    await testVerify2FA('admin@okurmen.kg', process.argv[3]);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Tests completed');
})();
