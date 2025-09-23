import CryptoJS from 'crypto-js';

// Chiave di criptazione (in produzione dovrebbe essere in una variabile d'ambiente)
const ENCRYPTION_KEY = 'lastello_analytics_2024_security_key_ultra_secure';

// Password criptata
const ENCRYPTED_PASSWORD = CryptoJS.AES.encrypt('pastello2020', ENCRYPTION_KEY).toString();

export function verifyPassword(inputPassword: string): boolean {
  try {
    const decryptedPassword = CryptoJS.AES.decrypt(ENCRYPTED_PASSWORD, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    return inputPassword === decryptedPassword;
  } catch (error) {
    console.error('Errore nella verifica della password:', error);
    return false;
  }
}

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lastello_auth_token');
}

export function setSessionToken(): void {
  if (typeof window === 'undefined') return;
  const token = CryptoJS.AES.encrypt(Date.now().toString(), ENCRYPTION_KEY).toString();
  localStorage.setItem('lastello_auth_token', token);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = getSessionToken();
  if (!token) return false;
  
  try {
    const decryptedTime = CryptoJS.AES.decrypt(token, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    const tokenTime = parseInt(decryptedTime);
    const currentTime = Date.now();
    
    // Token valido per 24 ore
    const validFor24Hours = 24 * 60 * 60 * 1000;
    return (currentTime - tokenTime) < validFor24Hours;
  } catch (error) {
    console.error('Errore nella verifica del token:', error);
    return false;
  }
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lastello_auth_token');
}
