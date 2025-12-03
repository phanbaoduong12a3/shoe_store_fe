// services/session-id-service.ts
import { cookies } from '@/utils/cookies';

const SESSION_KEY = 'cart_session_id';
const SESSION_EXPIRY = 1; // 1 ngày

function generateSessionId() {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const sessionIdService = {
  getSessionId(): string {
    let id = cookies.get<string>(SESSION_KEY);

    if (!id) {
      id = generateSessionId();
      cookies.set(SESSION_KEY, id, {
        expires: SESSION_EXPIRY,
        path: '/',
        sameSite: 'Lax',
      });
    }

    return id;
  },

  renewSession(): string {
    const newId = generateSessionId();
    cookies.set(SESSION_KEY, newId, {
      expires: SESSION_EXPIRY,
      path: '/',
      sameSite: 'Lax',
    });
    return newId;
  },

  clearSession(): void {
    cookies.remove(SESSION_KEY, { path: '/' });
  },
};
