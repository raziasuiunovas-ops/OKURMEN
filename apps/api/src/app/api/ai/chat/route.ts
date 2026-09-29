import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: Message[];
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем наличие API ключа
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI temporarily unavailable' 
        },
        { status: 500 }
      );
    }

    // Получаем данные запроса
    const body: ChatRequest = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Message is required' 
        },
        { status: 400 }
      );
    }

    // Формируем контекст для Gemini
    const systemPrompt = `Ты - AI-ассистент образовательного проекта ОКУРМЭН (OKURMEN).

ОКУРМЭН - это современный IT-образовательный проект, основанный в мае 2022 года в Бишкеке, Кыргызстан.

КЛЮЧЕВАЯ ИНФОРМАЦИЯ:
- Адрес: ул. Орозбекова, 136, Бишкек
- Телефон: +996 550 550 550
- Email: info@okurmen.kg
- Часы работы: Пн-Пт: 9:00 - 18:00

ФОРМАТ ОБУЧЕНИЯ:
- Гибридный формат: онлайн уроки + очные занятия 2 раза в неделю
- Личный ментор для каждого студента (до 50 студентов на ментора)
- Доступ ко всем урокам через мобильное приложение
- АЭМ-методика Гапыра Мадаминова

ОСОБЕННОСТИ:
- Более 3000 студентов прошли обучение
- Возраст: 15-50 лет
- Грант 10,000 сом при трудоустройстве или создании коммерческого проекта после окончания курса
- Выпускники работают в Apple, мэрии Бишкека, Kulikovsky, IT-компаниях Казахстана
- Возможность фриланса во время обучения

ДОПОЛНИТЕЛЬНЫЕ ПРОГРАММЫ:
- Өнүгүү сабактары
- Ораторское мастерство
- Компьютерная грамотность
- Talking Club
- Искусственный интеллект / AI
- Семинары Гапыра Мадаминова

НОУТБУКИ:
- Возможность приобрести ноутбук по удобной цене
- Комплект включает: мышь, сумку, зарядное устройство

Отвечай кратко, дружелюбно и по существу. Если не знаешь точной информации - предложи связаться напрямую.`;

    // Формируем историю для Gemini
    let contents = [];
    
    // Добавляем системный промпт
    contents.push({
      parts: [{ text: systemPrompt }]
    });

    // Добавляем последние N сообщений из истории (ограничиваем историю)
    const maxHistoryLength = 6; // последние 3 пары сообщений
    const recentHistory = history.slice(-maxHistoryLength);
    
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    // Добавляем текущее сообщение
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Пробуем разные модели
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-flash-latest',
      'gemini-1.5-pro'
    ];
    
    let resultData = null;
    let usedModel = '';
    let lastError = '';
    
    for (const model of modelsToTry) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        
        const requestBody = {
          contents: contents
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
          break;
        } else {
          const errorText = await response.text();
          lastError = `${model}: ${response.status}`;
        }
      } catch (err) {
        lastError = `${model}: ${err instanceof Error ? err.message : String(err)}`;
        continue;
      }
    }
    
    if (!resultData) {
      console.error('All Gemini models failed:', lastError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI temporarily unavailable' 
        },
        { status: 503 }
      );
    }
    
    // Извлекаем текст ответа
    const aiResponse = resultData.candidates?.[0]?.content?.parts?.[0]?.text || 'Извините, не могу ответить на этот вопрос.';

    return NextResponse.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'AI temporarily unavailable'
      },
      { status: 500 }
    );
  }
}
