// Utility function to generate or get session ID for guest users
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('guestSessionId');

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestSessionId', sessionId);
  }

  return sessionId;
};

// Check if user is logged in
export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};
