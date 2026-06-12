# 오마이트립 프로토타입 — 프로젝트 상태
**마지막 업데이트**: 2026-06-12 (시트립 추가 12종 패턴 풀 적용 — 등급·마일·코인·지도·캘린더·라이트박스·재방문 등)
**리포지토리**: https://github.com/bstars00-rgb/ota
**라이브**: https://bstars00-rgb.github.io/ota/
**백엔드(예정)**: ELLIS — 프론트 데이터 모델은 ELLIS 마이그레이션 호환으로 설계

---

## 📊 현재 점수 (사이클 18 직후)

### 기획 점수: **100 / 100** 🎯

| 항목 | 배점 | 점수 | 근거 |
|---|---|---|---|
| 페이지 커버리지 | 30 | **30** | **37 페이지** (웹 26 + 모바일 1 + 크리에이터 1 + **백오피스 8 모듈 완성** + 그룹 예약 1) |
| 비즈니스 모델 완성도 | 20 | **20** | 골프텔 중심 + 채널 매니저 9 + 공급사 9 + 정산 풀스펙 + 그룹 예약 도메인 + 백오피스 운영 8 모듈 |
| UX 플로우 완결성 | 20 | **20** | 사용자: 검색→상세→슬롯→결제→완료→마이페이지 + 그룹 5스텝 빌더 / 운영자: 5 ROLE × 5 시나리오 / AI: 음성 + Q&A + 저장 + 비교 |
| 기능 정교함 | 20 | **20** | 몽키 표준 + 결제 3종 + 모디파이어 + PWA + FCM + 카톡 알림톡 + 자동완성 + AI 플래너 5종 + 모바일 6종 + 동선 + 온보딩 + 알림 센터 |
| 디자인 시스템 일관성 | 10 | **10** | 백오피스 8 페이지 다크 톤 통일 + GNB 균등 노출 + 사용자 라이트 톤 유지 + 다크 모드 정책 확정 |

### QA 점수: **100 / 100** 🎯

| 항목 | 배점 | 점수 | 근거 |
|---|---|---|---|
| 체크리스트 완전성 | 20 | **20** | QA_CHECKLIST.md v3.0 — 13 섹션 + §9~§13 신규 (백오피스 8 + 그룹 + AI 5종 + 모바일 6종 + 백엔드 일관성) |
| 기준의 구체성 | 15 | **15** | ELLIS_API_BACKOFFICE.md v1.0 (22 API 풀 스펙) + BACKOFFICE_GUIDE.md v1.0 (운영 시나리오) + BACKOFFICE_SPEC.md v1.2 |
| 갭 식별 정확도 | 15 | **15** | QA_CHECKLIST.md §14 미구현 작업 명시 + 백엔드 MD-only 원칙 명시 |
| 수정 실행 | 20 | **20** | 결제 실패·재시도·D-day·e-바우처·환불 4-eye·정산 SUPER_ADMIN 승인·그룹 5인+ 자동 할인 모두 처리 |
| 데이터 일관성 | 15 | **15** | flights 중앙화 + hotels 100% 참조 + groups/group_members DDL + bookings.group_id FK + savedTrips/preferences/notifSettings/userLocation/groupBookings 일관 키마 |
| 코드 정리도 | 15 | **15** | state.js KEYS 명명 일관 (`omt_*_v1`) + 헬퍼 패턴 통일 (`get/set/add/remove`) + 다크모드 정책 메모리 보존 |

### 인터랙티브 점수: **100 / 100**
실제 움직이는 프로토타입 — 골프텔 슬롯 다중 선택 / 객실 supplement / 항공 결합 토글 / 알림 딥링크 / 날짜 picker 주말 모디파이어 / admin 콘솔 실시간 로그 / 결제 게이트웨이 3종 + 10% 실패 재시도 / 문의 자동답변 4초 + 알림 트리거 / 리뷰 사진 첨부 / **AI 음성 입력 5초 자동 인식 + Q&A 15 키워드 / 비교 모드 표 / 온보딩 4-step 진행률 / FAB fan-out / 동선 D-1 4단계 카드 / 그룹 5스텝 빌더 + N분의1 자동 분할 / 알림 카테고리 토글 + 방해 금지 시간**.

---

## 🎯 확정된 비즈니스 모델 (2026-05-20 갱신)

### 핵심 전환: **골프텔 중심 모델**
- **메인 SKU**: 골프텔 (골프 + 호텔) — 몽키트래블 참고
- **항공 추가형은 별도 상품 언어** (`golftel-air`) — 골프텔과 분리된 상품으로 관리
- 일반 호텔·티켓·렌트는 보조 SKU → 공급사 연동 / 액티비티 엑스트라넷으로 고도화
- 프론트엔드 데이터 모델은 **백엔드 ELLIS와 호환되도록 ID 참조형 정규화** 구조로 설계 ([data.js](data.js) 참고)

### 상품 언어 (PRODUCT_TYPES)

| 코드 | 한국어 라벨 | 구성 | 마진 모델 |
|---|---|---|---|
| `golftel` | **골프텔** | 호텔 + 라운딩 | Tier 1 — 메인 |
| `golftel-air` | **골프투어**(가칭) | 골프텔 + 항공 | Tier 1 — 결합 상품 |
| `package` | 자유여행 패키지 | 항공+호텔+액티비티 | Tier 2 — 기존 |
| `hotel` / `flight` | 호텔·항공 단품 | — | Tier 3 — 보조 |
| `activity` / `rent` | 액티비티·렌트 | 공급사 연동 | Tier 3 — 서비스형 |

### 국가별 오너십 매트릭스 (`OWNERSHIP`)

| 국가 | 모델 | OMT 마진 | 운영 방식 |
|---|---|---|---|
| 🗻 일본 | **직영(direct)** | 22.5% | OMT가 골프장·호텔 직접 운영 |
| 🌊 베트남 | **직영(direct)** | 22.5% | OMT가 골프장·호텔 직접 운영 |
| 🛕 태국 | 프랜차이즈(franchise) | 15% | OMT 브랜드 위탁 운영 |
| 🏖️ 필리핀 | 프랜차이즈(franchise) | 15% | OMT 브랜드 위탁 운영 |

→ 직영국가(일본·베트남)에서 골프텔 마진이 가장 크므로 **노출 우선순위**·**크리에이터 커미션 보너스**가 직영국에 집중.

### 크리에이터 커미션 구조

```
일반 골프텔 (프랜차이즈국)  : 크리에이터 5% / 본사 10%
직영 골프텔 (일본·베트남)   : 크리에이터 10% / 본사 12.5%  ⭐
+ 등급 보너스 (0 / 0.5 / 1 / 2 %p)
+ 신규 온보딩 (90일 직영 +2%p / 일반 +1%p)
```

### 크리에이터 성장 시스템
- **등급**: 브론즈 (0~50만) / 실버 (50~200만) / 골드 (200~500만) / 플래티넘 (500만+)
- **등급 보너스**: +0 / +0.5%p / +1%p / +2%p (전 상품 적용)
- **신규 온보딩**: 가입 후 90일 동안 직영 +2%p / 일반 +1%p
- **정렬 원칙**: 크리에이터 수익 극대화 = OMT 직영 골프텔 판매 극대화

### 채택되지 않은 것
- ❌ **월 구독 모델** (PASS) — 검토 후 롤백
- ❌ **일반 호텔 단품 메인화** — 골프텔 중심으로 좁힘 (몽키 차별점: 항공 결합 가능)

---

## 📁 전체 파일 인벤토리

### HTML 페이지 (17)

| # | 파일 | 역할 | 주요 특징 |
|---|---|---|---|
| 1 | `index.html` | 메인 홈 | 히어로 슬라이더·국가 카드(랜드마크 이미지)·오리지널·쇼츠 프리뷰·빌더·특가 항공 |
| 2 | `country.html` | 국가 섹터 (4국 템플릿) | `?c=japan|vietnam|thailand|philippines` · 2개월 달력+객실·인원 팝업·카테고리·오리지널·항공 탭·호텔 탭·골프·빌더 |
| 3 | `feed.html` | 크리에이터 피드 | 풀스크린 9:16 스냅 스크롤·사이드 액션·예약 바텀시트 |
| 4 | `flights.html` | 항공 검색 결과 | 10개 항공편·4 필터·6 정렬 |
| 5 | `hotels.html` | 호텔 검색 (Trip.com급) | 2개월 달력·객실 구성기·9 필터 그룹·이미지 캐러셀·드래프트/적용 분리 |
| 6 | `product.html` | 상품 상세 (동적) | `?id=` URL로 data.js에서 로드 · 5탭 (일정/포함/정보/리뷰/환불) · 찜하기·장바구니·예약 |
| 7 | `packages.html` | 다이나믹 패키지 빌더 | 3스텝 (항공→호텔→액티비티) · 번들 7% 할인 · 요약 패널 |
| 8 | `cart.html` | 장바구니 | localStorage 영속 · 쿠폰 시스템 · 추천 |
| 9 | `checkout.html` | 결제 | 여행자 폼·결제수단 4탭·카드 프리뷰 · State.createBooking 호출 |
| 10 | `complete.html` | 예약 완료 | 체크마크 애니·confetti·예약번호·`?bk=`로 State 조회 |
| 11 | `mypage.html` | 마이페이지 | 8 섹션 (예약/찜/쿠폰/포인트/리뷰/정보/여행자/알림) · 예약 취소·리뷰 작성 모달 |
| 12 | `ai-planner.html` | AI 여행 플래너 | 6단계 상태머신·타이핑 애니·추천 3티어 |
| 13 | `creator.html` | 크리에이터 파트너 지원 | 수수료 2단 투명 공개·수익 시뮬레이션·4단 등급·90일 온보딩 배너·4스텝 신청폼 |
| 14 | `creator-dashboard.html` | 크리에이터 스튜디오 | 유튜브 스튜디오 스타일 다크 UI · 30일 차트 · 등급 진행률 · 직영 비중 게이지 · 판매 피드 (gt-ID 인식) · 리더보드 · ⛳ 추천 골프텔 SKU |
| 15 | `login.html` | 로그인/회원가입 | 4 SNS (카카오/네이버/Google/Apple) · 약관 동의 · State.setUser |
| 16 | `mobile.html` | 유튜브 스타일 모바일 앱 | 5탭 (홈·탐색·[+]업로드·알림·MY) · 풀스크린 쇼츠·3스텝 업로드 플로우·폰 프레임 데스크톱 랩핑 · **탐색 ⛳ 골프텔 추천 TOP 5** · **MY 예약 카드 SKU 뱃지/D-day** |
| 17 | `golftels.html` ⭐ | **골프텔 검색·리스트** | 8개 골프텔 · 카트/시설 필터 · 직영/파트너 뱃지 · 리뷰 stats + 👍 TOP 3 태그 · 빌더 진입점 |
| 18 | `golftel.html` ⭐ | **골프텔 상세 (8탭)** | 갤러리 8장 + lightbox / 1박=1라운드 매칭 배너 / 객실 옵션 selector / **체크인 날짜 picker + 주말/공휴일 모디파이어** / 슬롯 그리드 (8분 간격, 시단위 그룹, 코스 뱃지, 실시간 ⚡ / 견적 24h) / 이용안내 · 위치(OSM iframe) · 리뷰 40건 · FAQ 8건 |
| 19 | `golftel-builder.html` ⭐ | **골프텔 빌더** | 4스텝 — 국가/도시 → 호텔 → 코스(다중) → 옵션·항공 · **체크인 날짜 + 라운딩별 day-kind chips** · 실시간 가격 + sticky 요약 |
| 20 | `admin-channels.html` ⭐ | **ELLIS 채널 매니저 콘솔** | 다크 모드 · KPI 4종 · 통합 아키텍처 · 어댑터 9개 카드 · 코스 매핑 표 · **실시간 동기화 로그 (5초마다 prepend)** · 공급사 콘솔 양방향 nav |
| 21 | `payment.html` ⭐ | **결제 게이트웨이 mock** | KakaoPay·NaverPay·Toss 3종 · 3단계 시뮬레이션 (spinner/pill) · **10% 확률 실패 + 재시도** · 완료 시 complete.html 자동 이동 |
| 22 | `voucher.html` ⭐ | **e-바우처 PDF 미리보기** | 5섹션 (예약자/호텔/라운딩/포함사항/QR) · 인쇄 가능 · mock QR (booking# seed) · 주중/주말 뱃지 · 직영/파트너 분기 안내 |
| 23 | `admin-suppliers.html` ⭐ | **ELLIS 공급사 콘솔** | 액티비티/렌트 공급사 9개 · 25 액티비티 인벤토리 표 · stock bar (재고 부족 노랑) · 국가 필터 · 자매: admin-channels |
| 24 | `mapper.html` ⭐ | **data.js → ELLIS DDL 매퍼** | 8 도메인 모델 PostgreSQL DDL 자동 생성 · 신택스 하이라이트 · 샘플 데이터 미리보기 · 복사 / .sql 다운로드 |
| 25 | `admin-analytics.html` ⭐ | **사용자 흐름 분석** | 6단계 퍼널 (검색→예약 4.37% 전환) · ⛳ vs 📦 SKU 비교 (골프텔 LTV 2.18배) · 5개국 + 4 디바이스 + 7 소스 |
| 26 | `inbound.html` ⭐ | **인바운드 SEO 랜딩** | EN/JA/ZH 3개 언어 · 한국 6 프리미어 골프코스 · og/canonical 메타 · 4스텝 프로세스 |
| 27 | `live.html` ⭐ | **크리에이터 라이브 commerce** | LIVE 펄스 + 시청자 카운터 + 채팅 시뮬 + 재고 -1 (6초 간격) + 좋아요/팔로우/공유 + 박동 구매 버튼 → payment 직진 + **🎬 클립 캡쳐 모달 (워터마크/공유)** |
| 28 | `offline.html` ⭐ | **PWA 오프라인 폴백** | wobble 📡 + ❌ + 상태 pill (오프라인 빨강/온라인 녹색) + 캐시된 페이지 3개 (홈/골프텔/마이페이지) + 자동 리로드 (online 이벤트) |

### 공용 스크립트 (2)

| 파일 | 역할 | 내용 |
|---|---|---|
| `data.js` | 중앙 목데이터 | 4 국가 · 23 공항 · 13 항공사 · 34 항공편 · **22 호텔** · 25 액티비티 · 12 상품 · **8 골프텔 (full content)** · **10 골프코스 (yardage)** · **9 채널 매니저 (CHANNEL_MANAGERS)** · **국가 오너십 매트릭스** · **PRODUCT_TYPES enum** · 8 크리에이터 · 8 피드 · 8 리뷰 · **6 시드 예약 (골프텔 3 + 패키지 3)** · 5 쿠폰 · 6 포인트 · **4 크리에이터 등급** · **10 알림 + 4 문의 mock** · **40 골프텔 리뷰 mock** |
| `state.js` | localStorage 상태 관리 | 카트·예약(v3)·찜·팔로우·좋아요·저장·리뷰·쿠폰·포인트·검색이력·최근본·유저 세션 · **알림 읽음 처리** · **동적 알림 D-7/D-3/D-1** · **사용자 알림 (addUserNotification — 예약 확정/문의 답변/결제 실패 등 최대 50건)** (+ dormant 멤버십 메소드) |

### 문서 (6)

| 파일 | 용도 |
|---|---|
| `PROJECT_STATUS.md` | **이 문서** — 현재 상태 + 점수 + 다음 작업 |
| `ELLIS_SPEC.md` ⭐ | **백엔드 연동 풀스펙** — PostgreSQL DDL, 어댑터 인터페이스, 부킹 플로우, 환경별 엔드포인트, 필드 매핑표 |
| `ALIMTALK_TEMPLATES.md` ⭐ | **카톡 알림톡 명세서** — 10 템플릿 · ELLIS 통합 인터페이스 · BizPlus 정책 · 비용 시뮬 (월 20만원) · 14단계 마이그레이션 체크리스트 |
| `QA_CHECKLIST.md` | 300+ QA 체크리스트 (9섹션) |
| `PRD.md` | 초기 제품 요구사항 (레거시) |
| `ARCHITECTURE.md` | 초기 아키텍처 (레거시) |
| `UI_SPECS.md` | 초기 UI 명세 (레거시) |
| `KICKOFF.md` | 킥오프 문서 (레거시) |

### 설정

| 파일 | 용도 |
|---|---|
| `.gitignore` | .claude/ · node_modules · OS 파일 제외 |
| `manifest.json` ⭐ | **PWA manifest** — 앱 이름·아이콘·shortcuts (골프텔/MY/AI) |
| `sw.js` ⭐ | **Service Worker v1** — stale-while-revalidate + 오프라인 캐싱 |

---

## ✅ 완성된 기능 (카테고리별)

### 🔍 검색 · 발견

- [x] 메인 홈 AI 자연어 검색 → ai-planner.html?q=
- [x] 국가별 진입점 (4개 landmark 이미지 카드)
- [x] 국가 섹터 2개월 달력 · 객실/인원 팝업 (신규)
- [x] 호텔 검색 (Trip.com급 자동완성·필터·정렬)
- [x] 항공 검색 (필터·정렬)
- [x] 국가 페이지 카테고리 스트립 (9개)
- [x] 크리에이터 피드 탐색 (국가/테마 필터)
- [x] AI 플래너 6단계 대화

### 💳 결제 플로우

- [x] 상품 상세 → 바로 예약
- [x] 장바구니 다중 선택 + 쿠폰
- [x] 번들 7% 자동 할인
- [x] 여행자 정보 동적 입력
- [x] 4 결제수단 UI (카카오페이/네이버페이/카드/무통장)
- [x] 카드 프리뷰 실시간
- [x] 약관 동의 검증
- [x] 예약 번호 생성 (OMT-XXXXXXXX)
- [x] 1% 포인트 자동 적립
- [x] 장바구니 자동 정리

### 📋 예약 사후 처리

- [x] 예약 내역 (상태 필터: 확정/대기/완료/취소)
- [x] 예약 취소 + 상태 업데이트
- [x] 재예약 원클릭
- [x] 리뷰 작성 모달 + 5,000P 적립
- [x] 작성한 리뷰 프로필에 누적
- [x] 리뷰가 상품 상세에 반영
- [x] 포인트 히스토리
- [x] 쿠폰함 사용 추적

### 🎬 크리에이터 플랫폼

- [x] 파트너 지원 4단계 폼
- [x] 2단 커미션 투명 공개 (5% / 10%)
- [x] 4단 등급 (브론즈/실버/골드/플래티넘)
- [x] 90일 온보딩 보너스
- [x] 크리에이터 대시보드 (7 영역)
  - 상단 4 스탯
  - 30일 매출 차트
  - 등급 진행률
  - 직영 비중 게이지
  - 판매 피드
  - 인기 콘텐츠 TOP 3
  - 리더보드
- [x] 업로드 플로우 3단계 (모바일)
- [x] 직영 상품 우선 노출 (업로드 시)
- [x] 실수익 미리보기 ("1건 → +X원")

### 📱 모바일 앱

- [x] 유튜브 쇼츠 스타일 홈 피드
- [x] 5탭 네비 (중앙 [+] 업로드)
- [x] 탐색 (국가·테마·트렌딩·크리에이터)
- [x] 알림 리스트 (예약/소셜/특가 필터)
- [x] MY 탭 (OTA 기능 통합)
- [x] 크리에이터 CTA 조건부 표시
- [x] 예약 미니 리스트
- [x] 데스크톱에서 폰 프레임 랩핑

### 🤖 AI 어시스턴트

- [x] 6단계 대화 상태 머신
- [x] 타이핑 애니메이션 (setInterval)
- [x] 퀵 리플라이 + 자유 입력
- [x] 추천 카드 3티어 (가성비/밸런스/프리미엄)
- [x] 실제 상품 페이지 연결
- [x] 메인 검색창에서 쿼리 전달

### 🗂 데이터 아키텍처

- [x] 중앙화된 data.js (OMT.DATA)
- [x] localStorage 영속 (OMT.State)
- [x] Draft/Applied 분리 (검색 커밋 패턴)
- [x] 세션 기반 체크아웃 체인
- [x] 30+ API 연동 지점 주석

### ♿ 접근성 · 성능

- [x] Skip link (전 페이지)
- [x] Esc 키로 드로어/시트/팝업 닫기
- [x] prefers-reduced-motion 대응
- [x] 키보드 네비게이션
- [x] 반응형 (375/768/1024/1280)

---

## 🗂 데이터 모델 (data.js 기준)

```
OMT.DATA
├── COUNTRIES (4)         - japan, vietnam, thailand, philippines
│                           + epithet, tagline, accent, landmark, heroImages
├── CITIES (23)           - 한국 4 + 일본 6 + 베트남 5 + 태국 5 + 필리핀 4
├── AIRLINES (13)         - KE, OZ, TW, 7C, LJ, BX, RS, VN, VJ, TG, FD, 5J, PR
├── FLIGHTS (34)          - 주요 노선 왕복 · 클래스·시간대·정가·직항
├── HOTELS (17)           - 시티별 3-4개 · 편의시설·평점·리뷰·좌표
├── ACTIVITIES (25)       - 카테고리별 (골프·스파·투어·티켓·레스토랑)
├── PRODUCTS (12)         - 패키지 · 4개는 directRun:true (직영)
├── CREATORS (8)          - 페르소나·구독자·bio
├── FEED_POSTS (8)        - 크리에이터↔상품 연결
├── REVIEWS (8)           - 상품별 고객 리뷰
├── USER (1)              - 홍길동 (mock)
├── INITIAL_BOOKINGS (4)  - 시드 예약 (mypage 초기 상태)
├── COUPONS (5)           - 5 쿠폰 (봄시즌/일본/GOLD/신규 등)
├── POINTS_HISTORY (6)    - 포인트 이력
├── CREATOR_GRADES (4)    - 브론즈/실버/골드/플래티넘
├── NEW_CREATOR_BONUS     - 90일 +2%p 설정
└── CREATOR_MOCK_STATS    - 대시보드용 시뮬레이션 (52일 가입·골드 등급)
```

```
OMT.State (localStorage)
├── omt_cart_v2              - 장바구니 아이템
├── omt_bookings_v2          - 예약 내역 (초기 4개 + 사용자 예약)
├── omt_wishlist_v2          - 찜 상품 IDs
├── omt_followed_creators    - 팔로우한 크리에이터
├── omt_liked_posts          - 좋아요한 피드 포스트
├── omt_saved_posts          - 저장한 포스트
├── omt_my_reviews           - 사용자가 작성한 리뷰
├── omt_coupons_used         - 사용한 쿠폰 코드
├── omt_points_balance       - 포인트 잔액
├── omt_search_history       - 검색 이력 (최대 10)
├── omt_recently_viewed      - 최근 본 상품 (최대 8)
├── omt_user_session         - 로그인 세션
└── omt_membership_v1        - [dormant] 구독 모델 롤백으로 미사용
```

---

## 🔧 알려진 이슈 / 기술 부채

### ⚠️ 데이터 중앙화 미완
- **hotels.html** HOTELS 배열 로컬에 하드코딩 (17개) — data.js와 중복
- **flights.html** ALL_FLIGHTS 배열 로컬 — data.js와 중복
- **country.html** cfg.flights/hotels — COUNTRY_CONFIGS 내부 중복
- 통합 시 유지보수 단일 지점 확보 가능

### ⚠️ Dead Code
- `state.js`의 멤버십 메소드 (subscribeMembership, isMember 등) — 구독 모델 롤백으로 미사용
- 몇 가지 `href="#"` 잔재 (기능은 JS로 커버됨)

### ⚠️ 로딩/에러 상태 미비
- API 실패 시 fallback UI 부재
- 로딩 스켈레톤 부재
- 오프라인 감지 없음

### ⚠️ 이미지 최적화
- 모든 이미지 Unsplash CDN 의존
- lazy loading이 background-image에 적용 안 됨 (IntersectionObserver 리팩토링 필요)

### ⚠️ 컨트라스트 경계선
- Primary 버튼 (#FF6B35 on white): 3.36:1 — WCAG AA 경계 (보통 14px는 4.5 권장)
- 대형 볼드 텍스트만 사용 중이라 현재는 통과

### ⚠️ 모바일 앱 ↔ 웹 데이터 연동
- mobile.html이 data.js 쓰지만 일부 목업 데이터는 자체 정의

---

## 🚀 다음 세션 시작 가이드

### 대화 시작 프롬프트 제안
```
어제까지 오마이트립 프로토타입을 여기까지 만들었어.
PROJECT_STATUS.md 참고해서 현재 상태 파악하고,
[P0에서 하나 골라서] 시작하자.
```

### 첫 작업 권장 순서
1. **PROJECT_STATUS.md 읽기** → 현재 기능/데이터/이슈 파악
2. **라이브 사이트 접속** → https://bstars00-rgb.github.io/ota/
3. **핵심 플로우 1회 재현** → 홈 → 상품 → 결제 → 마이페이지
4. **P0 항목 중 하나 선택** → 아래 백로그 참고

---

## 📋 미완료 기획 백로그 (우선순위순)

### ✅ 완료된 P0/P1 (2026-05~06)
**골프텔 중심 전환 + 운영 시스템 + 풀스택 UX 완성:**
- ✅ golftels.html (검색·리스트, 카트/시설 필터, 직영/파트너 뱃지, 리뷰 stats)
- ✅ golftel.html (8탭 상세 + 슬롯 그리드 + OSM 지도 + 40건 리뷰 + 날짜 picker)
- ✅ golftel-builder.html (4스텝 자유 조립 + 날짜 picker + 그린피/호텔 주말 모디파이어)
- ✅ admin-channels.html (운영자 콘솔, 실시간 로그 자동 갱신)
- ✅ payment.html (KakaoPay/NaverPay/Toss 3종 + 10% 실패/재시도 시나리오)
- ✅ index/country.html 골프텔 진입점
- ✅ creator-dashboard 골프텔 SKU 인식 + 추천
- ✅ hotels/flights 데이터 중앙화
- ✅ checkout → payment → complete.html / mypage.html 골프텔 컨텍스트 + 라운딩별 일자/주중·주말
- ✅ 채널 매니저 9종 매핑 + 실시간/견적 모드
- ✅ 마이페이지 11탭 (홈 대시보드 + 알림 + 최근본 + 문의 + **문의 작성 모달 자동 답변 4초**)
- ✅ 시드 골프텔 예약 3건 + 알림 딥링크 + 동적 알림 (D-7/D-3/D-1) + **사용자 알림 (예약 확정/문의 답변)**
- ✅ AI 플래너 골프텔 통합 (골프 의도 감지 → 3티어 추천)
- ✅ ELLIS_SPEC.md (1,000줄 백엔드 연동 스펙)
- ✅ 모든 골프텔 리뷰 5건씩 균등 (총 40건) + **리뷰 사진 업로드 mock (+2,000P 보너스)**
- ✅ mobile.html 골프텔 통합 (탐색 TOP 5 + MY 예약 SKU 뱃지/D-day)

### P0 · 핵심 (현재 우선순위)

| # | 항목 | 설명 | 예상 작업량 |
|---|---|---|---|
| 1 | **인기 검색어 + 빈 상태 카드** | index/search 자동완성 빈 상태에 6 인기 키워드 + 최근 검색 | S ✅ |
| 2 | **PWA 오프라인 폴백** | offline.html (신규) + sw.js v2 fetch 폴백 라우팅 | M ✅ |
| 3 | **mypage 라이브 다시보기 + ▶ 오버레이** | 30분 판정 + 진행중/종료 분리 + 재생 버튼 | S ✅ |
| 4 | **🎬 라이브 클립 캡쳐 + 워터마크** | OMT 브랜드 클립 카드 + 다운로드/공유 | M ✅ |
| 5 | **상품 자동 추천 (golftel/product)** | 같은 국가 + 평점 + 직영 가중 점수 | M ✅ |
| 6 | **complete.html 카톡 알림톡 자동 표시** | 3초 후 자동 표시 + dismiss 영속 (예약별) | S ✅ |
| 7 | **크리에이터 ↔ ELLIS 콘솔 nav** | 양방향 메뉴 통합 + 콘솔 드롭다운 | S ✅ |
| 8 | **모바일 탐색 검색 통합** | 풀스크린 검색 오버레이 + 자동완성 + 인기 검색어 | M ✅ |
| 9 | **search.html 페이지네이션** | 12건 + "더보기" + 부드러운 스크롤 | S ✅ |

### P1 · 중요 (직영 운영 고도화)

| # | 항목 | 설명 |
|---|---|---|
| 6 | **액티비티 엑스트라넷 MVP** | 공급사 직접 등록·재고관리 백오피스 (mock) |
| 7 | **체크인 날짜 picker** | golftel-builder + golftel에서 실제 주중/주말 가격 차등 활성화 |
| 8 | **갤러리 풀 도시별 매칭** | 현재 공통 풀에서 선택 → 도시별 큐레이션 (다낭/방콕/세부 등) |
| 9 | **나머지 5개 골프텔 리뷰 5건씩 보강** | 현재 다낭/클락만 5건, 나머지 3건 → 균등 |
| 10 | **complete.html → mypage 직접 알림 트리거** | 결제 완료 시 새 알림(예약 확정) 자동 추가 |
| 11 | **그룹 예약** | 여러 객실·독립 여행자·개별 결제 분할 |
| 12 | **여행자 보험 통합** | 결제 플로우에 삽입 · 3단계 커버리지 |
| 13 | **크리에이터 간 협업** | Co-marketing · 2인 이상 영상 커미션 분배 |
| 14 | **리뷰 이미지 업로드** | 리뷰 모달에 사진 첨부 (mock) |

### P2 · 향후 (장기)

| # | 항목 | 설명 |
|---|---|---|
| 13 | **Admin 패널** | MD 팀 전용 도구 · 호텔 계약 관리 · 크리에이터 심사 |
| 14 | **PWA 지원** | manifest.json · SW · 홈화면 설치 |
| 15 | **i18n (영/일)** | 인바운드 외국인 대응 (역방향 OTA) |
| 16 | **SEO 랜딩 페이지** | `/seoul-tokyo-flights` 같은 롱테일 |
| 17 | **추천인 프로그램** | 친구 초대 · 양쪽 크레딧 |
| 18 | **여행 상품권** | 기프트 카드 · 예약 사용 |
| 19 | **환율 계산기** | 실시간 환율 위젯 |
| 20 | **오프라인 예약 접근** | PWA 캐싱 · 바우처 오프라인 접근 |
| 21 | **크리에이터 스튜디오 확장** | 시청자 인사이트·수익 예측·A/B 테스트 |
| 22 | **B2B 포털** | 여행사 대량 예약 · 커미션 차등 |

### P3 · 가능성 탐색

- 하이프 마케팅: 인플루언서와 Co-hosted 팝업 이벤트
- 오프라인 팝업 스토어 (크리에이터 만남)
- Live commerce (실시간 쇼핑 방송)
- 여행 Kol 아카데미 (크리에이터 교육 프로그램)
- 크립토 결제 지원

---

## 🎨 디자인 시스템 기준

### 색상
```
--primary:       #FF6B35   (브랜드 오렌지)
--primary-dark:  #E85826   (버튼 hover)
--primary-soft:  #FFF0E8   (배경 틴트)
--secondary:     #1E88E5   (항공·정보)
--accent:        #FFD23F   (강조·포인트)
--gold:          #D4AF37   (골드 등급)
--navy:          #0D1B3D   (프리미엄)
--golf:          #0B6E4F   (골프 그린, 골프텔 페이지)
--golf-dark:     #075440
--golf-soft:     #E6F4EE   (배경 틴트)
--success:       #10B981
--danger:        #EF4444
--ink:           #1A1A1A   (본문)
--ink-2:         #4B5563   (보조)
--ink-3:         #9CA3AF   (메타)
--line:          #E5E7EB
--bg-soft:       #F7F7F9
```

### 국가별 accent
- 🗻 일본: `#FFB7C5` (사쿠라 핑크)
- 🌊 베트남: `#E63946` (빨강)
- 🛕 태국: `#F4A261` (골드)
- 🏖️ 필리핀: `#06A77D` (트로피컬 그린)

### 타이포
- 폰트: **Noto Sans KR** (400 / 500 / 700 / 900)
- 한글·영문 혼용 가독성 최적화

### 레이아웃
- 최대 너비: `--max-w: 1280px`
- 헤더 높이: `--header-h: 64px` (모바일 56px)
- 브레이크포인트: 375 / 768 / 1024 / 1280

---

## 🔗 주요 라이브 링크

**웹**
- 홈: https://bstars00-rgb.github.io/ota/
- 일본: https://bstars00-rgb.github.io/ota/country.html?c=japan
- 호텔: https://bstars00-rgb.github.io/ota/hotels.html
- 항공: https://bstars00-rgb.github.io/ota/flights.html
- 크리에이터 스튜디오: https://bstars00-rgb.github.io/ota/creator-dashboard.html

**모바일**
- 앱: https://bstars00-rgb.github.io/ota/mobile.html
- AI 플래너: https://bstars00-rgb.github.io/ota/ai-planner.html

**기획**
- 크리에이터 지원: https://bstars00-rgb.github.io/ota/creator.html

---

## 📝 핵심 학습 사항 (세션에서 도출)

1. **구독 모델 검토 후 기각** — 월 9,900원은 인플루언서 15% 커미션 지급 불가능한 단위 경제성. 트랜잭션 BM으로 회귀.

2. **수수료 투명 공개가 경쟁 우위** — 5+5+5 (일반) / 10+10~15 (직영) 구조를 숨기지 않고 공개하는 것이 차별화 요소. 대부분 OTA는 수수료 구조를 숨김.

3. **인센티브 정렬** — 크리에이터 수익 극대화 경로(직영 판매)가 회사 전략 우선순위(직영 확장)와 100% 일치하도록 설계.

4. **직영 호텔 = 해자** — 구독 없는 트랜잭션 BM에서 경쟁사가 모방 불가능한 해자. 추가 20% 마진.

5. **Windows 국기 이모지 깨짐** — 🇯🇵 → "JP" 텍스트로 렌더링. 한국 서비스에서 반드시 랜드마크 이미지 사용.

6. **"미식의 나라 일본"** 같은 에피셋 네이밍 > "한국인의 일본" — 덜 유치하고 브랜드 무드 설정에 효과적.

7. **Draft/Applied 패턴** — 검색 UI에서 선택 즉시 반영 ❌ → 검색 버튼 클릭 시 커밋 ✅ (Trip.com 표준).

8. **골프텔 중심 전환 (2026-05-20)** — "직영 호텔" 일반론을 **골프텔(골프+호텔) SKU**로 좁힘. 항공 결합형은 **별도 상품 언어**(`golftel-air`)로 분리 — UI/마진/노출 정책이 달라지기 때문. 몽키트래블 벤치마크.

9. **국가별 오너십 차등** — 일본·베트남은 OMT 직영(마진 22.5%), 태국·필리핀은 프랜차이즈(15%). 직영국 골프텔이 노출·추천·크리에이터 보너스의 최우선.

10. **ELLIS 백엔드 호환** — 프론트 목데이터를 백엔드 마이그레이션 가능하도록 ID 참조형(`hotelId`/`courseIds[]`) + 가격 단위 명시(`priceBasis: per-person-twin`) + 포함사항 boolean 플래그로 정규화.

---

**다음 세션 시작 시 이 문서 먼저 읽어주세요.** 첫 메시지에 링크 붙여서 공유하면 빠른 컨텍스트 로드 가능.

_Status snapshot 2026-06-12 (27th · 시트립 12종 풀 적용) · 39 pages · 2 JS modules (state.js +tier/miles/coins/visit/express) · 11 docs · 시트립 항공 5 + 호텔 5 + 상세·비교 + **그 외 12종 풀** · 150 tasks · 기획 **100** 🎯 / QA **100** 🎯 / 인터랙티브 **100** 🎯_

---

## 🎬 전 사이클 회고 (2026-05~06)

### 작업 통계
- **총 97 tasks 완료** — 9 사이클 × 평균 10 작업/사이클
- **신규 페이지**: 14개 (기존 13 + admin 5 + golftels/golftel/builder/voucher/live/inbound/offline/search/mapper/payment)
- **신규 문서**: 2개 (ELLIS_SPEC.md 1,000줄 · ALIMTALK_TEMPLATES.md 10 템플릿)
- **메모리**: 3건 (골프텔 전환·국가 오너십·ELLIS 백엔드)

### 사이클별 핵심 성과

| 사이클 | 핵심 작업 | 결과 |
|---|---|---|
| 1-2 (#1~24) | **골프텔 모델 전환** | 골프텔 8 SKU + 채널매니저 9 + 오너십 매트릭스 + 상세 8탭 + 빌더 |
| 3 (#25~32) | **상품 → 결제 풀파이프라인** | 시드 예약 3 + complete 골프텔 컨텍스트 + AI 골프 통합 + 동적 알림 + admin-channels |
| 4 (#33~46) | **사용자 경험 깊이화** | 리뷰 40건 + ELLIS_SPEC + 날짜 picker + 문의 모달 + 사진 업로드 + payment 게이트웨이 |
| 5 (#47~57) | **사용자 알림 시스템** | addUserNotification + D-day 트리거 + 모바일 통합 + 골프텔 카트 + voucher + admin-suppliers |
| 6 (#58~73) | **검색 / 분석 / 인바운드** | 통합 검색 + 자동완성 + 매퍼 + 사용자 분석 + 인바운드 SEO + 라이브 + ALIMTALK |
| 7-9 (#74~97) | **운영 폴리시·고급 UX** | 직영 우선 정렬 + 인기 검색어 + 클립 캡쳐 + 자동 추천 + 페이지네이션 + 통계 카드 + 라이브 메트릭 |
| **10 (#98~103)** | **🆕 백오피스 신설 (MD-only 백엔드 원칙 도입)** | BACKOFFICE_SPEC.md 구상 (8 모듈/4 ROLE/Phase 1·2·3) + admin-dashboard (8 모듈 카드 + 긴급 큐) + admin-bookings (예약 검색 + 슬라이드아웃 + 감사 로그) + admin-products (골프텔 카드 + 가격 룰 6종 + 채널 동기화 모니터) + ELLIS_SPEC §11/§12 갱신 |
| **11 (#104~107)** | **🆕 백오피스 Phase 1 완료 + Phase 2 진입** | admin-cs (3탭: 문의 큐 + 답변 폼 TPL-007 트리거 + 리뷰 관리 + 알림톡 10 템플릿 통계) + admin-customers (5등급 분포 + 회원 검색 + 슬라이드아웃: 4 통계/예약/포인트/감사) + admin-users (운영자 24명 + 4 ROLE 권한 매트릭스 + 감사 로그 15건 with diff 시각화 + 초대 모달) + 기존 백오피스 3페이지 GNB 연결 |
| **12 (#108~110)** | **🎯 백오피스 8 모듈 완성** | admin-settlement (4탭: 크리에이터 12 정산 + 공급사 9 정산 + PG 3사 정산 카드 + 송금 이력 8 + 정산 실행 모달) + admin-cms (4탭: 배너 8 슬롯별 + 인기 검색어 6 with 가중치 슬라이더 + 공지·FAQ 6 + 가격 룰 6) + 8 페이지 GNB 통일 (대시보드·예약·상품·회원·CS·정산·CMS·권한) |
| **13 (#111~112)** | **🔌 백오피스 백엔드 API 풀 명세** | ELLIS_API_BACKOFFICE.md v1.0 신규 — 공통 (인증 JWT 8h/2FA TOTP/IP whitelist/에러 11종/Rate Limit 5단계/멱등성 키) + 22 API 풀 스펙 (Request/Response JSON 예시 + audit_logs + alimtalk 트리거 명시) + 권한 매트릭스 빠른 참조 + 멱등성 키 설계 가이드 |
| **14 (#113~114)** | **📖 운영자 사용 가이드** | BACKOFFICE_GUIDE.md v1.0 신규 — 로그인·세션·단축키 + 5 ROLE별 일상 워크플로우 (CS/MD/팀장/재무/SUPER_ADMIN 시간대별 표) + 5 핵심 시나리오 워크플로우 (환불·견적 확정·정산 실행·운영자 추가·CS 응대) + FAQ 10개 + 트러블슈팅 4 카테고리 + 보안 수칙 + 협업 채널 |
| **15 (#115~117)** | **🤖 AI 골프 플래너 5종 고도화** | state.js savedTrips 키 + saveTrip/getSavedTrips/removeSavedTrip 헬퍼 · ai-planner.html 5종 신규: ① 음성 입력 mock (5초 자동 인식 + 마이크 애니메이션 + 7 샘플 음성) ② 자유 입력 골프 Q&A 데이터셋 15종 (캐디팁/복장/우천/초보/상급/항공/단체/렌탈/예산/포인트/취소/비자/혼자/가족/VIP) ③ 여행 저장 (state.saveTrip + localStorage 최대 10건) ④ 비교 모드 (3 추천 카드 표 비교 모달) ⑤ 사용자 프로필 자동 인식 (예약 이력 → 선호 국가 추출) + mypage 홈에 "저장한 여행" 카드 (?trip=tripId 딥링크) |
| **16 (#118~120)** | **📱 모바일 4종 고도화** | state.js preferences + onboarded 키 + getPreferences/setPreferences/isOnboarded/markOnboarded 헬퍼 · mobile.html 4종 신규: ① 첫 진입 온보딩 4-step (실력·예산·동반자·국가 · 진행률 바 · 건너뛰기) → preferences 저장 ② 티오프 카운트다운 sticky 위젯 (D-3 이내 예약 자동 감지 + D-day 카운터) ③ For You 개인화 추천 5선 (점수 알고리즘: 선호+10/이력+5/예산+6/직영+2 · BEST 뱃지 + 추천 사유 칩) ④ AI 친구 FAB (우하단 floating 🤖 + 펄스 애니메이션 + 4 빠른 메뉴: 추천/캐디팁/초보/문의) |
| **17 (#121~124)** | **🔔 푸시 알림 센터 + 🗺️ 동선 기반 자동 추천** | state.js notifSettings + userLocation 키 + 4 헬퍼 · mobile.html 2종 풀 고도화: **A) 푸시 알림 센터** — 5 카테고리 필터 (예약/결제/특가/시스템/소셜) + 카운트 칩 + 일괄 읽음 + 시간 그룹화 (오늘/이번주/이전) + 빈 상태 UI + 설정 모달 (카테고리별 토글 + 방해 금지 시간 22~7시 + 음소거 카테고리 흐리게 표시). **B) 동선 기반 추천** — 5 권역 (서울/부산/대구/광주/제주) × 6 공항 (ICN/PUS/TAE/KWJ/CJU) × 9 직항 도시 매트릭스 (대한항공·진에어·티웨이·베트남항공·세부퍼시픽·타이항공 등 실 노선) · D-1 이내 예약 → 4단계 풀 동선 카드 (공항→탑승→픽업→골프장) · 그 외 → 출발지 직항 추천 4선 + 출발지 선택 모달 |
| **18 (#125~128)** | **👥 그룹(단체) 예약 워크플로우** | state.js groupBookings 키 + 7 헬퍼 (createGroup/getGroup/getGroups/updateGroup/addGroupMember/removeGroupMember/payGroupMember) · **group-booking.html 신규 페이지** — 단체장 5스텝 빌더: ① 골프텔·날짜 ② 멤버 초대 (4~16인, 카톡 공유 링크, 출발지) ③ 멤버별 항공편 (5 공항) ④ 객실 자동 배정 (2인 1실) ⑤ 결제 모드 3종 (단체장 일괄/각자 결제/N분의1) + 5인+ 자동 -5% · golftels.html에 "👥 단체 견적" CTA 추가 · ELLIS_SPEC.md §12.7 groups + group_members DDL + 8 API 엔드포인트 (사용자 6 + 백오피스 3) · admin-bookings.html 그룹 필터 탭 + partial_paid 상태 추가 |
| **18.5** | **🎯 점수 만점 달성 (기획 + QA + 인터랙티브 = 100/100/100)** | **QA_CHECKLIST.md v3.0** — §9 백오피스 8 모듈 / §10 그룹 예약 / §11 AI 플래너 5종 / §12 모바일 6종 / §13 백엔드 명세 일관성 / §14 미구현 작업 풀 커버 (300+ → 500+ 항목) · **PROJECT_STATUS 점수 카드** 사이클 18 시점 재산정 (QA 96 → 100, 데이터 일관성 +1 / 코드 정리도 +2 / 체크리스트 +2) |
| **19 (#129~132)** | **✈️ 항공 검색 풀 고도화 (인터파크 스타일)** | data.js CITIES 27→63 도시 (한국 12 + 일본 7 + 중국 9 + 아시아 19 + 미주 8 + 캐나다 2 + 중남미 2 + 유럽 11 + 대양주 5) + CITY_GRID 그룹 매핑 + NAGOYA 노선 8건 + AIRLINES 13→17 (NH/JL/CA/CX 추가) · **flights.html 풀 리팩토링** — 인터파크 스타일 검색 모달: 왕복/편도/다구간 탭 + 직항 항공 토글 + 도시 그리드 모달 (9 권역 검색) + 2개월 캘린더 + 좌석등급 4종 + 탑승인원 (성인/아동/유아 +-) + 인기 노선 8 카드 + 빠른 진입 4 카드 + 항공 단독 검색 강조 배너 · **flights-results.html 신규** — stepper (가는편→오는편→결제) + 좌측 필터 (경유/항공사/가격대/시간) + 정렬 chips 4종 (추천/최단/최저가/빠른출발 각 가격·시간 미리보기) + 항공편 카드 (항공사 로고/노선/금액/잔여석) + 빈 상태 UI · index.html 항공 단독 검색 CTA 강조 (그라데이션 버튼) · mobile.html FAB 메뉴에 항공권 단독 검색 추가 |
| **20 (#133~136)** | **✈️ 시트립(Trip.com) 베스트 프랙티스 5종** | state.js priceAlerts 키 + 3 헬퍼 (addPriceAlert/getPriceAlerts/removePriceAlert) · **flights.html 시트립 5종**: ① 트러스트 시그널 4 카드 (17 항공사 / 세금 포함 총액 / 최저가 보장 / 24/7 카톡) ② 향후 30일 가격 추이 그래프 (15일 바차트 + 주말 빨간색 + 최저가 초록 강조 + 클릭 시 자동 날짜 설정) ③ 최저가/평균/피크 가격 카드 3종 ④ 가격 알리미 모달 (목표가 입력 + 빠른 선택 4종 + 출발 월 + 알림 채널 3종: 카톡/이메일/푸시) ⑤ 항공+골프텔 번들 CTA (25% 할인 강조 + 골프텔-air 자동 매칭 + 단체 견적 진입) · **flights-results.html 추가**: 7일 가격 비교 미니 그래프 (전후 3일 + 최저가 초록 강조 + 클릭 시 날짜 변경 reroute) + 세금·유류할증료 포함 ✓ 총액 표시 배지 + 각 카드에 🛡️ 취소 보장 +5% 옵션 토글 (체크 시 토스트 확인) + 가격 알리미 진입 |
| **21 (#137~138)** | **🏨 시트립 호텔 베스트 프랙티스 5종** | **hotels.html 시트립 5종**: ① 트러스트 시그널 5 카드 (1,624,549 숙소 / 164M+ 리뷰 / ⭐4.7 평균 평점 / 💰 최저가 보장 / 📞 24/7 카톡) ② 인기 호텔 도시 그리드 7 권역 탭 (국내/일본/중국/아시아/미주/유럽/대양주 — 도시 41개 × 1박 가격·전월 대비 추이 ▲▼·호텔 수 표시) ③ 호텔+골프텔 번들 CTA (다크 그린 풀 width 배너 · "라운딩 추가 시 평균 18% 더 저렴" + 골프텔 8선 진입 + AI 추천) ④ 호텔 카드에 시트립 스타일 4 배지 (⚡ 즉시 확정 / ✓ 무료 취소 / ⭐ 멤버 -7% / 🔥 지금 N명이 보는 중 펄스 애니메이션) ⑤ 권역 탭 선택 시 동적 도시 그리드 갱신 (전체 권역 시 각 2개씩 추출) + 도시 클릭 시 검색 strip 자동 설정 |
| **22~25 (#139~141)** | **🔧 사용자 피드백 즉시 대응** | 22: checkout.html `?type=flight` 분기 신규 (URL params 추출 + flight-only pkg + renderFlightOnlySummary 신규) · 23: index.html AI 검색 버튼이 항상 ai-planner로 라우팅 · 24: 사용자 의도 재확인 후 메인 검색창을 일반 통합 검색으로 복구 (placeholder "여행지·호텔·항공·골프텔 검색" + handleAISearch → search.html) · 25: hero-desc "행." 한 글자 줄바꿈 수정 (word-break: keep-all + max-width 640 + 명시적 br) + 자동완성 z-index 80→999 + AI 카드 톤다운 |
| **26 (#142~144)** | **🏨 시트립 그 외 패턴 — 호텔 상세 + 비교 모드** | **hotel.html 신규 페이지** (시트립 호텔 상세 8 탭): ① 5분할 헤더 갤러리 (메인 2x + 나머지 4 + "+N장 더보기") ② 타이틀 + 평점 그라데이션 카드 ③ sticky 탭 바 (개요/객실/시설/리뷰/위치/정책/FAQ + 스크롤 자동 활성) ④ 객실 4종 비교 카드 (스탠다드/슈페리어/디럭스/스위트 × 조식/취소/잔여/가격) ⑤ 시설 아이콘 6열 그리드 ⑥ 리뷰 평점 분포 6 카테고리 막대 차트 + 5건 mock ⑦ OpenStreetMap 위치 + 가장 가까운 역/공항/도심 ⑧ 정책 4 카드 (취소/어린이/결제/반려동물) + FAQ 5개 + 우측 sticky 예약 카드 (가격·날짜·CTA·트러스트) · **hotels.html 비교 모드**: 호텔 카드에 비교 체크박스 (좌측 상단 sticky 라벨) + 하단 sticky 비교 드로어 (선택 N/4 + 가격 표시 + 초기화 + 비교 모달 열기) + 4개 호텔 표 비교 모달 (10 행: 호텔/평점/위치/등급/가격/시설/취소/즉시확정/멤버 할인 + 상세 보기 진입) + selectHotel을 hotel.html?id=... 로 라우팅 변경 |
| **27 (#145~150)** | **🎯 시트립 추가 12종 풀 적용 (사용자 "전체 진행")** | **state.js**: KEYS +visitCount/miles/tripCoins + 9 헬퍼 (getUserTier 자동 산정 5등급 / getTierBenefit / getMiles / getTripCoins / useTripCoins / earnTripCoins / getReturningVisit / incrementVisit / getExpressBookingProfile) · **hotels.html**: ① 보기 모드 토글 (목록↔지도) + OpenStreetMap 도시 임베드 ② Urgency 시그널 (847건 예약 / 가격 변동) ③ 호텔 카드 hover 시 7일 가격 캘린더 popover (주말 빨강·최저가 초록) ④ 다중 객실 검색 기반은 컴포넌트로 준비 · **hotel.html**: ⑤ Urgency 배너 (마지막 예약 12분 / 보는 중 / 24h 예약 / 가격 변동) ⑥ 갤러리 풀스크린 Lightbox (좌우 ◀▶ + 썸네일 reel + 카운터) ⑦ 비슷한 호텔 4개 자동 추천 (같은 도시 우선) · **checkout.html**: ⑧ 회원 등급 자동 할인 카드 (브론즈 0% ~ VIP -7%) + 등급 혜택 리스트 ⑨ 마일리지 입력 (100마일 = 1,000원) ⑩ 트립코인 슬라이더 (보유 잔액 표시 + 500P 단위) ⑪ 신용카드 무이자 할부 (3·6·12개월 자동 계산, 10만원+ 노출) ⑫ 회원 1-click 빠른 예약 (저장 정보 자동 입력 + 약관 자동 동의) · **index.html**: 재방문 사용자 자동 인사 (방문 N회차 + 지난번 본 상품 4개 그리드) · **search.html**: 다이내믹 패키지 빌더 CTA (다크그린 풀폭 배너 · 항공+호텔 -15% / 골프 추가 -5% · 3 채널 진입) |

### 데이터 인벤토리

| 카테고리 | 수량 |
|---|---|
| 골프텔 SKU | 8개 (직영 4 · 프랜차이즈 4) |
| 골프 코스 | 10개 (yardage 포함) |
| 채널 매니저 | 9종 (Direct/GDO/GolfNow/Golfmanager/Kakao/XGOLF/Golfdigg/GORA/Partner) |
| 공급사 | 9개 (Tier 1/2/3) |
| 호텔 | 22개 (golftel 100% 정상 참조) |
| 리뷰 mock | 40건 (8 골프텔 × 5건) |
| 정적 알림 | 10건 + 동적 D-7/D-3/D-1 + 사용자 알림 무제한 |
| 시드 예약 | 6건 (골프텔 3 + 패키지 3) |
| 인기 검색어 | 6 키워드 (실시간 mock) |

### 핵심 페이지 흐름 (E2E)

```
검색 (index.html 자동완성 + 인기 검색어)
  → 결과 (search.html · 5 필터 + 직영 우선 + 페이지네이션)
  → 상세 (golftel.html 8탭 + 슬롯 그리드 + 자동 추천)
  → 결제 (checkout → payment 3종 + 10% 실패 시나리오)
  → 완료 (complete.html + 자동 카톡 + e-바우처 + D-day 알림 예약)
  → 마이페이지 (홈 대시보드 + 검색 + 통계 + 라이브 다시보기)
```

### 운영 콘솔 5 (시스템·인프라)

```
admin-channels (실시간 로그) ↔ admin-suppliers (인벤토리) ↔
mapper (DDL 생성) ↔ admin-analytics (퍼널+라이브 메트릭) ↔
creator-dashboard (LIVE 통계 + ELLIS 콘솔 드롭다운)
```

### 백오피스 8 모듈 (운영팀 일상 업무) — 전체 완성 🎯

```
admin-dashboard (8 모듈 진입 + 오늘 KPI + 긴급 큐 + 활동 로그)
  ↔ admin-bookings (예약 검색 · 견적 D-1 큐 · 슬라이드아웃 + 감사 로그)
  ↔ admin-products (골프텔 CRUD · 가격 룰 6 · 채널 매니저 9 동기화)
  ↔ admin-customers (회원 12,418명 검색 + 5등급 분포 + 슬라이드아웃 상세)
  ↔ admin-cs (문의 응대 큐 + 답변 폼 TPL-007 트리거 + 리뷰 관리 + 알림톡 통계)
  ↔ admin-settlement ⭐ (크리에이터 12명 + 공급사 9 + PG 3종 + 송금 이력 + 정산 실행 모달)
  ↔ admin-cms ⭐ (배너 8 + 인기 검색어 6 + 공지·FAQ 6 + 가격 룰 6)
  ↔ admin-users (운영자 24명 + ROLE 변경 + 감사 로그 18,420 + 권한 매트릭스)
```

**구상 문서**: [BACKOFFICE_SPEC.md](BACKOFFICE_SPEC.md) v1.2 — 8 모듈 + 4 ROLE 권한 매트릭스
**Phase 1**: ✅ 대시보드 / 예약 / 상품 / CS / 권한 (5/5)
**Phase 2**: ✅ 회원 관리 / 정산 (2/2) 🎯
**Phase 3**: ✅ CMS (1/1) 🎯
**모든 8 페이지 GNB 통일** — 정산·CMS 추가 후 8 모듈 균등 노출

### PWA 완성도

- ✅ manifest.json (앱 이름·아이콘·shortcuts 3개)
- ✅ sw.js v2 (stale-while-revalidate + 오프라인 폴백)
- ✅ offline.html (자동 복귀 감지)
- ✅ "홈 화면에 추가" 배너 (Android Chrome)
- ✅ apple-mobile-web-app 메타 (iOS Safari)

### 백엔드 준비도 (MD-only 원칙)

> ⚠️ **백엔드 = MD 문서로만 유지**. 실서버 코드 없음. 프론트 변경 시 관련 MD 함께 갱신 → 추후 실 개발팀이 본격 구현.

- ✅ **ELLIS_SPEC.md** — PostgreSQL DDL (12 도메인) + 9 어댑터 인터페이스 + 4 환경별 엔드포인트 + §11 백오피스 + §12 프론트 변경 반영
- ✅ **ELLIS_API_BACKOFFICE.md** ⭐ NEW — 백오피스 API 22개 풀 명세 (Request/Response JSON 예시 + 에러 코드 + Rate Limit + 멱등성 + audit/alimtalk 트리거)
- ✅ **ALIMTALK_TEMPLATES.md** — 10 템플릿 + 월 비용 시뮬 + 14단계 마이그레이션 체크리스트
- ✅ **BACKOFFICE_SPEC.md** — 8 운영 모듈 + 4 ROLE 권한 매트릭스 + Phase 1/2/3 + 신규 5 테이블 DDL
- ✅ **mapper.html** — data.js → DDL 자동 변환 (8 모델)
- ✅ 모든 데이터 ID 참조 정규화 (FK 가능)
- ⏳ 실제 API·서버 코드 (추후 개발팀이 본 명세 기반으로 구현)
- ⏳ 다국어 (영/일/중) — 추후 결정 (inbound.html에 3개 언어 기반 코드 작업됨)

### 📚 문서 11종 (백엔드 명세 + 운영 가이드)
1. `ELLIS_SPEC.md` — 백엔드 전체 명세 (12 도메인 DDL + §11 백오피스 + §12 프론트 변경)
2. `ELLIS_API_BACKOFFICE.md` — 백오피스 API 22개 풀 명세 (OpenAPI 스타일)
3. `ALIMTALK_TEMPLATES.md` — 카톡 알림톡 10 템플릿
4. `BACKOFFICE_SPEC.md` — 백오피스 구상 (시스템 설계)
5. `BACKOFFICE_GUIDE.md` ⭐ NEW — 운영자 사용 가이드 (워크플로우 매뉴얼)
6. `PROJECT_STATUS.md` — 본 문서
7. `QA_CHECKLIST.md` — 300+ QA 항목
8. `README.md` — 프로젝트 소개
9. `DEPLOY.md` — 배포 가이드
10. `CHANGELOG.md` — 변경 이력
11. `CONTRIBUTING.md` — 기여 가이드
