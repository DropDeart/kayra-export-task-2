##🛍️ Full Stack E-Commerce — 2. Aşama Task

#Bu proje, .NET 7 (Onion Architecture + CQRS + Redis Cache) tabanlı bir backend ile, Next.js 15 (App Router) + NextAuth + RTK + Tailwind + shadcn tabanlı bir frontend’den oluşan tam kapsamlı bir e-ticaret uygulamasıdır.

##🚀 Proje Hedefi
JWT tabanlı kimlik doğrulama (login/register)
Redis cache destekli performanslı ürün servisi
Çok dilli, SEO uyumlu, filtrelenebilir e-ticaret frontend’i
Role tabanlı admin panel (CRUD) ve kullanıcı tarafı alışveriş deneyimi

##🛠️ Teknolojiler
#Backend
.NET 7 — Onion Architecture (Core / Application / Infrastructure / API)
CQRS + MediatR — Command/Query ayrımı
PostgreSQL + Redis (docker-compose ile aynı anda ayağa kalkıyor)
JWT Authentication — Kullanıcı giriş/kayıt için
Serilog — Loglama
Global Exception Middleware — Merkezi hata yönetimi

#Frontend
Next.js 15 — App Router yapısı
TypeScript + TailwindCSS
NextAuth — Session & JWT tabanlı auth
RTK (Redux Toolkit) — Global state (sepet yönetimi)
Formik + Yup — Form validasyonu
shadcn/ui — UI bileşenleri
Dropzone — Ürün resmi yükleme
next-intl — Çok dilli yapı (entegrasyon hazırlandı fakat tamamlanamadı)
Custom SEO MetaTags — Ürün detay sayfalarında dinamik meta etiketler

##🔑 Özellikler
#Backend

Kullanıcı kayıt/login (JWT üretimi)
Ürün ekleme/güncelleme/silme (Command’lar)
Ürün listeleme (Query + Redis cache ile hızlandırma)
Cache invalidation (ürün eklendiğinde/güncellendiğinde)

#Frontend
Login/Register (NextAuth + Backend API)
Role tabanlı Admin Panel (CRUD)
Filtreleme & sıralama (fiyat, kategori)
Dinamik ürün detay sayfaları (/products/[slug])
Sepet (RTK store ile)
Çoklu dil altyapısı (hazırlandı, tamamlanmadı)
SEO optimizasyonu (SSR/ISR + dinamik meta etiketler)
