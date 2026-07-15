# 03. 진행 내용과 의사결정 (Progress & Decisions)

---

## A. 완료된 작업

### 제품/프론트
- 골프텔 중심 정보구조 전환 + 고객/백오피스/모바일 **40페이지** 인터랙티브 프로토타입.
- **골프텔 상세**(`golftel.html`): 갤러리·객실 옵션·**라운드별 티오프 선택**(R1/R2/R3 탭 + 코스 필터 + 시간대 아코디언)·리뷰·FAQ·위치 지도. 필요 객실수 계산. **골프+항공 실시간 항공편 선택**(고정 추정치 → 실제 편 선택).
- **항공**: 검색(`flights.html`) → 결과(`flights-results.html`, 7일/30일 가격 비교·운임 3종 비교 모달·가격 알리미·결제 여정 카드).
- **호텔**: 목록(`hotels.html`, 지도/비교/가격 캘린더 hover)·상세(`hotel.html`, Lightbox·비슷한 호텔). 목록 미표시 TDZ 버그 수정.
- **항공+호텔 동적 결합**(`airhotel.html`): 따로예약 vs 묶음 할인 비교(FIT).
- **AI 플래너**(`ai-planner.html`): 음성 인식 mock + 키워드 Q&A + 골프 의도 감지. 추천 카드에 찜·장바구니·티오프 정보 → 대화→예약 파이프라인.
- **결제 플로우**: cart → checkout → payment(10% 실패 시뮬) → complete → voucher.
- **회원**: 로그인, 마이페이지(등급 5단·마일리지·예약·리뷰·문의·저장여행), 통합검색.
- **콘텐츠/커머스**: 크리에이터 피드(`feed.html`)·라이브 커머스(`live.html`)·인바운드 SEO(`inbound.html`)·크리에이터 대시보드(**매직 링크 어트리뷰션**: 링크→예약 전환 추적)·**영상으로 예약**(`video-to-trip.html`, 콘텐츠→골프텔 변환 데모).
- **모바일 앱 목업**(`mobile.html`): PWA(`manifest.json` + `sw.js` 오프라인 폴백 `offline.html`).
- **리워드 마일리지 단일화**(트립코인 폐지 → 2026-07-10 포인트까지 완전 통합), 회원등급 5단 자동 산정, 할부, 다이내믹 패키지.
- 전 사이트 이모지→라인 SVG(`icons.js`) + 폰트 현대화(Pretendard tabular-nums) + 헤더 레이아웃 안정화.
- 폰트 현대화, index 헤더 nav 이모지→인라인 라인 SVG 하드코딩(FOUC/캐시 무관).

### 백오피스/문서 (ELLIS)
- **ELLIS BackOffice 8모듈** 구상 + 프로토타입: admin-dashboard/bookings/products/customers/cs/users/settlement/cms + 시스템 콘솔(channels/suppliers/analytics/mapper). 4 ROLE(SUPER_ADMIN/MANAGER/OPERATOR/VIEWER).
- 백엔드 ELLIS 연동/백오피스/카톡 알림톡 **MD 문서 세트** 완비.

### 이관 후속 (이번 세션, 2026-07-14)
- **README.md 신규 작성**(커밋 `4c9cd7b`) — 그동안 없던 파일.
- **PROJECT_STATUS.md 최신화**(커밋 `4c9cd7b`) — 헤더 2026-07-10, "최근 변경 이력" 델타 섹션, 실측 규모(HTML 40) 반영.
- **포인트/마일리지 중복 지갑 → 마일리지 단일 통합**(커밋 `fa6d73a`, 10파일) — 아래 D 참조. 브라우저 런타임 검증(잔액 12,500 마일, 적립/사용/이력 정상, 콘솔 에러 0) 완료 후 push.

---

## B. 진행 중인 작업과 진행률

| 항목 | 상태 | 진행률(추정) | 비고 |
|---|---|---|---|
| 인터랙티브 프론트 프로토타입 | 사실상 완성 | ~95% | 상세 이미지 다수 placeholder, 세부 폴리싱 잔여 |
| 백오피스 8모듈 | 일부 구현 | ~60% | ⚠️ 확인 필요 — admin-cs/admin-users 등 일부 "미구현" 표기 이력(메모리 기준). 실제 파일은 존재하나 완성도 상이 |
| ELLIS 백엔드(MD 명세) | 명세만 | 문서 100% / 구현 0% | 실코드는 의도적으로 미작성 |
| SW 캐시 버전업(재방문자 즉시 반영) | **미결정/미실행** | 0% | ⚠️ 이번 세션에서 사용자에 질문했으나 답변 전. `sw.js` = `omt-v3-2026-07-09` 그대로 |
| 문서 최신화(폐지 페이지 참조 정리) | 부분 | — | 일부 문서가 폐지된 trip-builder/packages/product 언급 가능(점검 필요) |

> 진행률은 자동 산정치가 아닌 **추정**입니다. 정밀 수치는 ⚠️ 확인 필요.

---

## C. 주요 결정사항 (요약)

| # | 결정 | 시점 | 근거 |
|---|---|---|---|
| 1 | 골프텔 중심 모델로 피벗 | 2026-05-20 | 몽키트래블 검증 시장 + 항공 결합 차별화. 항공은 별도 SKU |
| 2 | 국가별 오너십(직영/프랜차이즈) 매트릭스 | — | 마진·노출·커미션 기준. 일본·베트남 직영 / 태국·필리핀 프랜차이즈 |
| 3 | 백엔드 ELLIS는 MD 명세만 | — | 사용자 지시. 실 개발은 별도 개발팀 추후 진행 |
| 4 | 다크 모드 불필요(고객 화면) | 사이클 17 직후 | 디자인 일관성·우선순위. 운영 콘솔 다크 톤은 별개 |
| 5 | 트립코인 폐지 → 마일리지 통합 | 사이클 36 | "트립코인"이 경쟁사 Trip.com 명칭 차용 + 역할 중복 |
| 6 | 에어텔 고정 패키지 폐지 | 사이클 38 | FIT 트렌드 부적합. trip-builder/packages/product git rm |
| 7 | 동적 항공+호텔 결합은 허용 | 사이클 39 | 사용자 요청. airhotel.html은 고정 PRODUCTS 부활 아님 |
| 8 | 포인트 지갑까지 마일리지로 완전 통합 | 2026-07-10 | 마일리지 단일 리워드 정책 완결(중복 지갑 제거) |

---

## D. 변경 이력 (git log 최신 기준 — 정본)

```
fa6d73a refactor(reward): 포인트/마일리지 중복 지갑 → 마일리지 단일 리워드 통합   ← 2026-07-10 (이번 세션)
4c9cd7b docs: 계정 이관 후속 — README 신규 + PROJECT_STATUS 최신화              ← 2026-07-10 (이번 세션)
ba679e6 feat(golftel): 티오프 슬롯 시간대 아코디언 — 스크롤 91% 감소
9bf031c chore(pwa): SW 캐시 버전 업 (omt-v3)
aac4d32 feat: '영상으로 예약' 신규 페이지 — 콘텐츠→골프텔 변환 데모 (video-to-trip.html)
01c3d60 feat(creator): 매직 링크 어트리뷰션 — 크리에이터 링크→예약 전환 추적
9eb2229 feat(ai-planner): 추천 카드에 찜·장바구니·티오프 정보 추가
580fead docs: 이관 문서 handover.md 추가 (OPS → CEO Office 계정 이관용)
81b4244 feat(golftel): 티오프 선택을 라운드별 방식으로 재설계
0dd7dc5 fix(golftel): 상세 헤더 리뷰 개수 [object Object] 수정
cff6b2a chore(hotels): '인기 호텔 도시' 그리드 삭제
2cda425 fix(hotels): 숙소 목록 미표시(TDZ) + 트러스트 지표 제거
7d966f3 feat(golftel): 골프+항공 실시간 항공편 선택
950ab90 fix(golftel): 예약 로직 명확화
e6deca6 fix(country): 검색 위젯 캘린더 잘림/밀림 수정
568fa5d fix(header): GNB 과밀 시 글자 세로 줄바꿈 방지
c3ee48b fix(index): 헤더 nav 이모지 → 인라인 라인 SVG 하드코딩
```

### 2026-07-10 마일리지 통합 상세 (참고 — 되돌리기 어려운 변경)
- **제거**: `state.js`의 `KEYS.points`(`omt_points_balance`), `getPointsBalance()`, `addPoints()` + export.
- **연결 변경**: checkout 예약 적립·mypage 리뷰 보너스/대시보드/마일리지 탭/프로필 통계·mobile 프로필·메뉴 → 전부 `getMiles().balance` / `earnMiles(...)`.
- **라벨 변경**: mypage·mobile·ai-planner·live·admin-customers·admin-dashboard·admin-users·data.js(알림 n5/n6·POINTS_HISTORY 라벨·silver tier 혜택) → "마일리지/마일".
- **유지(내부 식별자)**: `type:'points'`(알림 카테고리), mypage tab key `points`, `mypage.html#points` 링크, `POINTS_HISTORY` const, admin `u.points` 데이터 필드.
- **유지(외부 리워드)**: `checkout.html` 네이버페이 패널의 "네이버 포인트"(외부 PG), 항공사 FFP.
