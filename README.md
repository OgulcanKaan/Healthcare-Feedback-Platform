# Hasta Memnuniyet Survey System

Hasta memnuniyet anketlerini yönetmek, public survey akışını çalıştırmak, birim bazlı analitik üretmek ve düşük puanlı oturumları şikayet sürecine taşımak için hazırlanmış çok katmanlı proje yapısıdır.

## Klasor Yapisi

```text
project-root/
│
├── backend/        # ASP.NET Core Web API + Scalar + configurable cache
├── frontend/       # React + TypeScript + Redux Toolkit + React Query + Tailwind
├── mobile/         # Flutter iskeleti
├── shared/         # Ortak modeller / ileride paylasilacak varliklar icin ayrildi
└── docker/         # Deploy dosyalari icin ayrildi
```

## Kullanilan Teknolojiler

### Backend
- ASP.NET Core Web API
- JWT Authentication
- Swagger + Scalar
- SOLID, DRY
- CQRS
- Configurable caching
  - `MemoryCache`
  - `Redis / IDistributedCache`

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Query
- React Router
- Axios
- Tailwind CSS
- Recharts

### Mobile
- Flutter proje iskeleti

## Backend Mimarisi

### SOLID
- Controller katmanı sadece request/response yönetir.
- İş kuralları service katmanına taşınmıştır.
- Repository katmanı yalnızca veri erişiminden sorumludur.
- `IAnketService`, `IOturumService`, `IRaporService`, `IBirimService`, `ICacheService` arayüzleri görünür şekilde kullanılır.

### DRY
- Ortak sonuç yapıları `Common/Results`
- Cache key yönetimi `Common/Caching`
- Mapping yardımcıları `Common/Mapping`
- Controller response dönüştürmeleri `Extensions/ControllerResultExtensions`

### CQRS
`backend/HastaAnketi.API/Application` altında:
- `Commands/Anket`
- `Commands/Oturum`
- `Queries/Anket`
- `Queries/Rapor`
- `Queries/Oturum`
- `Handlers`

Okuma işlemleri query, veri değiştiren işlemler command mantığıyla ayrılmıştır.

### Cache
`backend/HastaAnketi.API/appsettings.json`:

```json
"CacheSettings": {
  "Provider": "Memory",
  "RedisConnection": "localhost:6379",
  "DefaultExpirationMinutes": 10
}
```

- `Provider = Memory` ise `MemoryCacheService`
- `Provider = Redis` ise `RedisCacheService`
- Redis bağlantısı yoksa uygulama kontrollü hata yönetimi ile ayakta kalır.

Cache kullanılan ana akışlar:
- anket listesi
- dashboard özeti
- birim bazlı rapor
- şikayet listesi

### Scalar
- Swagger korunmuştur.
- Scalar adresi:
  - `https://localhost:7159/scalar`
- Swagger adresi:
  - `https://localhost:7159/swagger`

## Frontend Mimarisi

`frontend/src` yapısı feature-based organize edilmiştir:

```text
src/
├── app/
├── features/
│   ├── auth/
│   ├── survey/
│   ├── admin/
│   ├── dashboard/
│   └── complaint/
└── shared/
    ├── components/
    ├── models/
    ├── services/
    └── utils/
```

### Frontend CQRS
Her feature altında ayrı query/command dosyaları vardır:
- `surveyQueries.ts`
- `surveyCommands.ts`
- `dashboardQueries.ts`
- `complaintQueries.ts`
- `adminQueries.ts`
- `adminCommands.ts`
- `authCommands.ts`

### Frontend State Management
- Client state: Redux Toolkit
  - auth session
  - dashboard date filters
- Server state + caching: React Query
  - `staleTime`
  - query invalidation
  - backend cache yapısıyla uyumlu okunabilir akış

## Ekranlar

### Public
- public survey linki
- KVKK onayı
- birim seçimi
- dinamik soru gösterimi
- survey tamamlama
- teşekkür / sonuç ekranı

### Admin
- login
- dashboard
- anket listesi
- anket oluşturma / düzenleme
- rapor ekranı
- birim bazlı rapor
- şikayet listesi
- yönetim ekranı
  - kullanıcılar
  - roller
  - birimler
  - soru bankası
  - kullanıcı logları

## Calistirma Adimlari

### 1. Backend

Visual Studio ile:
- `backend/HastaAnketi.API.sln` aç
- `HastaAnketi.API` projesini startup project yap
- `https` profilini seç
- `F5`

Terminal ile:

```powershell
cd C:\Users\ogulc\Desktop\HastaAnketi.API\backend\HastaAnketi.API
dotnet run --launch-profile https
```

### 2. Frontend

```powershell
cd C:\Users\ogulc\Desktop\HastaAnketi.API\frontend
npm install
npm run dev
```

Adres:
- `http://localhost:5173`

### 3. Mobile

```powershell
cd C:\Users\ogulc\Desktop\HastaAnketi.API\mobile
flutter pub get
flutter run
```

Not:
- Flutter SDK bu makinede kurulu değilse önce kurulmalıdır.
- `mobile/` tarafı şu an proje iskeleti ve ekran akışı için hazırlanmıştır.

## Varsayilan Giris Bilgileri

- Kullanıcı adı: `admin`
- Şifre: `123456`

## API Ornekleri

### Login

`POST /api/Auth/login`

```json
{
  "kullaniciAdi": "admin",
  "sifre": "123456"
}
```

### Yeni anket

`POST /api/Anket`

```json
{
  "anketAdi": "Poliklinik Nisan Survey",
  "durum": "Aktif",
  "baslangicTarihi": "2026-04-29T09:00:00Z",
  "bitisTarihi": "2026-05-29T09:00:00Z",
  "karsilamaMesaji": "Hos geldiniz",
  "tesekkurMesaji": "Katiliminiz icin tesekkur ederiz.",
  "olusturanKullaniciId": 1
}
```

### Oturum baslat

`POST /api/Oturum/baslat`

```json
{
  "anketId": 1,
  "hastaId": 1,
  "birimId": 1,
  "randevuId": 1,
  "kanal": "Web",
  "kvkkOnayDurumu": true,
  "ipAdresi": "127.0.0.1",
  "cihazBilgisi": "React Frontend"
}
```

## Test Akisi

### Backend

```powershell
cd C:\Users\ogulc\Desktop\HastaAnketi.API\backend
dotnet build
```

### Frontend

```powershell
cd C:\Users\ogulc\Desktop\HastaAnketi.API\frontend
npm run build
```

## Notlar

- `frontend/.env` varsayılan olarak `https://localhost:7159/api` kullanır.
- Public survey akışı için `GET /api/Birim` anonim erişime açılmıştır.
- Yönetim ekranındaki kullanıcı logları için `GET /api/Kullanici/loglar` endpoint’i eklenmiştir.
