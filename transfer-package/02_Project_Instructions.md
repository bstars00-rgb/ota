# 02. 프로젝트 지침 (Project Instructions)

> 아래 규칙은 그동안 **Claude 개인 메모리**에 저장돼 이어져 온 결정들입니다. 계정을 옮기면 그 메모리는 함께 이동하지 않으므로 여기 **박제**합니다. 새 계정 담당자·AI는 이 규칙을 지켜야 일관성이 유지됩니다.

---

## A. 프로젝트 필수 규칙 / 결정사항 (반드시 준수)

1. **메인 SKU는 골프텔**. 항공 결합형은 `golftel-air`로 **분리** 관리.
   - UI에서 항공 옵션은 "골프투어로 보기" 등 명시적으로 다른 상품임을 드러냄. `PRODUCT_TYPES` enum(`data.js`)의 백엔드 키와 UI 라벨을 분리 사용.
2. **국가별 오너십 매트릭스**: 일본·베트남 **직영(direct, 마진 22.5%)**, 태국·필리핀 **프랜차이즈(franchise, 마진 15%)** (`OWNERSHIP` in `data.js`).
   - 골프텔 리스트·홈에서 **직영국(일본·베트남)을 상단 우선 노출**. "OMT 직영"/"OMT 파트너" 뱃지 구분.
   - 크리에이터 커미션: 직영 골프텔 10% / 프랜차이즈 5%. 헬퍼 `OMT.getOwnership(country)`, `OMT.isDirectRun(country)`.
3. **백엔드 ELLIS는 MD 명세만** 유지(실 서버 코드 작성 금지). 프론트 변경 시 관련 MD 문서를 **같은 사이클에 동반 갱신**.
   - 핵심 문서: `ELLIS_SPEC.md`(DDL·ChannelAdapter·API·견적 시퀀스), `ELLIS_API_BACKOFFICE.md`, `BACKOFFICE_SPEC.md`(권한 매트릭스·audit_logs·cms_*), `ALIMTALK_TEMPLATES.md`.
   - `server/`·`api/`·Express/Fastify 등 실코드 작성 금지. localStorage + mock data 패턴 유지. 백오피스 UI도 프론트 프로토타입(admin-*.html) + mock 데이터.
4. **다크 모드 정책**: 사용자(고객) 화면에 **라이트/다크 토글 추가 금지**. `prefers-color-scheme: dark` 미디어쿼리도 추가하지 않음.
   - 운영 콘솔(백오피스 admin-*, mapper, creator-dashboard)의 **다크 톤은 페이지 디자인 자체**이므로 유지(이건 다크 모드가 아님).
5. **에어텔(고정 자유여행 패키지) 폐지**: 고정 `PRODUCTS`·패키지 빌더 **부활 금지**.
   - 삭제된 페이지(부활 금지): `trip-builder.html`, `packages.html`, `product.html` (현재 파일 없음).
   - `data.js`의 `PRODUCTS`는 `[]`로 비움. `PRODUCT_TYPES.PACKAGE` enum 키는 백엔드 호환용으로만 잔존.
   - **예외 — 동적 항공+호텔 결합은 허용**: `airhotel.html`(따로예약 vs 묶음 할인 비교, FLIGHTS/HOTELS 실데이터 동적 계산)은 유지·확장 OK.
   - 상품 링크는 id 접두사로 분기: `gt-`→golftel.html, `h-`→hotel.html.
6. **리워드는 마일리지 1종** (트립코인 폐지).
   - `state.js`의 `miles`(`omt_miles_v1`) 단일 키. 헬퍼 `getMiles`/`useMiles`/`earnMiles`. 환산 **1마일 = 1원**.
   - **2026-07-10 완료**: 중복 지갑이던 "포인트"(`omt_points_balance`, `getPointsBalance`/`addPoints`)를 **완전 제거**하고 전부 miles로 통합. 화면 라벨 "포인트/P" → "마일리지/마일". 내부 식별자(`type:'points'`·mypage tab key `points`·`POINTS_HISTORY` const·`u.points` 필드)는 ELLIS 원칙에 따라 유지.
   - **경쟁사(시트립·인터파크 등) 고유 명칭·색 차용 금지** — 패턴/UX는 참고하되 명칭은 오마이트립 브랜드로.
   - **외부 리워드는 별개로 유지**: 네이버페이의 "네이버 포인트", 항공사 FFP(스카이팀·대한항공 마일리지)는 통합 대상 아님.
7. **골프 티시트/채널 매니저 연동 대상**: GDO(일본)·GolfNow(글로벌)·카카오골프/XGOLF(한국)·Golfdigg(태국) 등 (`CHANNEL_MANAGERS` in `data.js`).
   - 실시간(⚡) vs 견적(24h) 모드 구분이 UI(golftel.html 슬롯 뱃지·필터)에 의미 있게 작동.
8. **JS 제거 시**: 블록 주석 처리 말고 **완전 삭제** 후 검증.
9. **ELLIS 마이그레이션 호환 데이터 설계 유지**: 안정적 슬러그 ID, 객체 임베드 대신 ID 참조(`hotelId`·`courseIds[]`), 가격 단위 명시(`priceBasis`), 포함사항 boolean 정규화(`inclusions`), UI 라벨과 분리된 백엔드 enum. 임베드형 데이터 남발 금지.

---

## B. 반복적으로 사용하는 프롬프트 / 작업 패턴

- **JS 문법 검증(빌드 없으니 수동)**:
  - 외부 JS: `node --check data.js` (state.js/icons.js/sw.js 동일).
  - 인라인 스크립트: `<script>` 블록 추출 후 `new Function(block)`으로 파싱 체크.
    예) `node -e '…fs.readFileSync…정규식으로 <script> 추출… new Function(block)…'`
- **커밋 메시지**: 한글 메시지는 PowerShell here-string에서 깨질 수 있으므로 **파일로 커밋** 권장 — `git commit -F msgfile`.
- **로컬 프리뷰**: `serve`가 파일을 캐시할 수 있음 → 최신 반영 안 보이면 서버 재시작 + 브라우저 `Ctrl+Shift+R`(+ URL `?cb=타임스탬프`).
- **스크린샷 타임아웃 회피**: hero setInterval 등이 있는 페이지는 스크린샷이 멈출 수 있어 DOM 조회/eval 검증이 안정적.
- **변경 후 브라우저 런타임 검증**: 정적 서버(`omt-static`, 4178)를 띄우고 실제 페이지에서 DOM/상태를 eval로 확인(자동 테스트 없음).

---

## C. 답변 및 작업 기준

- **문서-코드 정본 우선순위**: 최신 상태는 항상 `git log`가 정본. `PROJECT_STATUS.md`는 스냅샷일 수 있음(2026-06-12 이후분은 델타 섹션/커밋 참조).
- **문서 동반 갱신**: 프론트 페이지 변경/추가 시 영향받는 MD 문서를 같은 사이클에 함께 업데이트(특히 ELLIS_SPEC.md DDL/API, BACKOFFICE_SPEC.md 권한 매트릭스).
- **QA**: 자동화 테스트 없음. `QA_CHECKLIST.md`(v4.0, 수동) 기반 검증.
- **확인되지 않은 내용은 추정하지 말 것** — "확인 필요"로 표시.
- **기존 작업 임의 변경 금지** — 복원/이전 상태를 먼저 검증한 뒤 최우선 작업 제시.
