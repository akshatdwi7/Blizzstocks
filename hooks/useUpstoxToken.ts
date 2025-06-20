// hooks/useUpstoxToken.ts
import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';

export function useUpstoxToken() {
  const [accessToken, setAccessToken] = useState('');

  const loginWithUpstox = async () => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        'http://localhost:3000/auth/upstox',
        'http://localhost:3000/callback'
      );

      if (result.type === 'success' && result.url) {
        const response = await fetch(result.url);
        const data = await response.json();
        setAccessToken(data.access_token);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return { accessToken, loginWithUpstox };
}
