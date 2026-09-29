import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Проверяем наличие API ключа
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GEMINI_API_KEY не найден в переменных окружения' 
        },
        { status: 500 }
      );
    }

    // Используем прямой HTTP запрос к Gemini API
    // Новые API ключи требуют заголовок X-goog-api-key
    // Пробуем разные модели по очереди
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-flash-latest',
      'gemini-pro'
    ];
    
    let resultData = null;
    let usedModel = '';
    let lastError = '';
    
    for (const model of modelsToTry) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        
        const requestBody = {
          contents: [{
            parts: [{
              text: 'Ответь на русском языке одним предложением: что такое искусственный интеллект?'
            }]
          }]
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          resultData = await response.json();
          usedModel = model;
          break; // Успешно - выходим из цикла
        } else {
          const errorText = await response.text();
          lastError = `${model}: ${response.status} - ${errorText}`;
        }
      } catch (err) {
        lastError = `${model}: ${err instanceof Error ? err.message : String(err)}`;
        continue;
      }
    }
    
    if (!resultData) {
      throw new Error(`Ни одна модель не сработала. Последняя ошибка: ${lastError}`);
    }
    
    // Извлекаем текст ответа
    const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';

    return NextResponse.json({
      success: true,
      response: text,
      model: usedModel,
      message: 'Gemini API успешно подключен и работает'
    });

  } catch (error) {
    console.error('Ошибка при обращении к Gemini API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка при обращении к Gemini API',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}
