'use client';

import { useEffect, useState } from 'react';
import { API_URL, getApiUrl } from '@/config/api';

export default function DiagnosticPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('admin@okurmen.kg');
  const [testPassword, setTestPassword] = useState('');
  const [testCode, setTestCode] = useState('');
  const [manualTestResult, setManualTestResult] = useState<any>(null);

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};

      // Test 1: Check environment variable
      results.envVar = {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        API_URL_constant: API_URL,
      };

      // Test 2: Test getApiUrl function
      results.getApiUrl = {
        input: 'api/auth/request-2fa',
        output: getApiUrl('api/auth/request-2fa'),
      };

      // Test 3: Test API connectivity
      try {
        const response = await fetch(getApiUrl('api/health'), {
          method: 'GET',
        });
        results.apiHealth = {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
        };
      } catch (error: any) {
        results.apiHealth = {
          error: error.message,
        };
      }

      // Test 4: Test 2FA endpoint with fake credentials
      try {
        const response = await fetch(getApiUrl('api/auth/request-2fa'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'nonexistent@test.com',
            password: 'fake',
          }),
        });
        
        const contentType = response.headers.get('content-type');
        results.twoFAEndpoint = {
          status: response.status,
          ok: response.ok,
          contentType,
          isJSON: contentType?.includes('application/json'),
        };

        if (contentType?.includes('application/json')) {
          const data = await response.json();
          results.twoFAEndpoint.response = data;
        } else {
          const text = await response.text();
          results.twoFAEndpoint.response = text.substring(0, 200);
        }
      } catch (error: any) {
        results.twoFAEndpoint = {
          error: error.message,
        };
      }

      setTestResults(results);
      setLoading(false);
    };

    runTests();
  }, []);

  const handleTestRequest2FA = async () => {
    setManualTestResult({ loading: true });
    try {
      console.log('[TEST] Отправка request-2fa...');
      const response = await fetch(getApiUrl('api/auth/request-2fa'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword }),
      });
      const data = await response.json();
      console.log('[TEST] Ответ request-2fa:', data);
      setManualTestResult({ request2FA: { status: response.status, data } });
    } catch (error: any) {
      setManualTestResult({ request2FA: { error: error.message } });
    }
  };

  const handleTestVerify2FA = async () => {
    setManualTestResult({ loading: true });
    try {
      console.log('[TEST] Отправка verify-2fa...');
      const response = await fetch(getApiUrl('api/auth/verify-2fa'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, code: testCode }),
      });
      const data = await response.json();
      console.log('[TEST] Ответ verify-2fa:', data);
      setManualTestResult({ verify2FA: { status: response.status, data } });
      
      if (data.success && data.data?.token) {
        console.log('[TEST] Токен получен, сохранение...');
        localStorage.setItem('auth-token', data.data.token);
        console.log('[TEST] Токен сохранён');
      }
    } catch (error: any) {
      setManualTestResult({ verify2FA: { error: error.message } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Diagnostic Information
        </h1>

        <div className="space-y-6">
          {Object.entries(testResults).map(([key, value]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {key}
              </h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-yellow-900 dark:text-yellow-100">
            Manual 2FA Test
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                placeholder="admin@okurmen.kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                placeholder="Admin123!LocalDev"
              />
            </div>
            <button
              onClick={handleTestRequest2FA}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              1. Request 2FA Code
            </button>
            
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-1">2FA Code (from Telegram)</label>
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleTestVerify2FA}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              2. Verify Code
            </button>

            {manualTestResult && (
              <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(manualTestResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-100">
            Instructions
          </h2>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Check that API_URL points to http://localhost:3002</li>
            <li>Check that API health endpoint returns 200</li>
            <li>Check that 2FA endpoint returns JSON (not HTML)</li>
            <li>Use Manual Test to debug 2FA flow step by step</li>
            <li>Check browser console and API logs for errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
