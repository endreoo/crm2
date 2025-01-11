const API_BASE_URL = 'http://37.27.142.148:3000';

interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

export const auth = {
  login: async (email: string, password: string): Promise<string> => {
    try {
      console.log('Authenticating user:', email);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(`Authentication failed: ${data.message || response.statusText}`);
      }

      if (!data.access_token) {
        throw new Error('No access token received from server');
      }

      // Parse and validate the token
      const payload = parseJwt(data.access_token);
      if (!payload) {
        throw new Error('Invalid JWT token received');
      }

      console.log('Token payload:', {
        sub: payload.sub,
        email: payload.email,
        expires: new Date(payload.exp * 1000).toISOString()
      });

      // Store the token
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('token_expires', payload.exp.toString());
      
      return data.access_token;
    } catch (error) {
      console.error('Authentication failed:', error);
      // Clear any existing token on login failure
      auth.logout();
      throw error;
    }
  },

  getToken: (): string | null => {
    try {
      const token = localStorage.getItem('auth_token');
      const expires = localStorage.getItem('token_expires');

      if (!token || !expires) {
        console.log('No token or expiration found');
        return null;
      }

      const expiresTimestamp = parseInt(expires) * 1000;
      if (Date.now() >= expiresTimestamp) {
        console.log('Token expired:', {
          now: new Date().toISOString(),
          expires: new Date(expiresTimestamp).toISOString()
        });
        auth.logout();
        return null;
      }

      const payload = parseJwt(token);
      if (!payload || !payload.sub || !payload.email) {
        console.log('Invalid token payload');
        auth.logout();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      auth.logout();
      return null;
    }
  },

  logout: (): void => {
    console.log('Logging out user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expires');
  },

  isAuthenticated: (): boolean => {
    try {
      const token = auth.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  refreshIfNeeded: async (): Promise<boolean> => {
    try {
      const token = auth.getToken();
      if (!token) {
        return false;
      }

      const payload = parseJwt(token);
      if (!payload) {
        auth.logout();
        return false;
      }

      // If token expires in less than 5 minutes, refresh it
      const expiresIn = payload.exp * 1000 - Date.now();
      console.log('Token expires in:', Math.round(expiresIn / 1000), 'seconds');
      
      if (expiresIn < 5 * 60 * 1000) {
        console.log('Token expiring soon, refreshing...');
        await auth.login('admin@hotelonline.co', 'admin123');
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
}; 