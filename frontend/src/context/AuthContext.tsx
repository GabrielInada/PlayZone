"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  type: 'clube' | 'delegado' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://play-zone-omega.vercel.app';

const AuthContext = createContext<AuthContextValue>({
  user: null, token: null, isLoading: true, logout: () => {},
});

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Inicializa direto do cache — sem esperar fetch
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') ?? localStorage.getItem('access_token');
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token') ?? localStorage.getItem('access_token');
    if (!savedToken) { setIsLoading(false); return; }

    setToken(savedToken);

    // Valida token em background e atualiza cache
    fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Token inválido');
        const profile: User = await res.json();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        deleteCookie('auth-token');
        deleteCookie('user-type');
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    deleteCookie('auth-token');
    deleteCookie('user-type');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}