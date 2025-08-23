// src/middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;
const locales = ['en', 'tr'];
const defaultLocale = 'tr';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  const match = pathname.match(/^\/(en|tr)/);
  const locale = match ? match[1] : defaultLocale;

  const isAdminPath = pathname.startsWith(`/${locale}/admin`);
  const isLoginOrRegister = pathname === `/${locale}/login` || pathname === `/${locale}/register`;
  
  // Yönlendirmeyi daha esnek hale getiriyoruz.
  const isRootPath = pathname === '/' || pathname === `/${locale}`;


  // 1. Durum: Login ve Register sayfalarına her zaman erişim ver
  if (isLoginOrRegister) {
      return NextResponse.next();
  }

  // 2. Durum: Admin yoluna token yoksa Login'e yönlendir
  if (isAdminPath && !token) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }
  
  // 3. Durum: Token varsa ve kullanıcı adminse, ana sayfadan admin paneline yönlendir
  if (token) {
      const role = token.role;
      // Kullanıcı bir kez giriş yaptıktan sonra ana sayfaya yönlenmesini engellemek için
      // bu yönlendirmeyi sadece oturum başlangıcında tetikleyin.
      if (role === 'Admin' && isRootPath) {
          return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
      }

      // 4. Durum: Admin olmayan kullanıcı admin paneline girmeye çalışırsa ana sayfaya yönlendir
      if (role !== 'Admin' && isAdminPath) {
          return NextResponse.redirect(new URL(`/${locale}/`, req.url));
      }
  }
  
  // Varsayılan olarak bir sonraki middleware'e geç
  return NextResponse.next();
}

export default async function middleware(req: NextRequest) {
  const response = await authMiddleware(req);

  if (response.status !== 200) {
    return response;
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};