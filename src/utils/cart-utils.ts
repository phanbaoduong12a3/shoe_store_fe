import { sessionIdService } from '@/services/session-id-service';
import store from '@/stores';
import { isAdmin, isAuthenticated } from '@/stores/auth';

// Utility function to generate or get session ID for guest users
export const getOrCreateSessionId = (): string => {
  let sessionId = sessionIdService.getSessionId();

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionIdService.renewSession();
  }

  return sessionId;
};

export const isLogged = (): boolean => {
  const state = store.getState();
  const loggedIn = isAuthenticated(state);
  return loggedIn;
};

export const isRoleAdmin = (): boolean => {
  const state = store.getState();
  const admin = isAdmin(state);
  return admin;
};
