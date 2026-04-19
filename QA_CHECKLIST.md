# 오마이트립 프론트엔드 프로토타입 — QA 체크리스트

> **대상 파일**: `index.html` · `country.html` · `ai-planner.html` · `packages.html` · `checkout.html` · `complete.html`
> **테스트 환경**: Chrome 최신 / Safari 최신 / Firefox 최신 · DevTools Device Toolbar
> **체크리스트 포맷**: `[ ] 항목 — 확인 방법 — 통과 기준`

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

## 9. 미구현 / 후속 작업

다음 페이지는 현재 프로토타입에 **미포함** (별도 제작 필요):

- [ ] `feed.html` — 크리에이터 쇼츠 피드 (9:16 스냅 스크롤, Bottom Sheet 예약)
- [ ] `flights/search` — 항공 검색 결과 페이지
- [ ] `hotels/search` — 호텔 검색 결과 페이지
- [ ] `product/:id` — 상품 상세
- [ ] `cart` — 장바구니 (현재 빌더 요약으로 대체)
- [ ] `mypage` — 마이페이지
- [ ] `creator` — 크리에이터 파트너 등록
- [ ] `login` / 회원가입

---

**체크리스트 버전**: v1.0 · 2026-04-19 초안
**다음 업데이트**: 미구현 페이지 추가 후 각 섹션 확장
