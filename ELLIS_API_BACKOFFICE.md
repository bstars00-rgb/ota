# ELLIS BackOffice API 명세서

> **v1.0** · 2026-06-11 · 사이클 13 · 백오피스 API 22개 풀 명세
>
> 본 문서는 백오피스(`admin-*.html`) 프론트에서 호출하는 ELLIS 백엔드 API의 상세 스펙입니다.
> 상위 문서: [ELLIS_SPEC.md](./ELLIS_SPEC.md) §11 / [BACKOFFICE_SPEC.md](./BACKOFFICE_SPEC.md)
>
> **백엔드 MD-only 원칙**: 실제 서버 코드는 추후 개발팀이 본 명세 기반 구현. 프론트 변경 시 본 문서 함께 갱신.

---

## 0. 공통 사항

### 0.1 Base URL

| 환경 | URL |
|---|---|
| Local | `http://localhost:3001/api/admin` |
| Dev | `https://dev-api.ellis.omt.com/api/admin` |
| Staging | `https://stg-api.ellis.omt.com/api/admin` |
| Production | `https://api.ellis.omt.com/api/admin` |

### 0.2 인증

모든 `/api/admin/*` 엔드포인트는 JWT Bearer 토큰을 요구합니다 (로그인 엔드포인트 제외).

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Admin-Id: admin-08
X-Request-Id: req_2026061114320887abc123    # 멱등성·추적용 (UUID v4 권장)
X-Idempotency-Key: idem_xyz789               # POST/PATCH/DELETE에서 권장
```

- **JWT Access**: 8h
- **JWT Refresh**: 24h
- **세션 비활성 30분**: 자동 만료 — 401 응답 시 refresh 시도 후 재시도
- **민감 작업** (환불·회원탈퇴·운영자 추가): `X-Reauth-Token`을 별도 요구
- **IP 화이트리스트**: `admins.ip_whitelist`가 NULL이 아니면 회사 VPN/오피스 IP만 허용

### 0.3 공통 응답 포맷

**Success (2xx)**:
```json
{
  "ok": true,
  "data": { ... },              // 엔드포인트별 페이로드
  "meta": {
    "request_id": "req_xxx",
    "elapsed_ms": 142
  }
}
```

**Error (4xx, 5xx)**:
```json
{
  "ok": false,
  "error": {
    "code": "BO_BOOKING_NOT_FOUND",
    "message": "Booking with id OMT-XYZ123 not found",
    "details": {                 // 선택
      "field": "booking_id",
      "hint": "예약번호 형식 확인 — OMT-로 시작"
    }
  },
  "meta": {
    "request_id": "req_xxx",
    "elapsed_ms": 42
  }
}
```

### 0.4 페이지네이션

목록 API는 cursor 기반 + offset 옵션을 모두 지원:

**Cursor (권장)**:
```
GET /api/admin/bookings?limit=25&cursor=eyJpZCI6Ik9NVC1YWVoifQ==
```

**Offset (CSV 다운로드 등)**:
```
GET /api/admin/bookings?limit=25&offset=50
```

**응답 meta**:
```json
"meta": {
  "pagination": {
    "limit": 25,
    "next_cursor": "eyJpZCI6IjAxNDk5In0=",     // null이면 마지막 페이지
    "total_count": 2486,                        // offset 모드에서만 정확
    "has_more": true
  }
}
```

### 0.5 에러 코드

| 코드 | HTTP | 설명 |
|---|---|---|
| `BO_AUTH_REQUIRED` | 401 | JWT 토큰 없음 또는 만료 |
| `BO_AUTH_2FA_REQUIRED` | 401 | 2FA 미인증 |
| `BO_AUTH_REAUTH_REQUIRED` | 401 | 민감 작업 — 재인증 필요 |
| `BO_FORBIDDEN_ROLE` | 403 | 권한 부족 (현재 ROLE 표시) |
| `BO_FORBIDDEN_IP` | 403 | IP 화이트리스트 외 |
| `BO_NOT_FOUND` | 404 | 리소스 없음 |
| `BO_VALIDATION` | 422 | 요청 필드 유효성 실패 |
| `BO_CONFLICT` | 409 | 상태 충돌 (이미 확정된 예약 등) |
| `BO_RATE_LIMIT` | 429 | Rate Limit 초과 |
| `BO_IDEMPOTENCY_CONFLICT` | 409 | 동일 멱등키로 다른 payload 재요청 |
| `BO_INTERNAL` | 500 | 서버 내부 오류 (Sentry 자동 보고) |

### 0.6 Rate Limit

| 범위 | 제한 | 헤더 |
|---|---|---|
| 일반 GET | 600 req/min/admin | `X-RateLimit-*` |
| Mutating (POST/PATCH/DELETE) | 120 req/min/admin | 동일 |
| 정산 실행 | 1 req/hour/role(SUPER_ADMIN) | 동일 |
| CSV export | 10 req/hour/admin | 동일 |
| 알림톡 일괄 발송 | 3 req/hour/admin | 동일 |

응답 헤더:
```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 583
X-RateLimit-Reset: 1718082600
```

### 0.7 멱등성 (Idempotency)

POST/PATCH/DELETE 호출 시 `X-Idempotency-Key` 헤더 권장. 동일 키로 24h 내 재요청 시 캐시된 응답 반환. 다른 payload로 재요청 시 `BO_IDEMPOTENCY_CONFLICT` (409).

### 0.8 감사 로그 (audit_logs)

**모든 mutating API**는 다음을 자동 INSERT:
```sql
INSERT INTO audit_logs (admin_id, action, target_type, target_id, before_value, after_value, reason, ip_address, user_agent, created_at)
VALUES ('admin-08', 'booking.cancel', 'booking', 'OMT-XYZ', '{"status":"confirmed"}', '{"status":"cancelled"}', '고객 단순 변심', '192.168.1.42', 'Mozilla/...', NOW());
```

각 API 명세의 `audit_logs` 섹션에 액션명 명시.

### 0.9 카톡 알림톡 자동 트리거

일부 API는 ALIMTALK_TEMPLATES.md의 템플릿을 자동 발송. 각 API 명세에 `alimtalk` 섹션 명시.

---

## 1. 인증 API

### 1.1 `POST /auth/login`

**권한**: (공개)
**Rate Limit**: 10 req/min/IP

**Request**:
```http
POST /api/admin/auth/login
Content-Type: application/json
X-Request-Id: req_login_abc

{
  "email": "park@omt.com",
  "password": "PlainPassword123!"
}
```

**Response (200)** — 2FA 미설정 계정:
```json
{
  "ok": true,
  "data": {
    "session_token": "tmp_xxx",
    "requires_2fa_setup": true,
    "totp_qr": "otpauth://totp/ELLIS:park@omt.com?secret=JBSWY3DPEHPK3PXP&issuer=ELLIS"
  }
}
```

**Response (200)** — 2FA 설정된 계정:
```json
{
  "ok": true,
  "data": {
    "session_token": "tmp_xxx",
    "requires_2fa": true,
    "expires_in": 300
  }
}
```

**Response (401)**:
```json
{
  "ok": false,
  "error": {
    "code": "BO_AUTH_INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 잘못되었습니다",
    "details": { "remaining_attempts": 3 }
  }
}
```

**비즈니스 로직**:
- `admins.failed_attempts` 5회 초과 시 15분 잠금 (`locked_until` 설정) → `BO_AUTH_LOCKED` (423)
- 성공 시 `failed_attempts = 0` 리셋
- 비활성 계정 (`is_active = false`) → `BO_AUTH_DEACTIVATED` (403)

**audit_logs**: `auth.login_attempt` (성공/실패 무관 기록)

---

### 1.2 `POST /auth/2fa/verify`

**권한**: (session_token)
**Rate Limit**: 10 req/min/IP

**Request**:
```http
POST /api/admin/auth/2fa/verify
Authorization: Bearer tmp_xxx

{
  "totp_code": "428193"
}
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 28800,
    "admin": {
      "id": "admin-08",
      "name": "박CS",
      "email": "park@omt.com",
      "role": "OPERATOR",
      "team": "CS",
      "permissions": ["booking.read", "booking.cancel", "inquiry.reply", ...]
    }
  }
}
```

**Response (401)**:
```json
{
  "ok": false,
  "error": {
    "code": "BO_AUTH_2FA_INVALID",
    "message": "TOTP 코드가 일치하지 않습니다 (시계 동기 ±30s)"
  }
}
```

**audit_logs**: `auth.login` (2FA 성공 후) · `auth.2fa_failed` (실패)

---

### 1.3 `POST /auth/refresh`

**권한**: (refresh_token)
**Request**:
```json
{ "refresh_token": "eyJhbGc..." }
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "access_token": "eyJhbGc...",
    "expires_in": 28800
  }
}
```

---

### 1.4 `POST /auth/logout`

**권한**: VIEWER+

토큰 무효화 + 세션 종료. `audit_logs`: `auth.logout`

---

## 2. 대시보드 API

### 2.1 `GET /dashboard/summary`

**권한**: VIEWER+
**Rate Limit**: 일반

**Request**:
```http
GET /api/admin/dashboard/summary?date=2026-06-11
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "date": "2026-06-11",
    "kpi": {
      "today_bookings": { "value": 38, "diff": "+12", "breakdown": { "golftel": 24, "package": 14 } },
      "quote_pending": { "value": 14, "urgent": 7 },
      "inquiry_pending": { "value": 23, "overdue_24h": 4, "avg_response_h": 3.2 },
      "new_users": { "value": 142, "diff": "+28", "inbound": 4 }
    },
    "urgent_queue": [
      {
        "type": "booking_quote_d1",
        "id": "OMT-VN8K3M",
        "title": "다낭 풀빌라 6박 — D-2 견적 확정 대기",
        "priority": "high",
        "deadline_at": "2026-06-12T18:00:00+09:00",
        "link": "/admin-bookings.html?id=OMT-VN8K3M"
      }
    ],
    "recent_activity": [
      {
        "actor": "박CS",
        "action": "booking.cancel",
        "target": "OMT-3DK21A",
        "at": "2026-06-11T14:32:08+09:00"
      }
    ]
  }
}
```

**캐싱**: 응답 60s ETag · 클라이언트 If-None-Match → 304

---

## 3. 예약 API

### 3.1 `GET /bookings`

**권한**: VIEWER+
**Rate Limit**: 일반

**Query Parameters**:
| 파라미터 | 타입 | 설명 |
|---|---|---|
| `q` | string | 통합 검색 (예약번호·이름·전화·상품명) |
| `status` | enum | `confirmed`/`pending`/`completed`/`cancelled`/`refunded` |
| `sku` | enum | `golftel`/`golftel-air`/`package`/`hotel`/`activity` |
| `country` | enum | `japan`/`vietnam`/`thailand`/`philippines` |
| `depart_from` | date | YYYY-MM-DD |
| `depart_to` | date | YYYY-MM-DD |
| `tag` | string | `urgent`/`today`/`issue` |
| `limit` | int | 기본 25, max 100 |
| `cursor` | string | 페이지네이션 |

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "bookings": [
      {
        "id": "OMT-CL9X2A",
        "name": "클락 미모사 5박 4라운딩",
        "sku": "golftel",
        "country": "philippines",
        "ownership": "franchise",
        "customer": {
          "user_id": "user-11842",
          "name": "박○○",
          "phone_masked": "010-XXXX-1234",
          "grade": "gold"
        },
        "depart_date": "2026-06-13",
        "pax": { "adults": 4, "children": 0 },
        "amount_krw": 4580000,
        "status": "pending",
        "tags": ["urgent", "d-day-2"],
        "channel": "partner",
        "created_at": "2026-06-09T11:18:00+09:00"
      }
    ]
  },
  "meta": {
    "pagination": { "limit": 25, "next_cursor": "...", "total_count": 2486, "has_more": true }
  }
}
```

---

### 3.2 `GET /bookings/:id`

**권한**: VIEWER+

**Response (200)** — 풀 상세:
```json
{
  "ok": true,
  "data": {
    "id": "OMT-CL9X2A",
    "name": "클락 미모사 5박 4라운딩 풀패키지",
    "sku": "golftel",
    "country": "philippines",
    "ownership": "franchise",
    "hotel_id": "h-clark-mimosa",
    "course_ids": ["c-mimosa-gc", "c-festa-gc"],
    "customer": { ... },
    "depart_date": "2026-06-13",
    "nights": 5,
    "rounds": 4,
    "pax": { "adults": 4, "children": 0 },
    "room_option": "슈페리어 트윈 (2인 1실 × 2)",
    "selected_slots": [
      { "date": "2026-06-14", "course_id": "c-mimosa-gc", "tee_time": "07:24", "price_krw": 89000 }
    ],
    "amount_krw": 4580000,
    "margin_pct": 0.15,
    "status": "pending",
    "payment": {
      "method": "kakaopay",
      "status": "paid",
      "transaction_id": "kpay_xxx",
      "paid_at": "2026-06-09T11:24:00+09:00"
    },
    "alimtalk_log": [
      { "template": "TPL-001", "sent_at": "2026-06-09T11:24:00+09:00", "status": "delivered" },
      { "template": "TPL-003", "sent_at": "2026-06-11T09:00:00+09:00", "status": "delivered" }
    ],
    "audit_trail": [
      { "actor": "system", "action": "booking.create", "at": "2026-06-09T11:18:00+09:00" },
      { "actor": "system", "action": "payment.complete", "at": "2026-06-09T11:24:00+09:00" }
    ]
  }
}
```

---

### 3.3 `POST /bookings/:id/cancel`

**권한**: OPERATOR+
**Rate Limit**: mutating

**Request**:
```json
{
  "reason": "고객 단순 변심",
  "refund_amount_krw": 4580000,
  "refund_method": "original",      // "original" | "points"
  "notify_user": true                // 카톡 발송 여부
}
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "id": "OMT-CL9X2A",
    "status": "cancelled",
    "refund_status": "scheduled",
    "alimtalk_sent": true,
    "alimtalk_template": "TPL-009"
  }
}
```

**Response (409)** — 이미 출발/완료:
```json
{
  "ok": false,
  "error": { "code": "BO_CONFLICT", "message": "이미 출발한 예약은 취소할 수 없습니다" }
}
```

**audit_logs**: `booking.cancel`
**alimtalk**: TPL-009 (`notify_user: true`일 때)

---

### 3.4 `POST /bookings/:id/refund`

**권한**: MANAGER+ (재인증 필요)
**Rate Limit**: mutating

**Request**:
```http
POST /api/admin/bookings/OMT-CL9X2A/refund
X-Reauth-Token: reauth_xxx
Content-Type: application/json

{
  "amount_krw": 4580000,
  "reason": "호텔 시설 하자 — 사진 첨부 증빙 완료",
  "evidence_urls": ["https://s3.../evidence_1.jpg"],
  "method": "original",                  // "original" (결제수단 환불) | "transfer" (계좌 송금)
  "transfer_account": {                   // method=transfer일 때만
    "bank": "kookmin",
    "number": "111-22-3333333",
    "holder": "박○○"
  }
}
```

**Response (202)** — 환불 비동기 처리:
```json
{
  "ok": true,
  "data": {
    "refund_id": "refund_2026061114328",
    "status": "processing",
    "estimated_completion": "2026-06-14T18:00:00+09:00",
    "alimtalk_sent": true
  }
}
```

**audit_logs**: `booking.refund` (before/after에 금액·사유 포함)
**alimtalk**: TPL-009 (환불 안내) 자동

---

### 3.5 `POST /bookings/:id/confirm`

**권한**: OPERATOR+
**Request**:
```json
{ "notify_user": true }
```

**Response (200)**:
```json
{
  "ok": true,
  "data": { "id": "OMT-CL9X2A", "status": "confirmed", "alimtalk_template": "TPL-001" }
}
```

견적 모드(`pending`)에서 운영자가 수동 확정. **alimtalk**: TPL-001

---

### 3.6 `POST /bookings/:id/resend-alimtalk`

**권한**: OPERATOR+
**Rate Limit**: 5 req/min/booking

**Request**:
```json
{
  "template_code": "TPL-001",
  "force_sms_fallback": false
}
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "alimtalk_log_id": 92847,
    "template": "TPL-001",
    "status": "sent",
    "sms_fallback": false
  }
}
```

**audit_logs**: `alimtalk.resend`

---

## 4. 상품 API

### 4.1 `GET /products`

**권한**: VIEWER+

**Query**: `sku`, `country`, `status`, `ownership`, `q`, `limit`, `cursor`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "products": [
      {
        "id": "gt-jp-kanucha-okinawa-3n",
        "name": "카누차 오키나와 3박 2R",
        "sku": "golftel",
        "country": "japan",
        "ownership": "direct",
        "hotel_id": "h-kanucha-okinawa",
        "course_ids": ["c-kanucha-east", "c-kanucha-west"],
        "price_per_person_krw": 1310000,
        "status": "active",
        "stats": { "this_month_bookings": 24, "rating_avg": 4.8 },
        "updated_at": "2026-06-08T14:22:00+09:00"
      }
    ]
  }
}
```

---

### 4.2 `POST /products`

**권한**: MANAGER+
**Request**:
```json
{
  "id": "gt-vn-new-2026-jul",
  "name": "다낭 신규 골프텔",
  "sku": "golftel",
  "country": "vietnam",
  "hotel_id": "h-danang-new",
  "course_ids": ["c-bana-hills"],
  "nights": 4,
  "rounds": 3,
  "price_per_person_krw": 1980000,
  "inclusions": {
    "green_fee": true,
    "caddy_tip": false,
    "cart": true,
    "breakfast": true,
    "airport_transfer": true
  },
  "operating_info": { ... },
  "status": "draft"
}
```

**Response (201)**:
```json
{
  "ok": true,
  "data": { "id": "gt-vn-new-2026-jul", "status": "draft" }
}
```

**audit_logs**: `product.create`

---

### 4.3 `PATCH /products/:id`

**권한**: MANAGER+
**Request** (부분 업데이트):
```json
{
  "price_per_person_krw": 1890000,
  "status": "active",
  "reason": "성수기 가격 룰 사전 적용"
}
```

**Response (200)**: 변경된 풀 객체
**audit_logs**: `product.update` (before/after 값 포함)

---

### 4.4 `POST /products/:id/sync`

**권한**: OPERATOR+
**Rate Limit**: 30 req/hour/product

**Request**:
```json
{ "channels": ["gdo", "golfnow"] }
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "sync_results": [
      { "channel": "gdo", "status": "success", "inventory_updated": 142, "elapsed_ms": 1840 },
      { "channel": "golfnow", "status": "partial", "warnings": ["slot_2_unavailable"] }
    ]
  }
}
```

**audit_logs**: `product.sync`

---

### 4.5 `POST /pricing-rules`

**권한**: MANAGER+
**Request**:
```json
{
  "name": "성수기 가산",
  "rule_type": "season",
  "scope": { "countries": ["vn", "ph"] },
  "starts_at": "2026-07-15",
  "ends_at": "2026-08-25",
  "delta_pct": 18.0,
  "applies_to": "golftel",
  "priority": 10
}
```

**Response (201)**: `{ "id": "rule_xxx", "is_active": true }`

**비즈니스 로직**: 활성화 시 모든 미확정 견적 자동 재계산 트리거 (백그라운드 작업).

**audit_logs**: `pricing_rule.create`

---

## 5. 회원 API

### 5.1 `GET /users`

**권한**: VIEWER+
**Query**: `q`, `grade` (`bronze|silver|gold|platinum|vip`), `is_active`, `joined_after`, `last_seen_within_days`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "users": [
      {
        "id": "user-11842",
        "name": "박○○",
        "email_masked": "p***@kakao.com",
        "phone_masked": "010-XXXX-1234",
        "grade": "gold",
        "total_paid_krw": 4840000,
        "bookings_count": 7,
        "points": 48400,
        "joined_at": "2024-09-12",
        "last_seen_at": "2026-06-11T12:48:00+09:00"
      }
    ]
  }
}
```

---

### 5.2 `GET /users/:id`

**권한**: VIEWER+ — 상세 (예약·포인트·문의·감사 이력 포함)

---

### 5.3 `POST /users/:id/grade`

**권한**: MANAGER+
**Request**:
```json
{
  "new_grade": "platinum",
  "reason": "5월 누적 결제액 500만 돌파 — 자동 등급업 미적용 케이스 수동 적용"
}
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "user_id": "user-11842",
    "before_grade": "gold",
    "after_grade": "platinum",
    "alimtalk_sent": true
  }
}
```

**audit_logs**: `user.grade-change`
**alimtalk**: TPL-등급변경 (별도 템플릿 신규)

---

### 5.4 `POST /users/:id/points`

**권한**: MANAGER+
**Request**:
```json
{
  "delta": 5000,                  // 양수=적립, 음수=차감
  "reason": "리뷰 사진 첨부 보너스",
  "expires_at": "2027-06-11"       // 적립 시 유효기간 (선택)
}
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "user_id": "user-11842",
    "before_points": 48400,
    "after_points": 53400,
    "transaction_id": "pts_xxx"
  }
}
```

**Response (422)** — 차감 시 잔액 부족:
```json
{
  "ok": false,
  "error": { "code": "BO_VALIDATION", "message": "포인트 잔액 부족 (현재: 1,000P, 차감 요청: 5,000P)" }
}
```

**audit_logs**: `user.points-adjust`

---

### 5.5 `POST /users/:id/deactivate`

**권한**: SUPER_ADMIN (재인증)
**Request**:
```json
{ "reason": "회원 요청 — 탈퇴 처리", "anonymize_after_days": 30 }
```

GDPR/개인정보보호법 대응: 30일 후 PII 익명화 스케줄.
**audit_logs**: `user.deactivate`

---

## 6. CS API

### 6.1 `GET /cs/inquiries`

**권한**: OPERATOR+
**Query**: `status` (`open|replied|closed`), `category`, `overdue_24h`, `q`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "inquiries": [
      {
        "id": "uq-2618",
        "user_id": "user-11218",
        "category": "결제·환불",
        "title": "환불 진행 상황 문의",
        "body": "어제 취소 신청한 OMT-3DK21A 환불이 아직...",
        "status": "open",
        "urgency": "high",                  // 24h+ 미답변
        "related_booking_id": "OMT-3DK21A",
        "created_at": "2026-06-10T14:22:00+09:00"
      }
    ]
  }
}
```

---

### 6.2 `POST /cs/inquiries/:id/reply`

**권한**: OPERATOR+
**Request**:
```json
{
  "body": "안녕하세요 박○○님,\n\n환불 진행 상황을 확인해드리겠습니다...",
  "template_used": "환불 진행",
  "notify_user": true,
  "close_after": true                  // 답변 후 자동 close
}
```

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "inquiry_id": "uq-2618",
    "status": "replied",
    "alimtalk_sent": true,
    "alimtalk_template": "TPL-007"
  }
}
```

**audit_logs**: `inquiry.reply`
**alimtalk**: TPL-007

---

### 6.3 `GET /cs/reviews`

**권한**: OPERATOR+
**Query**: `reported`, `score_max`, `has_photos`, `product_id`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "reviews": [
      {
        "id": "rev-2418",
        "user_id": "user-11218",
        "product_id": "gt-th-pattaya-kanchana-3n",
        "score": 2,
        "body": "사진과 달라요...",
        "photos": ["https://s3.../1.jpg"],
        "reported": true,
        "report_count": 3,
        "created_at": "2026-06-10T12:48:00+09:00"
      }
    ]
  }
}
```

---

### 6.4 `POST /cs/reviews/:id/reply`

**권한**: OPERATOR+ — 운영사 답변
**Request**:
```json
{ "body": "불편을 드려 죄송합니다..." }
```

**audit_logs**: `review.reply`

---

### 6.5 `DELETE /cs/reviews/:id`

**권한**: MANAGER+ (재인증)
**Request body** (DELETE도 body 필수):
```json
{ "reason": "허위 사실 명백 — 명예훼손 위험" }
```

**audit_logs**: `review.delete`

---

### 6.6 `GET /cs/alimtalk-logs`

**권한**: OPERATOR+
**Query**: `template`, `status` (`sent|delivered|failed|fallback_sms`), `from`, `to`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "logs": [
      {
        "id": 92847,
        "template_code": "TPL-001",
        "recipient_phone_masked": "010-XXXX-1234",
        "user_id": "user-11842",
        "booking_id": "OMT-CL9X2A",
        "sent_at": "2026-06-09T11:24:00+09:00",
        "status": "delivered",
        "delivered_at": "2026-06-09T11:24:08+09:00",
        "cost_krw": 8
      }
    ]
  }
}
```

---

### 6.7 `POST /cs/alimtalk-logs/:id/retry`

**권한**: OPERATOR+
**Rate Limit**: 30 req/min/admin

**Request**:
```json
{ "force_sms": true }
```

실패한 알림톡을 SMS 폴백으로 재발송.

---

## 7. 정산 API

### 7.1 `GET /settlement/creators`

**권한**: VIEWER+
**Query**: `period_start`, `period_end`, `tier`, `status`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "settlements": [
      {
        "id": "stl_creator_2026-05_yuna",
        "creator_id": "creator-yuna",
        "creator_handle": "@golf_yuna_pro",
        "period_start": "2026-05-01",
        "period_end": "2026-05-31",
        "tier": "platinum",
        "sales_krw": 48200000,
        "base_commission_pct": 10.0,
        "bonus_pct": 2.0,
        "total_commission_krw": 4820000,
        "status": "pending",
        "bank_account_masked": "신한 ***-***-12345"
      }
    ],
    "summary": {
      "total_creators": 48,
      "total_commission_krw": 68420000,
      "pending_count": 32,
      "paid_count": 16
    }
  }
}
```

---

### 7.2 `POST /settlement/creators/run`

**권한**: SUPER_ADMIN (재인증)
**Rate Limit**: 1 req/hour
**Idempotency-Key 필수**

**Request**:
```json
{
  "period_start": "2026-05-01",
  "period_end": "2026-05-31",
  "dry_run": false,
  "notify_creators": true
}
```

**Response (202)** — 비동기:
```json
{
  "ok": true,
  "data": {
    "run_id": "stl_run_2026-05_xxx",
    "status": "processing",
    "expected_settlements": 48,
    "expected_total_krw": 68420000,
    "estimated_completion": "2026-06-11T17:30:00+09:00",
    "progress_url": "/api/admin/settlement/runs/stl_run_2026-05_xxx"
  }
}
```

**Response (409)** — 이미 실행됨:
```json
{
  "ok": false,
  "error": {
    "code": "BO_CONFLICT",
    "message": "5월 정산이 이미 실행되었습니다 (run_id: stl_run_2026-05_yyy)",
    "details": { "existing_run_id": "stl_run_2026-05_yyy", "ran_at": "2026-06-10T14:00:00+09:00" }
  }
}
```

**비즈니스 로직**:
1. 대상 기간 모든 `bookings` (status=completed) 조회
2. 환불 차감 반영
3. 크리에이터별 등급 + 보너스 산정
4. `settlements` INSERT
5. 알림톡 일괄 발송 (선택)
6. SUPER_ADMIN 송금 승인 대기 상태로 진입

**audit_logs**: `settlement.run`

---

### 7.3 `GET /settlement/runs/:run_id`

비동기 정산 작업 진행 상황 조회 (long-polling 가능).

```json
{
  "ok": true,
  "data": {
    "run_id": "stl_run_2026-05_xxx",
    "status": "completed",
    "progress": { "processed": 48, "total": 48 },
    "result": {
      "created_settlements": 48,
      "total_commission_krw": 68420000,
      "alimtalk_sent": 48,
      "alimtalk_failed": 0
    }
  }
}
```

---

### 7.4 `POST /settlement/creators/:id/payout`

**권한**: SUPER_ADMIN (재인증)
**Request**:
```json
{
  "transfer_method": "bank",
  "swift_required": false,
  "memo": "5월 정산"
}
```

**Response (202)**:
```json
{
  "ok": true,
  "data": {
    "payout_id": "payout_xxx",
    "status": "processing",
    "alimtalk_template": "TPL-정산완료"
  }
}
```

**audit_logs**: `settlement.payout`

---

### 7.5 `GET /settlement/suppliers`

**권한**: VIEWER+
공급사 정산 — 구조는 크리에이터와 유사. 추가 필드: `tier`, `commission_pct`, `bank_account` (SWIFT 정보 포함).

---

### 7.6 `GET /settlement/pg`

**권한**: VIEWER+
**Query**: `pg` (`kakao|naver|toss`), `from`, `to`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "pg_settlements": [
      {
        "id": "pg_kakao_2026-06-08",
        "pg": "kakao",
        "settlement_date": "2026-06-08",
        "sales_krw": 14280000,
        "fee_krw": 414000,
        "net_krw": 13866000,
        "deposited_at": "2026-06-08T18:00:00+09:00",
        "deposit_account": "국민 ***-**-89421"
      }
    ]
  }
}
```

---

## 8. CMS API

### 8.1 `GET /cms/banners`

**권한**: VIEWER+
**Query**: `slot`, `is_active`

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "banners": [
      {
        "id": "b-9",
        "slot": "hero",
        "priority": 1,
        "name": "🌸 6월 골프텔 특가",
        "image_url": "https://s3.../b9.jpg",
        "link_url": "/search.html?promo=summer-2026",
        "starts_at": "2026-06-01",
        "ends_at": "2026-06-30",
        "is_active": true,
        "click_count": 8420
      }
    ]
  }
}
```

---

### 8.2 `POST /cms/banners`

**권한**: MANAGER+
**Request** (`multipart/form-data` 가능):
```json
{
  "slot": "hero",
  "name": "🆕 7월 신규 골프텔",
  "image_url": "https://s3.../new.jpg",
  "link_url": "/golftels.html",
  "starts_at": "2026-07-01",
  "ends_at": "2026-07-31",
  "priority": 1
}
```

**audit_logs**: `banner.create`

---

### 8.3 `PATCH /cms/banners/:id`

**권한**: MANAGER+
`is_active`, `priority`, `name`, 등 부분 업데이트.
**audit_logs**: `banner.update` (전체 diff)

---

### 8.4 `POST /cms/banners/reorder`

**권한**: MANAGER+
드래그 정렬 일괄 반영.

**Request**:
```json
{
  "slot": "hero",
  "ordered_ids": ["b-9", "b-7", "b-8"]
}
```

**audit_logs**: `banner.reorder`

---

### 8.5 `GET /cms/trending-keywords`

**권한**: VIEWER+

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "keywords": [
      { "id": "k-1", "rank": 1, "query": "푸꾸옥 골프텔", "icon": "🔥", "score_label": "+128%", "boost_factor": 1.5, "is_active": true }
    ]
  }
}
```

---

### 8.6 `POST /cms/trending-keywords`
### 8.7 `PATCH /cms/trending-keywords/:id`

표준 CRUD. **audit_logs**: `trending_keyword.create` / `.update`

캐시 무효화: 변경 시 5분 내 `search.html` 자동완성 캐시 갱신 (Redis pub/sub).

---

### 8.8 `GET /cms/notices`

**권한**: VIEWER+
**Query**: `slot`, `is_pinned`, `active_at`

---

### 8.9 `POST /cms/notices`

**권한**: MANAGER+
**audit_logs**: `notice.create`

---

## 9. 운영자·감사 API (SUPER_ADMIN 전용)

### 9.1 `GET /admins`

**권한**: SUPER_ADMIN
**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "admins": [
      {
        "id": "admin-08",
        "name": "박CS",
        "email": "park@omt.com",
        "role": "OPERATOR",
        "team": "CS",
        "is_active": true,
        "twofa_enabled": true,
        "last_login_at": "2026-06-11T14:30:00+09:00",
        "last_login_ip": "192.168.1.42"
      }
    ]
  }
}
```

---

### 9.2 `POST /admins/invite`

**권한**: SUPER_ADMIN
**Request**:
```json
{
  "name": "이서연",
  "email": "lee.sy@omt.com",
  "role": "OPERATOR",
  "team": "CS",
  "reason": "7월 신규 CS 인력 충원"
}
```

**SUPER_ADMIN ROLE 부여 시 4-eye**:
```json
{
  "name": "...",
  "role": "SUPER_ADMIN",
  "co_approver_admin_id": "admin-02"     // 다른 SUPER_ADMIN의 ID 필수
}
```

co_approver에게 별도 승인 요청 발송 (대기 상태로 INSERT).

**Response (201)**:
```json
{
  "ok": true,
  "data": {
    "admin_id": "admin-25",
    "invitation_sent": true,
    "temp_password_expires_at": "2026-06-12T14:30:00+09:00"
  }
}
```

**audit_logs**: `admin.invite`

---

### 9.3 `PATCH /admins/:id/role`

**권한**: SUPER_ADMIN (재인증, SUPER_ADMIN 변경 시 4-eye)
**Request**:
```json
{
  "new_role": "MANAGER",
  "reason": "팀장 승진"
}
```

**audit_logs**: `admin.role-change`

---

### 9.4 `POST /admins/:id/deactivate`

**권한**: SUPER_ADMIN (재인증)
**Request**:
```json
{ "reason": "퇴사 처리 — HR 통지 수신" }
```

JWT 토큰 즉시 무효화 + 활동 로그 보존.
**audit_logs**: `admin.deactivate`

---

### 9.5 `POST /admins/:id/reset-password`

**권한**: SUPER_ADMIN
임시 비밀번호 이메일 발송 + 첫 로그인 시 변경 강제.

---

### 9.6 `GET /audit-logs`

**권한**: MANAGER+ (자기 팀만) / SUPER_ADMIN (전체)
**Query**:
| 파라미터 | 설명 |
|---|---|
| `admin_id` | 특정 운영자 |
| `action` | 예: `booking.cancel` |
| `target_type` | `booking`/`product`/... |
| `target_id` | 특정 리소스 |
| `from`/`to` | 기간 |
| `ip` | IP 필터 |

**Response (200)**:
```json
{
  "ok": true,
  "data": {
    "logs": [
      {
        "id": 28419,
        "admin_id": "admin-08",
        "admin_name": "박CS",
        "action": "booking.cancel",
        "target_type": "booking",
        "target_id": "OMT-3DK21A",
        "before_value": { "status": "confirmed" },
        "after_value": { "status": "cancelled" },
        "reason": "고객 단순 변심",
        "ip_address": "192.168.1.42",
        "user_agent": "Mozilla/...",
        "created_at": "2026-06-11T14:32:08+09:00"
      }
    ]
  }
}
```

---

### 9.7 `GET /audit-logs/export`

**권한**: SUPER_ADMIN
**Rate Limit**: 10 req/hour
CSV 다운로드 (스트리밍).
**audit_logs**: `audit-logs.export`

---

## 10. 알림 (운영자용)

### 10.1 `GET /notifications`

**권한**: VIEWER+
운영자 본인의 알림 (예: "4-eye 승인 요청", "정산 작업 완료", "본인 ROLE 변경됨" 등).

### 10.2 `POST /notifications/:id/read`

읽음 처리.

---

## 11. 헬스체크·메트릭

### 11.1 `GET /health`

**권한**: (공개)
**Response (200)**:
```json
{ "ok": true, "data": { "status": "healthy", "db": "ok", "redis": "ok", "alimtalk_api": "ok" } }
```

### 11.2 `GET /metrics` (Prometheus 포맷)

**권한**: 내부 IP만
운영자 활동 수, API 응답시간, 정산 실행 성공률 등.

---

## 부록 A. 권한 매트릭스 (요약)

각 API의 권한 요구사항 빠른 참조:

| API 그룹 | VIEWER | OPERATOR | MANAGER | SUPER_ADMIN |
|---|:---:|:---:|:---:|:---:|
| 인증 (login/2fa/logout) | ✓ | ✓ | ✓ | ✓ |
| 대시보드 | ✓ | ✓ | ✓ | ✓ |
| 예약 조회 | ✓ | ✓ | ✓ | ✓ |
| 예약 확정/취소 | ✗ | ✓ | ✓ | ✓ |
| 환불 (재인증) | ✗ | ✗ | ✓ | ✓ |
| 상품 조회 | ✓ | ✓ | ✓ | ✓ |
| 상품 CRUD | ✗ | ✗ | ✓ | ✓ |
| 상품 동기화 | ✗ | ✓ | ✓ | ✓ |
| 가격 룰 | ✗ | ✗ | ✓ | ✓ |
| 회원 조회 | ✓ | ✓ | ✓ | ✓ |
| 회원 등급/포인트 | ✗ | ✗ | ✓ | ✓ |
| 회원 탈퇴 (재인증) | ✗ | ✗ | ✗ | ✓ |
| CS 응대 | ✗ | ✓ | ✓ | ✓ |
| 리뷰 답변 | ✗ | ✓ | ✓ | ✓ |
| 리뷰 삭제 (재인증) | ✗ | ✗ | ✓ | ✓ |
| 정산 조회 | ✓ | ✓ | ✓ | ✓ |
| 정산 실행 (재인증) | ✗ | ✗ | ✗ | ✓ |
| 송금 (재인증) | ✗ | ✗ | ✗ | ✓ |
| CMS 조회 | ✓ | ✓ | ✓ | ✓ |
| CMS CRUD | ✗ | ✗ | ✓ | ✓ |
| 운영자 관리 | ✗ | ✗ | ✗ | ✓ |
| 감사 로그 조회 | ✗ | ✗ | ✓ (팀) | ✓ (전체) |

---

## 부록 B. 멱등성 키 설계

**원칙**: 중복 호출(네트워크 재시도)로 인한 부작용 방지.

**키 권장**:
- POST `bookings/:id/cancel` → `cancel_{booking_id}_{admin_id}_{timestamp_minute}`
- POST `settlement/creators/run` → `settlement_run_{period_start}_{period_end}`
- POST `bookings/:id/refund` → `refund_{booking_id}_{amount}`

**서버 처리**:
- 24h TTL
- 동일 키 + 동일 payload → 첫 응답 캐시 반환 (200)
- 동일 키 + 다른 payload → 409 `BO_IDEMPOTENCY_CONFLICT`

---

## 부록 C. 변경 이력

| 버전 | 일자 | 변경 |
|---|---|---|
| **v1.0** | 2026-06-11 | 초기 작성 — 백오피스 API 22개 + 공통 + 부록 |

---

_본 문서는 백엔드 MD-only 원칙 하에 작성됨. 실제 서버 구현 시 OpenAPI 3.1 YAML로 자동 변환 권장 (Stoplight/Postman)._
