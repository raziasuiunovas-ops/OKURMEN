// Test Employee Save with Authentication
const API_URL = 'http://localhost:3002';

async function loginAsAdmin() {
  console.log('=== Logging in as Admin ===');
  
  const loginResponse = await fetch(`${API_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@okurmen.kg',
      password: 'Admin123!LocalDev',
    }),
  });

  const loginText = await loginResponse.text();
  console.log('Login status:', loginResponse.status);
  console.log('Response:', loginText.substring(0, 200));
  
  if (!loginResponse.ok) {
    console.error('❌ LOGIN FAILED');
    return null;
  }
  
  const loginResult = JSON.parse(loginText);
  console.log('✅ LOGIN SUCCESS');
  
  // Получаем токен из Set-Cookie заголовка
  const setCookie = loginResponse.headers.get('set-cookie');
  if (setCookie) {
    const tokenMatch = setCookie.match(/auth-token=([^;]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      console.log('Token extracted from cookie');
      return token;
    }
  }
  
  console.error('No token found in response');
  return null;
}

async function testEmployeeSave() {
  try {
    // Сначала логинимся
    const token = await loginAsAdmin();
    
    if (!token) {
      console.error('Cannot proceed without token');
      return;
    }
    
    console.log('\n=== Testing Employee Save ===\n');
    
    // Тестовые данные для создания сотрудника
    const newEmployeeData = {
      fullName: 'Тестовый Сотрудник',
      email: `test${Date.now()}@example.com`,
      phone: '+996555123456',
      positions: ['TEACHER', 'MENTOR'],
      bio: 'Тестовая биография',
      education: 'Высшее образование',
      experience: '2 года',
    };

    console.log('1. Creating new employee...');
    console.log('Data:', JSON.stringify(newEmployeeData, null, 2));
    
    const createResponse = await fetch(`${API_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newEmployeeData),
    });

    const createText = await createResponse.text();
    console.log('\nResponse status:', createResponse.status);
    console.log('Response body:', createText.substring(0, 500));
    
    if (!createResponse.ok) {
      console.error('❌ CREATE FAILED');
      return;
    }
    
    const createResult = JSON.parse(createText);
    console.log('✅ CREATE SUCCESS');
    console.log('Created employee ID:', createResult.data.employeeProfile.id);
    
    const employeeId = createResult.data.employeeProfile.id;
    
    // Теперь тестируем UPDATE
    console.log('\n2. Updating employee...');
    const updateData = {
      fullName: 'Обновлённое Имя',
      positions: ['SENIOR_MANAGER'],
      bio: 'Обновлённая биография',
      experience: '3 года',
    };
    
    console.log('Update data:', JSON.stringify(updateData, null, 2));
    
    const updateResponse = await fetch(`${API_URL}/api/employees/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const updateText = await updateResponse.text();
    console.log('\nResponse status:', updateResponse.status);
    console.log('Response body:', updateText.substring(0, 500));
    
    if (!updateResponse.ok) {
      console.error('❌ UPDATE FAILED');
      return;
    }
    
    console.log('✅ UPDATE SUCCESS');
    
    // Проверяем GET
    console.log('\n3. Getting employee...');
    const getResponse = await fetch(`${API_URL}/api/employees/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const getResult = await getResponse.json();
    
    if (getResult.success) {
      console.log('Employee data:');
      console.log('- Full name:', getResult.data.user.fullName);
      console.log('- Positions:', getResult.data.positions);
      console.log('- Bio:', getResult.data.bio);
      console.log('- Experience:', getResult.data.experience);
      console.log('\n✅ ALL TESTS PASSED');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  }
}

testEmployeeSave();
