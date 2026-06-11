# 카카오 알림톡 템플릿 명세서 (BizPlus)

**버전**: v1.0 · 2026-06-11
**대상**: 카카오 비즈니스 알림톡 (BizPlus / KakaoTalk Channel)
**연동 방향**: ELLIS 백엔드 → 카카오 BizPlus API → 사용자
**현재 상태**: 프론트엔드 mock (complete.html showKakaoPreview) → 실제 API 연동 대기

---

## 1. 연동 개요

### 1.1 발송 흐름

```
[ELLIS Booking Service]
       │
       │ 1. 트리거 이벤트 발생 (예: 예약 확정)
       ▼
[Notification Dispatcher]
       │
       │ 2. 템플릿 코드 + 변수 매핑
       ▼
[KakaoBiz Adapter]
       │
       │ 3. POST /v2/sender/send
       │    { plus_friend_id, message_type:"AT", template_code, vars, phone_number }
       ▼
[Kakao BizPlus API]
       │
       │ 4. 사용자 카톡 발송 (광고 X · 정보성)
       ▼
[Webhook Callback]
       │
       │ 5. 발송 결과 → ELLIS 기록 (성공/실패/읽음)
       ▼
[notifications 테이블 UPDATE]
```

### 1.2 인증

- **API Key**: BizPlus 발급 (환경별 분리: dev/stg/prod)
- **Plus Friend ID**: `@ohmytrip` (검토 후 발급)
- **발신번호 등록**: 1588-0000 (KISA 검증 필요)

### 1.3 BizPlus 정책 준수

- 정보성 메시지(예약 확정·일정 안내·결제 정보) → 24시간 발송 가능
- 광고성 메시지(특가·쿠폰 알림) → 별도 마케팅 수신 동의 + 야간 발송 금지 (21~08시)
- 1일 발송 한도: 사용자당 최대 5건
- 템플릿은 카카오 사전 심사 (영업일 2~3일)

---

## 2. 템플릿 카탈로그 (10개)

### TPL-001 · 예약 확정 (booking_confirmed)

**용도**: 결제 완료 → 예약 확정 즉시 발송
**유형**: 정보성
**발송 트리거**: `bookings.status = 'confirmed'` 트랜잭션 commit
**연동 코드**: complete.html addUserNotification → ELLIS dispatch

**템플릿 본문**:
```
[오마이트립] 예약 확정 안내

#{고객명}님, #{상품유형} 예약이 확정되었습니다 🎉

▪︎ 예약번호: #{예약번호}
▪︎ 상품명: #{상품명}
▪︎ 출발일: #{출발일}
▪︎ 인원: 성인 #{인원}명
▪︎ 결제금액: #{결제금액}원

자세한 사항은 아래 버튼으로 확인해 주세요.

24시간 카카오 상담 1588-0000
```

**버튼**:
- 웹링크: "예약 확인서 보기" → `https://ohmytrip.kr/complete.html?bk={예약번호}`
- 웹링크: "📄 e-바우처 PDF" → `https://ohmytrip.kr/voucher.html?bk={예약번호}`

**변수**:
```json
{
  "고객명":   "string (최대 20자)",
  "상품유형": "골프텔 | 골프투어 | 패키지",
  "예약번호": "OMT-XXXXXXXX",
  "상품명":   "string (최대 40자)",
  "출발일":   "YYYY-MM-DD",
  "인원":     "integer",
  "결제금액": "number (천단위 콤마)"
}
```

---

### TPL-002 · 골프 라운딩 D-7 리마인더 (golftel_d7)

**용도**: 출발 7일 전 자동 발송 (cron 일 00:30)
**유형**: 정보성
**연동 코드**: state.js `_buildDynamicNotifications` D-7

**템플릿 본문**:
```
[오마이트립] ⛳ 골프 라운딩 D-7

#{고객명}님, #{상품명} 출발이 7일 남았어요.

📋 출발 전 준비 안내
▪︎ 여권 잔여 유효기간 6개월 이상 확인
▪︎ 골프 클럽 휴대수하물 규정 체크
▪︎ 캐디팁 현금 준비 (#{캐디팁_안내})
▪︎ 골프웨어 (카라티 권장, 청바지 불가)

티오프 30분 전 골프장 도착·체크인 필수입니다.
```

**버튼**:
- 웹링크: "이용 안내 보기" → `https://ohmytrip.kr/golftel.html?id={상품ID}#guide`
- 채널 추가: "@ohmytrip 카톡 상담"

---

### TPL-003 · 골프 라운딩 D-3 체크리스트 (golftel_d3)

**용도**: 출발 3일 전 자동 발송
**유형**: 정보성

**템플릿 본문**:
```
[오마이트립] 📋 출국 D-3 체크리스트

#{고객명}님, #{상품명} 출발이 3일 남았어요.

✅ 최종 체크리스트
1) 여권 (유효기간 6개월 이상)
2) 골프 클럽 (위탁수하물, 케이스 추천)
3) 골프웨어 + 골프화 (소프트 스파이크)
4) 캐디팁 현지 통화 환전
5) 여행자보험 가입 확인

#{픽업_안내}

비상 연락 1588-0000 (24시간)
```

**변수**:
```json
{
  "픽업_안내": "공항 픽업 #{도착시각} #{지역} (#{기사명} 010-XXXX-XXXX 대기)"
}
```

---

### TPL-004 · 티오프 시간 확정 (tee_time_confirmed)

**용도**: OMT 견적 모드 슬롯이 골프장과 협의 완료 시
**유형**: 정보성
**트리거**: `booking_slots.channel_confirmed_at` UPDATE 시 webhook

**템플릿 본문**:
```
[오마이트립] ⛳ 티오프 시간 확정

#{고객명}님, 골프 라운딩 #{회차}회차 시간이 확정되었습니다.

▪︎ 코스: #{코스명}
▪︎ 일자: #{라운딩일자}
▪︎ 티오프: #{티오프시간}
▪︎ 카트: #{카트정책}
▪︎ 캐디: #{캐디언어}

📌 티오프 30분 전 골프장 도착·체크인 필수
```

**버튼**:
- 웹링크: "예약 상세" → complete.html?bk=

---

### TPL-005 · 결제 완료 (payment_completed)

**용도**: 결제 게이트웨이 성공 콜백 직후 (booking_confirmed보다 먼저)
**유형**: 정보성

**템플릿 본문**:
```
[오마이트립] 💳 결제가 완료되었습니다

#{고객명}님의 결제가 정상 처리되었어요.

▪︎ 결제수단: #{결제수단}
▪︎ 결제금액: #{결제금액}원
▪︎ 결제일시: #{결제일시}
▪︎ 승인번호: #{승인번호}

영수증은 마이페이지 > 결제 내역에서 확인하실 수 있습니다.
```

**버튼**:
- 웹링크: "영수증 보기" → mypage.html#points

---

### TPL-006 · 결제 실패 (payment_failed)

**용도**: 결제 게이트웨이 거절 콜백 시
**유형**: 정보성 (긴급)

**템플릿 본문**:
```
[오마이트립] ⚠️ 결제 처리 실패

#{고객명}님, #{상품명} 결제가 정상 처리되지 않았습니다.

▪︎ 실패 사유: #{실패사유}
▪︎ 결제수단: #{결제수단}

5분 내 재시도하시거나, 다른 결제 수단으로 시도해주세요.
```

**버튼**:
- 웹링크: "다시 시도" → payment.html?bn=&pay=
- 웹링크: "다른 결제 수단" → checkout.html

---

### TPL-007 · 1:1 문의 답변 (inquiry_replied)

**용도**: 운영자가 INQUIRIES 답변 등록 시
**유형**: 정보성

**템플릿 본문**:
```
[오마이트립] 💬 문의 답변이 도착했어요

#{고객명}님께서 보내주신 문의에 답변드렸습니다.

📌 문의: #{문의제목}

#{답변_미리보기}
(전체 답변은 아래 버튼으로 확인)
```

**버튼**:
- 웹링크: "답변 보기" → mypage.html#inquiries

---

### TPL-008 · 리뷰 작성 요청 (review_request)

**용도**: 여행 종료 후 D+3 자동 발송
**유형**: 정보성

**템플릿 본문**:
```
[오마이트립] ✏️ 리뷰 작성 부탁드려요

#{고객명}님, #{상품명} 잘 다녀오셨나요?

후기를 남겨주시면 다음 여행자에게 큰 도움이 됩니다.
지금 리뷰를 작성하시면 +5,000P 적립 (사진 첨부 시 +2,000P 추가)
```

**버튼**:
- 웹링크: "리뷰 쓰기" → mypage.html#bookings

---

### TPL-009 · 예약 취소 확정 (booking_cancelled)

**용도**: 사용자 취소 신청 → 시스템 환불 처리 완료 시
**유형**: 정보성

**템플릿 본문**:
```
[오마이트립] 예약 취소 확정

#{고객명}님의 예약이 취소되었습니다.

▪︎ 예약번호: #{예약번호}
▪︎ 상품명: #{상품명}
▪︎ 위약금: #{위약금}원
▪︎ 환불금액: #{환불금액}원
▪︎ 환불수단: #{환불수단}
▪︎ 환불 완료 예정일: #{환불예정일}

문의는 1588-0000 카카오 상담으로 부탁드립니다.
```

---

### TPL-010 · 특가 알림 (marketing_promo)

**용도**: 마케팅 수신 동의 사용자에게 단독 특가 안내
**유형**: ⚠️ **광고성** (별도 사전 동의 필수)
**발송 제한**: 21:00 ~ 08:00 발송 금지

**템플릿 본문**:
```
(광고) [오마이트립] 🔥 단독 특가 알림

#{고객명}님께만 드리는 한정 혜택!

▪︎ 상품: #{상품명}
▪︎ 할인: #{할인율}%
▪︎ 한정수량: #{잔여수량}석
▪︎ 마감: #{마감일시}

수신거부: 마이페이지 > 알림 설정
```

**버튼**:
- 웹링크: "특가 상품 보기" → product.html?id= 또는 golftel.html?id=

---

## 3. ELLIS 백엔드 통합 인터페이스

### 3.1 발송 API (ELLIS → KakaoBiz Adapter)

```typescript
interface AlimtalkRequest {
  templateCode: 'TPL-001' | 'TPL-002' | ... | 'TPL-010';
  toPhone: string;            // E.164 형식 (예: +821012345678)
  userId: string;             // ELLIS users.id
  variables: Record<string, string | number>;
  bookingNumber?: string;     // 관련 예약 (있을 시)
  scheduledAt?: string;       // 예약 발송 (ISO 8601), 즉시 발송이면 null
  marketingConsentChecked?: boolean;  // 광고성 발송 시 필수
}

interface AlimtalkResponse {
  messageId: string;          // 카카오 BizPlus 발송 ID
  status: 'queued' | 'sent' | 'failed' | 'fallback_sms';
  failureCode?: 'invalid_phone' | 'not_registered_kakao' | 'rate_limit' | 'template_rejected';
  fallbackSmsUsed?: boolean;  // 카톡 미사용자 → SMS 자동 대체 시
  sentAt?: string;
}
```

### 3.2 Webhook (KakaoBiz → ELLIS)

```typescript
interface AlimtalkWebhook {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  metadata?: {
    deviceType?: 'ios' | 'android' | 'web';
    readAt?: string;
  };
}
```

**처리 로직**:
- `notifications.delivery_status` UPDATE
- 발송 실패 → SMS 자동 대체 (`fallback_sms`)
- 24h 내 미읽음 → 마이페이지 인앱 알림으로 백업

### 3.3 ELLIS notifications 테이블 확장

```sql
ALTER TABLE notifications ADD COLUMN delivery_channel VARCHAR(20);   -- 'inapp' | 'kakao_alimtalk' | 'sms' | 'email' | 'push'
ALTER TABLE notifications ADD COLUMN delivery_status VARCHAR(20);    -- 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
ALTER TABLE notifications ADD COLUMN template_code VARCHAR(20);
ALTER TABLE notifications ADD COLUMN external_message_id TEXT;       -- 카카오 BizPlus messageId
ALTER TABLE notifications ADD COLUMN delivered_at TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN read_at TIMESTAMPTZ;
```

---

## 4. Mock → 실제 연동 마이그레이션 체크리스트

- [ ] BizPlus 비즈니스 계정 발급 (kakaobusiness.com)
- [ ] Plus Friend `@ohmytrip` 등록 + 검수
- [ ] 발신번호 1588-0000 KISA 검증
- [ ] 10개 템플릿 BizPlus 콘솔 등록 + 사전 심사 통과
- [ ] ELLIS Notification Dispatcher 구현
- [ ] KakaoBiz Adapter 패키지 (`@ellis/adapter-kakaobiz`)
- [ ] Webhook 엔드포인트 구현 (`POST /webhooks/kakaobiz`)
- [ ] notifications 테이블 스키마 확장 (위 ALTER TABLE)
- [ ] 광고성 메시지 마케팅 수신 동의 플로우 (회원가입 + 마이페이지 알림 설정)
- [ ] 카톡 미사용자 SMS 대체 (Twilio 또는 NHN Toast)
- [ ] 일 발송 한도 (사용자당 5건) Redis 카운터
- [ ] 21~08시 광고성 발송 차단 (스케줄러 큐 처리)
- [ ] 발송 결과 모니터링 대시보드 (admin-channels.html 패턴)
- [ ] 비용 모니터링 (건당 약 8~10원, 월 예상 트래픽 시뮬레이션)

---

## 5. 프론트엔드 현재 mock 위치 (참고)

- `complete.html` `showKakaoPreview()` — TPL-001 미리보기 (실제 발송 X)
- `state.js` `addUserNotification()` — 모든 알림 in-app 저장
- `state.js` `_buildDynamicNotifications()` — D-7/D-3/D-1/D-Day 클라이언트 사이드 동적 생성 (백엔드 cron 이관 대상)

---

## 6. 비용 시뮬레이션 (월간)

| 항목 | 월 예상 발송량 | 단가 | 월 비용 |
|---|---|---|---|
| TPL-001 예약 확정 | 1,847건 | 9.5원 | 17,547원 |
| TPL-002 D-7 | 1,847건 | 9.5원 | 17,547원 |
| TPL-003 D-3 | 1,847건 | 9.5원 | 17,547원 |
| TPL-004 티오프 확정 | 4,420건 (라운딩수×예약) | 9.5원 | 41,990원 |
| TPL-005 결제 완료 | 1,847건 | 9.5원 | 17,547원 |
| TPL-006 결제 실패 | 185건 (10%) | 9.5원 | 1,758원 |
| TPL-007 문의 답변 | 420건 | 9.5원 | 3,990원 |
| TPL-008 리뷰 요청 | 1,847건 | 9.5원 | 17,547원 |
| TPL-009 취소 확정 | 92건 (5%) | 9.5원 | 874원 |
| TPL-010 특가 알림 | 5,000건 (마케팅) | 12원 (광고성) | 60,000원 |
| **합계** | **약 19,352건/월** | - | **약 196,347원/월** |

SMS 대체 발송 (카톡 미사용 5% 가정): +50건 × 30원 = +1,500원/월

→ **총 약 19~20만원/월** (매출 약 4억원 기준 비용율 0.05%)

---

**참고 자료**:
- [카카오 알림톡 가이드](https://business.kakao.com/info/alimtalk/)
- [BizPlus 개발자 문서](https://developers.kakao.com/docs/latest/ko/message/rest-api)
- [정보통신망법 제50조 (영리목적 광고성 정보 전송)](https://www.law.go.kr/법령/정보통신망이용촉진및정보보호등에관한법률)
