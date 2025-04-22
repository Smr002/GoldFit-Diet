export function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub; 
    } catch {
      return null;
    }
  }
  