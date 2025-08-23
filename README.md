# 🛒 E-Ticaret Projesi Kayra Export Task -2

Bu proje, **.NET 7 (Backend)** ve **Next.js 15 (Frontend)** teknolojileri kullanılarak geliştirilmiş, **Onion Architecture** tabanlı bir e-ticaret uygulamasıdır. Projede **CQRS + MediatR**, **role-based authentication**, **PostgreSQL + Redis (Docker Compose)**, **Formik & Yup validasyon**, **shadcn UI**, **dropzone entegrasyonu** ve daha birçok modern teknoloji entegre edilmiştir.

---

## 🚀 Teknolojiler

### Backend
- **.NET 7**
- **Onion Architecture**
- **MediatR** ile **CQRS Pattern**
- **Generic Repository**
- **PostgreSQL** (Docker ile)
- **Redis** (Docker ile)
- **Serilog** (Logging)
- **Global Middleware Error Handling**

### Frontend
- **Next.js 15**
- **NextAuth** (Session & Token Management - Email Credential Provider)
- **Formik & Yup** (Form validasyonu)
- **shadcn UI** (UI bileşenleri)
- **RTK (Redux Toolkit)** (Sepet yönetimi)
- **Dropzone** (Ürün resimleri yükleme)
- **TanStack Table** (Listeleme & Filtreleme)
- **Slug tabanlı ürün detay sayfası**
- **Custom SEO meta tags**
- **next-intl** (Çok dil desteği, süre yetmediği için tamamlanamadı)

---

## 🏗️ Proje Özellikleri

### Backend
- **CQRS ve MediatR** ile temiz komut/sorgu yapısı
- **Generic Repository** ile veri erişim soyutlaması
- **PostgreSQL** ana veritabanı
- **Redis** ile caching & session management
- **Serilog** ile loglama
- **Global Exception Middleware** ile hata yakalama

### Frontend
- **Role-based Admin Panel**
  - CRUD işlemleri
  - Filtreleme ve sıralama
- **User tarafı**
  - Ürün listeleme
  - Sepet yönetimi (RTK store)
  - Slug tabanlı ürün detay sayfası
- **Form Yönetimi**
  - Formik + Yup entegrasyonu
  - Dropzone ile çoklu görsel yükleme
- **UI**
  - shadcn bileşenleri ile modern ve esnek UI
- **SEO**
  - Custom meta tag fonksiyonu
- **Çok dil desteği**
  - next-intl (tamamlanamadı)

---

## 📂 Klasör Yapısı

### Backend
Backend/
│── src/
│ ├── Core/
│ ├── Application/
│ ├── Infrastructure/
│ ├── Persistence/
│ ├── API/
│── docker-compose.yml

###Frontend
Frontend/
│── app/
│ ├── (auth)/
│ ├── (admin)/
│ ├── (user)/
│── components/
│── hooks/
│── services/
│── store/
│── providers/
│── next.config.js
│── package.json

--

## ⚙️ Kurulum ve Çalıştırma

### 1. Gereksinimler
- **Docker & Docker Compose**
- **Node.js 20+**
- **.NET 7 SDK**

### 2. Backend Çalıştırma
```bash
cd Backend
docker-compose up -d
dotnet restore
dotnet build
dotnet run 
```

DB'için Persistance katmanında migration için nuGet Package Manager Consol'u çalıştırın 
```bash
Update-Database
```

### 3. Frontend Çalıştırma
```bash
npm install
npm run dev
```
