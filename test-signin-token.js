// Test signin returns token
const API_URL = 'http://localhost:3002';

async function testSigninToken() {
  console.log('=== Testing Signin Token ===\n');
  
  const response = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@okurmen.kg',
      password: 'Admin123!LocalDev',
    }),
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
  
  if (response.ok) {
    const data = JSON.parse(text);
    console.log('\n✅ Login successful!');
    console.log('Token returned:', !!data.token);
    if (data.token) {
      console.log('Token length:', data.token.length);
      console.log('Token preview:', data.token.substring(0, 50) + '...');
    }
  } else {
    console.log('\n❌ Login failed');
  }
}

testSigninToken();
