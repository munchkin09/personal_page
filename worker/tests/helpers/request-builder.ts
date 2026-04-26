import { TEST_SECRET, TEST_CHAT_ID } from './env-mock';

export const BASE = 'https://worker.test';

export const ALLOWED_CHAT_ID_NUM = parseInt(TEST_CHAT_ID, 10);

export function getRequest(path: string) {
  return new Request(`${BASE}${path}`, { method: 'GET' });
}

export function optionsRequest(path: string) {
  return new Request(`${BASE}${path}`, { method: 'OPTIONS' });
}

export function telegramPost(body: object, secret = TEST_SECRET) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) headers['X-Telegram-Bot-Api-Secret-Token'] = secret;
  return new Request(`${BASE}/telegram`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

export function telegramMessage(text: string, chatId = ALLOWED_CHAT_ID_NUM) {
  return { message: { chat: { id: chatId }, text, document: undefined } };
}

export function telegramDocument(
  doc: { file_id: string; mime_type?: string; file_name?: string },
  chatId = ALLOWED_CHAT_ID_NUM,
) {
  return { message: { chat: { id: chatId }, text: '', document: doc } };
}
