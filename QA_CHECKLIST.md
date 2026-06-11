# 오마이트립 프론트엔드 프로토타입 — QA 체크리스트

> **v3.0 업데이트 (2026-06-11 · 사이클 18 직후)**: 사이클 10~18 신규 기능 풀 커버.
> 추가된 영역: 백오피스 8 모듈 · 그룹 예약 · AI 플래너 5종 · 모바일 6종 · 동선 추천 · 알림 센터

> **v2 추가 페이지**: `feed.html` · `flights.html` · `hotels.html` · `product.html` · `cart.html` · `mypage.html` · `creator.html` · `creator-dashboard.html` · `login.html` · `mobile.html`
> **v3 추가 페이지**: `admin-dashboard.html` · `admin-bookings.html` · `admin-products.html` · `admin-customers.html` · `admin-cs.html` · `admin-settlement.html` · `admin-cms.html` · `admin-users.html` · `group-booking.html`

> **대상 파일**: 37 페이지 (사용자 26 + 모바일 1 + 크리에이터 1 + 백오피스 8 + 그룹 예약 1)
> **테스트 환경**: Chrome 최신 / Safari 최신 / Firefox 최신 · DevTools Device Toolbar
> **체크리스트 포맷**: `[ ] 항목 — 확인 방법 — 통과 기준`
> **참고 문서**: BACKOFFICE_GUIDE.md (운영자 시나리오) · ELLIS_API_BACKOFFICE.md (API 명세) · BACKOFFICE_SPEC.md (시스템 설계)

---

## 0. 사전 준비

- [ ] 모든 파일이 동일 디렉토리(`C:\Users\LENOVO\Desktop\OTA\`)에 있는가 — 탐색기 확인 — 6개 HTML 파일 존재
- [ ] 인터넷 연결 확인 — 브라우저 접속 — Google Fonts / Unsplash CDN 로드 성공
- [ ] `sessionStorage` 초기화 — DevTools → Application → Storage → Clear site data — 깨끗한 상태에서 시작

---

## 1. 반응형 UI 체크

### 1.1 브레이크포인트별 공통 (모든 페이지)

| [ ] | 항목 | 확인 방법 | 통과 기준 |
|---|---|---|---|
| [ ] | **375px (iPhone SE)** 가로 스크롤 | DevTools → iPhone SE 모드 → 모든 페이지 스크롤 | 가로 스크롤바 없음, `<html>` overflow-x 없음 |
| [ ] | **768px (iPad)** 레이아웃 전환 | DevTools → iPad 모드 | 태블릿용 2단 그리드 적용, 모바일 요소(햄버거) 노출 기준 일관 |
| [ ] | **1280px (Desktop)** 최대 너비 | DevTools → Responsive → 1280px | `max-width: 1280px` 중앙 정렬, 좌우 여백 균일 |
| [ ] | 폰트 크기 | 모든 화면에서 본문 읽기 | 본문 최소 13px, 14px 이상 권장 |
| [ ] | 터치 영역 (모바일) | 375px에서 버튼 클릭 | 최소 44×44px 터치 영역 |
| [ ] | 이미지 비율 유지 | 모든 화면에서 카드 이미지 확인 | `aspect-ratio` 적용되어 찌그러짐 없음 |

### 1.2 `index.html` (메인 홈)

- [ ] **375px** 히어로 텍스트 가독성 — 모바일 뷰 히어로 확인 — 타이틀 26px 이하로 2줄 이내
- [ ] **375px** 국가 카드 가로 스크롤 — 좌우 스와이프 — 스냅 스크롤 작동, 각 카드 44% 너비
- [ ] **375px** 크리에이터 쇼츠 가로 스크롤 — 좌우 스와이프 — 스냅 스크롤 작동, 9:16 비율 유지
- [ ] **375px** 오리지널 상품 2열 그리드 — 스크롤 — 2열 유지, 카드 높이 균일
- [ ] **768px** 국가 섹터 3×2 그리드 — 768px 뷰 — 국가 6개가 3열 2행
- [ ] **768px** 항공권 2열 — 특가 항공권 섹션 — 2열 카드 그리드
- [ ] **1280px** 국가 섹터 6열 한 줄 — PC 뷰 — 1열에 6개 국가 카드 균일 배치
- [ ] **1280px** 오리지널 4열 — PC 뷰 — 4개 카드 한 줄
- [ ] **전 화면** 플로팅 AI 버튼 위치 — 스크롤하며 확인 — PC 우측 하단 / 모바일 하단 탭바 위 겹침 없음
- [ ] **모바일 전용** 하단 탭바 5개 — 375px 하단 — 홈/검색/피드/장바구니/MY 5개 표시, safe-area-inset 반영

### 1.3 `country.html?c=japan` (국가 섹터)

- [ ] **375px** 히어로 플래그 + 타이틀 — 모바일 뷰 — 플래그 40px, 타이틀 줄바꿈 자연스러움
- [ ] **375px** 인기 도시 칩 — 모바일 뷰 — 감싸기(wrap) 또는 가로 스크롤, "🏙️ 인기 도시" 레이블 숨김
- [ ] **375px** 검색 바 2×2 그리드 — 모바일 뷰 — 출발/도착/날짜/인원 2행 배치
- [ ] **375px** 검색 모드 탭 가로 스크롤 — 모드 탭 스와이프 — 4개 탭 스크롤 가능
- [ ] **375px** 카테고리 스트립 sticky — 스크롤 — 헤더 아래 붙어서 스크롤되며 9개 카테고리 스와이프
- [ ] **375px** 호텔 카드 가로 레이아웃 — 호텔 섹션 — 이미지 130px + 정보 가로 배치
- [ ] **768px** 호텔/항공/오리지널 2열 — 태블릿 뷰 — 2열 균형 그리드
- [ ] **1280px** 호텔 3열 / 오리지널 4열 — PC 뷰 — 명시된 그리드 폭 유지
- [ ] **1280px** 빌더 2단 레이아웃 — 빌더 섹션 — 좌측 옵션 / 우측 sticky 요약 패널
- [ ] **전 국가** (japan/vietnam/thailand/philippines) 레이아웃 일관성 — URL `?c=` 변경하며 확인 — 모든 국가에서 동일 레이아웃, accent 컬러만 변경

### 1.4 `ai-planner.html`

- [ ] **375px** `100dvh` 대응 — iOS 모바일 브라우저 — 주소 표시줄 숨김/표시 전환 시 레이아웃 안정
- [ ] **375px** 말풍선 최대 폭 — 대화 진행 — 85% 이하로 제한, 긴 문장 줄바꿈
- [ ] **375px** 추천 카드 2단 레이아웃 — 추천 결과 단계 — 이미지 110px + 정보 분할
- [ ] **375px** 입력창 하단 고정 — 스크롤 — flex-shrink:0으로 항상 노출
- [ ] **768px** 중앙 정렬 chat-shell — 태블릿 뷰 — 760px 최대 폭 중앙 정렬
- [ ] **키보드 열림 시** (모바일) — 실기기 iOS/Android — visualViewport 이벤트로 스크롤 유지
- [ ] **전 화면** AI mark 애니메이션 — 상단 로고 — `floaty` 3.2s 무한 반복

### 1.5 `packages.html`

- [ ] **375px** 진행 상태바 — 모바일 뷰 — 원 34px, 라벨 11px, 라인 유지
- [ ] **375px** 항공 카드 세로 스택 — Step 1 — `grid-template-columns: 1fr`로 세로 배치
- [ ] **375px** 호텔 필터 세로 배치 — Step 2 필터 — column 방향, 각 필터 full-width
- [ ] **375px** 액티비티 1열 — Step 3 — 1열 그리드
- [ ] **375px** 하단 고정 요약 바 — 모든 스텝 — 총가격 + "요약 ▲" + 다음 버튼
- [ ] **375px** 바텀 시트 — "요약 ▲" 클릭 — 80vh 이내, safe-area-inset 반영
- [ ] **1024px 이하** 우측 요약 패널 숨김 — 태블릿/모바일 — `.summary-panel { display: none }`, 하단 바로 대체
- [ ] **1280px** 2단 그리드 — PC 뷰 — 좌 메인 + 우 sticky 요약 (top 계산 정확)
- [ ] **1280px** 호텔 2열 — Step 2 — 2×3 그리드
- [ ] **1280px** 액티비티 3열 — Step 3 — 3열 카드

### 1.6 `checkout.html`

- [ ] **375px** 여행자 폼 1열 — 모바일 뷰 — 이름/영문/생년월일/연락처 각 1열
- [ ] **375px** 결제수단 탭 2×2 — 모바일 뷰 — 4개 결제수단이 2열 그리드
- [ ] **375px** 카드폼 1열 — 신용카드 탭 — 카드번호/유효기간/CVC/이름 세로 배치
- [ ] **375px** 하단 고정 결제 바 — 스크롤 — 총 결제 금액 + "결제하기" 버튼 하단 고정
- [ ] **768px** 2단 그리드 일부 유지 — 태블릿 — 카드 내부 form-row 1열로 변경
- [ ] **1280px** 메인 + 요약 2단 — PC — 좌측 입력 / 우측 sticky 요약
- [ ] **전 화면** 카드 프리뷰 비율 — 신용카드 입력 중 — 가로 비율 및 그라디언트 일관

### 1.7 `complete.html`

- [ ] **375px** 체크마크 크기 — 성공 애니메이션 — 100px 원, 48px 체크마크
- [ ] **375px** 예약 카드 padding — 모바일 — 18px 패딩, 예약번호 18px
- [ ] **768px** 중앙 정렬 — 태블릿 — 640px 최대 폭 centered
- [ ] **1280px** 페이지 전체 중앙 정렬 — PC — 640px 단일 컬럼 centered

---

## 2. 기능 동작 체크

### 2.1 헤더 · 네비게이션 (전 페이지 공통)

- [ ] 로고 클릭 — 클릭 — `index.html`로 이동
- [ ] GNB 6개 링크 — 각 클릭 — `country.html?c=japan|vietnam|thailand|philippines|southeast-asia|world`
- [ ] GNB active 상태 (country.html) — URL `?c=` 변경 — 해당 국가만 primary 컬러 + 배경
- [ ] AI 플래너 버튼 — 클릭 — `ai-planner.html` 이동
- [ ] 모바일 햄버거 — 375px에서 클릭 — 드로어 우측에서 슬라이드 인
- [ ] 드로어 오버레이 클릭 — 드로어 열린 상태에서 어두운 영역 클릭 — 드로어 닫힘
- [ ] 드로어 × 버튼 — 클릭 — 드로어 닫힘, `body overflow` 복원

### 2.2 `index.html` 기능

- [ ] 히어로 슬라이드 자동 전환 — 5.5초 대기 — 4장 순환, 페이드 1.2s
- [ ] 히어로 도트 클릭 — 도트 클릭 — 해당 슬라이드로 이동, active 도트 24px 길이
- [ ] AI 검색 submit — 입력 후 엔터 또는 검색 버튼 — alert로 입력값 표시
- [ ] AI 검색 빈 입력 — 빈값 제출 — "여행지나 원하는 여행을 입력해주세요" 경고
- [ ] 빠른 탭 5개 — 항공/호텔/패키지/골프/투어 클릭 — 각 카테고리 alert
- [ ] 국가 카드 — 6개 카드 각각 클릭 — `/japan` `/vietnam` 등 이동 (404는 정상; `country.html?c=`로 수동 변경 검증)
- [ ] 오리지널 카드 hover — 마우스 오버 — `translateY(-4px)` + shadow-lg
- [ ] 오리지널 링크 — 클릭 — `/product/{id}` 이동 (404는 정상)
- [ ] 크리에이터 쇼츠 "자세히 보기" / "지금 예약" — 각 버튼 클릭 — 버튼 반응 (현재는 기능 없음)
- [ ] 빌더 항공 select — 드롭다운 변경 — 요약 패널 가격·레이블 실시간 업데이트
- [ ] 빌더 호텔 select — 드롭다운 변경 — 호텔 가격 반영
- [ ] 빌더 액티비티 select — "선택 안 함" → 액티비티 선택 — 총액 증가, 번들 -7% 할인 표시
- [ ] 빌더 "이 조합으로 예약하기" — 클릭 — 장바구니 alert
- [ ] 항공권 탭 (일본/베트남/태국) — 각 탭 클릭 — 해당 국가 항공 6개 렌더, active 표시
- [ ] 크리에이터 파트너 CTA — "파트너 신청하기" 클릭 — `/creator` 이동 (404 정상)
- [ ] 푸터 소셜 아이콘 hover — 유튜브/인스타/카톡 hover — primary 배경 전환
- [ ] 플로팅 AI 버튼 — 클릭 — `ai-planner.html` 이동, `pulse` 애니메이션 확인
- [ ] IntersectionObserver reveal — 스크롤 — 각 섹션 진입 시 fade-up 1회 발동

### 2.3 `country.html` 기능

- [ ] URL `?c=japan` → 일본 렌더 — 페이지 로드 — 플래그 🇯🇵 / 타이틀 "한국인의 일본" / accent 사쿠라핑크
- [ ] URL `?c=vietnam` → 베트남 렌더 — URL 변경 — 플래그 🇻🇳 / accent 빨강 / 도시 다낭·나트랑·하노이
- [ ] URL `?c=thailand` → 태국 렌더 — URL 변경 — 플래그 🇹🇭 / accent 골드
- [ ] URL `?c=philippines` → 필리핀 렌더 — URL 변경 — 플래그 🇵🇭 / accent 그린
- [ ] 잘못된 `?c=` 값 — `?c=xyz` — japan fallback 렌더
- [ ] 히어로 슬라이드 4장 순환 — 5.5초 대기 — opacity 전환
- [ ] 인기 도시 칩 클릭 — 6개 칩 각각 — alert로 도시 필터 표시
- [ ] 검색 모드 탭 전환 — "항공+호텔"/"항공만"/"호텔만"/"골프만" — active 토글 + underline
- [ ] 검색 폼 submit — 선택 후 검색 버튼 — 선택 값 alert
- [ ] 카테고리 스트립 9개 — 각 카테고리 클릭 — active 토글 + 해당 섹션으로 smooth scroll
- [ ] 항공 도시 탭 — 각 도시 탭 클릭 — 해당 도시 항공 6개 렌더
- [ ] 호텔 도시 탭 — 각 도시 탭 클릭 — 해당 도시 호텔 3개 렌더
- [ ] 호텔 점수 · 리뷰 · 별점 — 카드 렌더 확인 — 9.x 점수 + 리뷰 수 + ★ 별점 개수 일치
- [ ] 빌더 Step 1 클릭 — 항공 3개 중 선택 — active 토글
- [ ] 빌더 Step 2 클릭 — 호텔 3개 중 선택 — active 토글
- [ ] 빌더 Step 3 클릭 — "선택 안 함" vs 액티비티 — 가격 차이 반영
- [ ] 빌더 실시간 가격 계산 — 선택 조합 변경 — 소계 합산 + -7% 할인 + 최종 금액
- [ ] 빌더 "이 조합으로 예약하기" — 클릭 — 장바구니 alert

### 2.4 `ai-planner.html` 기능

- [ ] 초기 로드 — 페이지 진입 — 타이핑 점 → 첫 인사 메시지 타이핑 출력
- [ ] Step 1 (greeting) 빠른 답변 5개 — 🇯🇵 일본 클릭 — 유저 말풍선 "일본" 추가 + Step 2 진행
- [ ] Step 1 "✏️ 직접 입력" — 클릭 — AI가 "가고 싶은 나라나 도시를 입력해주세요" 응답 + 입력창 포커스
- [ ] 직접 입력 후 submit — 텍스트 입력 → 전송 — Step 2 진행, 입력값이 destination에 저장
- [ ] Step 2 (style) — 스타일 5개 버튼 클릭 — Step 3 진행
- [ ] Step 3 (duration) — 4개 버튼 — Step 4 진행
- [ ] Step 4 (pax) — 4개 버튼 — Step 5 진행
- [ ] Step 5 (budget) — 4개 버튼 — Step 6 로딩 진행
- [ ] Step 6 로딩 — 예산 선택 직후 — 3단계 체크리스트 (항공 조회/호텔/매칭) 순차 ✓
- [ ] Step 6 결과 — 로딩 완료 — 국가별 추천 3장 (가성비 녹/밸런스 파/프리미엄 그라디언트)
- [ ] 추천 "예약하기" — 3개 중 각 클릭 — 해당 상품 alert
- [ ] 결과 후 액션 3개 — "조건 바꾸기"/"처음부터"/"저장" — 각 기능 동작 확인
- [ ] 자유 텍스트 입력 (플로우 중) — 입력 → 전송 — 프로토타입 안내 메시지 응답
- [ ] 입력창 textarea 자동 높이 — 긴 텍스트 입력 — 최대 120px까지 자동 확장
- [ ] Enter 전송 / Shift+Enter 줄바꿈 — 각 키 입력 — 동작 분리 확인
- [ ] 전송 버튼 disabled — 빈 입력 — 버튼 비활성화 + 그레이 배경
- [ ] 마이크 버튼 — 클릭 — "곧 제공" alert
- [ ] 헤더 "↻ 처음부터" — 클릭 → 확인 — 대화 초기화 후 greeting 재시작

### 2.5 `packages.html` 기능

- [ ] 진행 상태바 초기 — 페이지 로드 — Step 1 active (primary), Step 2/3 inactive
- [ ] Step 1 → 2 전환 — 항공 선택 후 "다음" — Step 1 done (녹색 체크) + Step 2 active + 라인 1 done
- [ ] Step 2 → 3 전환 — 호텔 선택 후 "다음" — Step 2 done + Step 3 active
- [ ] 스텝 back — Step 2에서 "이전" — Step 1로 돌아감 (선택 값 유지)
- [ ] 진행바 클릭 back — Step 3에서 Step 1 원 클릭 — Step 1로 점프 (완료 스텝만 가능)
- [ ] 진행바 클릭 forward — Step 1에서 Step 3 원 클릭 — 이동 안됨 (unvisited step)
- [ ] 항공 카드 선택 — 5개 중 1개 클릭 — `.selected` 클래스 + primary 배경 + 버튼 "✓ 선택됨"
- [ ] 항공 재선택 — 다른 카드 클릭 — 이전 선택 해제, 새 카드만 selected
- [ ] "다음" 버튼 disabled — 항공 미선택 상태 — Step 1 "다음" 비활성화
- [ ] 호텔 필터 3종 — 가격대/성급/위치 변경 — 리스트 즉시 필터링
- [ ] 호텔 필터 결과 없음 — 극단 조합 (5성 + 10만원 이하) — "조건에 맞는 호텔이 없어요" 메시지
- [ ] 호텔 날짜 안내 — Step 2 진입 — "📅 2026.04.25 - 2026.04.28 · 3박 기준으로 보여드려요"
- [ ] 액티비티 카테고리 탭 5개 — 골프/스파/투어/티켓/레스토랑 — 각 3개 카드 렌더
- [ ] 액티비티 다중 선택 — 여러 카드 클릭 — "+ 추가" → "✓ 추가됨" 토글, 요약에 누적
- [ ] 액티비티 선택 해제 — 선택된 카드 재클릭 — 해제, 요약에서 제거
- [ ] 요약 패널 항목 × 삭제 — 각 항목 우측 × 클릭 — 해당 항목 삭제 + 가격 재계산
- [ ] 요약 총액 실시간 — 선택 변경 — 소계 / -7% 할인 / 최종 총액 즉시 갱신
- [ ] 번들 할인 7% — 소계 1,000,000원 — 70,000원 할인, 최종 930,000원
- [ ] 예약하기 disabled — 항공 또는 호텔 미선택 — CTA 비활성화
- [ ] 예약하기 활성 — 항공 + 호텔 선택 후 — CTA 활성, 클릭 시 `checkout.html`로 이동
- [ ] sessionStorage 저장 — 예약하기 클릭 후 — DevTools Application에 `omt_package` 키 존재
- [ ] 모바일 요약 바 — 375px — 하단 고정, 총액 + "요약 ▲" + "다음 →"
- [ ] 모바일 시트 열기 — "요약 ▲" — 시트 슬라이드 업, overlay 0.5 opacity
- [ ] 모바일 시트 닫기 — overlay 또는 × — 슬라이드 다운
- [ ] 모바일 "다음 →" 버튼 텍스트 — 스텝별 — Step 1 "다음 (호텔) →", Step 3 "예약 진행 →"

### 2.6 `checkout.html` 기능

- [ ] 빈 sessionStorage 접근 — storage 비우고 `checkout.html` 직접 진입 — "예약할 상품이 없어요" empty state
- [ ] 정상 sessionStorage — packages에서 진입 — 입력 폼 + 요약 렌더
- [ ] 여행자 탭 (2명) — 탭 클릭 — 탭 active 전환, 폼 입력값 개별 유지
- [ ] 한글 이름 — "홍길동" 입력 — 그대로 반영
- [ ] 영문 이름 자동 대문자 — "hong" 입력 — "HONG"으로 자동 변환
- [ ] 생년월일 자동 하이픈 — "19900101" 입력 — "1990-01-01" 포맷
- [ ] 연락처 자동 하이픈 — "01012345678" 입력 — "010-1234-5678" 포맷
- [ ] 결제수단 탭 4개 — 각 탭 클릭 — 해당 패널만 display:block
- [ ] 카드번호 자동 하이픈 — "1234567812345678" 입력 — "1234-5678-1234-5678"
- [ ] 카드번호 16자 제한 — 20자 입력 시도 — 16자에서 중단
- [ ] 카드 프리뷰 실시간 — 입력 중 — 카드 번호/유효기간/소유자 실시간 반영
- [ ] 유효기간 자동 슬래시 — "1228" 입력 — "12/28"
- [ ] CVC 숫자만 — 문자 입력 — 숫자만 필터, 3자 제한
- [ ] 약관 개별 체크 — 각 체크박스 클릭 — 토글 + primary 배경
- [ ] 약관 전체 동의 — "모든 약관 전체 동의" — 4개 모두 체크
- [ ] 전체 해제 — 전체동의 재클릭 — 4개 모두 해제
- [ ] 결제 버튼 disabled (초기) — 폼 비어있음 — "결제하기" 비활성
- [ ] 결제 버튼 활성 조건 — 대표자 필수 4개 + 필수 약관 3개 + (카드면) 카드 4필드 — 활성 + "X원 결제하기" 라벨
- [ ] 결제 처리 시뮬레이션 — "결제하기" 클릭 — 1.4초 후 `complete.html` 이동
- [ ] sessionStorage 저장 — 결제 후 — `omt_booking` 키에 bookingNumber/total/paxData 등 저장

### 2.7 `complete.html` 기능

- [ ] 빈 sessionStorage — storage 비우고 직접 진입 — "최근 예약 정보가 없어요" empty
- [ ] 정상 진입 — checkout 거쳐 진입 — 체크마크 애니메이션 + 예약 상세
- [ ] 체크마크 드로우 — 페이지 진입 — SVG path 0.6s 그리기 애니메이션
- [ ] 이중 링 확산 — 페이지 진입 — 2개 링 1.4s/1.7s ease-out
- [ ] 색종이 confetti — 페이지 진입 — 20개 dot 랜덤 방향 산란
- [ ] 예약 번호 — 예약 카드 확인 — `OMT-XXXXXXXX` base36 8자리 고유값
- [ ] 예약 상세 — 예약자/연락처/일정/인원/결제수단/일시 — 모두 실제 입력값 반영
- [ ] 항목 리스트 — 항공/호텔/액티비티 — 선택한 모든 항목 표시, 가격 합계 일치
- [ ] 카카오톡 받기 버튼 — 클릭 — 전송 완료 alert
- [ ] 마이페이지 버튼 — 클릭 — `mypage.html` 이동 (404 정상)
- [ ] 홈 버튼 — 클릭 — `index.html` 이동

---

## 3. UX 플로우 체크

### 3.1 End-to-End: 메인 → 국가 → 빌더 → 결제 → 완료

- [ ] 시나리오 1 (정석) — 홈 → GNB "🇯🇵 일본" → 빌더 링크(없으므로 홈 하단 빌더 이용) → 항공/호텔 선택 → 예약 → 결제 → 완료 — 끊김 없이 완주, 결제번호 생성
- [ ] 시나리오 2 (packages 직접) — `packages.html` 직접 진입 → 3스텝 완주 → 결제 → 완료 — sessionStorage 체인 정상 동작
- [ ] 시나리오 3 (스텝 중단 후 복귀) — Step 2 중 뒤로가기 → Step 1 재선택 → 앞으로 — 선택 값 유지 또는 초기화 정책 명확
- [ ] 시나리오 4 (빈 장바구니 결제 페이지) — sessionStorage 삭제 후 `checkout.html` — empty state → "패키지 만들러 가기" 링크 동작
- [ ] 시나리오 5 (결제 후 뒤로가기) — complete에서 브라우저 뒤로가기 → checkout 재진입 — sessionStorage 유지되어 재결제 가능
- [ ] 시나리오 6 (모바일 전체 플로우) — 375px 뷰포트에서 1~5 재현 — 모든 단계 모바일 UI로 완주

### 3.2 AI 플래너 전체 플로우

- [ ] 6단계 완주 — 인사 → 목적지 → 스타일 → 기간 → 인원 → 예산 → 로딩 → 결과 — 중간 끊김 없음
- [ ] 결과 "예약하기" — 추천 카드 클릭 — 상품 alert (실제 빌더 이관은 미구현, API 연동 포인트 주석만)
- [ ] 결과 "조건 바꾸기" — 클릭 — style 스텝으로 복귀 + 이전 선택값 기억 (현재 구현 확인 필요)
- [ ] 결과 "처음부터" — 클릭 → 확인 — 전체 초기화 후 greeting
- [ ] 직접 입력 경로 — Step 1에서 "✏️ 직접 입력" → 텍스트 입력 — Step 2 정상 진행
- [ ] 자유 질문 (플로우 중) — 임의 단계에서 자유 텍스트 전송 — "프로토타입" 안내 응답, 플로우 유지

### 3.3 크리에이터 피드 → 예약 Bottom Sheet → 결제

- [ ] ⚠️ **미구현 페이지** — `feed.html`은 현재 미작성 — **제작 필요** (별도 작업)
- [ ] 대안 검증: 메인 홈 크리에이터 섹션 "지금 예약" — 클릭 — 현재 기능 없음 (후속 구현 필요)

---

## 4. 성능 체크

### 4.1 이미지 로딩

- [ ] Lazy loading 적용 — 모든 `<img>` / `background-image` 확인 — **⚠️ 현재 미적용** — `loading="lazy"` 추가 필요 (모든 product/hotel/creator 이미지)
- [ ] Unsplash 사이즈 파라미터 — HTML 내 URL 검사 — `?w=600-1800&q=80` 범위로 적정 사이즈
- [ ] 히어로 이미지 우선순위 — 첫 슬라이드 — `fetchpriority="high"` 추가 권장
- [ ] 이미지 포맷 — CDN 응답 — `auto=format` 파라미터로 WebP 자동 서빙

### 4.2 페이지 첫 로드

- [ ] `index.html` First Contentful Paint — DevTools → Lighthouse → Mobile (Slow 4G) — FCP < 2.0s
- [ ] `index.html` Largest Contentful Paint — Lighthouse — LCP < 2.5s (Good)
- [ ] `index.html` Time to Interactive — Lighthouse — TTI < 3.0s
- [ ] Google Fonts 로드 — Network 탭 — preconnect 적용, font-display: swap
- [ ] 모든 페이지 로드 시간 — Network 탭 Fast 3G — 3초 이내

### 4.3 스크롤 성능

- [ ] 메인 홈 스크롤 — DevTools Performance 녹화 → 페이지 스크롤 — 60fps 유지 (jank/long task 없음)
- [ ] 국가 섹터 스크롤 — 동일 방식 — 60fps
- [ ] 빌더 스텝 전환 — Performance 녹화 — transform/opacity만 사용하여 60fps
- [ ] AI 플래너 타이핑 중 스크롤 — 타이핑 애니메이션 중 스크롤 — jank 없음
- [ ] 모바일 가로 스크롤 (쇼츠/국가) — 375px 스크롤 — 스냅 부드러움, dropped frame 없음

### 4.4 애니메이션 성능

- [ ] `will-change` 또는 GPU 레이어 — 애니메이션 요소 — transform/opacity만 사용 (현재 준수)
- [ ] `prefers-reduced-motion` — OS 설정에서 감소 모션 켜기 — 모든 애니메이션 즉시 종료

---

## 5. 접근성 체크

### 5.1 aria-label

- [ ] 아이콘 전용 버튼 — DevTools → Accessibility tree — 햄버거/닫기/마이크/플로팅AI 등 모두 aria-label 존재
- [ ] 로고 링크 — `<a class="logo">` — `aria-label="오마이트립 홈"` 또는 텍스트 포함
- [ ] 네비게이션 landmark — `<nav>` — `aria-label` 지정 ("주요 메뉴", "모바일 하단 메뉴" 등)
- [ ] 히어로 슬라이드 도트 — 도트 확인 — `aria-label="슬라이드 1"` 등
- [ ] 모달/드로어 — 드로어 루트 — `aria-label` 지정
- [ ] 요약 패널 `aria-live` — 빌더 가격 변경 — `aria-live="polite"` 동작

### 5.2 키보드 네비게이션

- [ ] Tab 순서 — 각 페이지에서 Tab 연속 입력 — 논리적 순서 (상→하, 좌→우)
- [ ] Focus outline — Tab 중인 요소 — 시각적으로 명확한 focus ring
- [ ] Enter/Space 활성화 — 모든 버튼에 Tab 후 Enter — 클릭과 동일한 동작
- [ ] Escape 드로어/시트 닫기 — ESC 키 — **⚠️ 현재 미구현** — keydown 리스너 추가 권장
- [ ] Skip link — Tab 최초 — "본문 바로가기" 링크 **⚠️ 미구현** — 접근성 강화 필요
- [ ] 폼 label 연결 — 모든 input — `<label for>` 또는 래핑으로 스크린리더 인식 가능

### 5.3 색상 대비 (WCAG AA)

- [ ] 본문 텍스트 (`#1A1A1A` on `#FFFFFF`) — Contrast Checker — 15.8:1 ✓ (AAA)
- [ ] 보조 텍스트 (`#4B5563` on `#FFFFFF`) — Contrast Checker — 7.59:1 ✓ (AAA)
- [ ] ink-3 (`#9CA3AF` on `#FFFFFF`) — Contrast Checker — 2.82:1 ✗ (11-13px 본문에는 부적합, 보조 정보만 사용 중인지 확인)
- [ ] Primary 버튼 (`#FFFFFF` on `#FF6B35`) — Contrast Checker — 3.36:1 (AA 대형 텍스트만 통과, 14px 이하는 실패) — **⚠️ 개선 검토** (`#E85826` 배경이 더 안전)
- [ ] 히어로 오버레이 텍스트 — 배경 이미지 위 흰 텍스트 — 반투명 그라디언트로 4.5:1 이상 확보 확인
- [ ] Success 녹색 배경 — `#10B981` on `#FFFFFF` — 2.69:1 (아이콘/배경용만, 텍스트 금지)

### 5.4 reduced motion 대응

- [ ] CSS `@media (prefers-reduced-motion: reduce)` — OS 설정 변경 후 reload — 모든 애니메이션/트랜지션 0.01ms로 단축
- [ ] 히어로 자동 슬라이드 — reduced motion 시 — **⚠️ JS는 미반영** — `setInterval` 조건부 실행 추가 권장

---

## 6. API 연동 준비 체크

### 6.1 TODO 주석 위치

전체 파일에서 `TODO: API 연동` 검색으로 다음 포인트 확인:

- [ ] `index.html` — 9개 TODO: hero/slides, countries/sectors, products/originals, creator/shorts, flights/deals, ai/search, {type}/search, packages 관련
- [ ] `country.html` — 7개 TODO: countries/:slug/hero, products/originals, flights/deals, creator/shorts, hotels, products/golf, cart
- [ ] `ai-planner.html` — 4개 TODO: /api/ai-planner (POST), save, cart, transcribe
- [ ] `packages.html` — 3개 TODO: flights/search, hotels, activities
- [ ] `checkout.html` — 5개 TODO: 카카오페이/네이버페이/토스페이먼츠/bookings 생성/알림톡
- [ ] `complete.html` — 2개 TODO: bookings/confirmation, notifications/kakao-alimtalk

### 6.2 Mock 데이터 스키마

백엔드 구현 시 기대되는 응답 shape:

```typescript
// GET /api/countries/:slug
{ slug, flag, name, tagline, accentCountry, heroImages[],
  cities: [{id, label, featured?}],
  originals: [{id, img, title, compo, price, oldPrice}],
  flightTabs: [{id, label}],
  flightDeals: Record<cityId, Flight[]>,
  hotelTabs, hotels: Record<cityId, Hotel[]>,
  golf: GolfPkg[], builder: {flights, hotels, activities} }

// Flight
{ id, code, airline, number,
  out: {dep, arr, depAp, arrAp, dur},
  ret: {dep, arr, depAp, arrAp, dur},
  direct, price }

// Hotel
{ id, img, name, area, areaLabel, stars, score, reviews, price }

// Booking
{ bookingNumber, total, paymentMethod, leadName, phone,
  package: {flight, hotel, activities, paxCount, nights, dates},
  createdAt }
```

- [ ] 스키마 문서화 — API 설계 미팅 전 — 위 shape로 OpenAPI 또는 Notion spec 공유
- [ ] Mock 데이터 `id` 규칙 — 각 파일 검토 — 실제 DB PK 포맷과 정합성 (`orig-jp-01` 등은 교체 대상)
- [ ] 가격 단위 — 모든 price 필드 — KRW 정수 단위 (소수점 없음) 확인
- [ ] 날짜 포맷 — `createdAt` — ISO 8601 (`toISOString()`) 사용 중, 일관성 확인

### 6.3 에러/로딩 상태 UI

- [ ] 빈 상태 UI — `checkout.html` / `complete.html` — **✓ 구현됨** — sessionStorage 없을 때 empty state 표시
- [ ] 호텔 필터 결과 없음 — `packages.html` Step 2 — **✓ 구현됨** — "조건에 맞는 호텔이 없어요"
- [ ] API 실패 fallback — 모든 fetch 포인트 — **⚠️ 미구현** — try/catch + 재시도 UI 추가 필요
- [ ] 로딩 스켈레톤 — 카드 목록 로딩 중 — **⚠️ 미구현** — 스켈레톤 UI 추가 권장
- [ ] 네트워크 오프라인 — 오프라인 모드 테스트 — **⚠️ 미구현** — offline 감지 + 토스트 필요
- [ ] 결제 실패 처리 — checkout submit 에러 — **⚠️ 미구현** — 버튼 복원 + 에러 메시지 toast 필요

---

## 7. 크로스 브라우저

- [ ] Chrome 최신 (Windows) — 모든 페이지 — 정상 동작
- [ ] Edge 최신 (Windows) — 동일 — 정상
- [ ] Firefox 최신 — `backdrop-filter` 포함 페이지 — 지원 확인 (118+ 지원)
- [ ] Safari (macOS/iOS) — 모든 페이지 — `-webkit-backdrop-filter` 동작, `100dvh` 지원 확인
- [ ] Samsung Internet (Android) — 모바일 — 하단 탭바 safe-area 정상

---

## 8. 회귀 테스트 (릴리스 전 필수)

- [ ] sessionStorage 초기 상태 전체 플로우 — 브라우저 프라이빗 모드 — end-to-end 완주
- [ ] URL 직접 접근 — `country.html?c=japan` 직접 URL 타이핑 — 정상 렌더
- [ ] 새로고침 유지 — 각 페이지에서 F5 — 스크롤 위치/상태 합리적으로 복원
- [ ] 브라우저 뒤로가기 — packages → checkout → 뒤로 — 이전 상태 유지
- [ ] 새 탭으로 열기 — 링크 Ctrl+Click — 독립 세션 정상

---

## 9. 백오피스 8 모듈 (사이클 10~12 신규)

### 9.1 인증 + 권한 (`admin-users.html`)

- [ ] 비로그인 시 admin-* 페이지 접근 — 직접 URL 입력 — 로그인 페이지 리디렉션 (실 구현)
- [ ] 2FA 미설정 첫 로그인 — 신규 운영자 계정 — TOTP QR 표시 + 등록 강제
- [ ] 30분 비활성 후 작업 시도 — 모달 띄운 채 30분 대기 — 자동 로그아웃 + 재로그인 안내
- [ ] OPERATOR가 환불 버튼 클릭 — admin-bookings → 환불 — "MANAGER+ 권한 필요" 비활성
- [ ] SUPER_ADMIN 신규 초대 시 4-eye — admin-users → 초대 → ROLE=SUPER_ADMIN — co_approver_admin_id 필드 필수 노출
- [ ] 운영자 24명 카드 — 권한 탭 — 2FA 활성 22/24 KPI 일치
- [ ] 감사 로그 diff 시각화 — 권한 탭 → 감사 로그 → 행 확인 — before(빨강) → after(초록) 표시
- [ ] 권한 매트릭스 15×4 표 — 권한 매트릭스 탭 — 15 행동 × 4 ROLE 정확히 표시
- [ ] ROLE별 GNB 모듈 카드 활성/비활성 — VIEWER로 로그인 시 — 일부 모듈 disabled (실 구현)

### 9.2 대시보드 (`admin-dashboard.html`)

- [ ] 오늘 운영 KPI 4종 — 카드 표시 — 오늘 예약/견적 대기/문의/신규 회원 모두 숫자 표시
- [ ] 8 모듈 진입 카드 — 각 카드 클릭 — 해당 페이지로 이동 (모두 활성)
- [ ] 긴급 작업 큐 7건 — 우측 카드 — D-1 견적 / 24h+ 미답변 / 결제 실패 모두 노출
- [ ] 최근 활동 로그 10건 — 좌측 카드 — 시간/운영자/액션/대상 모두 표시
- [ ] ⌘K 빠른 검색 — 단축키 입력 — 검색 입력 모달 (mock) 표시

### 9.3 예약 운영 (`admin-bookings.html`)

- [ ] 5 탭 필터 (전체/긴급/오늘/그룹/문제) — 탭 전환 — 각 탭별 행 필터링 (mock)
- [ ] 검색 + 5필터 — 예약번호/회원/상품/SKU/국가/날짜 — 다중 조건 적용
- [ ] 슬라이드아웃 상세 — 행 클릭 — 우측 패널 등장 + 4 섹션 (정보/슬롯/결제/감사)
- [ ] 견적 D-1 임박 큐 — 🔥 탭 — D-day 빨간색 + 견적 대기 표시
- [ ] 환불 액션 (MANAGER+) — 환불 버튼 클릭 — 재인증 모달 (mock) 표시
- [ ] 카톡 재발송 — 행 액션 — TPL-001 발송 시뮬레이션 alert
- [ ] partial_paid 상태 pill — 그룹 예약 행 — 노란색 pill 표시

### 9.4 상품 관리 (`admin-products.html`)

- [ ] 5 SKU 탭 (골프텔/+항공/패키지/호텔/액티비티) — 탭 전환 — 각 SKU 행 필터링
- [ ] 채널 매니저 9 동기화 모니터 — 페이지 진입 — 9 채널 상태 + 마지막 동기화 시간
- [ ] XGOLF 토큰 만료 케이스 — 동기화 모니터 — 빨간색 ✗ 토큰 만료 표시
- [ ] 가격 룰 6종 표 — 가격 정책 카드 — 성수기/주말/단체/VIP 모두 표시
- [ ] 골프텔 8 카드 grid — 골프텔 탭 — 8건 모두 표시 + 액션 4종 (편집/가격/일시중지/동기화)
- [ ] 일괄 가격 변경 — 가격 일괄 버튼 — 모달 진입 (mock)

### 9.5 회원 관리 (`admin-customers.html`)

- [ ] 5 등급 분포 KPI — 페이지 진입 — 브론즈/실버/골드/플래티넘/VIP 모두 표시
- [ ] 검색 + 등급 chips — 등급 chip 클릭 — 해당 등급 행 필터링
- [ ] 슬라이드아웃 4통계 — 회원 행 클릭 — 결제액/예약/포인트/리뷰 표시
- [ ] 등급 수동 변경 (MANAGER+) — 슬라이드아웃 → 등급 변경 — audit_logs 시뮬 알림
- [ ] 포인트 적립·차감 — 포인트 액션 — 사유 입력 모달 (mock)
- [ ] VIP 탭 — VIP 24명 탭 — VIP 매니저 정보 표시
- [ ] 휴면 회원 탭 — 휴면 2,418명 — 90일+ 미접속 자동 분류 (mock)

### 9.6 CS 운영 (`admin-cs.html`)

- [ ] 3 탭 (문의/리뷰/알림톡) — 탭 전환 — 각 탭별 컨텐츠 렌더
- [ ] 문의 응대 2-col — 좌측 큐 + 우측 답변 폼 — 행 클릭 시 우측 채워짐
- [ ] 24h+ 미답변 빨간 우선순위 — 좌측 큐 — 🔥 라벨 표시
- [ ] 6 자동 답변 템플릿 — 답변 폼 위 — 클릭 시 textarea 자동 입력
- [ ] TPL-007 트리거 안내 — 답변 폼 하단 — 카톡 알림톡 자동 발송 명시
- [ ] 리뷰 신고 큐 — 리뷰 탭 → 신고 대기 — 🚨 뱃지 표시
- [ ] 운영사 답변 작성 — 리뷰 카드 액션 — 답변 모달 mock
- [ ] 알림톡 10 템플릿 통계 — 알림톡 탭 — 각 템플릿 발송 수 + 성공률 % 표시
- [ ] 실패 큐 SMS 대체 — 실패 발송 표 — SMS 대체 버튼 동작

### 9.7 정산 관리 (`admin-settlement.html`)

- [ ] 4 KPI (크리에이터/공급사/대기/완료) — 페이지 진입 — 모두 금액 표시
- [ ] 4 탭 (크리에이터/공급사/PG/이력) — 탭 전환 — 각 컨텐츠 렌더
- [ ] 크리에이터 등급 보너스 — 크리에이터 탭 — 등급별 +0.5/1/2%p 표시
- [ ] 공급사 Tier별 수수료 — 공급사 탭 — 직영 22.5% / FC 15%
- [ ] PG 3사 카드 (카카오/네이버/토스) — PG 탭 — 매출-수수료-실 정산액 표시
- [ ] T+3 입금 일정 — PG 탭 → 다음 입금일 — 정확한 날짜 표시
- [ ] 정산 실행 모달 — ⚡ 5월 정산 실행 버튼 — 체크리스트 7개 + SUPER_ADMIN 승인 안내
- [ ] 송금 실패 보류 케이스 — 이력 탭 — 빨간색 status-hold pill

### 9.8 CMS (`admin-cms.html`)

- [ ] 4 KPI (배너/검색어/공지/룰) — 페이지 진입 — 모두 카운트 표시
- [ ] 4 탭 (배너/검색어/공지/가격) — 탭 전환 — 각 컨텐츠 렌더
- [ ] 배너 슬롯 필터 (Hero/Sidebar/Mobile) — 슬롯 chip 클릭 — 해당 슬롯 배너만 표시
- [ ] 배너 활성 토글 — 토글 클릭 — on/off 전환 (mock)
- [ ] 배너 미리보기 프레임 — Hero 탭 상단 — 현재 1순위 그라데이션 카드 표시
- [ ] 인기 검색어 2-col — 키워드 탭 — 좌 TOP 6 + 우 편집 폼
- [ ] boost_factor 슬라이더 — 키워드 편집 — 0.5~3.0 범위
- [ ] 공지 핀 고정 — 공지 탭 — 📌 핀 + 노란 배경 표시
- [ ] 슬롯별 공지 (main-top/mypage-top/modal/FAQ) — 공지 행 — 슬롯 명 mono 표시
- [ ] 가격 룰 6종 공유 — 가격 탭 — admin-products와 동일 6 룰 표시

---

## 10. 그룹 예약 워크플로우 (사이클 18 신규)

### 10.1 진입

- [ ] golftels.html 모든 카드에 "👥 단체 견적" CTA — 페이지 진입 — 8개 카드 모두 표시
- [ ] CTA 클릭 — 카드 우하단 단체 견적 버튼 — `group-booking.html?golftelId=...` 이동
- [ ] golftel.html 상세 페이지에서도 단체 견적 진입 (실 구현 권장)

### 10.2 5스텝 빌더 (`group-booking.html`)

- [ ] 스텝 1: 골프텔 정보 카드 — 페이지 진입 — 선택한 골프텔 이미지·가격 표시
- [ ] 스텝 1: 체크인 날짜 선택 — date input — 체크아웃 자동 계산
- [ ] 스텝 2: 멤버 최소 4인 — 다음 클릭 시 3인 이하 — 토스트 알림 표시
- [ ] 스텝 2: 멤버 최대 16인 — 17번째 추가 시도 — 토스트 알림 표시
- [ ] 스텝 2: 카톡 초대 링크 — 링크 복사 버튼 — clipboard 복사 + 토스트
- [ ] 스텝 3: 멤버별 출발지 — 5 공항 select — 변경 시 state 반영
- [ ] 스텝 4: 객실 자동 배정 — 2인 1실 — 인원/2 객실 자동 생성
- [ ] 스텝 5: 결제 모드 3종 — 카드 클릭 — selected 테두리 전환
- [ ] 스텝 5: 5인+ 자동 -5% — 5인 초과 시 — 할인 행 자동 표시
- [ ] 스텝 5: 1인당 분할 — 결제 요약 — total / pax 계산 정확
- [ ] 스테퍼 진행 상태 — 각 스텝 진입 — 현재 active, 이전 done 표시
- [ ] 이전/다음 버튼 — 액션 바 — 1스텝일 때 이전 숨김, 5스텝일 때 "견적 확정·결제"
- [ ] 임시저장 — 헤더 버튼 — state.createGroup 호출 + 토스트

### 10.3 state.js groupBookings 헬퍼

- [ ] createGroup 후 getGroups에 추가 — DevTools 확인 — localStorage `omt_group_bookings_v1` 키 존재
- [ ] addGroupMember 호출 — getGroup 결과 — members 배열 길이 +1
- [ ] payGroupMember 호출 — 멤버 paidAmount 증가 — 모두 결제 시 status='paid'
- [ ] 부분 결제 시 partial_paid — 일부 멤버만 결제 — status='partial_paid'

### 10.4 백오피스 그룹 연동

- [ ] admin-bookings 그룹 탭 — 👥 그룹 예약 — 38건 mock 표시
- [ ] 그룹 예약 행 표시 — 인원수 + 결제 모드 + 결제 진행도 — 모두 표시
- [ ] 그룹 mock 2건 — 푸꾸옥 8인 / 클락 12인 — partial_paid + confirmed 라벨

---

## 11. AI 플래너 5종 고도화 (사이클 15)

### 11.1 음성 입력 mock (`ai-planner.html`)

- [ ] 마이크 버튼 클릭 — 우하단 🎙 — 풀스크린 오버레이 + 펄스 애니메이션
- [ ] 5초 카운트다운 — 오버레이 타이머 — 5→0 정확히 감소
- [ ] 자동 인식 후 발송 — 5초 후 — 7개 샘플 중 랜덤 텍스트 + 자동 submit
- [ ] 취소 버튼 — 오버레이 → 취소 — micActive false + 오버레이 제거
- [ ] 마이크 활성 시 빨간 ⏺ — 마이크 버튼 — 배경 #FF3366 + ⏺ 아이콘

### 11.2 자유 입력 골프 Q&A 데이터셋

- [ ] 15 키워드 매칭 — "캐디팁" 입력 — 답변 자동 + follow-up 빠른답변
- [ ] 키워드: 캐디팁/복장/우천/초보/상급/항공/단체/렌탈/예산/포인트/취소/비자/혼자/가족/VIP
- [ ] 미매칭 폴백 — 의미 없는 텍스트 — "자주 묻는 질문" 4종 폴백 표시

### 11.3 여행 저장

- [ ] 추천 결과 후 "💾 여행 저장" 버튼 — 클릭 — 토스트 알림 표시
- [ ] state.saveTrip 호출 — DevTools — `omt_saved_trips_v1` 키 존재
- [ ] 최대 10건 제한 — 11번째 저장 — 가장 오래된 항목 제거
- [ ] mypage 홈 "저장한 여행" 카드 — 3건 grid 표시
- [ ] ?trip=tripId 딥링크 — 카드 클릭 — ai-planner 재진입 + 자동 추천

### 11.4 비교 모드

- [ ] "⚖️ 3 상품 비교" 버튼 — 추천 후 액션 — 모달 표시
- [ ] tier 색상 (가성비/밸런스/프리미엄) — 비교 표 헤더 — green/blue/purple
- [ ] 각 행 (등급/호텔/라운딩/운영/가격) — 5 행 모두 표시
- [ ] "상세 보기 →" 액션 — 각 카드 — golftel.html?id=... 이동

### 11.5 사용자 프로필 자동 인식

- [ ] 회원 + 예약 1+ 시 맞춤 인사 — 페이지 진입 — "이전에 N번 예약" 메시지
- [ ] 선호 국가 자동 추출 — 예약 이력 분석 — 가장 많이 간 국가 표시
- [ ] "✨ X 또 가기" 빠른답변 — 회원 인사 후 — 빠른답변에 자동 추가

---

## 12. 모바일 6종 고도화 (사이클 16~17)

### 12.1 첫 진입 온보딩 (`mobile.html` · 사이클 16)

- [ ] 첫 방문 시 800ms 후 모달 — 신규 sessionStorage — 풀스크린 표시
- [ ] 진행률 바 25/50/75/100% — 각 스텝 진입 — 정확한 % 표시
- [ ] 4 질문 (실력/예산/동반자/국가) — 순차 진행 — 모두 답변 가능
- [ ] 건너뛰기 — 우상단 — markOnboarded + 모달 제거
- [ ] 이전 버튼 — 2스텝부터 — 이전 스텝 복귀
- [ ] 완료 시 🎉 페이지 — 4스텝 답변 후 — 축하 메시지 + For You 버튼
- [ ] state.setPreferences 저장 — DevTools — `omt_user_prefs_v1` 키 존재

### 12.2 티오프 카운트다운 sticky 위젯

- [ ] D-3 이내 예약 자동 감지 — home 탭 — 위젯 표시
- [ ] D-3 초과 예약 — 위젯 숨김 — display:none
- [ ] D-day 큰 숫자 — 위젯 우측 — 28px 폰트
- [ ] 라벨 (오늘 출발/내일 출발/여행 임박) — D-day별 — 정확히 표시
- [ ] 클릭 시 complete.html?bk=... — 위젯 전체 — e-바우처 페이지로 이동

### 12.3 For You 개인화 추천

- [ ] For You 서브탭 — 홈 상단 — 그라데이션 배경 ✨ For You
- [ ] 클릭 시 피드 교체 — 서브탭 활성 — renderForYouFeed() 호출
- [ ] 1위에 🏆 BEST 뱃지 — 첫 카드 — 우상단 표시
- [ ] 추천 사유 칩 (선호+10/예약+5/예산+6) — 각 카드 — 2개 이하 표시
- [ ] 미온보딩 사용자 CTA — preferences 비었을 때 — "30초 설문" 점선 버튼
- [ ] 전체 골프텔 보기 → — 피드 하단 — golftels.html 이동

### 12.4 AI 친구 FAB

- [ ] 우하단 🤖 floating — 모든 탭 — 56×56 원형 + 펄스
- [ ] bobbing 애니메이션 — fab — 3s 무한 위아래 4px
- [ ] 클릭 시 4 메뉴 fan-out — fab 클릭 — 백드롭 블러 + 메뉴 위로 슬라이드
- [ ] 4 메뉴 (추천/캐디팁/초보/문의) — 각 항목 — ai-planner 또는 mypage 이동
- [ ] 백드롭 클릭 시 닫힘 — 백드롭 클릭 — 메뉴 + 백드롭 같이 제거

### 12.5 푸시 알림 센터 (사이클 17)

- [ ] 5 카테고리 필터 (예약/결제/특가/시스템/소셜) — 알림 탭 — 모두 표시 + 카운트
- [ ] 카운트 칩 색상 — 카운트 > 0 — 주황색 / 0 회색
- [ ] 시간 그룹화 (오늘/이번주/이전) — 알림 리스트 — 3 섹션 헤더 표시
- [ ] 모두 읽음 버튼 — 헤더 우측 — 확인 모달 → 일괄 처리 + 토스트
- [ ] 빈 상태 UI — 알림 없을 때 — 🔔 + 메시지 표시
- [ ] 음소거 카테고리 알림 흐리게 — 설정에서 OFF 후 — opacity 0.45 + 🔕 뱃지

### 12.6 알림 설정 모달

- [ ] ⚙️ 설정 버튼 — 헤더 — 바텀시트 슬라이드 업
- [ ] 5 카테고리 토글 — 각 토글 — 상태 즉시 전환
- [ ] 토글 색상 (on=주황, off=회색) — 클릭 — CSS 정확히
- [ ] 방해 금지 시간 토글 — 활성화 — 시간 선택 UI 노출
- [ ] 시작/종료 시간 select — 24시간 선택 — state.setNotifSettings 반영

### 12.7 동선 기반 자동 추천

- [ ] D-1 이내 예약 시 4단계 풀 동선 — 동선 위젯 — 공항→탑승→픽업→골프장
- [ ] 4 단계 각 카드 — 위젯 — 시간/장소/상세 모두 표시
- [ ] D-1 초과 시 출발지 추천 4선 — 위젯 — 직항 도시 카드 grid
- [ ] 5 권역 선택 — 출발지 변경 버튼 — 바텀시트 권역 선택
- [ ] 권역 변경 시 추천 갱신 — 권역 선택 — renderItineraryWidget() 호출
- [ ] 공항코드 (ICN→DAD) — 각 카드 — mono 폰트 표시
- [ ] 비행시간 / 일일 편수 — 각 카드 — h, 편 정확히

---

## 13. 백엔드 명세 일관성 (사이클 13)

### 13.1 ELLIS_API_BACKOFFICE.md

- [ ] 22 API 모두 Request/Response 예시 — 각 섹션 — JSON 코드 블록 존재
- [ ] 11 에러 코드 — §0.5 — BO_AUTH_REQUIRED ~ BO_INTERNAL
- [ ] 5단계 Rate Limit — §0.6 — 일반/mutating/정산/CSV/알림톡
- [ ] 멱등성 키 가이드 — 부록 B — cancel/run/refund 예시
- [ ] 권한 매트릭스 — 부록 A — 22 API × 4 ROLE

### 13.2 ELLIS_SPEC.md §11/§12

- [ ] 백오피스 5 테이블 DDL — §11.1 — admins/audit_logs/cms_*/pricing_rules/supplier_settlements
- [ ] 그룹 예약 도메인 — §12.7 — groups + group_members + bookings.group_id FK
- [ ] 자동 트리거 명세 — §11.4 / §12.7 — TPL 발송 + audit_logs 자동 INSERT

### 13.3 BACKOFFICE_GUIDE.md

- [ ] 5 ROLE별 일상 워크플로우 — §1 — 시간대별 표 5개 존재
- [ ] 5 핵심 시나리오 — §2 — 환불/견적/정산/초대/CS 응대
- [ ] FAQ 10개 — §3 — 비번/2FA/감사/알림톡/정산/상품등록/비용/레이아웃/송금/VPN
- [ ] 트러블슈팅 4 카테고리 — §4 — 에러 9종 / 채널 / 알림톡 / 정산
- [ ] 보안 수칙 — §5 — 절대 금지 7 + 의무 6

---

## 14. 미구현 / 후속 작업

- [ ] 실제 ELLIS 백엔드 구현 (백엔드 MD-only 원칙 — 추후 개발팀)
- [ ] 그룹 예약 객실 드래그-드롭 (현재 자동 배정)
- [ ] 항공편 실제 채널 매니저 연동 (group-booking step 3)
- [ ] 멤버별 결제 링크 토큰 발급 (각자 결제 모드)
- [ ] 다국어 (영/일/중) — i18n 마커 준비 보류 (사용자 결정)
- [ ] 카톡 알림톡 실제 발송 (현재 mock alert)
- [ ] 4-eye 승인 시스템 (SUPER_ADMIN 부여 시)
- [ ] SWIFT 해외 송금 자동 처리 (현재 수동)

---

**체크리스트 버전**: v3.0 · 2026-06-11 (사이클 18 시점)
**커버리지**: 37 페이지 · 백오피스 8 + 그룹 + AI 플래너 5종 + 모바일 6종 + 동선 + 알림 센터
**다음 업데이트**: 백엔드 실 구현 시 통합 테스트 항목 추가
