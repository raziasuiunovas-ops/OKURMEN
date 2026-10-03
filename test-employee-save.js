// Test Employee Save API
const API_URL = 'http://localhost:3002';

async function testEmployeeSave() {
  console.log('=== Testing Employee Save ===\n');
  
  // Тестовые данные для создания сотрудника
  const newEmployeeData = {
    fullName: 'Тестовый Сотрудник',
    email: `test${Date.now()}@example.com`,
    phone: '+996555123456',
    positions: ['TEACHER', 'MENTOR'],
    bio: 'Тестовая биография',
    education: 'Высшее образование',
    experience: '2 года',
    photoUrl: '',
  };

  console.log('1. Creating new employee...');
  console.log('Data:', JSON.stringify(newEmployeeData, null, 2));
  
  try {
    const createResponse = await fetch(`${API_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployeeData),
    });

    const createText = await createResponse.text();
    console.log('\nResponse status:', createResponse.status);
    console.log('Response body:', createText);
    
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
      },
      body: JSON.stringify(updateData),
    });

    const updateText = await updateResponse.text();
    console.log('\nResponse status:', updateResponse.status);
    console.log('Response body:', updateText);
    
    if (!updateResponse.ok) {
      console.error('❌ UPDATE FAILED');
      return;
    }
    
    console.log('✅ UPDATE SUCCESS');
    
    // Проверяем GET
    console.log('\n3. Getting employee...');
    const getResponse = await fetch(`${API_URL}/api/employees/${employeeId}`);
    const getResult = await getResponse.json();
    
    console.log('Employee data:');
    console.log('- Full name:', getResult.data.user.fullName);
    console.log('- Positions:', getResult.data.positions);
    console.log('- Bio:', getResult.data.bio);
    console.log('- Experience:', getResult.data.experience);
    
    console.log('\n✅ ALL TESTS PASSED');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
  }
}

testEmployeeSave();
