import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Configuração
const ADMIN_PATHS = ['/admin'];
const PROTECTED_API_PATHS = ['/api/projects', '/api/uploads'];
const PUBLIC_API_METHODS = ['GET']; // GET público apenas para projetos publicados

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Proteger rotas /admin/*
  if (pathname.startsWith('/admin')) {
    // Permitir acesso à página de login
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Verificar se há token válido
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirecionar para login se não autenticado
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar se o usuário tem role de admin
    if (token.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    // Usuário autenticado e autorizado
    return NextResponse.next();
  }

  // 2. Proteger APIs sensíveis
  if (
    PROTECTED_API_PATHS.some(path => pathname.startsWith(path)) &&
    !pathname.startsWith('/api/projects/slug/') // Exceção: busca por slug é pública
  ) {
    const method = request.method;

    // GET de projetos é público (DynamicProjectClient precisa)
    if (method === 'GET' && pathname.startsWith('/api/projects')) {
      // Permitir GET em /api/projects e /api/projects/[id]
      // A API já filtra por status=published
      return NextResponse.next();
    }

    // Mutações (POST/PATCH/DELETE) requerem autenticação
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }
  }

  // 3. Headers de segurança para todas as respostas
  const response = NextResponse.next();

  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevenir MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection (legacy, mas não faz mal)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt (metadata files)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon|robots|images|uploads|icons).*)',
  ],
};

