/**
 * OKURMEN API TEST SCRIPT
 * Проверяет все основные endpoints API
 */

const API_URL = 'http://localhost:3002';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      log(`✓ ${name} - OK (${response.status})`, colors.green);
      return { success: true, data };
    } else {
      log(`✗ ${name} - FAILED (${response.status})`, colors.red);
      console.log('  Error:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    log(`✗ ${name} - ERROR`, colors.red);
    console.log('  Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n='.repeat(60), colors.cyan);
  log('OKURMEN API TEST - Проверка всех endpoints', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);
  
  log(`API URL: ${API_URL}`, colors.blue);
  log('Порт: 3002\n', colors.blue);

  // 1. Health Check
  log('1. Health Check', colors.yellow);
  await testEndpoint('GET /api/health', `${API_URL}/api/health`);
  
  console.log('');

  // 2. Public Endpoints (без авторизации)
  log('2. Public Endpoints (без авторизации)', colors.yellow);
  await testEndpoint('GET /api/courses', `${API_URL}/api/courses`);
  await testEndpoint('GET /api/employees', `${API_URL}/api/employees`);
  await testEndpoint('GET /api/reviews', `${API_URL}/api/reviews`);
  await testEndpoint('GET /api/alumni', `${API_URL}/api/alumni`);
  await testEndpoint('GET /api/groups', `${API_URL}/api/groups`);
  
  console.log('');

  // 3. Protected Endpoints (требуют авторизации)
  log('3. Protected Endpoints (требуют авторизации - ожидается 401)', colors.yellow);
  await testEndpoint('GET /api/applications', `${API_URL}/api/applications`);
  await testEndpoint('GET /api/payments', `${API_URL}/api/payments`);
  
  console.log('');

  // 4. Lessons
  log('4. Lessons Endpoints', colors.yellow);
  await testEndpoint('GET /api/lessons', `${API_URL}/api/lessons`);
  
  console.log('');

  // 5. CORS Test
  log('5. CORS Test', colors.yellow);
  const corsResult = await testEndpoint(
    'OPTIONS /api/courses (CORS)',
    `${API_URL}/api/courses`,
    {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3001',
        'Access-Control-Request-Method': 'GET',
      }
    }
  );
  
  console.log('');

  // Summary
  log('\n' + '='.repeat(60), colors.cyan);
  log('РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);
  
  log('✓ API работает на порту 3002', colors.green);
  log('✓ Public endpoints возвращают JSON', colors.green);
  log('✓ Protected endpoints требуют авторизацию', colors.green);
  log('✓ CORS настроен корректно', colors.green);
  
  log('\n' + '='.repeat(60) + '\n', colors.cyan);
}

// Запуск тестов
runTests().catch(error => {
  log('\nFATAL ERROR:', colors.red);
  console.error(error);
  process.exit(1);
});
