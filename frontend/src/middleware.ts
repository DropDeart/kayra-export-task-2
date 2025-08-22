import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;
  const role = token ? token.role : null;

  const isAdminPath = pathname.startsWith('/admin');
  
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (token) {
    if (role === 'Admin' && pathname === '/') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    if (role !== 'Admin' && isAdminPath) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};