# OhmyHotel 2.0 — Claude Code 개발 킥오프 가이드
**이 파일을 Claude Code에 첫 번째로 읽혀주세요**

---

## 📁 문서 구조

```
omh-platform-docs/
├── KICKOFF.md          ← 지금 이 파일 (Claude Code에 먼저 읽힐 것)
├── PRD.md              ← 전체 기능 요구사항
├── ARCHITECTURE.md     ← 기술 스택 + DB 스키마 + API 설계
└── UI_SPECS.md         ← 화면별 레이아웃 + 컴포넌트 스펙
```

---

## 🎯 프로젝트 목표

OhmyHotel 글로벌 OTA 경쟁분석 결과를 바탕으로,  
**한국인 특화 아시아 여행 예약 플랫폼** 을 신규 개발합니다.

핵심 해결 과제:
1. 자동완성 검색 (기존: 3단계 탭 클릭 → 신규: 1단계 입력)
2. 리뷰 시스템 (기존: 전무 → 신규: 10점제 + 카테고리별)
3. FOMO 희소성 UX (기존: 전무 → 신규: 잔여객실/최근예약 배지)
4. OMY Points 로열티 (기존: 전무 → 신규: 1% 적립)
5. 인라인 결제 (기존: 팝업 → 신규: 페이지 내 카드 폼)

---

## 🚀 개발 시작 순서

### Step 1: 프로젝트 생성
```bash
npx create-next-app@latest omh-platform \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd omh-platform
```

### Step 2: 핵심 패키지 설치
```bash
# UI
npm install @radix-ui/react-dialog @radix-ui/react-popover
npm install @radix-ui/react-select @radix-ui/react-slider
npm install lucide-react framer-motion class-variance-authority clsx

# shadcn/ui 초기화
npx shadcn-ui@latest init

# 상태관리
npm install zustand @tanstack/react-query

# 폼
npm install react-hook-form @hookform/resolvers zod

# 날짜
npm install date-fns

# DB
npm install prisma @prisma/client
npm install -D prisma

# 인증
npm install next-auth@beta

# 이메일
npm install resend

# 유틸
npm install qs
```

### Step 3: 폰트 설정
```tsx
// app/layout.tsx
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});
// 또는 CDN: https://cdn.jsdelivr.net/gh/orioncactus/pretendard/
```

### Step 4: Tailwind 컬러 추가
```typescript
// tailwind.config.ts
extend: {
  colors: {
    "omh-red":   "#E84855",
    "omh-navy":  "#1A2B5E",
    "omh-gold":  "#F4A629",
    "omh-green": "#27AE60",
    "omh-amber": "#F39C12",
  }
}
```

### Step 5: 환경 변수 설정
```bash
cp .env.example .env.local
# ARCHITECTURE.md의 "환경 변수" 섹션 참고
```

### Step 6: DB 설정
```bash
npx prisma init
# ARCHITECTURE.md의 "데이터베이스 스키마" 섹션을 prisma/schema.prisma에 복사
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 📋 개발 우선순위 (Sprint 계획)

### Sprint 1 (1~2주): 기반 구조 + 홈
- [ ] 프로젝트 세팅 완료
- [ ] Header / Footer 레이아웃
- [ ] SearchBox 컴포넌트 (자동완성 포함)
- [ ] DateRangePicker (가격 표시 달력)
- [ ] GuestSelector
- [ ] 홈 페이지 (`/`) 완성
- [ ] API: `/api/autocomplete`

### Sprint 2 (3~4주): 검색결과
- [ ] HotelCard 컴포넌트 (FOMO 배지 포함)
- [ ] 필터 패널 (데스크탑 + 모바일 시트)
- [ ] 정렬 드롭다운
- [ ] 검색결과 페이지 (`/search`)
- [ ] API: `/api/search`
- [ ] 무한 스크롤 / 페이지네이션

### Sprint 3 (5~6주): 호텔 상세
- [ ] 사진 갤러리 (라이트박스 포함)
- [ ] 리뷰 시스템 UI (ReviewSummary + 리뷰 목록)
- [ ] RoomCard (옵션 테이블)
- [ ] 호텔 상세 페이지 (`/hotel/[id]`)
- [ ] API: `/api/hotels/[id]`
- [ ] Kakao 지도 연동

### Sprint 4 (7~8주): 예약 플로우
- [ ] 진행 단계 바 (ProgressBar)
- [ ] TravelerForm (유효성 검사 포함)
- [ ] PriceBreakdown 사이드바
- [ ] CardForm (인라인 결제 폼)
- [ ] OMY Points 사용 UI
- [ ] 결제 API 연동 (NICEPAY)
- [ ] 예약 확인 페이지
- [ ] 예약 확인 이메일 발송

### Sprint 5 (9~10주): 인증 + 마이페이지
- [ ] 로그인 / 회원가입 (이메일 + 카카오 소셜)
- [ ] 마이페이지 - 예약 내역
- [ ] 마이페이지 - OMY Points 내역
- [ ] 리뷰 작성 페이지
- [ ] 즐겨찾기 기능

---

## 🔑 개발 시 핵심 주의사항

### 1. 가격은 항상 KRW 정수 (원 단위)
```typescript
// ✅ 정수로 저장 및 처리
const price = 125000; // ₩125,000

// ✅ 표시 시 포맷팅
formatKRW(price) // → "₩125,000"

// ❌ 절대 소수점 사용 금지
const price = 125000.50; // WRONG
```

### 2. 날짜는 항상 KST (한국 표준시) 기준
```typescript
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 사용자에게 표시할 때
format(date, 'yyyy.MM.dd(EEE)', { locale: ko })
// → "2026.04.20(월)"

// API 전송 시
date.toISOString() // UTC
// 서버에서 KST 변환 필요
```

### 3. 이미지 최적화
```tsx
// 항상 next/image 사용
import Image from 'next/image';

<Image
  src={hotel.thumbnailUrl}
  alt={hotel.nameKo}
  width={400}
  height={300}
  className="object-cover"
  placeholder="blur"
  blurDataURL={hotel.blurHash}
/>
```

### 4. 에러 핸들링
```typescript
// API Route에서
try {
  const data = await prisma.hotel.findMany(...);
  return NextResponse.json({ data });
} catch (error) {
  console.error('[SEARCH_ERROR]', error);
  return NextResponse.json(
    { error: '검색 중 오류가 발생했습니다.' },
    { status: 500 }
  );
}
```

### 5. SEO 메타태그 (모든 페이지)
```tsx
// app/hotel/[id]/page.tsx
export async function generateMetadata({ params }) {
  const hotel = await getHotel(params.id);
  return {
    title: `${hotel.nameKo} 예약 | OhmyHotel`,
    description: `${hotel.nameKo} ${hotel.stars}성급 · ₩${formatKRW(hotel.minPrice)}부터`,
    openGraph: {
      images: [hotel.thumbnailUrl],
    },
  };
}
```

---

## 🧪 테스트 전략

```bash
# 단위 테스트
npm install -D jest @testing-library/react @testing-library/jest-dom

# E2E 테스트 (예약 플로우)
npm install -D playwright
npx playwright install
```

테스트 필수 대상:
- `formatKRW()` 유틸 함수
- `DateRangePicker` 날짜 선택 로직
- `travelerSchema` Zod 유효성 검사
- 예약 플로우 E2E (검색→선택→결제 완료)

---

## 📊 더미 데이터 (시드)

개발 초기에 사용할 시드 데이터:
- 도쿄 호텔 20개 (성급별 4개씩)
- 호텔별 객실 타입 2~4개
- 호텔별 리뷰 10~50개
- 테스트 사용자 계정 3개

```bash
npx prisma db seed
# → prisma/seed.ts 파일 실행
```

---

## 🔗 참고 문서

- [PRD.md](./PRD.md) — 전체 기능 요구사항
- [ARCHITECTURE.md](./ARCHITECTURE.md) — DB 스키마 + API
- [UI_SPECS.md](./UI_SPECS.md) — 화면별 스펙
- Next.js App Router: https://nextjs.org/docs/app
- shadcn/ui: https://ui.shadcn.com
- NICEPAY 개발자 가이드: https://docs.nicepay.co.kr
- Kakao Maps API: https://apis.map.kakao.com

---

## ✅ Claude Code에 전달할 첫 번째 프롬프트 예시

```
이 프로젝트는 OhmyHotel OTA 플랫폼입니다.
docs/KICKOFF.md, docs/PRD.md, docs/ARCHITECTURE.md, docs/UI_SPECS.md 를 모두 읽고,
Sprint 1부터 시작해주세요.

첫 번째 작업:
1. Next.js 14 + TypeScript + Tailwind CSS 프로젝트 세팅
2. ARCHITECTURE.md의 Prisma 스키마를 그대로 적용
3. UI_SPECS.md의 디자인 토큰(컬러)을 tailwind.config.ts에 추가
4. Header 컴포넌트 구현 (UI_SPECS.md 참고)
5. SearchBox 컴포넌트 구현 (AutocompleteDropdown 포함)
6. /api/autocomplete API Route 구현
7. 홈 페이지(/) 레이아웃 완성

각 단계마다 확인을 요청하지 말고 전체를 한 번에 구현해주세요.
```
