// Тестовый скрипт для проверки API создания сотрудника
const fetch = require('node-fetch');

async function testEmployeeAPI() {
  console.log('🧪 Тестирование API создания сотрудника...\n');

  // Шаг 1: Логин
  console.log('1️⃣ Вход в систему...');
  const loginResponse = await fetch('http://localhost:3002/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@okurmen.kg',
      password: 'Admin123!LocalDev',
    }),
  });

  const loginData = await loginResponse.json();
  console.log('Результат логина:', loginData.success ? '✅' : '❌');

  if (!loginData.success) {
    console.log('❌ Не удалось войти:', loginData);
    return;
  }

  const token = loginData.data?.token;
  if (!token) {
    console.log('❌ Токен не получен');
    return;
  }

  console.log('✅ Токен получен:', token.substring(0, 20) + '...\n');

  // Шаг 2: Запрос 2FA кода
  console.log('2️⃣ Запрос 2FA кода...');
  const twoFARequest = await fetch('http://localhost:3002/api/auth/request-2fa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: 'admin@okurmen.kg',
    }),
  });

  const twoFAData = await twoFARequest.json();
  console.log('2FA запрос:', twoFAData.success ? '✅' : '❌');

  if (!twoFAData.success) {
    console.log('❌ Ошибка 2FA:', twoFAData);
    return;
  }

  console.log('✅ 2FA код отправлен в Telegram\n');
  console.log('⚠️  Для продолжения теста нужен код из Telegram');
  console.log('⚠️  Запустите скрипт заново после получения кода\n');

  // Шаг 3: Создание сотрудника (с разными вариантами данных)
  console.log('3️⃣ Тестирование создания сотрудника...\n');

  const testCases = [
    {
      name: 'С полным email',
      data: {
        fullName: 'Тестовый Сотрудник 1',
        email: 'test1@okurmen.kg',
        phone: '+996700123456',
        position: 'TEACHER',
        bio: 'Тестовая биография',
        education: 'Высшее',
        experience: '2 года',
        photoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        sortOrder: 0,
        isActive: true,
      },
    },
    {
      name: 'С пустым email',
      data: {
        fullName: 'Тестовый Сотрудник 2',
        email: '',
        phone: '+996700123457',
        position: 'DEVELOPER',
        photoUrl: '',
        sortOrder: 1,
      },
    },
    {
      name: 'Без email вообще',
      data: {
        fullName: 'Тестовый Сотрудник 3',
        phone: '',
        position: 'MANAGER',
        sortOrder: 2,
      },
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Тест: ${testCase.name}`);
    console.log('Данные:', JSON.stringify(testCase.data, null, 2));

    try {
      const response = await fetch('http://localhost:3002/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testCase.data),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        result = { rawResponse: text };
      }

      if (response.ok) {
        console.log('✅ Успех! Создан сотрудник:', result.data?.user?.fullName);
      } else {
        console.log('❌ Ошибка:', response.status);
        console.log('Детали:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log('❌ Исключение:', error.message);
    }
  }
}

testEmployeeAPI().catch(console.error);
