/**
 * Тест всех URL для поиска 404
 */

const API_URL = 'http://localhost:3002';
const ADMIN_URL = 'http://localhost:3001';

async function testURL(url, description) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual', // Не следовать редиректам автоматически
    });
    
    console.log(`\n${description}`);
    console.log(`URL: ${url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Type: ${response.headers.get('content-type')}`);
    
    if (response.status === 404) {
      console.log('❌ 404 NOT FOUND');
      const text = await response.text();
      console.log('Response:', text.substring(0, 200));
    } else if (response.status >= 300 && response.status < 400) {
      console.log(`↗️  Redirect to: ${response.headers.get('location')}`);
    } else {
      console.log('✓ OK');
    }
    
    return response.status;
  } catch (error) {
    console.log(`\n${description}`);
    console.log(`URL: ${url}`);
    console.log(`❌ Error: ${error.message}`);
    return -1;
  }
}

(async () => {
  console.log('TESTING ALL URLS FOR 404');
  console.log('='.repeat(60));
  
  // API endpoints
  await testURL(`${API_URL}/api/health`, 'API Health Check');
  await testURL(`${API_URL}/api/auth/me`, 'API Auth Me (no token)');
  await testURL(`${API_URL}/api/courses`, 'API Courses');
  
  // Admin frontend pages
  await testURL(`${ADMIN_URL}`, 'Admin Root');
  await testURL(`${ADMIN_URL}/admin`, 'Admin Dashboard');
  await testURL(`${ADMIN_URL}/auth/signin`, 'Admin Signin');
  await testURL(`${ADMIN_URL}/admin/courses`, 'Admin Courses Page');
  
  // Check for common 404 patterns
  await testURL(`${ADMIN_URL}/api/auth/me`, 'Admin trying to proxy API (should 404)');
  await testURL(`${ADMIN_URL}/undefined`, 'Undefined URL');
  
  console.log('\n' + '='.repeat(60));
  console.log('Tests completed');
})();
