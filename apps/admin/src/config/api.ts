/**
 * API Configuration
 * Централизованная конфигурация для всех API запросов
 */

// Получаем API URL из переменных окружения
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Вспомогательная функция для создания полного URL
export const getApiUrl = (path: string): string => {
  // Убираем начальный слеш если он есть
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
};

/**
 * Вспомогательная функция для выполнения fetch запросов с авторизацией
 */
export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Добавляем существующие headers если есть
  if (options.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(getApiUrl(path), {
    ...options,
    headers,
    credentials: 'include',
  });
};

// Экспортируем для использования в компонентах
export default {
  API_URL,
  getApiUrl,
  apiFetch,
};
