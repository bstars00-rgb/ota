# 오마이트립 (OhMyTrip / OMT)

한국인 대상 **아시아 아웃바운드 골프 관광 OTA** 프로토타입. 메인 상품은 **골프텔**(골프 + 호텔)입니다.

- **라이브**: https://bstars00-rgb.github.io/ota/
- **레포지토리**: https://github.com/bstars00-rgb/ota
- **상세 이관/현황 문서**: [handover.md](handover.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md)

---

## 30초 요약

- **무엇**: 골프텔(골프+호텔) 중심 OTA. 항공 결합형은 별도 상품 `golftel-air`, 항공·호텔 단품 및 동적 결합(`airhotel.html`)은 보조.
- **형태**: **빌드 없는 순수 정적 사이트** (Vanilla HTML/CSS/JS). npm 빌드·서버·DB **없음**.
- **데이터**: 실 DB/API 없음. 전부 [data.js](data.js)(목업) + [state.js](state.js)(브라우저 localStorage). **비밀키·`.env` 없음**.
- **백엔드(ELLIS)**: 실제 코드 없이 **MD 명세 문서로만** 존재 (의도된 설계 — [ELLIS_SPEC.md](ELLIS_SPEC.md)).
- **배포**: GitHub Pages (main 브랜치 자동 배포).

> ⚠️ [PRD.md](PRD.md)·[ARCHITECTURE.md](ARCHITECTURE.md)는 **미래 지향 목표 스택**(Next.js/TS/Supabase)을 적어둔 것으로 **현재 실제 코드와 다릅니다.** 실제는 정적 프로토타입입니다.

---

## 실행 방법

**빌드/설치 불필요.** 정적 서버만 있으면 됩니다.

```bash
# 방법 A — 권장 (.claude/launch.json에 정의됨: 서버명 omt-static, 포트 4178)
npx -y serve -l 4178 .
# 브라우저: http://localhost:4178

# 방법 B — 아무 정적 서버
python -m http.server 4178

# 방법 C — index.html 더블클릭 (일부 기능 제한 가능)
```

> **로컬 프리뷰 주의**: `serve`는 `foo.html`을 `foo`(클린 URL)로 301 리다이렉트하며 **쿼리스트링을 떨굽니다.** 파라미터가 필요한 페이지는 클린 URL로 접속하세요.
> 예: ❌ `/golftel.html?id=...` → ✅ `/golftel?id=gt-vn-danang-ba-na-4n`.
> GitHub Pages 배포본은 `.html?쿼리`를 그대로 유지하므로 이 문제가 없습니다.

**배포**: `main`에 push → GitHub Pages 자동 반영(약 1~2분). 별도 CI/CD 워크플로 없음.

---

## 프로젝트 구조

플랫 구조(하위 폴더 없음). 최상위에 전부 위치.

```
OTA/
├─ index.html                  # 홈 (진입점)
│
├─ [고객 페이지]
│   golftels.html golftel.html golftel-builder.html      # 골프텔 (핵심 SKU)
│   hotels.html hotel.html                               # 호텔 단품
│   flights.html flights-results.html airhotel.html      # 항공 · 항공+호텔 동적 결합
│   country.html search.html ai-planner.html             # 국가/검색/AI 플래너
│   cart.html checkout.html payment.html complete.html voucher.html   # 결제 플로우
│   mypage.html login.html                               # 회원
│   feed.html live.html creator.html creator-dashboard.html video-to-trip.html  # 콘텐츠/커머스
│   inbound.html group-booking.html mobile.html offline.html
│
├─ [백오피스 (ELLIS BackOffice, 다크 톤)]
│   admin-dashboard.html admin-bookings.html admin-products.html
│   admin-customers.html admin-cs.html admin-users.html
│   admin-settlement.html admin-cms.html
│   admin-channels.html admin-suppliers.html admin-analytics.html mapper.html
│
├─ data.js        # 중앙 목업 데이터 — 모든 페이지가 참조 (window.OMT.DATA)
├─ state.js       # localStorage 상태 + 헬퍼 (키 omt_*_v1)
├─ icons.js       # 이모지 → 라인 SVG 자동 치환
├─ sw.js          # PWA Service Worker
├─ manifest.json  # PWA 매니페스트
│
└─ [문서 .md]
    handover.md              # ⭐ 계정 이관 정본 (먼저 읽기)
    PRD.md ARCHITECTURE.md KICKOFF.md UI_SPECS.md
    PROJECT_STATUS.md QA_CHECKLIST.md
    ELLIS_SPEC.md ELLIS_API_BACKOFFICE.md
    BACKOFFICE_SPEC.md BACKOFFICE_GUIDE.md ALIMTALK_TEMPLATES.md
```

---

## 코어 파일 (먼저 이해할 것)

- **[data.js](data.js)** — 데이터 심장. `window.OMT.DATA`에 `GOLFTELS`·`HOTELS`·`GOLF_COURSES`·`FLIGHTS`·`AIRLINES`·`CHANNEL_MANAGERS`·`OWNERSHIP`·`PRODUCT_TYPES` 등. **ID 참조형 정규화** 구조(백엔드 ELLIS 마이그레이션 호환). `PRODUCTS`는 현재 `[]`(고정 자유여행 패키지 폐지).
- **[state.js](state.js)** — `window.OMT.State`. localStorage 래퍼 + 헬퍼(`get/set/add/remove/use/earn/increment`). 키 규칙 `omt_*_v1`. 예약·찜·마일리지·알림·회원등급·가격알리미 등.
- **[icons.js](icons.js)** — 전역 이모지를 라인 SVG로 자동 치환(TreeWalker + MutationObserver).
- **[sw.js](sw.js)** — PWA 오프라인 캐싱/폴백.

---

## ⭐ 프로젝트 필수 규칙 (반드시 준수)

전체·근거는 [handover.md](handover.md) §14 참조.

1. **메인 SKU는 골프텔**. 항공 결합형은 `golftel-air`로 분리 관리.
2. **국가별 오너십**: 일본·베트남 **직영**, 태국·필리핀 **프랜차이즈** (`OWNERSHIP` in `data.js`).
3. **백엔드 ELLIS는 MD 명세만** 유지(실코드 X). 프론트 변경 시 관련 MD 문서 **동반 갱신**.
4. **다크 모드 정책**: 고객 화면에 라이트/다크 토글 **추가 금지**. 운영 콘솔(백오피스)만 다크 톤 유지.
5. **에어텔(고정 자유여행 패키지) 폐지**: `PRODUCTS`·패키지 빌더 부활 금지. 단 **동적 항공+호텔 결합(`airhotel.html`)은 허용**.
6. **리워드는 마일리지 1종** (트립코인 폐지, 경쟁사 명칭·색 차용 금지).
7. **골프 채널 매니저**: GDO(일본)·GolfNow(글로벌)·카카오골프/XGOLF(한국)·Golfdigg(태국) 등 ELLIS 연동 대상.
8. **JS 제거 시**: 블록 주석 처리 말고 **완전 삭제** 후 검증.

---

## 개발 팁

- **JS 문법 검증**(빌드 없음): 외부 JS는 `node --check data.js`. 인라인 스크립트는 추출 후 `new Function()` 파싱 체크.
- **커밋 메시지**: 한글 메시지는 PowerShell here-string에서 깨질 수 있어 **파일로 커밋**(`git commit -F msgfile`) 권장.
- **QA**: 자동화 테스트 없음. [QA_CHECKLIST.md](QA_CHECKLIST.md) 기반 수동 검증.
- **캐시**: 최신 반영이 안 보이면 `serve` 재시작 + 브라우저 `Ctrl+Shift+R`.

---

## 알려진 백로그

- 실 백엔드(ELLIS) 미구현 — 전부 목업. API 명세([ELLIS_API_BACKOFFICE.md](ELLIS_API_BACKOFFICE.md))는 존재.
- 실 결제(PG)·카톡 알림톡·항공/호텔 실시간 재고 API 미연동.
- 자동화 테스트 없음(수동 QA).
- 다국어(i18n)·실 이미지 자산 후순위.
- **미정리**: `checkout.html`의 포인트 적립이 마일리지 단일 리워드 정책과 중복(통합 논의 필요).
