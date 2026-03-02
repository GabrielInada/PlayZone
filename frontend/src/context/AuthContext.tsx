"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// ── Tipos ─────────────────────────────────────────────────────────────────────
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

// ── Constantes ────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://play-zone-omega.vercel.app';

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  logout: () => {},
});

// ── Helpers de cookie ─────────────────────────────────────────────────────────
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao montar: lê token do localStorage e busca perfil
  useEffect(() => {
    // Suporta tanto "token" quanto "access_token" (padrão NestJS)
    const savedToken = localStorage.getItem('token') ?? localStorage.getItem('access_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    setToken(savedToken);

    fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Token inválido');
        const profile: User = await res.json();
        setUser(profile);
      })
      .catch(() => {
        // Token expirado ou inválido — limpa sessão
        localStorage.removeItem('token');
        deleteCookie('auth-token');
        deleteCookie('user-type');
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
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

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  return useContext(AuthContext);
}