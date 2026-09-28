/**
 * Воспроизведение реальной ошибки из браузера
 */

async function testVerify2FALikeFromBrowser() {
  console.log('=== TESTING VERIFY 2FA (Browser Simulation) ===\n');
  
  // Сначала получаем код
  console.log('Step 1: Request 2FA code...');
  const requestResponse = await fetch('http://localhost:3002/api/auth/request-2fa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@okurmen.kg',
      password: 'Admin123!LocalDev'
    }),
    credentials: 'include',
  });
  
  console.log('Request 2FA Status:', requestResponse.status);
  console.log('Request 2FA Headers:', Object.fromEntries(requestResponse.headers));
  
  const requestText = await requestResponse.text();
  console.log('Request 2FA Raw Response:', requestText);
  
  let requestData;
  try {
    requestData = JSON.parse(requestText);
    console.log('Request 2FA Parsed:', JSON.stringify(requestData, null, 2));
  } catch (e) {
    console.error('❌ Request 2FA JSON Parse Error:', e.message);
    console.error('Response was HTML or invalid JSON');
    return;
  }
  
  if (!requestData.success) {
    console.error('❌ Request 2FA failed:', requestData.error);
    return;
  }
  
  console.log('\n✓ 2FA code requested. Now testing with fake code to see error format...\n');
  
  // Пробуем с неправильным кодом чтобы увидеть формат ошибки
  console.log('Step 2: Verify with WRONG code (to see error format)...');
  const wrongVerifyResponse = await fetch('http://localhost:3002/api/auth/verify-2fa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@okurmen.kg',
      code: '000000'
    }),
    credentials: 'include',
  });
  
  console.log('Verify (wrong) Status:', wrongVerifyResponse.status);
  console.log('Verify (wrong) Headers:', Object.fromEntries(wrongVerifyResponse.headers));
  
  const wrongVerifyText = await wrongVerifyResponse.text();
  console.log('Verify (wrong) Raw Response:', wrongVerifyText.substring(0, 200));
  
  try {
    const wrongVerifyData = JSON.parse(wrongVerifyText);
    console.log('Verify (wrong) Parsed:', JSON.stringify(wrongVerifyData, null, 2));
  } catch (e) {
    console.error('❌ Verify (wrong) JSON Parse Error:', e.message);
    console.error('Response starts with:', wrongVerifyText.substring(0, 50));
    console.error('\n🚨 THIS IS THE PROBLEM! API returning HTML instead of JSON');
    console.error('Full response:', wrongVerifyText);
    return;
  }
  
  console.log('\n=== END ===');
}

testVerify2FALikeFromBrowser().catch(err => {
  console.error('Fatal error:', err);
});
