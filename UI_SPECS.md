# OhmyHotel 2.0 — UI/UX 스펙 (Screen Specifications)
**Version:** 1.0.0  
**Date:** 2026-04-14

---

## 디자인 토큰 (Design Tokens)

```typescript
// tailwind.config.ts 에 추가할 커스텀 컬러

const colors = {
  // Brand
  "omh-red":    "#E84855",   // Primary CTA, FOMO 강조
  "omh-navy":   "#1A2B5E",   // 헤더, 중요 텍스트
  "omh-gold":   "#F4A629",   // OMY Points, 별점
  "omh-green":  "#27AE60",   // 무료취소, 성공
  "omh-amber":  "#F39C12",   // 경고, 잔여 경고

  // Neutral
  "gray-50":    "#F9FAFB",
  "gray-100":   "#F3F4F6",
  "gray-200":   "#E5E7EB",
  "gray-400":   "#9CA3AF",
  "gray-600":   "#4B5563",
  "gray-800":   "#1F2937",
  "gray-900":   "#111827",
};

// 폰트
// - 한글: Pretendard (Google Fonts)
// - 영문/숫자: Inter
// 설정: @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
```

---

## SCREEN 01: 메인 홈 (/)

### 레이아웃 구조
```
┌─────────────────────────────────┐
│         HEADER (고정)            │  h-16 sticky top-0 z-50
├─────────────────────────────────┤
│        HERO SECTION             │  min-h-[500px] bg-gradient
│  ┌─────────────────────────┐    │
│  │    SEARCH BOX           │    │  p-6 rounded-2xl bg-white shadow-xl
│  │  [목적지] [날짜] [인원]  │    │
│  │     [검색하기 버튼]      │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│     오마이 픽 (에디터 추천)       │  
│  [카드][카드][카드][카드]→       │  가로 스크롤
├─────────────────────────────────┤
│       기획전 배너               │  full-width banner
├─────────────────────────────────┤
│      인기 목적지                 │
│  [도쿄][오사카][후쿠오카]...      │  그리드
├─────────────────────────────────┤
│        FOOTER                   │
└─────────────────────────────────┘
```

### 컴포넌트 스펙

#### Header
```tsx
// components/layout/Header.tsx
// - 로고 (좌측)
// - 내비게이션: 여행 아이디어, 기획전, OMY Points
// - 우측: 로그인/내 정보, 언어 (KO), 포인트 잔액 뱃지
// - 배경: bg-white shadow-sm (스크롤 시 shadow 강화)
// - 모바일: 햄버거 메뉴
```

#### SearchBox
```tsx
// components/search/SearchBox.tsx
interface SearchBoxProps {
  initialValues?: {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
  };
  onSearch: (params: SearchParams) => void;
  variant: "hero" | "compact"; // hero=홈, compact=검색결과 상단
}

// 탭: [날짜 지정] [유연한 날짜 - Phase2]
// 목적지 입력 → AutocompleteDropdown 렌더
// 날짜 클릭 → DateRangePicker 렌더 (달력 팝업)
// 인원 클릭 → GuestSelector 렌더 (드롭다운)
// 검색 버튼: bg-omh-red text-white, h-12 px-8 rounded-xl
```

#### AutocompleteDropdown
```tsx
// 입력값이 있을 때 렌더되는 드롭다운
// 섹션 구분:
//   1. 최근 검색 (있을 경우): 시계 아이콘 + 지역명
//   2. 인기 검색: 불꽃 아이콘 + 지역명 + "인기" 뱃지
//   3. 검색 결과: 도시 / 호텔 그룹핑
//      - 도시: 🏙 도쿄 · 일본 · 숙소 3,241개
//      - 호텔: 🏨 신주쿠 프린스 호텔 · 도쿄 ★★★★

// 최대 높이: max-h-96 overflow-y-auto
// 하이라이트: 입력 매칭 텍스트 bold 처리
```

#### DateRangePicker
```tsx
// 2개월 달력 나란히 표시 (모바일: 1개월 세로)
// 날짜 셀:
//   - 기본: 날짜 숫자 + 최저가 (작은 폰트, gray)
//   - 고가 (성수기): text-omh-red
//   - 저가 (비수기): text-omh-green
//   - 선택됨: bg-omh-navy text-white
//   - 범위 내: bg-omh-navy/10
//   - 비활성(과거): opacity-30 cursor-not-allowed
// 
// 하단: 선택된 기간 요약 "2026.04.20 → 2026.04.22 (2박)"
```

---

## SCREEN 02: 검색결과 (/search)

### 레이아웃 (데스크탑)
```
┌──────────────────────────────────────┐
│          HEADER (compact SearchBox)   │
├──────────────────────────────────────┤
│  [필터 칩 바 - 가로 스크롤]            │
├────────────┬─────────────────────────┤
│  필터 패널  │  [정렬] 도쿄 숙소 822개  │
│  (w-72)    │  ┌──────────────────┐   │
│  [가격대]  │  │  HotelCard        │   │
│  [성급]    │  └──────────────────┘   │
│  [리뷰점수]│  ┌──────────────────┐   │
│  [시설]    │  │  HotelCard        │   │
│  [취소정책]│  └──────────────────┘   │
│            │  [더 보기 / 무한스크롤]  │
└────────────┴─────────────────────────┘
```

### 모바일 레이아웃
```
┌──────────────────┐
│ [← 도쿄] [필터▼] │  상단 바
├──────────────────┤
│ [칩][칩][칩]→    │  빠른 필터 가로 스크롤
├──────────────────┤
│   HotelCard      │
│   HotelCard      │
│   HotelCard      │
└──────────────────┘
// 필터 버튼 클릭 → 하단에서 올라오는 시트 (Sheet)
```

### HotelCard 컴포넌트 스펙
```tsx
// components/hotel/HotelCard.tsx
// 크기: w-full, 모바일 세로형 / 데스크탑 가로형 (lg:flex-row)

// 이미지 영역: w-full lg:w-56 h-48 lg:h-auto (object-cover, rounded-l-xl)
//   - 하단 오버레이에 즐겨찾기 ❤️ 버튼 (우상단)

// 정보 영역: flex-1 p-4
//   - 상단: [성급별 ★] 호텔명 (text-lg font-bold)
//   - 위치: 📍 신주쿠, 도쿄 (text-sm text-gray-500)
//   - 리뷰: [8.7] "매우 좋음" · 2,341개 리뷰
//            아래: ["위치 최고" 태그] ["청결도 우수" 태그]
//   - FOMO 배지 영역 (조건부 렌더):
//       🔴 "오늘 3개 남음" (red, 굵게)
//       🟠 "12분 전 예약됨"
//       🟢 "무료 취소 가능"

// 가격 영역 (우측 하단, lg:self-end):
//   - ₩125,000 (세금 포함) [KRW 굵게]
//   - 원래가 ~~₩150,000~~ 17% (있을 경우)
//   - ♦ 1,250P 적립 예상 (text-omh-gold text-xs)
//   - [객실 선택] 버튼 (bg-omh-red)
```

### FomoBadge 컴포넌트
```tsx
// components/hotel/FomoBadge.tsx
type FomoBadgeType = 
  | "ROOMS_LEFT"        // 잔여 N개
  | "RECENTLY_BOOKED"   // N분 전 예약
  | "WEEKLY_BOOKINGS"   // 이번 주 N번
  | "FREE_CANCEL"       // 무료 취소

// 배지 스타일:
// ROOMS_LEFT: bg-red-50 text-red-600 border border-red-200
// RECENTLY_BOOKED: bg-orange-50 text-orange-600
// FREE_CANCEL: bg-green-50 text-green-600
// 
// 크기: text-xs px-2 py-0.5 rounded-full font-medium
```

---

## SCREEN 03: 호텔 상세 (/hotel/[id])

### 레이아웃
```
┌──────────────────────────────────────┐
│ HEADER                               │
├──────────────────────────────────────┤
│ [사진 갤러리 - 5열 그리드 / 전체보기] │
├──────────────────────────────┬───────┤
│ 호텔 정보 (좌)                │ 예약  │
│  - 이름/성급/위치             │ 사이드 │
│  - 시설 아이콘                │ 바    │
│  - 설명                      │(우)  │
│  - 지도                      │      │
├──────────────────────────────┤      │
│ 리뷰 섹션                    │      │
│  - 종합 점수 (대형)           │      │
│  - 카테고리 점수 바            │      │
│  - 리뷰 목록                  │      │
├──────────────────────────────┤      │
│ 객실 선택 섹션                │      │
│  [날짜 재선택 바]             │      │
│  RoomCard                    │      │
│  RoomCard                    │      │
└──────────────────────────────┴───────┘

// 고정 하단 바 (모바일):
// [최저 ₩125,000부터] [객실 선택하기 →]
```

### ReviewSummary 컴포넌트
```tsx
// 레이아웃:
// 
// ┌─────────────────────────────┐
// │  8.7      매우 좋음         │
// │  (대형)   2,341개 리뷰      │
// │                             │
// │  청결도    ████████░░  8.9  │
// │  위치      █████████░  9.5  │
// │  직원      ████████░░  8.8  │
// │  시설      ████████░░  8.4  │
// │  가성비    ████████░░  8.2  │
// └─────────────────────────────┘
//
// 점수 레이블:
// 9.5+ → "최고에요"
// 8.5+ → "매우 좋아요"
// 7.5+ → "좋아요"
// 6.5+ → "보통이에요"

// 리뷰 필터 탭: 전체 | ⭐9+ | 한국인만 | 최신순
```

### RoomCard 컴포넌트
```tsx
// 헤더: 객실 이미지 (좌측 240px) + 객실명/면적/시설
// 
// 옵션 테이블:
// ┌─────────────────┬──────────┬──────────────┬──────────┐
// │ 옵션            │ 취소정책 │     가격     │  선택    │
// ├─────────────────┼──────────┼──────────────┼──────────┤
// │ 기본 (조식불포함) │ 환불불가 │  ₩132,000   │ [선택]   │
// │ 무료취소         │✅무료취소│  ₩159,500   │ [선택]   │
// │ 조식포함         │ 환불불가 │  ₩180,000   │ [선택]   │
// └─────────────────┴──────────┴──────────────┴──────────┘
//
// 잔여 3개 이하: "🔴 3개만 남았어요!" 표시
// 무료취소: "2026.04.17 14:00까지 무료 취소" (녹색)
// 환불불가: "예약 후 취소 불가" (빨간색, ⚠️ 아이콘)
```

---

## SCREEN 04: 여행자 정보 (/booking/traveler)

### 레이아웃
```
┌──────────────────────────────────────┐
│ [① 객실선택  ──  ② 여행자정보  ──  ③결제] │  진행 바
├──────────────────────────────┬───────┤
│ 투숙객 정보 입력 (좌)          │ 예약  │
│                               │ 요약  │
│ [영문 성]  [영문 이름]         │ (우)  │
│ [연락처 (010-XXXX-XXXX)]      │      │
│ [이메일]                      │      │
│ [도착 예정 시간] (선택)        │      │
│ [특별 요청사항] (선택)         │      │
│                               │      │
│        [다음: 결제하기 →]      │      │
└──────────────────────────────┴───────┘
```

### TravelerForm 유효성 검사 (Zod)
```typescript
const travelerSchema = z.object({
  firstNameEn: z.string()
    .min(1, "영문 이름을 입력해주세요")
    .regex(/^[A-Za-z\s]+$/, "영문만 입력 가능합니다"),
  lastNameEn: z.string()
    .min(1, "영문 성을 입력해주세요")
    .regex(/^[A-Za-z\s]+$/, "영문만 입력 가능합니다"),
  phone: z.string()
    .regex(/^010-\d{4}-\d{4}$/, "010-XXXX-XXXX 형식으로 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  arrivalTime: z.string().optional(),
  specialRequest: z.string().max(500, "500자 이내로 입력해주세요").optional(),
});
```

### PriceBreakdown 컴포넌트
```tsx
// 예약 요약 사이드바에 표시
// 
// 신주쿠 프린스 호텔          ×
// 스탠다드 킹룸 · 무료취소
// 4.20(월) - 4.22(수) · 2박 · 성인2명
// ─────────────────────────────
// 객실 요금       ₩290,000
//   ₩145,000 × 2박
// 세금 및 봉사료   ₩29,000
// ─────────────────────────────
// ✅ 무료 취소 기한: 4.17(금) 14:00까지
// ─────────────────────────────
// 최종 결제 금액   ₩319,000  ← 굵게, 큰 글씨
// ─────────────────────────────
// ♦ 3,190P 적립 예상
```

---

## SCREEN 05: 결제 (/booking/payment)

### 레이아웃
```
┌──────────────────────────────────────┐
│ [① 객실선택  ──  ② 여행자정보  ──  ③결제] │
├──────────────────────────────┬───────┤
│ 결제 수단 선택 (좌)            │ 예약  │
│                               │ 요약  │
│ 💳 신용/체크카드               │      │
│   [카드번호     ] [유효기간]   │      │
│   [CVC] [할부 선택]           │      │
│                               │      │
│ 카카오페이 [버튼]              │      │
│ 네이버페이 [버튼]              │      │
│                               │      │
│ ─── OMY Points 사용 ──────── │      │
│ 보유: ♦ 12,400P              │      │
│ [     5,000    ] P 사용      │      │
│ (최대 63,800P 사용 가능)       │      │
│                               │      │
│ ─── 안심 메시지 ──────────── │      │
│ ✅ 2026.04.17까지 무료 취소   │      │
│ ⭐ "위치가 정말 최고예요" 리뷰  │      │
│ 🔒 SSL 보안 · PCI-DSS 인증   │      │
│                               │      │
│   [₩319,000 결제하기 🔒]      │      │
│   (개인정보 처리방침 동의 포함) │      │
└──────────────────────────────┴───────┘
```

### CardForm 컴포넌트 (인라인 결제)
```tsx
// components/payment/CardForm.tsx
// - 카드번호: 4자리마다 자동 하이픈 삽입
// - 유효기간: MM/YY 자동 포맷
// - CVC: 3~4자리, 입력 시 마스킹
// - 카드사 자동 감지 (첫 4자리로 로고 표시)
// - 할부: 1회 ~ 12개월 (5만원 이상 활성화)
// 
// NICEPAY 서버사이드 처리 (카드 정보 서버 비저장 원칙):
// → 클라이언트에서 NICEPAY SDK로 직접 토큰화
// → 토큰만 서버로 전송
```

---

## SCREEN 06: 예약 확인 (/booking/confirm/[id])

### 레이아웃
```
┌──────────────────────────────────────┐
│  ✅ 예약이 완료되었습니다!            │  green banner
│                                      │
│  예약 번호: OMH-2026-001234          │
│  ───────────────────────────────    │
│  신주쿠 프린스 호텔                  │
│  📍 일본 도쿄 신주쿠                 │
│  🗓 2026.04.20(월) 15:00 체크인     │
│     2026.04.22(수) 11:00 체크아웃   │
│  🛏 스탠다드 킹룸 · 무료취소         │
│  👥 성인 2명                        │
│  ───────────────────────────────    │
│  결제 완료: ₩319,000                │
│  확인 이메일: kim@example.com 발송   │
│  ───────────────────────────────    │
│  🎉 ♦ 3,190P 적립 예정              │  gold banner
│     (체크아웃 후 익일 적립)           │
│  ───────────────────────────────    │
│  📱 앱 다운로드하고 알림 받기         │  app CTA
│                                      │
│  [마이페이지에서 예약 확인] [홈으로]   │
└──────────────────────────────────────┘
```

---

## 공통 컴포넌트

### ProgressBar (예약 단계 진행 바)
```tsx
// components/layout/ProgressBar.tsx
// 단계: 객실선택 → 여행자정보 → 결제
// 
// 현재 단계: 굵게 + omh-navy
// 완료 단계: omh-green + 체크 아이콘
// 미완료 단계: gray-400
// 
// 연결선: 완료=omh-green, 미완료=gray-200
```

### PointsBadge
```tsx
// components/loyalty/PointsBadge.tsx
// "♦ 1,250P 적립 예상" 형태
// 크기: text-xs
// 색상: text-omh-gold
// 아이콘: 다이아몬드 ♦
```

---

## 애니메이션 가이드

```typescript
// Framer Motion 기본 설정

// 카드 등장
const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// 드롭다운 등장
const dropdownAnimation = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.15 }
};

// FOMO 배지 (약한 펄스)
const fomoPulse = {
  animate: { opacity: [1, 0.7, 1] },
  transition: { duration: 2, repeat: Infinity }
};

// 카운터 (숫자 올라가는 효과 - Phase 2)
```

---

## 반응형 브레이크포인트

```
모바일:    < 768px    (default)
태블릿:    768px+     (md:)
데스크탑:  1280px+    (xl:)
와이드:    1440px+    (2xl:)

주요 변경점:
- SearchBox: 세로 → 가로
- HotelCard: 세로형 → 가로형
- 필터: 하단 시트 → 사이드 패널
- 예약 요약: 하단 바 → 우측 사이드바
- 달력: 1개월 → 2개월
```

---

## 접근성 (A11y) 가이드

```tsx
// 모든 이미지 alt 필수
<Image alt="신주쿠 프린스 호텔 외관" ... />

// 버튼 aria-label
<button aria-label="신주쿠 프린스 호텔 즐겨찾기 추가">❤️</button>

// 폼 레이블
<label htmlFor="guestName">영문 성명 *</label>
<input id="guestName" aria-required="true" ... />

// 에러 메시지
<p role="alert" aria-live="polite">이메일 주소를 입력해주세요</p>

// 로딩 상태
<div role="status" aria-live="polite">
  {isLoading ? "검색 중..." : `${total}개의 숙소를 찾았습니다`}
</div>
```

---

## 스켈레톤 UI (로딩 상태)

```tsx
// 검색결과 로딩 시 HotelCard 스켈레톤 3개 표시
// Tailwind animate-pulse 사용

function HotelCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl animate-pulse">
      <div className="w-56 h-48 bg-gray-200 rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
```
