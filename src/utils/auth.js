const SESSION_KEY = 'writespace_session';

export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable or full
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage unavailable
  }
}

export function isAuthenticated() {
  return getSession() !== null;
}

export function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'admin';
}