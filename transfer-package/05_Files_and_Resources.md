# 05. 파일 및 리소스 (Files & Resources)

> 플랫 구조(하위 폴더 없음, 이 `transfer-package/` 제외). 전부 최상위 위치. 2026-07-14 기준.

---

## A. 코어 JS (반드시 먼저 이해 — 4개)

| 파일 | 용도 |
|---|---|
| `data.js` (~136KB) | 중앙 목업 데이터. `window.OMT.DATA` — 모든 페이지가 참조. ID 참조형 정규화(ELLIS 호환) |
| `state.js` | `window.OMT.State`. localStorage 상태 + 헬퍼(예약/찜/마일리지/알림/등급/어트리뷰션 등) |
| `icons.js` | 이모지 → 라인 SVG 자동 치환 |
| `sw.js` | PWA Service Worker(오프라인 캐싱/폴백, 캐시 `omt-v3-2026-07-09`) |

## B. 고객 페이지 (HTML)

| 파일 | 용도 |
|---|---|
| `index.html` | 홈(진입점) |
| `golftels.html` / `golftel.html` / `golftel-builder.html` | 골프텔 목록 / 상세(라운드별 티오프·골프+항공) / 빌더 |
| `hotels.html` / `hotel.html` | 호텔 목록(지도·비교·캘린더) / 상세(Lightbox) |
| `flights.html` / `flights-results.html` | 항공 검색 / 결과(가격비교·운임3종·알리미) |
| `airhotel.html` | 항공+호텔 동적 결합(따로예약 vs 묶음) |
| `country.html` | 국가별 페이지(검색 위젯) |
| `search.html` | 통합검색 |
| `ai-planner.html` | AI 여행 플래너(음성 mock + 키워드 Q&A) |
| `cart.html` / `checkout.html` / `payment.html` / `complete.html` / `voucher.html` | 결제 플로우 |
| `mypage.html` / `login.html` | 마이페이지(등급·마일리지·예약·리뷰) / 로그인 |
| `feed.html` / `live.html` / `creator.html` / `creator-dashboard.html` | 크리에이터 피드 / 라이브 커머스 / 크리에이터 / 대시보드(어트리뷰션) |
| `video-to-trip.html` | 영상으로 예약(콘텐츠→골프텔 변환 데모) |
| `inbound.html` / `group-booking.html` | 인바운드 SEO / 단체 예약 |
| `mobile.html` / `offline.html` | 모바일 앱 목업(PWA) / 오프라인 폴백 |

## C. 백오피스/도구 (HTML)

| 파일 | 용도 | Phase(구상) |
|---|---|---|
| `admin-dashboard.html` | 🏠 대시보드 | 1 |
| `admin-bookings.html` | 🎫 예약 운영 | 1 |
| `admin-products.html` | ⛳ 상품 관리 | 1 |
| `admin-customers.html` | 👥 회원 관리 | 2 |
| `admin-cs.html` | 💬 CS 운영 | 1 (⚠️ 완성도 확인 필요) |
| `admin-settlement.html` | 💰 정산 관리 | 2 |
| `admin-cms.html` | 📝 CMS | 3 |
| `admin-users.html` | 🔐 권한·계정 | 1 (⚠️ 완성도 확인 필요) |
| `admin-channels.html` / `admin-suppliers.html` / `admin-analytics.html` | 채널/공급사/분석 시스템 콘솔 | — |
| `mapper.html` | 프론트 모델 ↔ ELLIS 필드 매핑 도구 | — |

- 4 ROLE: SUPER_ADMIN / MANAGER / OPERATOR / VIEWER (권한 매트릭스는 `BACKOFFICE_SPEC.md §2`).

## D. 설정/PWA

| 파일 | 용도 | git |
|---|---|---|
| `manifest.json` | PWA 매니페스트 | 포함 |
| `.gitignore` | `.claude/` node_modules dist .env 등 무시 | 포함 |
| `.claude/launch.json` | 로컬 프리뷰 설정(omt-static, 4178) | **제외**(재생성 필요) |

## E. 문서 (.md — 13개)

| 파일 | 용도 | 최신성 |
|---|---|---|
| `README.md` | 실행법·구조·필수 규칙 요약 | 신규(2026-07-10) |
| `handover.md` | 이전 이관 문서(OPS→CEO Office) | 2026-07-08 |
| `PRD.md` | 제품 요구사항/비전/KPI | ⚠️ 스택 서술은 "목표" |
| `ARCHITECTURE.md` | 목표 아키텍처 | ⚠️ 현재 코드 아님 |
| `KICKOFF.md` | 킥오프 | — |
| `UI_SPECS.md` | UI 규격 | — |
| `PROJECT_STATUS.md` | 진행 상태/점수/로드맵 | 헤더 2026-07-10, 상세표는 06-12 스냅샷 |
| `QA_CHECKLIST.md` | 수동 QA 체크리스트 v4.0 | — |
| `ELLIS_SPEC.md` | ELLIS DDL·API·견적 시퀀스 | 2026-07-09 |
| `ELLIS_API_BACKOFFICE.md` | ELLIS API 22종·백오피스 API | 2026-07-09 |
| `BACKOFFICE_SPEC.md` | 백오피스 8모듈/권한/스키마 | — |
| `BACKOFFICE_GUIDE.md` | 백오피스 운영 가이드 | — |
| `ALIMTALK_TEMPLATES.md` | 카톡 알림톡 템플릿 10종 | — |

## F. 이 이전 패키지 (transfer-package/ — 7개 + 본 목록)
`01_Project_Overview.md` `02_Project_Instructions.md` `03_Progress_and_Decisions.md` `04_Technical_Context.md` `05_Files_and_Resources.md` `06_Next_Actions.md` `07_Account_Transfer_Prompt.md`

---

## G. 외부 링크 및 참고 자료

| 항목 | URL |
|---|---|
| 레포지토리 | https://github.com/bstars00-rgb/ota |
| 라이브(GitHub Pages) | https://bstars00-rgb.github.io/ota/ |
| Pretendard 폰트 | cdn.jsdelivr.net (CDN, 키 불필요) |
| Google Fonts (Noto Sans KR) | fonts.google.com (CDN, 키 불필요) |
| OpenStreetMap | openstreetmap.org (iframe, 키 불필요) |

> ⚠️ 레포/Pages URL은 **소유권 이전 시 변경될 수 있음** — 문서 내 링크 갱신 필요.

---

## H. 새 계정(OPS)에 다시 업로드/재생성해야 할 것

| 대상 | 방법 | 비고 |
|---|---|---|
| **소스 전체** | GitHub 레포로 전달(정본) | 소유권 이전 or fork/clone or 협업자 초대 |
| 프로젝트 폴더 사본 | `git clone` | 로컬 작업용 |
| `.claude/launch.json` | **재생성**(git 제외됨) | 04번 문서 F의 JSON 사용 |
| 이 `transfer-package/` 7종 | 새 프로젝트에 첨부/입력 | 07번을 프로젝트 지침으로 입력 |
| Claude 개인 메모리(규칙) | **수동 이전** | 계정 메모리는 자동 이동 안 함 → 02번 문서로 대체 |
| `.env`/API Key | **없음** | 정적 사이트라 재설정 대상 없음 |
