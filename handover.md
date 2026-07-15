# 프로젝트 이관 문서 (Handover) — 오마이트립 (OhMyTrip / OMT)

> 🔵 **[2026-07-14 재연결 정합 배너]**
> 이 `handover.md`는 **2026-07-08 OPS→CEO Office 방향 초기본**입니다. 이후 다른 계정에서 작업이 이어졌고 프로젝트는 다시 OPS 계정으로 복귀했습니다.
> **최신·정본 이관 세트 = `transfer-package/` 폴더(7종, 2026-07-14)**. 상세/최신은 그쪽과 `git log`(HEAD `fa6d73a`)를 우선하세요.
> 아래 본문은 이력 보존을 위해 남겨두며, 일부 서술은 그 사이 해결되어 아래 "변경 이력"으로 정정합니다.
>
> **변경 이력 (기존 → 변경 · 시점 · 이유 · 현재 적용)**
> | 항목 | 기존(이 문서) | 변경 | 시점 | 이유 | 현재 적용 |
> |---|---|---|---|---|---|
> | README.md | "없음(작성 권장)" | **신규 생성됨** | 2026-07-10 (`4c9cd7b`) | 이관 후속 | ✅ 적용 — README.md 존재 |
> | PROJECT_STATUS.md | "2026-06-12에서 멈춤(stale)" | **최신화됨(헤더 07-10 + 델타)** | 2026-07-10 (`4c9cd7b`) | 이관 후속 | ✅ 적용 — 상세표는 06-12 스냅샷, 델타는 git log |
> | 리워드 | "마일리지 1종(트립코인 폐지)" | **포인트 중복 지갑까지 완전 제거→마일리지 통합** | 2026-07-10 (`fa6d73a`) | 단일 리워드 완결 | ✅ 적용 — `state.js` points 잔재 0 |
> | 신규 페이지 | (없던 시점) | **`video-to-trip.html`** 추가 | 2026-07-09 (`aac4d32`) | 콘텐츠→예약 데모 | ✅ 적용 |
> | 골프텔 티오프 | "라운드별 재설계" | **+ 시간대 아코디언(스크롤 91%↓)** | 2026-07-09 (`ba679e6`) | 스크롤 과다 개선 | ✅ 적용 — 라운드탭+코스필터+아코디언 공존(문법·코드 확인) |
> | 정본 이관 문서 | 이 handover.md | **`transfer-package/` 7종으로 대체** | 2026-07-14 | 더 신규·구조적 | ✅ 정본 = transfer-package/ |

> **목적**: OPS 계정 Claude Code → **CEO Office 계정**으로 이관.
> 이 프로젝트를 **처음 보는 사람**도 이 문서 하나로 목적·현재 상태를 이해하고 **바로 이어서 작업**할 수 있도록 작성했습니다.
> 작성일: 2026-07-08 · 대상 폴더: `C:\Users\LENOVO\Desktop\OTA` (이 폴더 1개만 대상)

---

## 0. 30초 요약 (TL;DR)

- **무엇**: 한국인 대상 **아시아 아웃바운드 골프 관광 OTA** 프로토타입 (메인 상품 = **골프텔** = 골프+호텔).
- **형태**: **빌드 없는 순수 정적 사이트** (Vanilla HTML/CSS/JS). npm 빌드·서버·DB **없음**.
- **실행**: 폴더에서 정적 서버 하나 띄우면 끝 → `npx -y serve -l 4178 .` 후 `http://localhost:4178`.
- **배포**: **GitHub Pages** (main 브랜치 자동 배포) → 라이브 https://bstars00-rgb.github.io/ota/
- **데이터**: 실 DB/API **없음**. 전부 `data.js`(목업) + `state.js`(브라우저 localStorage). **비밀키·`.env` 없음**.
- **백엔드(ELLIS)**: 실제 코드 없이 **MD 명세 문서로만** 존재 (의도된 설계).
- ⚠️ **주의**: `PRD.md`·`ARCHITECTURE.md`는 **미래 지향 목표 스택**(Next.js/TS/Supabase)을 적어둔 것으로, **현재 실제 코드와 다릅니다**. 실제는 정적 프로토타입입니다.

---

## 1. 프로젝트명

- **표시명**: 오마이트립 (OhMyTrip, 코드상 약칭 **OMT**)
- **레포지토리**: https://github.com/bstars00-rgb/ota  (`git remote origin` = `https://github.com/bstars00-rgb/ota.git`)
- **라이브**: https://bstars00-rgb.github.io/ota/
- 관련 기획 문서상 상위 제품 비전명은 "OhmyHotel 2.0" (PRD 기준). 현재 구현체는 골프텔 중심으로 피벗된 "오마이트립".

---

## 2. 프로젝트 목적

- **비전**: "한국인을 위한 아시아 최고의 여행 예약 플랫폼" — 글로벌 OTA가 못 채우는 한국인 맞춤 경험(원화 투명가격 + 완전 한국어 + 아시아 특화 큐레이션).
- **핵심 피벗(2026-05 확정)**: **골프텔 중심 모델**. 몽키트래블식 골프+호텔 패키지가 메인 SKU.
  - 항공 결합형은 별도 상품 언어 **`golftel-air`** 로 분리.
  - 일반 호텔·항공 단품·항공+호텔(동적 결합, `airhotel.html`)은 보조 SKU.
- **타깃**: 일본·베트남·태국·필리핀 골프 여행을 즐기는 한국인(20~50대).

---

## 3. 현재 진행 상태

- **단계**: **인터랙티브 클릭 프로토타입 완성 단계** (실제로 클릭하면 동작하는 mock 데모). 실 결제·실 재고·실 백엔드 연동 전 단계.
- **페이지**: **HTML 39개**(고객 + 백오피스 8모듈 + 크리에이터 + 모바일). 4개 JS + 11개 MD 문서.
- **git**: `main` 브랜치, 작업 트리 clean(미커밋 없음). 최근 커밋 흐름:
  - `81b4244` feat(golftel): 티오프 선택 라운드별 재설계 (같은 시간 재사용 + 코스 필터)
  - `0dd7dc5` fix(golftel): 상세 헤더 리뷰 개수 `[object Object]` 수정
  - `cff6b2a` chore(hotels): '인기 호텔 도시' 그리드 삭제
  - `2cda425` fix(hotels): 숙소 목록 미표시(TDZ) + 트러스트 지표 제거
  - `7d966f3` feat(golftel): 골프+항공 실시간 항공편 선택
- **최근 세션 작업(2026-07 초)**: 항공 운임 3종 비교 모달, 결제 여정 카드, 폰트 현대화(JetBrains Mono→Pretendard tabular-nums), 헤더 글자 세로 줄바꿈 수정, index 헤더 이모지→라인 SVG 하드코딩, country 검색 캘린더 잘림/밀림 수정, 호텔 목록 TDZ 버그 수정, 골프텔 티오프 라운드별 UX 재설계.
- ⚠️ **문서 최신성 갭**: `PROJECT_STATUS.md` 헤더는 "마지막 업데이트 2026-06-12"로, 그 이후 약 2주치 작업(위 커밋들)이 **미반영**. 실제 최신 상태는 이 handover.md와 `git log`가 정본.

---

## 4. 주요 기능

### 고객 여정 (Customer)
- **골프텔** (핵심): 목록(`golftels.html`) → 상세(`golftel.html`, 갤러리·객실 옵션·**라운드별 티오프 선택**·리뷰·FAQ·위치 지도) → 빌더(`golftel-builder.html`).
  - 티오프: R1/R2/R3 **라운드 탭** + **코스 필터**로 라운드별 티타임 지정(같은 시간도 다른 날짜엔 지정 가능).
  - **골프+항공**: "항공권 함께 예약" 토글 시 실제 항공편 목록 모달에서 선택.
- **항공**: 검색(`flights.html`) → 결과(`flights-results.html`, 7일 가격 비교·운임 3종 비교 모달·가격 알리미).
- **호텔**: 목록(`hotels.html`, 지도/비교/가격 캘린더 hover) → 상세(`hotel.html`, Lightbox·비슷한 호텔).
- **항공+호텔 동적 결합**: `airhotel.html` (따로예약 vs 묶음 할인 비교).
- **AI 플래너**: `ai-planner.html` (음성 인식 mock + 키워드 Q&A + 골프 의도 감지).
- **결제 플로우**: 장바구니(`cart.html`) → 결제(`checkout.html`) → 게이트웨이(`payment.html`, 10% 실패 시뮬) → 완료(`complete.html`) → 바우처(`voucher.html`).
- **회원**: 로그인(`login.html`), 마이페이지(`mypage.html`, 등급 5단·마일리지·예약·리뷰·문의·저장여행), 통합검색(`search.html`).
- **콘텐츠/커머스**: 크리에이터 피드(`feed.html`), 라이브 커머스(`live.html`), 인바운드 SEO(`inbound.html`).
- **모바일 앱 목업**: `mobile.html` (PWA — `manifest.json` + `sw.js` 오프라인 폴백 `offline.html`).

### 백오피스 (ELLIS BackOffice — 운영 콘솔, 다크 톤)
- `admin-dashboard` / `admin-bookings` / `admin-products` / `admin-customers` / `admin-cs` / `admin-users` / `admin-settlement` / `admin-cms` — 8모듈 + 4 ROLE 구상.
- 공급/채널 연동 대시보드: `admin-suppliers`, `admin-channels`, `admin-analytics`.
- 데이터 매핑 도구: `mapper.html` (프론트 모델 ↔ ELLIS 필드 매핑).

### 리워드/비즈니스
- **마일리지 단일 리워드** (1마일=1원). 회원 등급 5단 자동 산정, 할부, 다이내믹 패키지.

---

## 5. 기술 스택 (실제 구현 기준)

| 영역 | 실제 사용 | 비고 |
|---|---|---|
| 마크업/스타일 | **순수 HTML5 + CSS** (인라인 `<style>`, CSS 변수 토큰) | 프레임워크·전처리기 없음 |
| 로직 | **Vanilla JavaScript (ES6+)**, 인라인 `<script>` + 외부 4개 JS | 번들러·트랜스파일 없음 |
| 상태 저장 | **브라우저 localStorage** (`state.js`, 키 `omt_*_v1`) | 서버 세션 없음 |
| 데이터 | **정적 목업** (`data.js`, `window.OMT.DATA`) | 실 API·DB 없음 |
| 폰트/아이콘 | Pretendard(jsDelivr CDN), Noto Sans KR(Google Fonts), 자체 라인 SVG(`icons.js`) | |
| 지도 | **OpenStreetMap iframe 임베드** | Kakao/Google Maps 키 불필요 |
| PWA | `manifest.json` + `sw.js`(Service Worker) | |
| 배포 | **GitHub Pages** (main 자동) | 빌드 파이프라인 없음 |
| 로컬 프리뷰 | `serve` (npx, 포트 4178) | `.claude/launch.json`에 정의 |

> ⚠️ `ARCHITECTURE.md`가 명시한 Next.js 14 / TypeScript / Tailwind / Zustand / Prisma / NextAuth / Kakao Maps 등은 **"향후 프로덕션 목표 스택"**이며 **현재 코드에는 없습니다.** 실제로 설치·사용 중인 런타임 의존성은 로컬 프리뷰용 `serve` 뿐(전역 npx 실행, `package.json` 없음).

---

## 6. 폴더 구조

플랫 구조(하위 폴더 없음). 최상위에 전부 위치.

```
OTA/
├─ index.html                     # 홈 (진입점)
├─ [고객 페이지 26개]
│   golftels.html golftel.html golftel-builder.html
│   hotels.html hotel.html
│   flights.html flights-results.html airhotel.html country.html
│   search.html ai-planner.html
│   cart.html checkout.html payment.html complete.html voucher.html
│   mypage.html login.html
│   feed.html live.html creator.html creator-dashboard.html
│   inbound.html group-booking.html mobile.html offline.html
├─ [백오피스/도구 13개]
│   admin-dashboard.html admin-bookings.html admin-products.html
│   admin-customers.html admin-cs.html admin-users.html
│   admin-settlement.html admin-cms.html admin-channels.html
│   admin-suppliers.html admin-analytics.html mapper.html
│
├─ data.js       # 중앙 목업 데이터 (135KB) — 모든 페이지가 참조
├─ state.js      # localStorage 상태 + 헬퍼 (예약/찜/마일리지/알림 등)
├─ icons.js      # 이모지 → 라인 SVG 자동 치환기
├─ sw.js         # PWA Service Worker
│
├─ manifest.json # PWA 매니페스트
├─ .gitignore    # .claude/ node_modules dist .env 등 무시
├─ .claude/launch.json   # 로컬 프리뷰 설정 (git 무시됨)
│
└─ [문서 11개 .md]
    PRD.md ARCHITECTURE.md KICKOFF.md UI_SPECS.md
    PROJECT_STATUS.md QA_CHECKLIST.md
    ELLIS_SPEC.md ELLIS_API_BACKOFFICE.md
    BACKOFFICE_SPEC.md BACKOFFICE_GUIDE.md ALIMTALK_TEMPLATES.md
    handover.md  ← (이 문서)
```

---

## 7. 주요 파일 설명

### 코어 JS (반드시 먼저 이해)
- **`data.js`** — 프로젝트의 데이터 심장. `window.OMT.DATA`에 `CITIES`, `AIRPORT_CITIES`, `HOTELS`, `GOLFTELS`, `GOLF_COURSES`, `FLIGHTS`, `AIRLINES`, `CHANNEL_MANAGERS`, `OWNERSHIP`, `INITIAL_BOOKINGS`, `PRODUCTS`(현재 `[]` — 고정 패키지 폐지) 등. **ID 참조형 정규화** 구조(백엔드 ELLIS 마이그레이션 호환 목적).
- **`state.js`** — `window.OMT.State`. localStorage 래퍼 + 헬퍼(`get/set/add/remove/use/earn/increment` 패턴). 키 네이밍 규칙 `omt_*_v1`. 예: 예약, 찜(wishlist), 마일리지(단일 리워드), 알림, 최근본, 회원등급, 빠른예약 프로필, 가격알리미.
- **`icons.js`** — 사이트 전역 이모지를 Lucide 계열 **라인 SVG로 자동 치환**(TreeWalker + MutationObserver). 각 HTML 하단에 `<script src="icons.js"></script>` 삽입됨. (참고: index 헤더 nav는 캐시/FOUC 방지를 위해 SVG를 **직접 하드코딩**해 예외.)
- **`sw.js`** — PWA 오프라인 캐싱/폴백.

### 핵심 문서 (읽는 순서 권장)
1. **`PRD.md`** — 제품 요구사항/비전/KPI (단, 스택 서술은 "목표"임에 유의).
2. **`PROJECT_STATUS.md`** — 진행 상태/점수/로드맵 (2026-06-12 기준, 이후분은 `git log` 참조).
3. **`ARCHITECTURE.md`** — 목표 아키텍처(현재 코드 아님).
4. **`ELLIS_SPEC.md`, `ELLIS_API_BACKOFFICE.md`** — 백엔드 ELLIS 연동 설계/도메인/API 22종 명세(문서만).
5. **`BACKOFFICE_SPEC.md`, `BACKOFFICE_GUIDE.md`** — 운영 콘솔 8모듈/4 ROLE 명세·가이드.
6. **`QA_CHECKLIST.md`** — 수동 QA 체크리스트 v4.0 (자동 테스트 없음, 이걸로 검증).
7. **`UI_SPECS.md`, `KICKOFF.md`, `ALIMTALK_TEMPLATES.md`** — UI 규격 / 킥오프 / 카톡 알림톡 템플릿.

---

## 8. 실행 방법

**빌드/설치 불필요.** 정적 서버만 있으면 됨.

```bash
# 방법 A — 권장 (프로젝트에 이미 설정됨: .claude/launch.json)
cd OTA
npx -y serve -l 4178 .
# 브라우저: http://localhost:4178

# 방법 B — 아무 정적 서버
python -m http.server 4178      # Python
# 또는 VS Code "Live Server" 확장

# 방법 C — 그냥 열기 (일부 기능 제한 가능)
index.html 더블클릭
```

> **로컬 프리뷰 주의**: `serve`는 `foo.html` 요청을 `foo`(확장자 없는 클린 URL)로 301 리다이렉트하며 **쿼리스트링을 떨굽니다.** 따라서 파라미터가 필요한 페이지는 클린 URL로 접속해야 합니다. 예: ❌ `/golftel.html?id=...` → ✅ `/golftel?id=gt-vn-danang-ba-na-4n`. **GitHub Pages 배포본은 `.html?쿼리`를 그대로 유지**하므로 이 문제가 없습니다.

**배포**: `main`에 push → GitHub Pages 자동 반영(약 1~2분). 별도 CI/CD·GitHub Actions 워크플로 파일 없음(Pages 기본 브랜치 배포).

---

## 9. 환경변수 / 설정값

- **`.env` 없음. 환경변수 없음. 비밀키·토큰 없음.** (정적 사이트라 서버 시크릿 불필요)
- 설정성 값:
  - `.claude/launch.json` — 로컬 프리뷰 서버명 `omt-static`, 포트 `4178`. (`.gitignore`로 git 제외)
  - `manifest.json` — PWA 이름/아이콘/테마컬러.
  - 하드코딩 상수: 마일리지 기본치, 항공 추정가(국가별), 그린피 기준가·시간대 모디파이어 등은 각 페이지/`data.js` 내부 상수로 존재(외부 설정 아님).

---

## 10. 외부 서비스 연동 정보

| 서비스 | 용도 | 키 필요 | 형태 |
|---|---|---|---|
| GitHub (bstars00-rgb/ota) | 소스 관리 + **Pages 호스팅** | 계정 권한 | main 자동 배포 |
| Pretendard (cdn.jsdelivr.net) | 폰트 | 불필요 | `<link>` CDN |
| Google Fonts (Noto Sans KR) | 폰트 | 불필요 | `<link>` CDN |
| OpenStreetMap | 위치 지도 | 불필요 | `<iframe>` 임베드 |

- **결제/PG, 카카오 알림톡, 항공/호텔 실 API, 지도 API(키형)** — 전부 **미연동(목업/시뮬레이션)**. 실 연동 전 단계.

---

## 11. 데이터베이스 / Supabase / GitHub / API 연동 여부

| 항목 | 연동 여부 | 설명 |
|---|---|---|
| **데이터베이스** | ❌ 없음 | 전부 `data.js` 목업 |
| **Supabase** | ❌ 없음 | 이 프로젝트엔 미사용 |
| **localStorage** | ✅ 사용 | `state.js`, 키 `omt_*_v1` (브라우저 로컬) |
| **GitHub** | ✅ 사용 | 레포 + Pages 배포 |
| **외부 API(REST/GraphQL)** | ❌ 없음 | 실 API 호출 없음 |
| **백엔드 ELLIS** | 🟡 문서만 | 실제 코드 없이 MD 명세로만 존재(의도된 설계) |

---

## 12. 완료된 작업

- 골프텔 중심 정보구조 전환 + 고객/백오피스/모바일 39페이지 인터랙티브 프로토타입.
- 골프텔 상세: 라운드별 티오프 선택 UX, 골프+항공 실시간 항공편 선택, 객실 옵션·필요 객실수 계산.
- 항공: 검색→결과, 7일 가격비교, 운임 3종 비교 모달, 가격 알리미, 결제 여정 카드.
- 호텔: 목록(지도/비교/캘린더 hover)·상세(Lightbox), 목록 미표시 TDZ 버그 수정.
- 리워드 마일리지 단일화(트립코인 폐지), 회원등급 5단, 할부, 다이내믹 패키지.
- 전 사이트 이모지→라인 SVG(`icons.js`) + 폰트 현대화 + 헤더 레이아웃 안정화.
- 백엔드 ELLIS 연동/백오피스/카톡 알림톡 **문서 세트** 완비.

## 13. 미완료 작업 (알려진 백로그)

- **실 백엔드(ELLIS) 연동 부재** — 현재 전부 목업. API 명세(`ELLIS_API_BACKOFFICE.md`)는 있으나 구현 없음.
- **실 결제/PG·카톡 알림톡·항공/호텔 실시간 재고 API** 미연동.
- **자동화 테스트 없음** — QA는 `QA_CHECKLIST.md` 기반 수동.
- **문서 최신화 필요** — `PROJECT_STATUS.md`가 2026-06-12에서 멈춰 최근 2주 작업 미반영. 일부 문서가 폐지된 페이지(trip-builder/packages/product 등, 현재 파일 없음)를 참조할 수 있음(확인 필요).
- **다국어(i18n)·실 이미지 자산** — 다국어는 후순위, 상세 이미지 다수 placeholder.
- 세부 백로그: `PROJECT_STATUS.md`의 미구현/피드백 섹션 및 `QA_CHECKLIST.md §14` 참조.

---

## 14. ⭐ 프로젝트 필수 규칙 / 결정사항 (반드시 준수 — 계정 이동 시 유실 위험)

> 아래는 그동안 **OPS 계정 Claude의 개인 메모리**에 저장돼 이어져 온 결정들입니다. 계정을 옮기면 그 메모리는 **함께 이동하지 않으므로**, 여기 박제합니다. CEO Office 담당자·AI는 이 규칙을 지켜야 일관성이 유지됩니다.

1. **메인 SKU는 골프텔**. 항공 결합형은 `golftel-air`로 **분리** 관리.
2. **국가별 오너십 매트릭스**: 일본·베트남 **직영**, 태국·필리핀 **프랜차이즈** (`OWNERSHIP` in `data.js`).
3. **백엔드 ELLIS는 MD 명세만** 유지(실코드 X). 프론트 변경 시 관련 MD 문서 **동반 갱신**.
4. **다크 모드 정책**: 사용자(고객) 화면에 **라이트/다크 토글 추가 금지**. 운영 콘솔(백오피스)만 다크 톤 유지.
5. **에어텔(고정 자유여행 패키지) 폐지**: 고정 `PRODUCTS`·패키지 빌더 부활 금지. 단, **동적 항공+호텔 결합(`airhotel.html`)은 허용**.
6. **리워드는 마일리지 1종** (트립코인 폐지, "시트립" 등 **경쟁사 명칭·색 차용 금지**).
7. **골프 티시트/채널 매니저**: GDO(일본)·GolfNow(글로벌)·카카오골프/XGOLF(한국)·Golfdigg(태국) 등 ELLIS 연동 대상 (`CHANNEL_MANAGERS`).
8. **JS 제거 시**: 블록 주석 처리 말고 **완전 삭제** 후 검증.

### 운영 팁 (다음 담당자용)
- **JS 문법 검증**(빌드 없으니 수동): 인라인 스크립트 추출 후 `new Function()`으로 파싱 체크, 외부 JS는 `node --check`.
  예: `node -e '...extract <script> blocks... new Function(block)'` (세션에서 사용하던 방식).
- **커밋 메시지**: 한글 메시지는 PowerShell here-string에서 깨지므로 **파일로 커밋**(`git commit -F msgfile`) 권장.
- **로컬 프리뷰**: `serve`가 파일을 캐시할 수 있음 → 최신 반영 안 보이면 서버 재시작 + 브라우저 `Ctrl+Shift+R`(+ URL에 `?cb=타임스탬프`).
- **스크린샷 타임아웃**: 일부 페이지(hero setInterval 등)는 스크린샷이 멈출 수 있어 DOM 조회/eval로 검증하는 편이 안정적.

---

## 15. CEO Office 계정에서 이어서 해야 할 다음 작업

**즉시 (Day 0~1)**
1. 레포 접근 권한 확보: `bstars00-rgb/ota`의 **소유권/협업자 권한**을 CEO Office 계정으로 이전 또는 초대 (§17 리스크 참조).
2. 로컬에 클론 후 실행 확인: `git clone` → `npx -y serve -l 4178 .` → `index.html` 정상 렌더 확인.
3. GitHub Pages 배포 정상 확인: https://bstars00-rgb.github.io/ota/ (새 계정으로 레포가 옮겨지면 Pages URL도 바뀔 수 있음 — 링크 갱신 필요).
4. **§14 필수 규칙 숙지** — 새 AI/담당자가 이걸 모르면 폐지된 기능을 되살리거나 정책을 위반할 수 있음.

**단기 (1~2주)**
5. `PROJECT_STATUS.md` 최신화(최근 커밋 반영) + 폐지 페이지 참조 문서 정리.
6. **README.md 신규 작성**(현재 없음) — 이 handover.md 요약 + 실행법.
7. 백로그 우선순위 재정렬 (`PROJECT_STATUS.md` 미구현 + `QA_CHECKLIST.md §14`).

**중기 (실서비스화)**
8. **ELLIS 백엔드 실제 구현 착수** — `ELLIS_API_BACKOFFICE.md`의 API 22종을 실제 서버로. 프론트 `data.js` 목업 → 실 API로 점진 교체.
9. 실 결제(PG)·카톡 알림톡·항공/호텔 실시간 재고 연동.
10. (아키텍처 결정 필요) 현 정적 프로토타입을 유지하며 백엔드만 붙일지 vs `ARCHITECTURE.md`대로 Next.js로 재구축할지 **의사결정**.

---

## 16. 누락/확인 필요 항목 체크리스트

| 항목 | 상태 | 조치 |
|---|---|---|
| `README.md` | ❌ 없음 | **신규 작성 권장** (실행법·구조 — 본 handover.md 축약본) |
| `package.json` | ❌ 없음 | 정적이라 필수는 아니나, dev 스크립트 표준화 원하면 추가 검토 |
| `.env` / `.env.example` | ❌ 없음 (정상) | 비밀키 없음 — **추가 불필요** |
| `LICENSE` | ❌ 없음 | 필요 시 추가(사내 프로젝트면 생략 가능) |
| `.nojekyll` | ❌ 없음 | 현재 underscore 자산 없어 무해. Pages Jekyll 이슈 발생 시에만 추가 |
| GitHub Actions 워크플로 | ❌ 없음 | Pages 기본 배포 사용 중 — 명시적 CI 원하면 추가 |
| 샘플/목업 데이터 | ✅ 있음 | `data.js`가 곧 샘플 데이터 |
| 문서 세트 | ✅ 있음(11종) | 단 `PROJECT_STATUS.md` 최신화 필요 |
| 자동화 테스트 | ❌ 없음 | 수동 QA(`QA_CHECKLIST.md`)로 대체 중 |
| 이미지/에셋 폴더 | ⚠️ 없음 | 이미지 다수 외부/placeholder — 실 자산 확보 시 폴더 신설 |

## 17. 정리 필요 항목 (삭제하지 말고 표시만)

> 요청대로 **삭제/변경하지 않고** 표시만 합니다.
- **`PROJECT_STATUS.md` 최신성 갭** — 2026-06-12 이후 작업 미반영. (정리: 최신화 필요, 삭제 X)
- **`PRD.md` / `ARCHITECTURE.md` 스택 불일치** — 목표 스택(Next.js/TS/Supabase) ≠ 현재 정적 구현. (정리: "목표/현재" 구분 주석 추가 권장)
- **폐지 페이지 참조 잔재 의심** — trip-builder / packages / product 페이지는 현재 **파일 없음**이나 일부 문서가 언급 가능. (정리: 문서 내 링크 점검)
- **임시/중복/테스트 파일**: 프로젝트 폴더 최상위에는 **발견되지 않음**(스캔 결과 clean). `.claude/`는 git 제외됨. `node_modules`·`dist` 없음.
- 스크래치/테스트 산출물은 이 프로젝트 폴더 **밖**(임시 디렉터리)에 있어 이관 무관.

---

## 18. 이관 시 주의사항 및 리스크

1. **"이관"의 실체 = GitHub 레포 + 로컬 폴더 사본.** Claude Code의 세션 이력(`~/.claude/projects/...`)과 `.claude/` 설정은 **계정·PC 로컬**이라 자동 이동 안 됨. 소스는 **GitHub로 전달**하는 것이 정본.
2. **레포 소유권/권한** — 레포가 개인 계정 `bstars00-rgb` 소유이므로, CEO Office가 이어가려면 (a) 레포 **소유권 이전(Transfer)** 또는 (b) **협업자 초대** 또는 (c) **fork/clone 후 새 원격** 중 택1 필요. 소유권/URL이 바뀌면 **GitHub Pages URL과 문서 내 링크 갱신** 필요.
3. **프로젝트 규칙이 Claude 메모리에 있었음** — §14에 박제했으니 새 계정 AI는 반드시 이 문서를 먼저 읽어야 함(안 읽으면 폐지 기능 부활·정책 위반 위험).
4. **문서-코드 스택 불일치** — 새 담당자가 `ARCHITECTURE.md`만 보고 "Next.js 앱"으로 오해할 수 있음. **실제는 정적 프로토타입**(본 문서 §0·§5 우선).
5. **로컬 `serve` 쿼리 드롭** 이슈(§8) — 로컬에서 파라미터 페이지 테스트 시 클린 URL 사용.
6. **민감정보 없음** — 이 폴더에는 `.env`·키·개인정보 없음(정적 목업). 이관 시 유출 리스크 낮음.
7. **바이너리/대용량 없음** — 총 ~11MB(대부분 `.git` 이력). 전달 부담 낮음.

---

## 19. 준비 상태 체크리스트 (이 프로젝트)

- [x] 코드 전체 커밋·푸시 완료 (main clean, 미커밋 0)
- [x] GitHub 원격 존재 + Pages 배포 동작
- [x] 실행법 문서화 (빌드 불필요, `serve` 4178)
- [x] 데이터/상태 구조 문서화 (`data.js`/`state.js`)
- [x] 외부 연동·키 유무 명시 (키 없음)
- [x] 완료/미완료/다음작업 정리
- [x] 프로젝트 필수 규칙 박제 (§14)
- [x] 리스크·주의사항 정리 (§18)
- [x] `handover.md` 생성 (본 문서)
- [ ] `README.md` 신규 작성 — **CEO Office 측 권장 후속**
- [ ] `PROJECT_STATUS.md` 최신화 — **후속**
- [ ] 레포 소유권/권한 이전 — **후속(계정 정책 결정 필요)**

---

_이 문서는 이관 준비용으로 생성됨(코드·설정 변경 없음). 최신 상태는 항상 `git log`가 정본._
