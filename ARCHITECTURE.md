# OhmyHotel 2.0 — 기술 아키텍처 (Technical Architecture)
**Version:** 1.0.0  
**Date:** 2026-04-14

---

## 1. 기술 스택 (Tech Stack)

### 1.1 Frontend
```
Framework:     Next.js 14 (App Router)
Language:      TypeScript 5.x
Styling:       Tailwind CSS 3.x + shadcn/ui
State:         Zustand (전역) + TanStack Query (서버 상태)
Form:          React Hook Form + Zod (유효성 검사)
Animation:     Framer Motion
Maps:          Kakao Maps API (한국 서비스 최적화)
Icons:         Lucide React
Date:          date-fns
```

### 1.2 Backend
```
Runtime:       Node.js 20 LTS
Framework:     Next.js API Routes (초기) → 트래픽 증가 시 Express.js 분리
Auth:          NextAuth.js v5 (JWT + Session)
ORM:           Prisma 5.x
Validation:    Zod
```

### 1.3 데이터베이스
```
Primary DB:    PostgreSQL 16 (Supabase 또는 RDS)
Cache:         Redis (Upstash 또는 ElastiCache)
Search:        Elasticsearch 8.x (Algolia로 대체 가능)
File Storage:  AWS S3 + CloudFront CDN
```

### 1.4 결제
```
Primary:       NICEPAY (인라인 결제 폼으로 전환)
Phase 2:       Toss Payments SDK
               Apple Pay / Google Pay (Web Payments API)
               Alipay (중화권 대응)
```

### 1.5 인프라
```
Hosting:       Vercel (Frontend + API Routes)
DB Hosting:    Supabase (PostgreSQL + Realtime)
CDN:           Vercel Edge + CloudFront (이미지)
Monitoring:    Sentry (에러) + Vercel Analytics
Email:         Resend (트랜잭션 이메일)
```

---

## 2. 프로젝트 구조 (Directory Structure)

```
omh-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (main)/                   # 메인 서비스 라우트 그룹
│   │   ├── layout.tsx            # 공통 헤더/푸터
│   │   ├── page.tsx              # 홈 (/)
│   │   ├── search/
│   │   │   └── page.tsx          # 검색결과 (/search?q=도쿄&ci=2026-04-20&co=2026-04-22&adults=2)
│   │   ├── hotel/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 호텔 상세 (/hotel/[id])
│   │   ├── booking/
│   │   │   ├── traveler/
│   │   │   │   └── page.tsx      # 여행자 정보
│   │   │   ├── payment/
│   │   │   │   └── page.tsx      # 결제
│   │   │   └── confirm/
│   │   │       └── [bookingId]/
│   │   │           └── page.tsx  # 예약 확인
│   │   └── mypage/
│   │       ├── bookings/
│   │       ├── points/
│   │       └── reviews/
│   └── api/                      # API Routes
│       ├── auth/
│       │   └── [...nextauth]/route.ts
│       ├── search/
│       │   └── route.ts          # GET /api/search
│       ├── hotels/
│       │   ├── route.ts          # GET /api/hotels
│       │   └── [id]/
│       │       ├── route.ts      # GET /api/hotels/[id]
│       │       ├── rooms/
│       │       │   └── route.ts  # GET /api/hotels/[id]/rooms
│       │       └── reviews/
│       │           └── route.ts  # GET/POST /api/hotels/[id]/reviews
│       ├── autocomplete/
│       │   └── route.ts          # GET /api/autocomplete?q=도쿄
│       ├── bookings/
│       │   ├── route.ts          # POST /api/bookings (예약 생성)
│       │   └── [id]/
│       │       └── route.ts      # GET/DELETE /api/bookings/[id]
│       ├── payments/
│       │   ├── initiate/
│       │   │   └── route.ts      # POST /api/payments/initiate
│       │   └── confirm/
│       │       └── route.ts      # POST /api/payments/confirm (NICEPAY 콜백)
│       └── points/
│           └── route.ts          # GET /api/points
│
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # shadcn/ui 기반 기본 컴포넌트
│   ├── search/
│   │   ├── SearchBar.tsx         # 자동완성 검색창
│   │   ├── AutocompleteDropdown.tsx
│   │   ├── DateRangePicker.tsx   # 가격 표시 달력
│   │   └── GuestSelector.tsx     # 인원 선택
│   ├── hotel/
│   │   ├── HotelCard.tsx         # 검색결과 카드
│   │   ├── FomoBadge.tsx         # 희소성 배지
│   │   ├── ReviewSummary.tsx     # 리뷰 요약
│   │   ├── RoomCard.tsx          # 객실 선택 카드
│   │   └── PhotoGallery.tsx      # 사진 갤러리
│   ├── booking/
│   │   ├── BookingSummary.tsx    # 예약 요약 사이드바
│   │   ├── PriceBreakdown.tsx    # 요금 분해 표시
│   │   └── TravelerForm.tsx      # 여행자 정보 폼
│   ├── payment/
│   │   ├── CardForm.tsx          # 인라인 카드 입력폼
│   │   └── PointsRedeemer.tsx    # 포인트 사용
│   ├── loyalty/
│   │   └── PointsBadge.tsx       # OMY Points 배지
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ProgressBar.tsx       # 예약 단계 진행 바
│
├── lib/                          # 유틸리티
│   ├── db.ts                     # Prisma 클라이언트
│   ├── redis.ts                  # Redis 클라이언트
│   ├── elasticsearch.ts          # ES 클라이언트
│   ├── auth.ts                   # NextAuth 설정
│   ├── nicepay.ts                # NICEPAY SDK 래퍼
│   ├── email.ts                  # Resend 이메일
│   └── utils.ts                  # 공통 유틸 (포맷팅 등)
│
├── store/                        # Zustand 스토어
│   ├── searchStore.ts            # 검색 조건 상태
│   ├── bookingStore.ts           # 예약 진행 상태
│   └── userStore.ts              # 사용자 상태
│
├── hooks/                        # 커스텀 훅
│   ├── useAutocomplete.ts
│   ├── useHotelSearch.ts
│   ├── useBooking.ts
│   └── usePoints.ts
│
├── types/                        # TypeScript 타입 정의
│   ├── hotel.ts
│   ├── booking.ts
│   ├── review.ts
│   └── user.ts
│
├── prisma/
│   ├── schema.prisma             # DB 스키마
│   └── seed.ts                   # 시드 데이터
│
└── public/
    ├── images/
    └── icons/
```

---

## 3. 데이터베이스 스키마 (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── 사용자 ───────────────────────────────────────────
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  passwordHash  String?
  provider      String?   // "google" | "kakao" | "email"
  providerId    String?
  
  // 로열티
  pointsBalance Int       @default(0)
  loyaltyTier   String    @default("BLUE") // BLUE | SILVER | GOLD | DIAMOND
  totalSpent    Int       @default(0)       // 연간 누적 결제액 (원)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  bookings      Booking[]
  reviews       Review[]
  pointsLogs    PointsLog[]
  wishlist      Wishlist[]
  
  @@index([email])
}

// ─── 호텔 ─────────────────────────────────────────────
model Hotel {
  id              String    @id @default(cuid())
  nameKo          String    // 한국어 호텔명
  nameEn          String    // 영어 호텔명
  stars           Int       // 1~5
  chainBrand      String?   // 체인 브랜드
  
  // 위치
  country         String
  city            String
  district        String?   // 지역 (신주쿠, 시부야 등)
  address         String
  addressEn       String?
  latitude        Float
  longitude       Float
  
  // 미디어
  thumbnailUrl    String
  imageUrls       String[]  // 갤러리 이미지 URLs
  
  // 시설
  amenities       String[]  // ["pool", "gym", "breakfast", "parking", ...]
  
  // 메타
  descriptionKo   String?
  checkInTime     String    @default("15:00")
  checkOutTime    String    @default("11:00")
  isActive        Boolean   @default(true)
  isFeatured      Boolean   @default(false) // 오마이 픽 여부
  
  // 집계 (정기 업데이트)
  reviewCount     Int       @default(0)
  reviewAvg       Float     @default(0)
  weeklyBookings  Int       @default(0)   // 이번 주 예약 수 (FOMO용)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  rooms           Room[]
  reviews         Review[]
  bookings        Booking[]
  wishlist        Wishlist[]
  
  @@index([city, isActive])
  @@index([latitude, longitude])
}

// ─── 객실 ─────────────────────────────────────────────
model Room {
  id              String    @id @default(cuid())
  hotelId         String
  hotel           Hotel     @relation(fields: [hotelId], references: [id])
  
  nameKo          String
  nameEn          String
  maxOccupancy    Int
  areaSqm         Float?
  bedType         String    // "KING" | "TWIN" | "DOUBLE" | "TRIPLE"
  smokingPolicy   String    // "NON_SMOKING" | "SMOKING" | "BOTH"
  floorRange      String?   // "3~8층"
  viewType        String?   // "OCEAN" | "CITY" | "GARDEN"
  imageUrls       String[]
  amenities       String[]
  
  isActive        Boolean   @default(true)
  
  roomOptions     RoomOption[]
  
  @@index([hotelId])
}

// ─── 객실 옵션 (가격+취소정책 조합) ────────────────────
model RoomOption {
  id              String    @id @default(cuid())
  roomId          String
  room            Room      @relation(fields: [roomId], references: [id])
  
  // 가격 (KRW, 1박 기준)
  basePriceKrw    Int
  taxKrw          Int       // 세금
  serviceChargeKrw Int      // 봉사료
  
  // 옵션
  includesBreakfast Boolean @default(false)
  cancellationPolicy String // "FREE_CANCELLATION" | "NON_REFUNDABLE" | "PARTIAL"
  freeCancellationDeadline DateTime? // 무료 취소 기한
  
  // 재고 (실시간 업데이트)
  availableCount  Int       @default(10)
  
  isActive        Boolean   @default(true)
  
  bookings        Booking[]
  
  @@index([roomId])
}

// ─── 예약 ─────────────────────────────────────────────
model Booking {
  id              String    @id @default(cuid())
  bookingNumber   String    @unique // OMH-2026-XXXXXX
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  hotelId         String
  hotel           Hotel     @relation(fields: [hotelId], references: [id])
  roomOptionId    String
  roomOption      RoomOption @relation(fields: [roomOptionId], references: [id])
  
  // 예약 조건
  checkIn         DateTime
  checkOut        DateTime
  nights          Int
  adults          Int
  children        Int       @default(0)
  
  // 투숙객 정보
  guestName       String    // 영문 성명
  guestPhone      String
  guestEmail      String
  specialRequest  String?
  
  // 금액
  subtotalKrw     Int       // 객실 요금
  taxKrw          Int
  discountKrw     Int       @default(0)
  pointsUsedKrw   Int       @default(0)
  totalKrw        Int       // 최종 결제 금액
  
  // 상태
  status          String    @default("PENDING")
  // PENDING | CONFIRMED | CANCELLED | COMPLETED | NO_SHOW
  
  // 결제
  paymentMethod   String?   // "CARD" | "KAKAOPAY" | "NAVERPAY" | "TOSSPAY"
  paymentId       String?   // PG사 거래 ID
  paidAt          DateTime?
  
  // 포인트
  pointsEarned    Int       @default(0)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  review          Review?
  
  @@index([userId, status])
  @@index([bookingNumber])
}

// ─── 리뷰 ─────────────────────────────────────────────
model Review {
  id              String    @id @default(cuid())
  hotelId         String
  hotel           Hotel     @relation(fields: [hotelId], references: [id])
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  bookingId       String    @unique
  booking         Booking   @relation(fields: [bookingId], references: [id])
  
  // 점수 (0~10)
  overallScore    Float
  cleanlinessScore Float?
  locationScore   Float?
  staffScore      Float?
  facilitiesScore Float?
  valueScore      Float?
  
  // 내용
  title           String?
  content         String
  positiveKeywords String[]  // AI 추출 태그
  negativeKeywords String[]
  
  // 여행 정보
  travelType      String?   // "COUPLE" | "FAMILY" | "BUSINESS" | "SOLO" | "GROUP"
  
  // 메타
  isVerified      Boolean   @default(true) // 실제 투숙 확인
  helpfulCount    Int       @default(0)
  language        String    @default("ko")
  
  createdAt       DateTime  @default(now())
  
  @@index([hotelId, overallScore])
  @@index([userId])
}

// ─── 포인트 로그 ──────────────────────────────────────
model PointsLog {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  
  type        String    // "EARN" | "USE" | "EXPIRE" | "BONUS"
  amount      Int       // 양수=적립, 음수=사용
  balance     Int       // 처리 후 잔액
  description String
  bookingId   String?
  
  createdAt   DateTime  @default(now())
  expiresAt   DateTime? // 만료 예정일
  
  @@index([userId, createdAt])
}

// ─── 즐겨찾기 ─────────────────────────────────────────
model Wishlist {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  hotelId   String
  hotel     Hotel   @relation(fields: [hotelId], references: [id])
  createdAt DateTime @default(now())
  
  @@unique([userId, hotelId])
}

// ─── 가격 캘린더 캐시 ────────────────────────────────
model PriceCalendar {
  id        String  @id @default(cuid())
  hotelId   String
  date      DateTime @db.Date
  minPrice  Int     // 해당 날짜 최저가 (KRW)
  updatedAt DateTime @updatedAt
  
  @@unique([hotelId, date])
  @@index([hotelId])
}
```

---

## 4. API 설계

### 4.1 자동완성 검색
```
GET /api/autocomplete?q={query}&limit=8

Response:
{
  suggestions: [
    {
      type: "city",           // "city" | "hotel" | "landmark"
      id: "tokyo",
      nameKo: "도쿄",
      nameEn: "Tokyo",
      country: "일본",
      hotelCount: 3241,
      thumbnailUrl: "..."
    },
    {
      type: "hotel",
      id: "hotel_abc123",
      nameKo: "도쿄 그랜드 하얏트",
      city: "도쿄",
      stars: 5,
      thumbnailUrl: "..."
    }
  ]
}
```

### 4.2 호텔 검색
```
GET /api/search?
  q={도시명|호텔ID}
  &checkIn=2026-04-20
  &checkOut=2026-04-22
  &adults=2
  &children=0
  &rooms=1
  &minPrice=0
  &maxPrice=500000
  &stars=4,5
  &minScore=8.0
  &amenities=pool,breakfast
  &cancellation=free
  &sort=recommended   // recommended | price_asc | price_desc | score | distance
  &page=1
  &limit=20

Response:
{
  total: 822,
  page: 1,
  hotels: [
    {
      id: "hotel_abc123",
      nameKo: "신주쿠 프린스 호텔",
      stars: 4,
      city: "도쿄",
      district: "신주쿠",
      thumbnailUrl: "...",
      reviewAvg: 8.7,
      reviewCount: 2341,
      reviewTopTags: ["위치 최고", "청결도 우수"],
      minPriceKrw: 125000,       // 해당 기간 최저가
      originalPriceKrw: 150000,  // 할인 전 가격 (있을 경우)
      discountRate: 17,           // 할인율 %
      includesTax: true,
      
      // FOMO 데이터
      availableRooms: 3,          // 잔여 객실 (5 이하 표시)
      lastBookedMinutes: 12,      // N분 전 예약
      weeklyBookings: 47,         // 이번 주 예약 수
      hasFreeCancel: true,
      
      // 로열티
      estimatedPoints: 1250,      // 적립 예상 포인트
      
      latitude: 35.6938,
      longitude: 139.7036
    }
  ]
}
```

### 4.3 호텔 상세
```
GET /api/hotels/{id}?checkIn=2026-04-20&checkOut=2026-04-22&adults=2

Response:
{
  id: "hotel_abc123",
  nameKo: "신주쿠 프린스 호텔",
  nameEn: "Shinjuku Prince Hotel",
  stars: 4,
  address: "일본 도쿄도 신주쿠구 카부키초 1-30-1",
  latitude: 35.6938,
  longitude: 139.7036,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  imageUrls: ["...", "...", "..."],
  amenities: ["pool", "gym", "restaurant", "parking"],
  descriptionKo: "...",
  
  // 리뷰 요약
  review: {
    avg: 8.7,
    count: 2341,
    cleanliness: 8.9,
    location: 9.5,
    staff: 8.8,
    facilities: 8.4,
    value: 8.2,
    topPositive: ["역 도보 2분", "직원 친절", "넓은 객실"],
    topNegative: ["방음 부족", "조식 퀄리티"]
  },
  
  // 객실 목록
  rooms: [
    {
      id: "room_xyz",
      nameKo: "스탠다드 킹룸",
      maxOccupancy: 2,
      areaSqm: 28,
      bedType: "KING",
      imageUrls: ["..."],
      options: [
        {
          id: "opt_1",
          basePriceKrw: 120000,
          taxKrw: 12000,
          totalKrw: 132000,
          includesBreakfast: false,
          cancellationPolicy: "NON_REFUNDABLE",
          availableCount: 8
        },
        {
          id: "opt_2",
          basePriceKrw: 145000,
          taxKrw: 14500,
          totalKrw: 159500,
          includesBreakfast: false,
          cancellationPolicy: "FREE_CANCELLATION",
          freeCancellationDeadline: "2026-04-17T14:00:00+09:00",
          availableCount: 3    // ← FOMO 트리거
        }
      ]
    }
  ]
}
```

### 4.4 예약 생성
```
POST /api/bookings
Authorization: Bearer {token}  (비로그인 시 생략 가능)

Body:
{
  roomOptionId: "opt_2",
  checkIn: "2026-04-20",
  checkOut: "2026-04-22",
  adults: 2,
  children: 0,
  guestName: "KIM GILDONG",
  guestPhone: "010-1234-5678",
  guestEmail: "kim@example.com",
  specialRequest: "높은 층 요청",
  pointsToUse: 5000   // 옵션
}

Response:
{
  bookingId: "booking_abc",
  bookingNumber: "OMH-2026-001234",
  status: "PENDING",
  paymentRequired: {
    totalKrw: 319000,
    expiresAt: "2026-04-14T15:30:00Z"  // 결제 대기 만료 (30분)
  }
}
```

### 4.5 결제 초기화
```
POST /api/payments/initiate
Body:
{
  bookingId: "booking_abc",
  paymentMethod: "CARD"
}

Response:
{
  paymentKey: "nicepay_key_xyz",
  merchantId: "OMH_MERCHANT",
  orderId: "OMH-2026-001234",
  amount: 319000,
  orderName: "신주쿠 프린스 호텔 2박"
}
```

---

## 5. 캐싱 전략 (Redis)

```
# 자동완성 결과
autocomplete:{query_hash}     TTL: 5분

# 호텔 기본 정보 (변경 드물음)
hotel:detail:{hotelId}        TTL: 1시간

# 검색 결과 (페이지별)
search:{params_hash}          TTL: 3분

# 객실 가격/재고 (실시간 중요)
room:availability:{roomId}:{date}    TTL: 30초

# 가격 달력
price:calendar:{hotelId}:{month}     TTL: 1시간

# FOMO 데이터 (실시간 업데이트)
fomo:bookings:{hotelId}              TTL: 5분
```

---

## 6. 환경 변수 (.env.local)

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."      # Supabase direct connection

# Redis
REDIS_URL="redis://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
KAKAO_CLIENT_ID="..."
KAKAO_CLIENT_SECRET="..."

# Payment - NICEPAY
NICEPAY_CLIENT_ID="..."
NICEPAY_SECRET_KEY="..."
NICEPAY_WEBHOOK_SECRET="..."

# Elasticsearch
ELASTICSEARCH_URL="..."
ELASTICSEARCH_API_KEY="..."

# Storage
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="omh-images"
CLOUDFRONT_URL="https://cdn.ohmyhotel.com"

# Email
RESEND_API_KEY="..."
EMAIL_FROM="noreply@ohmyhotel.com"

# Maps
KAKAO_MAP_APP_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_KAKAO_MAP_KEY="..."
```

---

## 7. 개발 환경 세팅 순서

```bash
# 1. 레포 클론 & 의존성 설치
git clone https://github.com/omh-global/omh-platform.git
cd omh-platform
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# → .env.local 편집

# 3. DB 세팅
npx prisma migrate dev --name init
npx prisma db seed

# 4. Elasticsearch 인덱스 생성
npm run es:setup

# 5. 개발 서버 실행
npm run dev
```

---

## 8. 코딩 컨벤션

### 8.1 파일명
- 컴포넌트: PascalCase (`HotelCard.tsx`)
- 훅: camelCase with `use` prefix (`useHotelSearch.ts`)
- 유틸: camelCase (`formatPrice.ts`)

### 8.2 TypeScript
```typescript
// ✅ 타입 명시
interface Hotel {
  id: string;
  nameKo: string;
  stars: 1 | 2 | 3 | 4 | 5;
}

// ✅ 서버 컴포넌트는 async
async function HotelDetailPage({ params }: { params: { id: string } }) {
  const hotel = await getHotel(params.id);
  return <HotelDetail hotel={hotel} />;
}

// ✅ 클라이언트 컴포넌트는 명시
"use client";
function SearchBar() { ... }
```

### 8.3 가격 포맷팅
```typescript
// lib/utils.ts
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(amount);
  // → "₩125,000"
}
```

### 8.4 날짜 처리
```typescript
import { format, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';

// 표시용
format(checkIn, 'M월 d일 (EEE)', { locale: ko }) // "4월 20일 (월)"

// 박수 계산
const nights = differenceInDays(checkOut, checkIn); // 2
```

---

## 9. 배포 파이프라인

```
[개발자 push] 
  → GitHub PR 
  → Vercel Preview Deploy (자동)
  → 리뷰 & 머지
  → main branch
  → Vercel Production Deploy (자동)
  → Sentry release 태깅
```
