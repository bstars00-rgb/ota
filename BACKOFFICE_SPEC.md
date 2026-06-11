# 오마이트립 백오피스 구상 (v1.0)

**최종 갱신**: 2026-06-11
**목적**: ELLIS 백엔드의 운영 측 UI 시스템 — 상품·예약·회원·정산·CS·CMS 통합 관리
**대상**: 본사 운영팀 (MD/CS/재무/마케팅/시스템) + 직영국 현지 라운저
**연계 문서**: [ELLIS_SPEC.md](./ELLIS_SPEC.md) · [ALIMTALK_TEMPLATES.md](./ALIMTALK_TEMPLATES.md)

---

## 1. 전체 구조

### 1.1 백오피스 vs 운영 콘솔 구분

```
┌─ 운영 콘솔 (기존 admin-*) ──────────────────────┐
│  채널 매니저 어댑터 / 공급사 / 스키마 매퍼 /     │
│  사용자 흐름 분석 → 시스템·인프라 모니터링       │
└─────────────────────────────────────────────────┘

┌─ 백오피스 (신규 admin-*) ───────────────────────┐
│  상품 / 예약 / 회원 / 정산 / CS / CMS / 권한 /  │
│  활동 로그 → 일상 운영 업무 처리                  │
└─────────────────────────────────────────────────┘
```

### 1.2 8개 운영 모듈

| # | 모듈 | 파일 | 사용 빈도 | 주요 사용자 |
|---|---|---|---|---|
| 1 | **🏠 대시보드** | `admin-dashboard.html` | 매시간 | 전체 |
| 2 | **🎫 예약 운영** | `admin-bookings.html` | 매분 | CS·MD |
| 3 | **⛳ 상품 관리** | `admin-products.html` | 매일 | MD |
| 4 | **👥 회원 관리** | `admin-customers.html` | 매시간 | CS |
| 5 | **💰 정산 관리** | `admin-settlement.html` | 매주 | 재무 |
| 6 | **💬 CS 운영** | `admin-cs.html` | 매분 | CS |
| 7 | **📝 CMS** | `admin-cms.html` | 매일 | 마케팅 |
| 8 | **🔐 권한·계정** | `admin-users.html` | 가끔 | 시스템 |

---

## 2. 권한 매트릭스 (4 ROLE)

| 권한 | SUPER_ADMIN | MANAGER | OPERATOR | VIEWER |
|---|---|---|---|---|
| 대시보드 조회 | ✅ | ✅ | ✅ | ✅ |
| 예약 조회 | ✅ | ✅ | ✅ | ✅ |
| 예약 수동 확정/취소 | ✅ | ✅ | ✅ | ❌ |
| 환불 처리 | ✅ | ✅ | ❌ | ❌ |
| 상품 CRUD | ✅ | ✅ | ❌ | ❌ |
| 가격 변경 | ✅ | ✅ | ❌ | ❌ |
| 회원 정보 조회 | ✅ | ✅ | ✅ | ✅ |
| 회원 등급/포인트 수동 조정 | ✅ | ✅ | ❌ | ❌ |
| 회원 탈퇴 처리 | ✅ | ❌ | ❌ | ❌ |
| 정산 조회 | ✅ | ✅ | ❌ | ✅ |
| 정산 실행 | ✅ | ❌ | ❌ | ❌ |
| CS 응대 | ✅ | ✅ | ✅ | ❌ |
| CMS (배너/공지) | ✅ | ✅ | ❌ | ❌ |
| 운영자 계정 관리 | ✅ | ❌ | ❌ | ❌ |
| 활동 로그 조회 | ✅ | ✅ | ❌ | ❌ |

**ROLE 정의**:
- `SUPER_ADMIN`: 전권 (CTO/COO 레벨)
- `MANAGER`: 팀장 레벨 (운영팀장·CS팀장)
- `OPERATOR`: 일반 운영자 (CS·MD 담당자)
- `VIEWER`: 조회만 (분석가·인턴)

---

## 3. 모듈별 페이지 명세

### 3.1 🏠 admin-dashboard.html (백오피스 메인)

**진입점**: 로그인 직후 첫 화면

**구성**:
- **상단**: 운영자 정보 (이름·ROLE·접속 일시) + 빠른 검색 (예약번호/회원/상품)
- **8 모듈 진입 카드** (3-col 그리드, ROLE에 따라 일부 비활성)
- **오늘의 운영 활동 요약** (KPI 4개):
  - 신규 예약 N건 · 취소 N건
  - 답변 대기 문의 N건
  - 24h 내 확정 필요 슬롯 N건 (견적 모드)
  - 신규 회원 가입 N명
- **긴급 작업 큐** (위로 갈수록 시급):
  - 견적 확정 D-2 임박 (빨강)
  - 결제 실패 재시도 요청 (노랑)
  - 24h+ 미답변 문의 (노랑)
- **최근 활동 로그** (다른 운영자가 한 작업 10건)

**데이터 소스**: ELLIS `GET /api/admin/dashboard/summary`

---

### 3.2 🎫 admin-bookings.html (예약 운영)

**핵심 사용 사례**:
- 고객 문의 시 예약번호로 즉시 조회
- 견적 모드 슬롯 24h 내 확정 처리
- 변경/취소 요청 수동 처리
- 일자별 출발 캘린더 (오늘/내일 출발 명단)

**구성**:
- **검색바**: 예약번호 / 회원명 / 전화번호 / 상품명
- **고급 필터** (펼침형):
  - 상태 (확정/대기/완료/취소/환불)
  - SKU 유형 (골프텔/골프투어/패키지)
  - 국가 / 출발일 범위 / 결제수단
- **결과 표** (페이지네이션 25건/페이지):
  - 예약번호 · 상품명 · 회원 · 출발일 · 인원 · 금액 · 상태 · 액션
- **예약 상세 슬라이드아웃** (행 클릭 시 우측 패널 열림):
  - 예약 정보 풀데이터
  - 결제 정보
  - 여행자 정보
  - 라운딩 슬롯 (골프텔)
  - 변경/취소 이력 (감사 로그)
  - 액션 버튼: 수동 확정 · 취소 · 환불 · 메모 추가 · 카톡 재발송
- **상단 탭** 추가:
  - "전체 예약" (기본)
  - "🔥 견적 확정 대기" (24h 내 확정 필요 — 견적 모드 슬롯)
  - "📅 오늘 출발" (당일 출발 명단)
  - "⚠️ 문제 예약" (결제 실패·환불 요청·고객 클레임)

**데이터 소스**: ELLIS `GET /api/admin/bookings`

---

### 3.3 ⛳ admin-products.html (상품 관리)

**구성**:
- **3 탭**: 골프텔 / 패키지 / 액티비티
- **상품 리스트** (검색·필터):
  - 국가 / 도시 / 상태 (판매중/일시중지/판매중지)
  - 직영/프랜차이즈
  - 가격 범위
- **카드형 그리드**:
  - 썸네일 + 상품명 + SKU 뱃지 + 가격 + 평점
  - 액션: 편집 / 일시중지 / 가격 일괄 변경 / 인벤토리 동기화
- **신규 상품 등록 폼** (모달 또는 별도 페이지):
  - 기본 정보 (이름·국가·도시·hotelId·courseIds)
  - 가격 (1인 기준 + 객실 옵션)
  - 포함 사항 (boolean 플래그)
  - 이미지 업로드 (드래그·드롭)
  - 운영 정보 (체크인/체크아웃/티오프)
  - 미리보기 (실제 골프텔 페이지처럼 렌더)
- **가격 관리 모드**:
  - 시즌별 가격 (성수기/비수기)
  - 요일별 가격 (주중/주말)
  - 공휴일 가격
  - 일괄 변경 (전 상품 +5% 등)
- **인벤토리 동기화 모니터링**:
  - 채널 매니저별 마지막 동기화 시각
  - 불일치 알림 (직영 인벤토리 vs 외부 채널)
  - 수동 동기화 트리거 버튼

**데이터 소스**: ELLIS `GET/POST/PATCH/DELETE /api/admin/products`

---

### 3.4 👥 admin-customers.html (회원 관리)

**구성**:
- **검색바**: 이름 / 이메일 / 전화번호 / 회원번호
- **필터**: 등급 (브론즈/실버/골드/플래티넘/VIP) · 가입일 · 직영 국가별 활동 빈도
- **회원 리스트** (예약 수·총 결제액 함께 표시):
  - 정렬: 최근 가입순 / 총 결제액순 / 예약 횟수순
- **회원 상세** (슬라이드아웃):
  - 기본 정보 + 등급 + 누적 통계 (mypage 통계 카드와 동일 데이터)
  - 예약 이력 (전체) · 리뷰 작성 이력 · 문의 이력 · 활동 로그
  - 액션: 등급 수동 변경 / 포인트 수동 적립·차감 / 쿠폰 발급 / 메모 / 계정 정지
- **VIP 관리** (별도 탭):
  - 누적 결제액 1억+ 회원
  - 매니저 1:1 배정
  - VIP 전용 혜택 부여 이력

**데이터 소스**: ELLIS `GET/PATCH /api/admin/users`

---

### 3.5 💰 admin-settlement.html (정산 관리)

**구성**:
- **3 탭**: 크리에이터 / 공급사 / 매출 리포트
- **크리에이터 정산** (월별):
  - 크리에이터별 표 (이름 · 등급 · 이번달 판매 · 커미션 · 정산 예정일)
  - 정산 실행 버튼 (관리자만)
  - 정산 이력 (지난 12개월)
- **공급사 정산** (월별):
  - 공급사별 (액티비티/렌트) 매출 + 마진 + 정산 금액
  - 송금 계좌 정보 + 송금 상태
- **매출 리포트**:
  - 일별/월별 매출 그래프
  - SKU별 비중 (골프텔 vs 패키지 vs 액티비티)
  - 국가별 비중 (직영 vs 프랜차이즈)
  - 결제수단별 (카카오/네이버/카드/무통장)
  - CSV/Excel 다운로드

**데이터 소스**: ELLIS `GET /api/admin/settlement/*`

---

### 3.6 💬 admin-cs.html (CS 운영)

**구성**:
- **3 탭**: 문의 응대 / 리뷰 관리 / 카톡 알림톡 발송 이력
- **문의 응대**:
  - 답변 대기 큐 (오래된 순)
  - 카테고리별 필터 (예약/골프/호텔/결제/렌탈/기타)
  - 문의 상세 + 답변 입력 폼
  - 자동 답변 템플릿 6종 (현재 mypage 자동 답변 활용)
  - 답변 시 자동으로 알림 발송 + ALIMTALK TPL-007 트리거
- **리뷰 관리**:
  - 모든 리뷰 검색 (사진 첨부 여부 필터)
  - 신고된 리뷰 (별도 탭)
  - 운영사 답변 작성 (`reviews.reply` 입력)
  - 리뷰 삭제 (사유 기록)
- **알림톡 발송 이력**:
  - ALIMTALK_TEMPLATES.md의 10 템플릿별 발송 통계
  - 실패한 발송 재시도
  - SMS 대체 발송 이력

**데이터 소스**: ELLIS `GET/PATCH /api/admin/cs/*`

---

### 3.7 📝 admin-cms.html (CMS)

**구성**:
- **5 탭**: 메인 배너 / 카테고리 / 인기 검색어 / 공지사항 / FAQ
- **메인 배너 관리**:
  - 히어로 슬라이드 이미지 (`index.html` heroImages)
  - 노출 기간 / 우선순위 / 클릭 통계
  - 이미지 업로드 + 미리보기
- **카테고리 관리**:
  - 국가 · 도시 · 테마 (골프/허니문/가족여행 등)
  - 노출 순서 변경 (드래그·드롭)
- **인기 검색어 관리** (현재 mock):
  - 자동 (실시간 검색 빈도 기반) / 수동 (담당자 큐레이션)
  - 가중치 조정 (자동순위 + 부스트)
- **공지사항**:
  - 발행/예약 발행 / 노출 위치 (메인/마이페이지/모바일)
- **FAQ**:
  - 골프텔 FAQ + 일반 FAQ 카테고리별

**데이터 소스**: ELLIS `GET/POST/PATCH/DELETE /api/admin/cms/*`

---

### 3.8 🔐 admin-users.html (운영자 권한 관리)

**SUPER_ADMIN 전용**

**구성**:
- **운영자 계정 리스트** (이름·이메일·ROLE·소속·마지막 접속)
- **계정 추가** (이메일 초대 → 비밀번호 설정 메일)
- **ROLE 변경** (드롭다운)
- **활동 로그** (감사 로그):
  - 누가 / 언제 / 어떤 작업 / 변경 전후 값
  - 정렬·필터: 운영자별 / 작업 유형별 / 기간별
- **2FA 설정** (의무 — Google Authenticator)

**데이터 소스**: ELLIS `GET/POST/PATCH /api/admin/admins/*` + `GET /api/admin/audit-logs`

---

## 4. Phase별 우선순위

### Phase 1 — MVP (즉시 필요)
| 모듈 | 이유 |
|---|---|
| 🏠 대시보드 | 진입점 |
| 🎫 예약 운영 | 매일 발생하는 핵심 업무 |
| 💬 CS (문의 응대만) | 고객 응대 필수 |
| 🔐 권한 (기본 ROLE 4종) | 보안 |

### Phase 2 — 정착 (3개월 내)
| 모듈 | 이유 |
|---|---|
| ⛳ 상품 관리 | MD 업무 효율화 |
| 👥 회원 관리 | CS 확장 + VIP 관리 |
| 💰 정산 (크리에이터만) | 월 1회 정산 자동화 |

### Phase 3 — 고도화 (6개월+)
| 모듈 | 이유 |
|---|---|
| 📝 CMS | 마케팅팀 업무 분리 |
| 💰 정산 (공급사+리포트) | 재무 정밀화 |
| 💬 리뷰 관리 | 리뷰가 100건+ 누적 후 의미 |
| 알림톡 발송 이력 | ALIMTALK 실제 연동 후 |

---

## 5. 데이터 모델 추가 (ELLIS_SPEC.md 확장)

```sql
-- 운영자 계정
CREATE TABLE admins (
  id                  VARCHAR(64)   PRIMARY KEY,
  email               TEXT          UNIQUE NOT NULL,
  password_hash       TEXT          NOT NULL,
  name                TEXT          NOT NULL,
  role                VARCHAR(20)   NOT NULL CHECK (role IN ('SUPER_ADMIN','MANAGER','OPERATOR','VIEWER')),
  team                VARCHAR(30),                              -- 'CS' | 'MD' | 'FINANCE' | 'MARKETING' | 'SYSTEM'
  is_active           BOOLEAN       DEFAULT TRUE,
  totp_secret         TEXT,                                      -- 2FA TOTP secret (암호화 저장)
  last_login_at       TIMESTAMPTZ,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- 감사 로그
CREATE TABLE audit_logs (
  id                  BIGSERIAL     PRIMARY KEY,
  admin_id            VARCHAR(64)   REFERENCES admins(id),
  action              VARCHAR(50)   NOT NULL,                    -- 'booking.cancel' | 'product.update' | ...
  target_type         VARCHAR(20)   NOT NULL,                    -- 'booking' | 'product' | 'user' | ...
  target_id           VARCHAR(64),
  before_value        JSONB,
  after_value         JSONB,
  ip_address          INET,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- CMS — 메인 배너
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

-- 인기 검색어 (수동 큐레이션)
CREATE TABLE cms_trending_keywords (
  id                  VARCHAR(64)   PRIMARY KEY,
  query               TEXT          NOT NULL,
  rank                SMALLINT      NOT NULL,
  score_label         TEXT,                                      -- '+128%' | '1위' | '추천' 등
  icon                VARCHAR(4),                                -- 🔥 🆕 🏆 ⭐
  boost_factor        NUMERIC(3,2)  DEFAULT 1.0,                 -- 자동 + 수동 가중치
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  created_by          VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- 공지사항
CREATE TABLE cms_notices (
  id                  VARCHAR(64)   PRIMARY KEY,
  title               TEXT          NOT NULL,
  body                TEXT          NOT NULL,
  slot                VARCHAR(30)   NOT NULL,                    -- 'main-top' | 'mypage-top' | 'modal' | ...
  starts_at           TIMESTAMPTZ,
  ends_at             TIMESTAMPTZ,
  is_pinned           BOOLEAN       DEFAULT FALSE,
  view_count          INT           DEFAULT 0,
  created_by          VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- 정산 (크리에이터 커미션 — 이미 ELLIS_SPEC.md에 있음)
-- 정산 (공급사) — 신규
CREATE TABLE supplier_settlements (
  id                  VARCHAR(64)   PRIMARY KEY,
  supplier_id         VARCHAR(64)   NOT NULL,                    -- admin-suppliers.html SUPPLIERS
  period_start        DATE          NOT NULL,
  period_end          DATE          NOT NULL,
  total_sales_krw     BIGINT,
  commission_pct      NUMERIC(5,4),
  commission_amount   BIGINT,
  net_payout          BIGINT,                                    -- 송금 금액
  bank_account        TEXT,
  status              VARCHAR(20)   NOT NULL,                    -- 'pending' | 'paid' | 'on_hold'
  paid_at             TIMESTAMPTZ,
  paid_by             VARCHAR(64)   REFERENCES admins(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);
```

---

## 6. API 엔드포인트 (요약)

| 메서드 | 경로 | 권한 | 설명 |
|---|---|---|---|
| `GET` | `/api/admin/dashboard/summary` | VIEWER+ | 운영자 대시보드 데이터 |
| `GET` | `/api/admin/bookings` | VIEWER+ | 예약 검색 |
| `PATCH` | `/api/admin/bookings/:id` | OPERATOR+ | 예약 수정 |
| `POST` | `/api/admin/bookings/:id/cancel` | OPERATOR+ | 수동 취소 |
| `POST` | `/api/admin/bookings/:id/refund` | MANAGER+ | 환불 |
| `GET` | `/api/admin/products` | VIEWER+ | 상품 리스트 |
| `POST` | `/api/admin/products` | MANAGER+ | 신규 상품 |
| `PATCH` | `/api/admin/products/:id/pricing` | MANAGER+ | 가격 변경 |
| `POST` | `/api/admin/products/:id/sync` | OPERATOR+ | 인벤토리 강제 동기화 |
| `GET` | `/api/admin/users` | VIEWER+ | 회원 검색 |
| `PATCH` | `/api/admin/users/:id/grade` | MANAGER+ | 등급 변경 |
| `POST` | `/api/admin/users/:id/points` | MANAGER+ | 포인트 수동 조정 |
| `GET` | `/api/admin/settlement/creators` | VIEWER+ | 크리에이터 정산 조회 |
| `POST` | `/api/admin/settlement/creators/run` | SUPER_ADMIN | 정산 실행 |
| `GET` | `/api/admin/cs/inquiries` | OPERATOR+ | 문의 큐 |
| `POST` | `/api/admin/cs/inquiries/:id/reply` | OPERATOR+ | 답변 작성 + 알림 트리거 |
| `GET/POST/PATCH/DELETE` | `/api/admin/cms/*` | MANAGER+ | CMS CRUD |
| `GET` | `/api/admin/admins` | SUPER_ADMIN | 운영자 리스트 |
| `POST` | `/api/admin/admins/invite` | SUPER_ADMIN | 운영자 초대 |
| `GET` | `/api/admin/audit-logs` | MANAGER+ | 감사 로그 |

---

## 7. 인증 / 보안

- **로그인**: 이메일 + 비밀번호 + 2FA (TOTP, Google Authenticator)
- **세션**: JWT 8h + Refresh 24h (운영자는 일반 유저보다 짧게)
- **IP 제한** (옵션): 회사 VPN/오피스 IP 화이트리스트
- **로그아웃 후 30분 비활성**: 자동 세션 만료
- **민감 작업** (환불/회원탈퇴/운영자 추가): 비밀번호 재입력 또는 2FA 재인증
- **모든 작업 감사 로그 기록** (audit_logs 테이블)

---

## 8. UI / UX 원칙

- **다크 톤 유지** (admin-channels 패턴) — 운영자 장시간 사용 고려
- **JetBrains Mono** 폰트 (숫자·ID·코드 영역)
- **키보드 단축키**:
  - `Cmd+K`: 빠른 검색 (어디서든)
  - `B`: 예약 운영 / `P`: 상품 / `C`: 회원
  - `Esc`: 모달/슬라이드아웃 닫기
- **테이블**: 25건/페이지 + URL 페이지 상태 동기화
- **벌크 액션**: 체크박스 선택 → 여러 항목 일괄 처리
- **CSV/Excel 다운로드**: 모든 리스트 화면에 제공
- **자동 저장**: 폼 입력 중 30초마다 draft 저장 (이탈 방지)

---

## 9. 프론트엔드 변경 시 백오피스 영향

본 문서와 ELLIS_SPEC.md는 프론트 변경 시 함께 업데이트.

| 프론트 변경 | 백오피스 반영 |
|---|---|
| 새 SKU 추가 (예: 골프투어) | 상품 관리에 SKU 분류 추가 |
| 새 결제 수단 | 결제 통계 + 정산 모듈 갱신 |
| 알림 종류 추가 | CS 알림톡 이력 + ALIMTALK_TEMPLATES.md 추가 |
| 회원 등급 추가 (예: VIP) | 회원 관리 등급 변경 옵션 + 정산 |
| 라이브 commerce 도입 | 대시보드 라이브 KPI + 크리에이터 통계 |

---

## 10. 마이그레이션 체크리스트

### ✅ 프론트엔드 프로토타입 (8/8 모듈 완료) 🎯
- [x] BACKOFFICE_SPEC.md 작성 (v1.0 → v1.2)
- [x] admin-dashboard.html — 사이클 10
- [x] admin-bookings.html — 사이클 10
- [x] admin-products.html — 사이클 10
- [x] admin-cs.html — 사이클 11 (3 탭: 문의 응대 + 리뷰 관리 + 알림톡 이력)
- [x] admin-customers.html — 사이클 11 (Phase 2 조기 · 5등급 분포)
- [x] admin-users.html — 사이클 11 (24명 운영자 + 권한 매트릭스 + 감사 로그)
- [x] **admin-settlement.html — 사이클 12** ⭐ NEW (크리에이터 12명 + 공급사 9 + PG 3종 + 송금 이력 8건 + 정산 실행 모달)
- [x] **admin-cms.html — 사이클 12** ⭐ NEW (배너 8 + 인기 검색어 6 + 공지·FAQ 6 + 가격 룰 6)

### ⏳ 백엔드 구현 (추후 개발팀)
- [ ] ELLIS DB 스키마 ALTER (admins / audit_logs / cms_* / pricing_rules / supplier_settlements)
- [ ] ELLIS API 백엔드 구현 (위 §6 엔드포인트 22종)
- [ ] 2FA TOTP 라이브러리 도입 (Google Authenticator)
- [ ] CSV/Excel export 라이브러리
- [ ] 운영자 초기 계정 등록 + ROLE 부여
- [ ] 감사 로그 모니터링 대시보드 (Grafana 등)
- [ ] 4-eye 승인 시스템 (SUPER_ADMIN 부여 시 2명 승인)
- [ ] IP 화이트리스트 정책 (회사 VPN/오피스)

### ⏳ 운영 도입
- [ ] 운영자 24명 초기 등록 + 권한 부여
- [ ] 운영자 사용 가이드 작성
- [ ] CS·MD 팀별 워크플로우 트레이닝
- [ ] 감사 로그 검토 정기 일정 (월 1회)
- [ ] CS SLA 정의 (24h 내 1차 답변 · 72h 내 처리 완료)

---

## 변경 이력

| 버전 | 일자 | 변경 |
|---|---|---|
| **v1.2** | 2026-06-11 | 사이클 12 — admin-settlement / admin-cms 2 페이지 추가 · **8 모듈 모두 완성** 🎯 · 8 페이지 GNB 통일 (8 모듈 균등) |
| v1.1 | 2026-06-11 | 사이클 11 — admin-cs / admin-customers / admin-users 3 페이지 · Phase 1 완료 + Phase 2 조기 진입 |
| v1.0 | 2026-06-11 | 초기 구상 — 8 모듈 · 4 ROLE · admin-dashboard/bookings/products 3 페이지 |

---

_본 문서는 프로토타입 단계 구상으로, 실제 백엔드 구현 시 디테일 조정 가능. 모든 페이지는 admin-channels.html의 다크 톤 패턴을 따른다._
