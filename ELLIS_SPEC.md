# ELLIS 백엔드 연동 스펙 (v1.0)

**최종 갱신**: 2026-06-11
**목적**: 프론트엔드 `data.js` 모델을 백엔드 ELLIS REST API와 일대일 매핑. 향후 백엔드 구현 시 프론트엔드는 코드 거의 그대로 사용 가능.

---

## 1. 아키텍처 개요

```
[OMT Frontend (golftels/golftel/builder)]
       │
       │ HTTPS · JSON · JWT
       ▼
[ELLIS Booking Service]
       │
       │ /api/v1/...
       ▼
┌─ Domain Services ─┐
│  - Catalog        │ ← 골프텔/코스/호텔
│  - Inventory      │ ← 슬롯 가용성 · 채널 어댑터 호출
│  - Booking        │ ← 예약 생성/취소
│  - User           │ ← 회원/세션
│  - Payment        │ ← 결제 게이트웨이 분기
│  - Notification   │ ← 알림 생성/푸시
│  - Review         │ ← 후기
│  - Creator        │ ← 크리에이터 커미션
└───────────────────┘
       │
       ▼
[Channel Adapter Layer] ← admin-channels.html에서 시각화
       │
       ▼
[Tee Sheet Systems] (GDO · GolfNow · Golfdigg · Kakao · XGOLF · ...)
```

---

## 2. 인증

- **방식**: JWT Bearer (HS256, 만료 24h, refresh 30d)
- **헤더**: `Authorization: Bearer <accessToken>`
- **로그인**: `POST /api/v1/auth/login` { provider: 'kakao' | 'naver' | 'google' | 'apple' | 'email', token | email + password }
- **응답**: `{ accessToken, refreshToken, user: User }`
- **갱신**: `POST /api/v1/auth/refresh` { refreshToken }

`State.getUser()` ↔ `GET /api/v1/users/me`

---

## 3. 도메인별 스키마 매핑

### 3.1 골프텔 (Golftels)

**프론트 (data.js)**:
```js
OMT.DATA.GOLFTELS[i] = {
  id, type, country, city,
  name, tagline,
  hotelId, hotelName, roomType,
  nights, rounds,
  courseIds[],
  inclusions:{ greenFee, cartFee, caddyFee, golfShuttle, airportPickup, breakfast, dinner },
  pricePerPerson, oldPricePerPerson, priceBasis,
  cartPolicy, teeTimeWindows[],
  operatingInfo:{ checkIn, checkOut, breakfast, teeOff:{...} },
  distance:{ city, airport },
  roomOptions[{ type, occupancy, supplement, isDefault }],
  facilities[],
  rules[],
  images[],
  highlights[], includes[], excludes[],
  rating, reviews,
  // 디테일 (Phase 2)
  facilityHours[], dresscode[], weatherPolicy[], partyRules[], cartRules[],
  juniorPolicy, companionPolicy, lateNote, onsiteNote, faqs[],
  caddyTip, equipmentRental, pickupZones[],
  address, phone, coords, holidays[],
  reviewStats, reviews[]
}
```

**백엔드 API**:
| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/api/v1/golftels` | 리스트 (query: country, city, minRounds, maxPrice, ownership, page, size) |
| `GET` | `/api/v1/golftels/:id` | 상세 (디테일 풀로드) |
| `GET` | `/api/v1/golftels/:id/reviews?page=1` | 리뷰 페이지네이션 |
| `GET` | `/api/v1/golftels/:id/faqs` | FAQ |
| `GET` | `/api/v1/golftels/:id/slots?date=YYYY-MM-DD` | 채널 어댑터 호출 → 슬롯 가용성 반환 |

**DB 컬럼 (예시 PostgreSQL)**:
```sql
CREATE TABLE golftels (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(20) NOT NULL,           -- 'golftel' | 'golftel-air'
  country VARCHAR(20) NOT NULL,
  city VARCHAR(20) NOT NULL,
  hotel_id VARCHAR(64) REFERENCES hotels(id),
  hotel_name TEXT,
  room_type TEXT,
  nights SMALLINT NOT NULL,
  rounds SMALLINT NOT NULL,
  price_per_person_krw INT NOT NULL,
  old_price_per_person_krw INT,
  price_basis VARCHAR(30) NOT NULL,     -- 'per-person-twin' | 'per-person-single'
  cart_policy TEXT,
  distance_city TEXT,
  distance_airport TEXT,
  rating NUMERIC(3,1),
  reviews_count INT DEFAULT 0,
  caddy_tip_included BOOLEAN,
  caddy_tip_amount TEXT,
  caddy_tip_note TEXT,
  address TEXT,
  phone TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- JSONB 필드 (PostgreSQL은 JSONB 인덱싱 지원):
ALTER TABLE golftels ADD COLUMN inclusions JSONB;
ALTER TABLE golftels ADD COLUMN operating_info JSONB;
ALTER TABLE golftels ADD COLUMN facility_hours JSONB;
ALTER TABLE golftels ADD COLUMN dresscode JSONB;
ALTER TABLE golftels ADD COLUMN weather_policy JSONB;
ALTER TABLE golftels ADD COLUMN party_rules JSONB;
ALTER TABLE golftels ADD COLUMN cart_rules JSONB;
ALTER TABLE golftels ADD COLUMN room_options JSONB;
ALTER TABLE golftels ADD COLUMN facilities JSONB;
ALTER TABLE golftels ADD COLUMN images JSONB;
ALTER TABLE golftels ADD COLUMN equipment_rental JSONB;
ALTER TABLE golftels ADD COLUMN pickup_zones JSONB;
ALTER TABLE golftels ADD COLUMN holidays JSONB;
ALTER TABLE golftels ADD COLUMN highlights JSONB;
ALTER TABLE golftels ADD COLUMN includes JSONB;
ALTER TABLE golftels ADD COLUMN excludes JSONB;
ALTER TABLE golftels ADD COLUMN tee_time_windows JSONB;
ALTER TABLE golftels ADD COLUMN review_stats JSONB;

-- 코스 매핑 (M:N)
CREATE TABLE golftel_courses (
  golftel_id VARCHAR(64) REFERENCES golftels(id) ON DELETE CASCADE,
  course_id VARCHAR(64) REFERENCES golf_courses(id),
  ord SMALLINT DEFAULT 0,
  PRIMARY KEY (golftel_id, course_id)
);
```

### 3.2 골프 코스 (Golf Courses)

```sql
CREATE TABLE golf_courses (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT NOT NULL,
  country VARCHAR(20),
  city VARCHAR(30),
  holes SMALLINT,
  par SMALLINT,
  yardage INT,
  designer TEXT,
  greens TEXT,
  channel_manager VARCHAR(20) NOT NULL,   -- 'direct' | 'gdo' | 'golfdigg' | 'partner' | ...
  real_time_booking BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 호텔 (Hotels)

호텔은 이미 정규화. `golftels.hotel_id` FK로 참조.

### 3.4 채널 매니저 (Channel Managers)

```sql
CREATE TABLE channel_managers (
  id VARCHAR(20) PRIMARY KEY,             -- 'direct', 'gdo', ...
  label TEXT NOT NULL,
  short_name TEXT NOT NULL,
  tier VARCHAR(10) NOT NULL,              -- 'tier-1' | 'tier-2' | 'tier-3'
  config JSONB,                            -- adapter-specific 설정
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 예약 (Bookings)

**프론트**:
```js
booking = {
  id, bookingNumber, status,           // 'confirmed' | 'pending' | 'completed' | 'cancelled'
  productId, productType,              // 'golftel' | 'golftel-air' | 'package'
  productName, productImage,
  country, city, ownership,
  nights, rounds,
  dates, paxCount, total,
  paymentMethod, leadName, phone,
  travelers[],
  packageSnapshot:{                    // 사용자 선택 사항 묶음
    roomOption, roomSupplement,
    selectedSlots[{ window, time, courseId, courseName, price }]
  },
  createdAt, cancelledAt
}
```

**백엔드 API**:
| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/v1/bookings` | 예약 생성 (결제 게이트웨이 호출 후 트랜잭션) |
| `GET` | `/api/v1/bookings` | 내 예약 리스트 (auth 필요) |
| `GET` | `/api/v1/bookings/:bookingNumber` | 단건 |
| `PATCH` | `/api/v1/bookings/:bookingNumber/cancel` | 취소 |

**DB**:
```sql
CREATE TABLE bookings (
  id VARCHAR(64) PRIMARY KEY,
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  user_id VARCHAR(64) REFERENCES users(id),
  status VARCHAR(20) NOT NULL,
  product_id VARCHAR(64),
  product_type VARCHAR(20),
  product_name TEXT,
  country VARCHAR(20),
  city VARCHAR(20),
  ownership VARCHAR(20),
  nights SMALLINT,
  rounds SMALLINT,
  dates_text TEXT,                       -- "2026.06.14 - 2026.06.18"
  date_start DATE,
  date_end DATE,
  pax_count SMALLINT NOT NULL,
  total_krw INT NOT NULL,
  payment_method VARCHAR(20),
  payment_id TEXT,                       -- 결제 게이트웨이 ID
  lead_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  package_snapshot JSONB,                -- selectedSlots, roomOption, ...
  travelers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ
);

-- 예약 슬롯 정규화 (admin/리포팅용)
CREATE TABLE booking_slots (
  booking_id VARCHAR(64) REFERENCES bookings(id) ON DELETE CASCADE,
  slot_idx SMALLINT,
  course_id VARCHAR(64) REFERENCES golf_courses(id),
  time_window VARCHAR(20),                -- 'morning' | 'afternoon' | 'twilight' | 'night'
  tee_time TIME,
  channel_booking_id TEXT,                -- 외부 채널 어댑터가 반환한 부킹 ID
  channel_confirmed_at TIMESTAMPTZ,
  PRIMARY KEY (booking_id, slot_idx)
);
```

### 3.6 알림 (Notifications)

```sql
CREATE TABLE notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  type VARCHAR(20) NOT NULL,             -- 'booking' | 'reminder' | 'promotion' | 'coupon' | 'points' | 'review' | 'system'
  icon VARCHAR(4),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  action_label TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_booking_id VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**API**:
- `GET /api/v1/notifications?unreadOnly=true&page=1`
- `PATCH /api/v1/notifications/:id/read`
- `PATCH /api/v1/notifications/read-all`

**동적 알림 (state.js _buildDynamicNotifications)** → 백엔드는 **cron job**으로 일일 자정에 D-7/D-3/D-1 알림을 일괄 생성하거나, 클라이언트 진입 시 on-demand 생성 + 결과 알림 INSERT.

### 3.7 후기 (Reviews)

```sql
CREATE TABLE reviews (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  product_id VARCHAR(64) NOT NULL,
  product_type VARCHAR(20) NOT NULL,
  booking_id VARCHAR(64) REFERENCES bookings(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  positives JSONB,                       -- ['코스 관리상태', '한국인 캐디']
  negatives JSONB,
  images JSONB,                          -- 향후 사진 후기
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 운영사 답변
CREATE TABLE review_replies (
  review_id VARCHAR(64) PRIMARY KEY REFERENCES reviews(id),
  reply_text TEXT NOT NULL,
  replied_by VARCHAR(64),                -- 답변 운영자 ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

후기 통계는 materialized view로:
```sql
CREATE MATERIALIZED VIEW review_stats AS
SELECT product_id, COUNT(*) AS count, AVG(rating) AS rating
FROM reviews GROUP BY product_id;
-- 트리거로 새 후기 INSERT 시 REFRESH
```

---

## 4. 채널 어댑터 인터페이스

ELLIS Channel Adapter Layer는 어댑터마다 동일한 인터페이스를 구현:

```typescript
interface ChannelAdapter {
  id: string;                                                  // 'gdo' | 'golfnow' | ...
  health(): Promise<HealthStatus>;
  searchSlots(courseId: string, date: string): Promise<Slot[]>;
  reserveSlot(courseId: string, slotKey: string, paxCount: number): Promise<ChannelBookingRef>;
  cancelSlot(channelBookingId: string): Promise<void>;
  webhookHandler(payload: unknown): Promise<void>;             // 외부 시스템 → ELLIS 콜백
}

type HealthStatus = {
  status: 'ok' | 'degraded' | 'down';
  lastSyncAt: string;
  avgLatencyMs: number;
  errorRate24h: number;
};

type Slot = {
  key: string;
  window: 'morning' | 'afternoon' | 'twilight' | 'night';
  time: string;          // "06:00"
  courseId: string;
  price: number;
  available: boolean;
};

type ChannelBookingRef = {
  channelId: string;
  channelBookingId: string;
  confirmedAt: string;
  voucher?: string;
};
```

### 구현체 (현재 mock, 향후 실제 통합)

| ID | 패키지 | 인증 | 폴링/Webhook |
|---|---|---|---|
| `direct` | 내부 PostgreSQL | 내부 토큰 | N/A (DB 직접) |
| `gdo` | `@ellis/adapter-gdo` | API Key | 5분 폴링 + Webhook |
| `gora` | `@ellis/adapter-gora` | OAuth2 | 10분 폴링 |
| `golfnow` | `@ellis/adapter-golfnow` | Bearer (B2B 계약) | Webhook (sub) |
| `golfmanager` | `@ellis/adapter-golfmanager` | Basic Auth (V3) | Webhook |
| `kakaogolf` | `@ellis/adapter-kakaogolf` | Partner Key | 폴링 |
| `xgolf` | `@ellis/adapter-xgolf` | Partner Key | 폴링 |
| `golfdigg` | `@ellis/adapter-golfdigg` | API Key | 5분 폴링 + Webhook |
| `partner` | 수동 | N/A | 채팅/이메일 |

### 부킹 흐름

```
1. 사용자가 frontend에서 슬롯 선택
2. POST /api/v1/bookings { productId, selectedSlots[], ... }
3. ELLIS Booking Service:
   a) 결제 게이트웨이 호출 → paymentId 확보
   b) bookings INSERT (status='pending')
   c) selectedSlots 각각:
      i)  course.channel_manager 조회 → adapter 결정
      ii) adapter.reserveSlot() 호출
      iii) 성공 → booking_slots에 channel_booking_id 저장
      iv) 실패 → booking 롤백 + payment 환불 → status='cancelled'
   d) 모두 성공 → status='confirmed'
   e) 알림 INSERT (n.type='booking')
4. 응답: { bookingNumber, status, ... }
```

### 견적 모드 (`realTimeBooking: false`)

- 슬롯 선택 시 즉시 확정 불가
- `bookings.status = 'pending'`로 저장
- 운영자가 24h 내 수동/자동으로 외부 시스템과 협의
- 확정되면 `status = 'confirmed'` + 알림 발송

---

## 5. 결제 (Payment)

```typescript
interface PaymentGateway {
  initiate(req: PaymentInitReq): Promise<PaymentInitResp>;     // 결제 페이지 URL 반환
  webhookHandler(payload: unknown): Promise<void>;             // 결제 결과 콜백
  refund(paymentId: string, amount: number): Promise<void>;
}
```

| `paymentMethod` | Gateway | 환경 |
|---|---|---|
| `kakao` | KakaoPay | sandbox + prod |
| `naver` | NaverPay | sandbox + prod |
| `card` | TossPayments | sandbox + prod |
| `bank` | 가상계좌 (Toss) | sandbox + prod |

---

## 6. 알림 발송 (Outbound)

- 카카오 알림톡 (BizPlus) — 예약 확정/D-day 리마인더
- 이메일 (SES) — 예약 확인서 PDF 첨부
- 푸시 (FCM/APNs) — 모바일 앱

ELLIS는 각 채널에 대해 `templateCode + variables` 형식의 통합 API 제공.

---

## 7. 크리에이터 (Creator)

```sql
CREATE TABLE creators (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  name TEXT, initial VARCHAR(2),
  subs INT, bio TEXT,
  grade VARCHAR(10),                     -- 'bronze' | 'silver' | 'gold' | 'platinum'
  joined_at TIMESTAMPTZ,
  is_approved BOOLEAN,
  cumulative_sales BIGINT DEFAULT 0,
  cumulative_direct_sales BIGINT DEFAULT 0,
  ...
);

CREATE TABLE creator_commissions (
  id VARCHAR(64) PRIMARY KEY,
  creator_id VARCHAR(64) REFERENCES creators(id),
  booking_id VARCHAR(64) REFERENCES bookings(id),
  base_rate NUMERIC(5,4),               -- 0.05 (5%) 또는 0.10 (10%)
  grade_bonus NUMERIC(5,4),
  onboarding_bonus NUMERIC(5,4),
  total_commission_krw INT,
  status VARCHAR(20),                    -- 'pending' | 'paid' | 'cancelled'
  paid_at TIMESTAMPTZ,
  ...
);
```

---

## 8. 마이그레이션 체크리스트

프론트엔드 코드를 그대로 백엔드 연동으로 전환할 때:

- [ ] `data.js` → 페이지마다 `fetch('/api/v1/...')`로 교체. 응답 스키마는 동일하도록 백엔드에서 정형화.
- [ ] `OMT.State.getBookings()` → 인증 토큰 첨부한 GET 호출 + 로컬 캐시.
- [ ] `OMT.State.createBooking()` → POST 호출 + 응답 booking 객체로 상태 갱신.
- [ ] `OMT.State.markNotifRead()` → PATCH 호출 + 로컬 readIds 동기화.
- [ ] `OMT.State.getRecentlyViewed()` → 클라이언트 로컬 유지 (트래픽 절감).
- [ ] `OMT.State._buildDynamicNotifications()` → 백엔드 cron job으로 이관.
- [ ] `complete.html`의 시드 booking 폴백 (`OMT-3DK21A` 등) → 제거. 모든 booking은 백엔드에서.
- [ ] `state.js`의 `KEYS.bookings` localStorage 버전 → 캐시 무효화 정책으로 전환.
- [ ] 결제 페이지의 `submitPayment()` mock → 실제 결제 게이트웨이 SDK로 교체.

---

## 9. 환경별 엔드포인트

| 환경 | Base URL | 비고 |
|---|---|---|
| Local | `http://localhost:8080/api/v1` | docker-compose |
| Dev | `https://api-dev.ellis.ohmytrip.com/api/v1` | 자동 배포 |
| Staging | `https://api-stg.ellis.ohmytrip.com/api/v1` | QA 환경 |
| Production | `https://api.ellis.ohmytrip.com/api/v1` | 운영 |

CORS: `https://*.ohmytrip.com` + `https://bstars00-rgb.github.io`

---

## 10. 시드 데이터 마이그레이션 SQL

`data.js`의 mock 데이터를 ELLIS DB로 옮길 때 사용할 시드 스크립트는 별도 `seeds/` 디렉토리에 보관 (향후):

```
seeds/
  001_channel_managers.sql
  002_hotels.sql
  003_golf_courses.sql
  004_golftels.sql
  005_golftel_courses.sql       (M:N 매핑)
  006_users_sample.sql
  007_bookings_sample.sql
  008_notifications_sample.sql
```

각 스크립트는 `INSERT ... ON CONFLICT DO NOTHING`으로 멱등성 보장.

---

## 부록 A. 필드 매핑 표 (요약)

| Frontend (data.js) | Backend Column | 비고 |
|---|---|---|
| `g.id` | `golftels.id` | VARCHAR(64) PK |
| `g.type` | `golftels.type` | enum |
| `g.country` | `golftels.country` | enum |
| `g.hotelId` | `golftels.hotel_id` | FK |
| `g.nights` | `golftels.nights` | SMALLINT |
| `g.rounds` | `golftels.rounds` | SMALLINT |
| `g.pricePerPerson` | `golftels.price_per_person_krw` | INT (원 단위) |
| `g.inclusions.greenFee` | `golftels.inclusions->>'greenFee'` | JSONB |
| `g.operatingInfo` | `golftels.operating_info` | JSONB |
| `g.courseIds[]` | `golftel_courses.course_id` | M:N table |
| `g.coords` | `golftels.lat`, `golftels.lng` | NUMERIC |
| `b.bookingNumber` | `bookings.booking_number` | UNIQUE |
| `b.packageSnapshot` | `bookings.package_snapshot` | JSONB |
| `b.selectedSlots[].time` | `booking_slots.tee_time` | TIME |
| `n.link` | `notifications.link` | TEXT |
| `c.channelManager` | `golf_courses.channel_manager` | enum |
| `c.realTimeBooking` | `golf_courses.real_time_booking` | BOOLEAN |
| `c.yardage` | `golf_courses.yardage` | INT |

---

_변경 시 GIT TAG로 버전 관리 (`spec-v1.0`, `spec-v1.1`...). Breaking change는 메이저 버전 업._

---

## 11. 백오피스 (ELLIS BackOffice) 영역

> 상세 명세: [BACKOFFICE_SPEC.md](./BACKOFFICE_SPEC.md)
>
> **본 섹션은 ELLIS 백엔드의 백오피스 측 데이터 모델 + 인증·권한 만 정의**. UI 명세·페이지 구조·운영 흐름은 BACKOFFICE_SPEC.md 참고.

### 11.1 추가 도메인 DDL

**운영자 계정 (`admins`)**

```sql
CREATE TABLE admins (
  id                  VARCHAR(64)   PRIMARY KEY,
  email               TEXT          UNIQUE NOT NULL,
  password_hash       TEXT          NOT NULL,                    -- bcrypt cost 12+
  name                TEXT          NOT NULL,
  role                VARCHAR(20)   NOT NULL CHECK (role IN ('SUPER_ADMIN','MANAGER','OPERATOR','VIEWER')),
  team                VARCHAR(30),                                -- 'CS' | 'MD' | 'FINANCE' | 'MARKETING' | 'SYSTEM'
  is_active           BOOLEAN       DEFAULT TRUE,
  totp_secret         TEXT,                                       -- 2FA TOTP secret (KMS 암호화 저장)
  ip_whitelist        INET[],                                     -- nullable; null이면 제한 없음
  last_login_at       TIMESTAMPTZ,
  last_login_ip       INET,
  failed_attempts     SMALLINT      DEFAULT 0,                    -- 5회 초과 시 잠금
  locked_until        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
```

**감사 로그 (`audit_logs`)**

```sql
CREATE TABLE audit_logs (
  id                  BIGSERIAL     PRIMARY KEY,
  admin_id            VARCHAR(64)   REFERENCES admins(id),
  action              VARCHAR(50)   NOT NULL,                    -- 'booking.cancel' | 'product.update' | 'user.grade-change' 등
  target_type         VARCHAR(20)   NOT NULL,                    -- 'booking' | 'product' | 'user' | 'admin' | 'banner' | ...
  target_id           VARCHAR(64),
  before_value        JSONB,
  after_value         JSONB,
  reason              TEXT,                                       -- 운영자가 작성한 변경 사유 (환불 등 민감 작업 의무)
  ip_address          INET,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

**CMS — 메인 배너 / 인기 검색어 / 공지**

```sql
CREATE TABLE cms_banners (
  id                  VARCHAR(64)   PRIMARY KEY,
  slot                VARCHAR(30)   NOT NULL,                    -- 'hero' | 'sidebar' | 'mobile-home'
  image_url           TEXT          NOT NULL,
  link_url            TEXT,
  title               TEXT,
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  priority            SMALLINT      DEFAULT 0,
  click_count         INT           DEFAULT 0,
  is_active           BOOLEAN       DEFAULT TRUE,
  created_by          VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE cms_trending_keywords (
  id                  VARCHAR(64)   PRIMARY KEY,
  query               TEXT          NOT NULL,
  rank                SMALLINT      NOT NULL,
  score_label         TEXT,                                       -- '+128%' | '1위' | '추천' 등
  icon                VARCHAR(4),                                 -- 🔥 🆕 🏆 ⭐
  boost_factor        NUMERIC(3,2)  DEFAULT 1.0,
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  created_by          VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE cms_notices (
  id                  VARCHAR(64)   PRIMARY KEY,
  title               TEXT          NOT NULL,
  body                TEXT          NOT NULL,
  slot                VARCHAR(30)   NOT NULL,                    -- 'main-top' | 'mypage-top' | 'modal'
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  is_pinned           BOOLEAN       DEFAULT FALSE,
  view_count          INT           DEFAULT 0,
  created_by          VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
```

**가격 정책 룰 (`pricing_rules`)**

```sql
CREATE TABLE pricing_rules (
  id                  VARCHAR(64)   PRIMARY KEY,
  name                TEXT          NOT NULL,                    -- '성수기 가산' | '주말 가산' | 'VIP 회원' 등
  rule_type           VARCHAR(20)   NOT NULL,                    -- 'season' | 'weekday' | 'holiday' | 'group' | 'tier'
  scope               JSONB         NOT NULL,                    -- {country:'vn,ph'} | {weekday:[6,7]} | {tier:'VIP'} 등
  starts_at           DATE,
  ends_at             DATE,
  delta_pct           NUMERIC(5,2)  NOT NULL,                    -- +18.00 / -12.00 등
  applies_to          VARCHAR(20)   NOT NULL,                    -- 'all' | 'golftel' | 'package' | 'activity'
  is_active           BOOLEAN       DEFAULT TRUE,
  priority            SMALLINT      DEFAULT 0,                   -- 충돌 시 우선순위
  created_by          VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active, starts_at, ends_at);
```

**공급사 정산 (`supplier_settlements`)** — 크리에이터 정산은 `settlements` 테이블 별도

```sql
CREATE TABLE supplier_settlements (
  id                  VARCHAR(64)   PRIMARY KEY,
  supplier_id         VARCHAR(64)   NOT NULL,                    -- admin-suppliers SUPPLIERS와 매칭
  period_start        DATE          NOT NULL,
  period_end          DATE          NOT NULL,
  total_sales_krw     BIGINT,
  commission_pct      NUMERIC(5,4),
  commission_amount   BIGINT,
  net_payout          BIGINT,                                    -- 송금 금액
  bank_account        TEXT,                                      -- 암호화 저장
  status              VARCHAR(20)   NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'on_hold'
  paid_at             TIMESTAMPTZ,
  paid_by             VARCHAR(64)   REFERENCES admins(id),
  invoice_url         TEXT,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
CREATE INDEX idx_supplier_settlement_period ON supplier_settlements(supplier_id, period_start);
CREATE INDEX idx_supplier_settlement_status ON supplier_settlements(status);
```

### 11.2 백오피스 API 엔드포인트 (요약 — **상세는 [ELLIS_API_BACKOFFICE.md](./ELLIS_API_BACKOFFICE.md)**)

> v1.0 (2026-06-11) 기준 22개 엔드포인트가 풀 명세화됨. Request/Response JSON 예시, 에러 코드, Rate Limit, 멱등성 키, audit_logs/알림톡 트리거 모두 별도 문서 참고.

| 메서드 | 경로 | 권한 |
|---|---|---|
| `POST` | `/api/admin/auth/login` | (공개) |
| `POST` | `/api/admin/auth/2fa/verify` | (로그인 토큰) |
| `POST` | `/api/admin/auth/logout` | VIEWER+ |
| `GET` | `/api/admin/dashboard/summary` | VIEWER+ |
| `GET/POST/PATCH/DELETE` | `/api/admin/bookings/*` | OPERATOR+ |
| `POST` | `/api/admin/bookings/:id/cancel` | OPERATOR+ |
| `POST` | `/api/admin/bookings/:id/refund` | MANAGER+ |
| `POST` | `/api/admin/bookings/:id/resend-alimtalk` | OPERATOR+ |
| `GET/POST/PATCH/DELETE` | `/api/admin/products/*` | MANAGER+ |
| `POST` | `/api/admin/products/:id/sync` | OPERATOR+ |
| `POST` | `/api/admin/pricing-rules/bulk` | MANAGER+ |
| `GET/PATCH` | `/api/admin/users/*` | VIEWER+ |
| `POST` | `/api/admin/users/:id/grade` | MANAGER+ |
| `POST` | `/api/admin/users/:id/points` | MANAGER+ |
| `GET` | `/api/admin/cs/inquiries` | OPERATOR+ |
| `POST` | `/api/admin/cs/inquiries/:id/reply` | OPERATOR+ |
| `GET/POST/PATCH/DELETE` | `/api/admin/cms/*` | MANAGER+ |
| `GET` | `/api/admin/settlement/creators` | VIEWER+ |
| `POST` | `/api/admin/settlement/creators/run` | SUPER_ADMIN |
| `GET` | `/api/admin/settlement/suppliers` | VIEWER+ |
| `GET/POST/PATCH` | `/api/admin/admins/*` | SUPER_ADMIN |
| `GET` | `/api/admin/audit-logs` | MANAGER+ |

### 11.3 인증·세션

- **로그인**: 이메일 + 비밀번호 + 2FA TOTP
- **JWT Access**: 8h (`/api/admin/*` 접근)
- **JWT Refresh**: 24h
- **세션 비활성 30분**: 자동 만료
- **민감 작업** (환불·회원탈퇴·운영자 추가): 비밀번호 재입력 또는 2FA 재인증
- **모든 mutating 요청**: `audit_logs` 자동 INSERT (미들웨어)

### 11.4 자동 트리거

- 운영자가 예약 수동 취소 → `bookings.status = 'cancelled'` + `notifications` INSERT + ALIMTALK TPL-009 발송
- 운영자가 환불 승인 → `bookings.status = 'refunded'` + 결제 게이트웨이 환불 API 호출 + ALIMTALK TPL-009 발송
- 운영자가 문의 답변 → `user_inquiries.status = 'replied'` + ALIMTALK TPL-007 발송
- 운영자가 상품 가격 변경 → `pricing_rules` INSERT + 모든 미확정 견적 재계산 (옵션)

---

## 12. 프론트엔드 변경 반영 (2026-06-11 기준)

다음 프론트 변경 사항이 본 스펙에 반영됨:

### 12.1 라이브 commerce
- `live.html` 풀스크린 라이브 페이지 + 시청 이력 추적
- 신규 도메인 추가 권장:
  ```sql
  CREATE TABLE live_streams (
    id            VARCHAR(64) PRIMARY KEY,
    creator_id    VARCHAR(64),
    title         TEXT,
    starts_at     TIMESTAMPTZ,
    ends_at       TIMESTAMPTZ,
    viewer_peak   INT,
    products      JSONB,                                 -- [{productId, soldCount, soldAmount}]
    chat_count    INT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE live_watch_history (
    id            BIGSERIAL PRIMARY KEY,
    user_id       VARCHAR(64),
    live_id       VARCHAR(64) REFERENCES live_streams(id),
    watched_at    TIMESTAMPTZ DEFAULT NOW(),
    watch_seconds INT,
    converted_booking_id VARCHAR(64)                     -- nullable, 시청 후 예약 전환 추적
  );
  ```

### 12.2 마이페이지 통계 카드
- `mypage.html` 적립/절감/방문국가/라운딩 4 KPI 카드
- 데이터는 기존 `bookings` + `users.points` 집계로 계산 (별도 테이블 불필요)

### 12.3 사용자 알림 (이번달 추가)
- `users.notifications` 컬럼 대신 별도 `user_notifications` 테이블 권장 (이미 §3.6에 정의됨)
- 모바일 PWA의 FCM 토큰은 `user_devices.fcm_token` 컬럼에 저장 (신규):
  ```sql
  CREATE TABLE user_devices (
    id              VARCHAR(64) PRIMARY KEY,
    user_id         VARCHAR(64) NOT NULL,
    platform        VARCHAR(20),     -- 'web' | 'ios' | 'android' | 'pwa'
    fcm_token       TEXT,
    last_seen_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  );
  ```

### 12.4 D-day 알림 트리거 시스템
- `mobile.html`의 D-7 / D-3 / D-1 알림 시뮬레이션은 백엔드에서 cron으로 처리:
  - `cron: 0 9 * * *` (매일 9시) → D-day 계산 후 ALIMTALK 발송 (TPL-002 / TPL-003)
  - 발송 이력은 §6.2의 `alimtalk_logs` 테이블에 기록

### 12.5 결제 실패 시나리오
- `payment.html`의 10% 실패 시뮬레이션 → `bookings.payment_attempts` JSONB로 시도 이력 보관:
  ```sql
  ALTER TABLE bookings ADD COLUMN payment_attempts JSONB DEFAULT '[]';
  -- [{attempt_no, method, status, error_code, attempted_at}, ...]
  ```

### 12.6 백오피스 운영 도구 (NEW)
- 본 v1.0에 §11 백오피스 영역 신규 추가
- 신규 페이지: `admin-dashboard.html` / `admin-bookings.html` / `admin-products.html`
- 신규 테이블: `admins`, `audit_logs`, `cms_banners`, `cms_trending_keywords`, `cms_notices`, `pricing_rules`, `supplier_settlements`

---

_v1.0 — 2026-06-11 백오피스 섹션 + 프론트 변경 반영 갱신_
