import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const OWNER_CHAT_ID = process.env.OWNER_CHAT_ID || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://app-ivory-five-19.vercel.app';

interface TgUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

function parseInitData(initData: string): TgUser | null {
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        id: user.id,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        username: user.username || '',
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function verifyInitData(initData: string): boolean {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;

    params.delete('hash');
    const entries = Array.from(params.entries());
    entries.sort(([a], [b]) => a.localeCompare(b));
    const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join('\n');

    const secretKey = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
  } catch {
    return false;
  }
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { serviceName, date, time, name, phone, comment, tgUser, initData } = req.body;

  if (!serviceName || !date || !time || !name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const safeName = String(name).slice(0, 100);
  const safePhone = String(phone).slice(0, 20);
  const safeComment = String(comment || '').slice(0, 500);
  const safeServiceName = String(serviceName).slice(0, 100);

  if (!isValidPhone(safePhone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  // Try HMAC-verified initData first, then fallback to tgUser from frontend
  const initDataStr = initData || '';
  const isVerified = initDataStr && verifyInitData(initDataStr);
  let user: TgUser | null = null;

  if (isVerified) {
    user = parseInitData(initDataStr);
  } else if (tgUser && tgUser.id) {
    user = tgUser;
  } else {
    user = parseInitData(initDataStr);
  }

  // Build Telegram contact info
  let tgInfo = '';
  if (user && user.id) {
    const tgName = escapeMarkdown([user.firstName, user.lastName].filter(Boolean).join(' '));
    tgInfo += `\n\n🔵 *Telegram профиль:*`;
    tgInfo += `\n   Имя: ${tgName}`;
    if (user.username) {
      const safeUsername = escapeMarkdown(user.username);
      tgInfo += `\n   Username: @${safeUsername}`;
      tgInfo += `\n   [✉️ Написать клиенту](https://t.me/${user.username})`;
    }
    tgInfo += `\n   ID: \`${user.id}\``;
  }

  const message = `📸 *Новая заявка на съёмку\\!*

📋 *Услуга:* ${escapeMarkdown(safeServiceName)}
📅 *Дата:* ${escapeMarkdown(date)}
🕐 *Время:* ${escapeMarkdown(time)}

👤 *Клиент:* ${escapeMarkdown(safeName)}
📱 *Телефон:* ${escapeMarkdown(safePhone)}${tgInfo}
${safeComment ? `\n💬 *Комментарий:* ${escapeMarkdown(safeComment)}` : ''}

_Отправлено через Mini App_`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: OWNER_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: true,
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      // Fallback: send without markdown
      const plainMessage = message.replace(/\\([_*\[\]()~`>#+\-=|{}.!\\])/g, '$1');
      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: OWNER_CHAT_ID,
            text: plainMessage,
            disable_web_page_preview: true,
          }),
        }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
