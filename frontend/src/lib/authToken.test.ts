import { describe, it, expect, beforeEach } from 'vitest';
import { getAuthToken, setAuthToken, clearAuthToken } from './authToken';

describe('authToken', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test to ensure a clean slate
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });

  it('should set the auth token in localStorage and cookies', () => {
    setAuthToken('test-token-123');

    expect(localStorage.getItem('authToken')).toBe('test-token-123');
    expect(document.cookie).toContain('authToken=test-token-123');
  });

  it('should get the auth token from localStorage', () => {
    localStorage.setItem('authToken', 'ls-token');

    const token = getAuthToken();
    expect(token).toBe('ls-token');
  });

  it('should get the auth token from cookies and sync to localStorage if localStorage is empty', () => {
    // Manually set a cookie to simulate an existing session without localStorage
    document.cookie = 'authToken=cookie-token; Path=/;';

    expect(localStorage.getItem('authToken')).toBeNull();

    const token = getAuthToken();
    expect(token).toBe('cookie-token');
    expect(localStorage.getItem('authToken')).toBe('cookie-token');
  });

  it('should return null if no token is found', () => {
    expect(getAuthToken()).toBeNull();
  });

  it('should clear the auth token from localStorage and cookies', () => {
    setAuthToken('token-to-delete');
    clearAuthToken();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(getAuthToken()).toBeNull();
  });
});