import { makeKVMock } from './kv-mock';

export const TEST_SECRET = 'test-secret-xyz';
export const TEST_CHAT_ID = '123456789';
export const TEST_TOKEN = 'bot-token-abc';

export function makeEnv(kvInitial: Record<string, string> = {}) {
  return {
    POSTS: makeKVMock(kvInitial),
    TELEGRAM_TOKEN: TEST_TOKEN,
    TELEGRAM_SECRET: TEST_SECRET,
    ALLOWED_CHAT_ID: TEST_CHAT_ID,
  };
}
