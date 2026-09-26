import { prisma } from '@okurmen/database';

// Типы уведомлений
export type TelegramNotificationType = 'booking' | '2fa' | 'payment' | 'admin_alert';

export interface TelegramNotificationData {
  type: TelegramNotificationType;
  data: {
    [key: string]: any;
  };
}

export async function sendTelegramNotification(
  notification: TelegramNotificationData
): Promise<boolean> {
  console.log('=== SEND TELEGRAM NOTIFICATION START ===');
  console.log('Notification type:', notification.type);
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('Bot token exists:', !!botToken);
  console.log('Chat ID exists:', !!chatId);

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  try {
    let message = '';

    switch (notification.type) {
      case '2fa':
        message = `🔐 Код подтверждения для входа\n\n` +
                  `Email: ${notification.data.email}\n` +
                  `Код: *${notification.data.code}*\n\n` +
                  `Код действителен 5 минут.`;
        break;
        
      case 'booking':
        message = `📝 Новая заявка на курс!\n\n` +
                  `Имя: ${notification.data.name}\n` +
                  `Телефон: ${notification.data.phone}\n` +
                  `Email: ${notification.data.email || 'Не указан'}\n` +
                  `Курс: ${notification.data.course}\n` +
                  `Стоимость: ${notification.data.amount} KGS`;
        break;

      case 'payment':
        message = `💳 Новый платёж!\n\n` +
                  `Сумма: ${notification.data.amount} KGS\n` +
                  `Статус: ${notification.data.status}\n` +
                  `Курс: ${notification.data.course}`;
        break;

      case 'admin_alert':
        message = `⚠️ ${notification.data.message}`;
        break;

      default:
        message = JSON.stringify(notification.data);
    }

    console.log('Message prepared:', message.substring(0, 50) + '...');
    console.log('Sending to Telegram...');

    // Отправка через Telegram Bot API
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    console.log('Telegram API response status:', response.status);
    console.log('Telegram API response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', errorText);
    }

    console.log('=== SEND TELEGRAM NOTIFICATION END ===');
    return response.ok;
  } catch (error) {
    console.error('=== SEND TELEGRAM NOTIFICATION ERROR ===');
    console.error('Telegram notification error:', error);
    return false;
  }
}


// Функции для работы с БД
export async function generate2FACode(email: string): Promise<string> {
  console.log('=== GENERATE 2FA CODE START ===');
  console.log('Email:', email);
  
  // Удаляем старые коды для этого email
  await prisma.twoFactorCode.deleteMany({
    where: { email },
  });
  console.log('Old codes deleted');
  
  // Генерация 6-значного кода
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log('Generated code:', code);
  
  // Код действителен 30 минут (увеличили время)
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  
  console.log('Expires at:', expiresAt);
  
  // Сохраняем код в БД
  await prisma.twoFactorCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });
  
  console.log('Code saved to database');
  console.log('=== GENERATE 2FA CODE END ===');
  return code;
}

export async function verify2FACode(email: string, code: string): Promise<boolean> {
  console.log('=== VERIFY 2FA CODE START ===');
  console.log('Email:', email);
  console.log('Code to verify:', code);
  
  // Ищем код в БД
  const stored = await prisma.twoFactorCode.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' }, // Берём самый свежий код
  });
  
  console.log('Stored code found:', !!stored);
  if (stored) {
    console.log('Stored code:', stored.code);
    console.log('Expires at:', stored.expiresAt);
    console.log('Current time:', new Date());
    console.log('Is expired:', new Date() > stored.expiresAt);
  }
  
  if (!stored) {
    console.log('ERROR: No code found for this email');
    console.log('=== VERIFY 2FA CODE END (FAILED) ===');
    return false;
  }
  
  // Проверка срока действия
  if (new Date() > stored.expiresAt) {
    console.log('ERROR: Code expired');
    await prisma.twoFactorCode.delete({
      where: { id: stored.id },
    });
    console.log('=== VERIFY 2FA CODE END (EXPIRED) ===');
    return false;
  }
  
  // Проверка кода
  console.log('Comparing codes:', code, '===', stored.code);
  if (stored.code !== code) {
    console.log('ERROR: Code mismatch');
    console.log('=== VERIFY 2FA CODE END (MISMATCH) ===');
    return false;
  }
  
  // Код использован успешно, удаляем
  await prisma.twoFactorCode.delete({
    where: { id: stored.id },
  });
  console.log('SUCCESS: Code verified and deleted');
  console.log('=== VERIFY 2FA CODE END (SUCCESS) ===');
  return true;
}

export async function send2FACode(email: string): Promise<boolean> {
  console.log('=== SEND 2FA CODE START ===');
  console.log('Email:', email);
  
  const code = await generate2FACode(email);
  console.log('Generated code:', code);
  
  try {
    // Отправка через Telegram
    console.log('Calling sendTelegramNotification...');
    const sent = await sendTelegramNotification({
      type: '2fa',
      data: {
        email,
        code,
      },
    });
    
    console.log('Telegram notification sent:', sent);
    console.log('=== SEND 2FA CODE END ===');
    return sent;
  } catch (error) {
    console.error('=== SEND 2FA CODE ERROR ===');
    console.error('Failed to send 2FA code:', error);
    return false;
  }
}
