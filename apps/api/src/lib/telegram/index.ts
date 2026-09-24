import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot: TelegramBot | null = null;

if (token && chatId) {
  bot = new TelegramBot(token, { polling: false });
}

interface NotificationData {
  type: 'booking' | 'payment';
  data: {
    name: string;
    phone: string;
    email?: string;
    course: string;
    amount?: number;
    status?: string;
  };
}

export async function sendTelegramNotification(notification: NotificationData): Promise<boolean> {
  if (!bot || !chatId) {
    console.warn('Telegram bot not configured. Skipping notification.');
    return false;
  }

  try {
    let message = '';

    if (notification.type === 'booking') {
      message = `
🎓 *Новая заявка на курс*

👤 Имя: ${notification.data.name}
📱 Телефон: ${notification.data.phone}
${notification.data.email ? `📧 Email: ${notification.data.email}` : ''}
📚 Курс: ${notification.data.course}
${notification.data.amount ? `💰 Сумма: ${notification.data.amount} KGS` : ''}
      `.trim();
    } else if (notification.type === 'payment') {
      message = `
💳 *Оплата ${notification.data.status === 'PAID' ? 'успешна' : 'получена'}*

👤 Имя: ${notification.data.name}
📱 Телефон: ${notification.data.phone}
📚 Курс: ${notification.data.course}
💰 Сумма: ${notification.data.amount} KGS
✅ Статус: ${notification.data.status}
      `.trim();
    }

    const result = await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
    });

    return !!result.message_id;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}
