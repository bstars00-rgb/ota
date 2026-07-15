# 04. 기술 컨텍스트 (Technical Context)

---

## A. 시스템 구조

- **프론트엔드**: 빌드 없는 **순수 정적 사이트**. 각 HTML이 인라인 `<style>`/`<script>` + 공통 외부 JS 4종(`data.js`/`state.js`/`icons.js`/`sw.js`)을 로드.
- **상태 저장**: 브라우저 **localStorage**(`state.js`, 키 네이밍 `omt_*_v1`). 서버 세션 없음.
- **데이터**: 정적 목업(`data.js`, `window.OMT.DATA`). 실 API·DB 없음.
- **백엔드(ELLIS)**: 실 코드 없이 **MD 명세만**. 향후 채널 어댑터 계층(GDO/GolfNow/Golfmanager/KakaoGolf/XGolf/Golfdigg/Direct)으로 티시트 시스템 연동 설계.

### ELLIS 채널 매니저 통합 아키텍처 (제안, 문서상)
```
[OMT Frontend (golftel.html)]
       ↓ slot 선택
[ELLIS Booking Service]
       ↓ /api/channel/quote
[Channel Adapter Layer]
   ├─ GDOAdapter (일본) ├─ GolfNowAdapter (글로벌 fallback)
   ├─ GolfmanagerAdapter (유럽) ├─ KakaoGolfAdapter / XGolfAdapter (한국 인바운드)
   ├─ GolfdiggAdapter (태국) └─ DirectAdapter (OMT 직영 베트남/일본)
       ↓ 시스템별 API
[Tee Sheet Systems]
```
- 데이터 모델 시사점: `GOLF_COURSES`에 `channelManager`(어댑터 ID)·`realTimeBooking`(boolean), Slot에 `inventoryStatus`('available'|'on_request'|'closed'). 직영 코스=100% 실시간 확정, 프랜차이즈/파트너=채널 응답에 따라 실시간 vs 견적(24h).

---

## B. 기술 구성 (실제 구현 기준)

| 영역 | 실제 사용 | 비고 |
|---|---|---|
| 마크업/스타일 | 순수 HTML5 + CSS(인라인 `<style>`, CSS 변수 토큰) | 프레임워크·전처리기 없음 |
| 로직 | Vanilla JavaScript(ES6+), 인라인 `<script>` + 외부 4 JS | 번들러·트랜스파일 없음 |
| 상태 저장 | 브라우저 localStorage(`state.js`, `omt_*_v1`) | 서버 세션 없음 |
| 데이터 | 정적 목업(`data.js`, `window.OMT.DATA`) | 실 API·DB 없음 |
| 폰트/아이콘 | Pretendard(jsDelivr CDN), Noto Sans KR(Google Fonts), 자체 라인 SVG(`icons.js`) | |
| 지도 | OpenStreetMap iframe 임베드 | Kakao/Google Maps 키 불필요 |
| PWA | `manifest.json` + `sw.js`(Service Worker, 캐시 `omt-v3-2026-07-09`) | |
| 배포 | GitHub Pages(main 자동) | 빌드 파이프라인·Actions 워크플로 없음 |
| 로컬 프리뷰 | `serve`(npx, 포트 4178) | `.claude/launch.json`에 정의(git 제외) |

> ⚠️ `ARCHITECTURE.md`의 Next.js 14 / TypeScript / Tailwind / Zustand / Prisma / NextAuth / Kakao Maps 등은 **"향후 프로덕션 목표 스택"**이며 **현재 코드에는 없습니다.** 실제 런타임 의존성은 로컬 프리뷰용 `serve`(전역 npx 실행)뿐, `package.json` 없음.

---

## C. 개발 환경

- **OS(작성 기준)**: Windows 11, 셸 PowerShell(주) + Git Bash 병용.
- **프로젝트 경로**: `C:\Users\LENOVO\Desktop\OTA`
- **필수 도구**: git, Node.js(문법 체크·`serve` 실행용), 브라우저.
- **빌드/설치 불필요**. 정적 서버만 있으면 실행.

---

## D. 데이터 구조 (핵심)

### `data.js` — `window.OMT.DATA`
- 주요 컬렉션: `CITIES`, `AIRPORT_CITIES`, `HOTELS`, `GOLFTELS`, `GOLF_COURSES`, `FLIGHTS`, `AIRLINES`, `CHANNEL_MANAGERS`, `OWNERSHIP`, `INITIAL_BOOKINGS`, `COUPONS`, `POINTS_HISTORY`, `NOTIFICATIONS`, `USER`, `CREATOR_GRADES` 등.
- `PRODUCTS` = **`[]`**(고정 자유여행 패키지 폐지). `PRODUCT_TYPES` enum 유지(golftel/golftel-air/package/hotel/flight/activity/rent).
- `OWNERSHIP`: `{ 일본:{model:'direct',margin:0.225}, 베트남:{direct,0.225}, 태국:{franchise,0.15}, 필리핀:{franchise,0.15} }`. 헬퍼 `OMT.getOwnership()`/`OMT.isDirectRun()`.
- 설계 원칙: ID 참조형 정규화(ELLIS 호환) — 슬러그 ID, ID 참조(`hotelId`·`courseIds[]`), `priceBasis`, `inclusions{}` boolean, UI 라벨↔백엔드 enum 분리.

### `state.js` — `window.OMT.State`
- localStorage 래퍼 + 헬퍼(`get/set/add/remove/use/earn/increment` 패턴). 키 `omt_*_v1`.
- 도메인: 장바구니, 예약(bookings), 찜(wishlist), 소셜(follow/like/save), 리뷰, 쿠폰, **마일리지(단일 리워드 `omt_miles_v1`: `getMiles`/`useMiles`/`earnMiles`, 기본 잔액 12,500)**, 검색기록/최근본, 알림, 라이브 히스토리, 저장여행, 회원등급(bronze~platinum, discount), 크리에이터 어트리뷰션(매직링크 `?ref=`, 7일 TTL, 라스트클릭), pub/sub 이벤트.
- ⚠️ **제거됨(부활 금지)**: `omt_points_balance`, `getPointsBalance`, `addPoints`.

### `icons.js`
- 전역 이모지를 Lucide 계열 라인 SVG로 자동 치환(TreeWalker + MutationObserver). 각 HTML 하단 `<script src="icons.js">`. (index 헤더 nav는 FOUC/캐시 방지로 SVG 직접 하드코딩 예외.)

### `sw.js`
- PWA 오프라인 캐싱/폴백. `CACHE_NAME = 'omt-v3-2026-07-09'`. 파일 변경 배포 시 재방문자 즉시 반영하려면 이 버전 문자열을 올려야 함.

---

## E. 연동 정보

| 서비스 | 용도 | 키 필요 | 형태 |
|---|---|---|---|
| GitHub (bstars00-rgb/ota) | 소스 관리 + Pages 호스팅 | 계정 권한 | main 자동 배포 |
| Pretendard (cdn.jsdelivr.net) | 폰트 | 불필요 | `<link>` CDN |
| Google Fonts (Noto Sans KR) | 폰트 | 불필요 | `<link>` CDN |
| OpenStreetMap | 위치 지도 | 불필요 | `<iframe>` 임베드 |

- **결제/PG·카카오 알림톡·항공/호텔 실 API·지도 API(키형)** — 전부 **미연동(목업/시뮬레이션)**.
- **`.env` 없음. 환경변수·비밀키·토큰 없음.** (정적 사이트라 서버 시크릿 불필요)
- **데이터베이스/Supabase 없음.** localStorage만 사용.

---

## F. 실행 방법

**빌드/설치 불필요.**
```bash
# 방법 A — 권장 (.claude/launch.json: 서버명 omt-static, 포트 4178)
cd OTA
npx -y serve -l 4178 .
# 브라우저: http://localhost:4178

# 방법 B — 아무 정적 서버
python -m http.server 4178

# 방법 C — index.html 더블클릭 (일부 기능 제한 가능)
```

> **⚠️ 로컬 `serve` 쿼리 드롭 이슈**: `serve`는 `foo.html`을 `foo`(클린 URL)로 301 리다이렉트하며 **쿼리스트링을 떨굽니다.** 파라미터 페이지는 클린 URL로 접속.
> 예: ❌ `/golftel.html?id=...` → ✅ `/golftel?id=gt-vn-danang-ba-na-4n`.
> **GitHub Pages 배포본은 `.html?쿼리`를 그대로 유지**하므로 이 문제 없음.

**배포**: `main`에 push → GitHub Pages 자동 반영(약 1~2분). CI/CD·Actions 워크플로 파일 없음(Pages 기본 브랜치 배포).

**`.claude/launch.json`** (git 제외됨 — 새 계정/PC에서 재생성 필요):
```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "omt-static", "runtimeExecutable": "npx", "runtimeArgs": ["-y","serve","-l","4178","."], "port": 4178 }
  ]
}
```
