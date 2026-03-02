import { NextRequest, NextResponse } from 'next/server';

// ── Mapeamento de rotas por type de usuário ───────────────────────────────────
// "clube" | "delegado" | "admin"
const ROLE_ROUTES: Record<string, string[]> = {
  clube: [
    '/home',
    '/cadastrar-time',
    '/clube',
    '/convocacoes',
    '/campeonatos',
    '/tabelas',
    '/punicoes',
  ],
  delegado: [
    '/home',
    '/convocacoes',
    '/campeonatos',
    '/tabelas',
    '/punicoes',
    '/sumula',
    '/delegado',
  ],
  admin: [
    '/home',
    '/campeonatos',
    '/tabelas',
    '/punicoes',
    '/estadios',
    '/validar-sumula',
    '/admin',
  ],
};

// Rotas públicas — acessíveis sem login
const PUBLIC_ROUTES = ['/login', '/cadastro'];

// Rotas de desenvolvimento — sem proteção
const DEV_ROUTES = ['/dev'];

function getBaseRoute(pathname: string): string {
  // Extrai o segmento base: "/cadastrar-time/qualquer-coisa" → "/cadastrar-time"
  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 0 ? `/${segments[0]}` : '/';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const baseRoute = getBaseRoute(pathname);

  // Ignora rotas de dev, assets e API
  if (
    DEV_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token    = request.cookies.get('auth-token')?.value;
  const userType = request.cookies.get('user-type')?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // ── Não logado ─────────────────────────────────────────────────────────────
  if (!token) {
    if (isPublic) return NextResponse.next();
    // Redireciona para login preservando a URL pretendida
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Logado tentando acessar login/cadastro ─────────────────────────────────
  if (isPublic) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // ── Raiz → redireciona para home ───────────────────────────────────────────
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // ── Verifica permissão de rota por type ────────────────────────────────────
  if (userType && ROLE_ROUTES[userType]) {
    const allowed = ROLE_ROUTES[userType];
    const hasAccess = allowed.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica middleware em todas as rotas exceto:
     * - _next/static, _next/image, favicon.ico, arquivos estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};