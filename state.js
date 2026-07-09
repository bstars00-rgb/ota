/* =============================================================================
   OhMyTrip State Manager
   - localStorage-backed persistent state
   - API: OMT.State.getCart() / addToCart() / createBooking() / ...
   - Exposed as window.OMT.State
   ============================================================================= */
(function(){
  'use strict';
  const root = window.OMT = window.OMT || {};

  const KEYS = {
    cart:          'omt_cart_v2',
    bookings:      'omt_bookings_v3',  // v3: 골프텔 시드 추가 (2026-06-11)
    wishlist:      'omt_wishlist_v2',
    followed:      'omt_followed_creators',
    likedPosts:    'omt_liked_posts',
    savedPosts:    'omt_saved_posts',
    myReviews:     'omt_my_reviews',
    couponsUsed:   'omt_coupons_used',
    points:        'omt_points_balance',
    searchHistory: 'omt_search_history',
    recentlyViewed:'omt_recently_viewed',
    user:          'omt_user_session',
    membership:    'omt_membership_v1',
    notifReadIds:  'omt_notif_read_v1',  // 읽은 알림 ID 목록
    userNotifs:    'omt_user_notifs_v1', // 사용자 발생 알림 (예약 확정/문의 답변/결제 실패 등)
    liveHistory:   'omt_live_history_v1', // 라이브 시청 이력 (최대 20개)
    savedTrips:    'omt_saved_trips_v1',   // AI 플래너 저장된 여행 (최대 10개)
    preferences:   'omt_user_prefs_v1',    // 온보딩 답변 + 개인화 설정
    onboarded:     'omt_onboarded_v1',     // 온보딩 완료 여부 boolean
    notifSettings: 'omt_notif_settings_v1',// 카테고리별 알림 on/off + 방해 금지 시간
    userLocation:  'omt_user_location_v1', // 사용자 출발지 권역 (seoul/busan/daegu/gwangju/jeju)
    groupBookings: 'omt_group_bookings_v1', // 그룹(단체) 예약 — 4인+ 단체 골프투어
    priceAlerts:   'omt_price_alerts_v1',  // 항공 가격 알리미 (Trip.com 스타일)
    visitCount:    'omt_visit_count_v1',   // 재방문 카운터 (사이클 27)
    miles:         'omt_miles_v1',         // 마일리지 잔액 + 적립/사용 이력 (단일 리워드)
    creatorRef:    'omt_creator_ref_v1',   // 크리에이터 매직 링크 유입 (?ref= 라스트 클릭, 7일 유효)
    creatorConversions: 'omt_creator_conv_v1' // 크리에이터 경유 예약 전환 기록 (커미션 산정용)
  };

  // ============================================================
  // 🏆 회원 등급 자동 산정 (누적 결제액 기준 5단)
  // ============================================================
  function getUserTier(){
    // 누적 결제액 기준 (getBookings로 INITIAL_BOOKINGS 시드 보장 → 진입 경로 무관 결정적)
    const bookings = getBookings() || [];
    const total = bookings.reduce((s, b) => s + (b.total || 0), 0);
    if(total >= 100000000) return 'vip';      // 1억+
    if(total >= 5000000)   return 'platinum';  // 500만+
    if(total >= 2000000)   return 'gold';      // 200만+
    if(total >= 500000)    return 'silver';    // 50만+
    return 'bronze';
  }
  function getTierBenefit(tier){
    const t = tier || getUserTier();
    const tiers = {
      bronze:   { label:'🥉 브론즈', discount:0,  benefits:['기본 예약'], color:'#CD7F32' },
      silver:   { label:'🥈 실버',   discount:0.02, benefits:['1박 무료 와이파이 업그레이드','리뷰 보너스 +500P'], color:'#B0B7C3' },
      gold:     { label:'🥇 골드',   discount:0.03, benefits:['조식 무료 (1박 1인)','우선 체크인','늦은 체크아웃 14:00'], color:'#FFD23F' },
      platinum: { label:'💎 플래티넘', discount:0.05, benefits:['룸 업그레이드 (가용 시)','조식 무료 (전 인원)','VIP 라운지','늦은 체크아웃 16:00'], color:'#58A6FF' },
      vip:      { label:'⭐ VIP',     discount:0.07, benefits:['1:1 전담 매니저','전 객실 업그레이드','전 메뉴 무료','얼리 체크인','전 일정 카톡 동행'], color:'#DA70D6' }
    };
    return tiers[t] || tiers.bronze;
  }

  // ============================================================
  // ✈️ 마일리지 (단일 리워드 — 적립금처럼 결제 시 차감 가능)
  // ============================================================
  function getMiles(){
    // 마일리지 잔액은 초기에 일부 부여 (mock)
    return read(KEYS.miles, { balance: 12500, history: [] });
  }
  function useMiles(amount, reason){
    const m = getMiles();
    if(m.balance < amount) return false;
    m.balance -= amount;
    m.history = m.history || [];
    m.history.unshift({ amount: -amount, reason, when: new Date().toISOString() });
    if(m.history.length > 50) m.history.length = 50;
    write(KEYS.miles, m);
    return true;
  }
  function earnMiles(amount, reason){
    const m = getMiles();
    m.balance += amount;
    m.history = m.history || [];
    m.history.unshift({ amount, reason, when: new Date().toISOString() });
    if(m.history.length > 50) m.history.length = 50;
    write(KEYS.miles, m);
    return m;
  }

  // ============================================================
  // 🔗 크리에이터 어트리뷰션 (매직 링크 ?ref= 추적)
  //    - 라스트 클릭 · 7일 유효 · 예약 생성 시 자동 전환 기록
  //    - 커미션 요율: 직영 10% / 파트너 5% (creator-dashboard 표기와 동일, mock)
  // ============================================================
  const CREATOR_REF_TTL_DAYS = 7;
  function setCreatorRef(creatorId, postId){
    if(!creatorId) return null;
    const entry = { creatorId, postId: postId || null, at: new Date().toISOString() };
    write(KEYS.creatorRef, entry);
    return entry;
  }
  function getCreatorRef(){
    const ref = read(KEYS.creatorRef, null);
    if(!ref) return null;
    const ageDays = (Date.now() - new Date(ref.at).getTime()) / 86400000;
    if(ageDays > CREATOR_REF_TTL_DAYS){ localStorage.removeItem(KEYS.creatorRef); return null; }
    return ref;
  }
  function clearCreatorRef(){
    localStorage.removeItem(KEYS.creatorRef);
  }
  function recordCreatorConversion(booking){
    const ref = getCreatorRef();
    if(!ref) return null;
    const rate = booking.ownership === 'direct' ? 0.10 : 0.05;
    const entry = {
      id: 'conv-' + Date.now().toString(36),
      creatorId: ref.creatorId,
      postId: ref.postId,
      bookingId: booking.id || null,
      bookingNumber: booking.bookingNumber || null,
      productId: booking.productId || null,
      productName: booking.productName || null,
      productType: booking.productType || null,
      ownership: booking.ownership || null,
      amount: booking.total || 0,
      commissionRate: rate,
      commission: Math.round((booking.total || 0) * rate),
      at: new Date().toISOString()
    };
    const list = read(KEYS.creatorConversions, []);
    list.unshift(entry);
    if(list.length > 100) list.length = 100;
    write(KEYS.creatorConversions, list);
    notify('creatorConversion', entry);
    return entry;
  }
  function getCreatorConversions(creatorId){
    const list = read(KEYS.creatorConversions, []);
    return creatorId ? list.filter(c => c.creatorId === creatorId) : list;
  }

  // ============================================================
  // 🏠 재방문 감지 (시트립 패턴)
  // ============================================================
  function getReturningVisit(){
    const v = read(KEYS.visitCount, { count: 0, firstAt: null, lastAt: null });
    return v;
  }
  function incrementVisit(){
    const v = getReturningVisit();
    v.count = (v.count || 0) + 1;
    if(!v.firstAt) v.firstAt = new Date().toISOString();
    v.lastAt = new Date().toISOString();
    write(KEYS.visitCount, v);
    return v;
  }

  // ============================================================
  // 🚀 빠른 예약 프로필 (Express Booking)
  // ============================================================
  function getExpressBookingProfile(){
    // 저장된 결제수단 + 여행자 정보
    const user = read(KEYS.user, null);
    return {
      hasProfile: !!user,
      paxName: user?.name || '',
      paxPhone: user?.phone || '',
      paxEmail: user?.email || '',
      defaultPaymentMethod: 'kakao',
      lastUsed: read('omt_last_payment', null)
    };
  }

  // ============================================================
  // 🔔 가격 알리미 (Price Alert) — 시트립 스타일
  // ============================================================
  function getPriceAlerts(){
    return read(KEYS.priceAlerts, []);
  }
  function addPriceAlert(alert){
    // alert: { from, to, targetPrice, currentPrice, depMonth, channel, ... }
    const list = getPriceAlerts();
    const id = `pa-${Date.now().toString(36)}`;
    const entry = {
      id,
      from: alert.from,
      to: alert.to,
      targetPrice: alert.targetPrice || 0,
      currentPrice: alert.currentPrice || 0,
      depMonth: alert.depMonth || null,
      channel: alert.channel || 'kakao',  // 'kakao' | 'email' | 'push'
      active: true,
      createdAt: new Date().toISOString()
    };
    list.unshift(entry);
    if(list.length > 20) list.length = 20;
    write(KEYS.priceAlerts, list);
    return entry;
  }
  function removePriceAlert(id){
    const list = getPriceAlerts().filter(x => x.id !== id);
    write(KEYS.priceAlerts, list);
    return list;
  }

  // ============================================================
  // 👥 그룹(단체) 예약 — 4인+ 단체 골프투어
  // ============================================================
  function getGroups(){
    return read(KEYS.groupBookings, []);
  }
  function getGroup(id){
    return getGroups().find(g => g.id === id) || null;
  }
  function createGroup(group){
    // group: { golftelId, leaderName, leaderPhone, dates, paymentMode, members? }
    const list = getGroups();
    const id = `grp-${Date.now().toString(36)}`;
    const entry = {
      id,
      golftelId: group.golftelId,
      leaderName: group.leaderName || '단체장',
      leaderPhone: group.leaderPhone || '',
      dates: group.dates || '',
      paymentMode: group.paymentMode || 'leader_pays',  // leader_pays | each_pays | split
      members: group.members || [{
        userId: 'self',
        name: group.leaderName || '단체장',
        phone: group.leaderPhone || '',
        airportCode: 'ICN',
        paidAmount: 0,
        roomMate: null,
        isLeader: true,
        confirmed: true
      }],
      totalAmount: group.totalAmount || 0,
      status: 'draft',  // draft | confirmed | partial_paid | paid | cancelled
      createdAt: new Date().toISOString()
    };
    list.unshift(entry);
    write(KEYS.groupBookings, list);
    return entry;
  }
  function updateGroup(id, patch){
    const list = getGroups();
    const idx = list.findIndex(g => g.id === id);
    if(idx < 0) return null;
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    write(KEYS.groupBookings, list);
    return list[idx];
  }
  function addGroupMember(groupId, member){
    const g = getGroup(groupId);
    if(!g) return null;
    const newMember = {
      userId: member.userId || `mem-${Date.now().toString(36)}`,
      name: member.name || '',
      phone: member.phone || '',
      airportCode: member.airportCode || 'ICN',
      paidAmount: 0,
      roomMate: null,
      isLeader: false,
      confirmed: false,
      ...member
    };
    g.members.push(newMember);
    return updateGroup(groupId, { members: g.members });
  }
  function removeGroupMember(groupId, userId){
    const g = getGroup(groupId);
    if(!g) return null;
    const filtered = g.members.filter(m => m.userId !== userId);
    return updateGroup(groupId, { members: filtered });
  }
  function payGroupMember(groupId, userId, amount){
    const g = getGroup(groupId);
    if(!g) return null;
    g.members = g.members.map(m =>
      m.userId === userId ? { ...m, paidAmount: (m.paidAmount || 0) + amount, confirmed: true } : m
    );
    const fullyPaid = g.members.every(m => (m.paidAmount || 0) >= (g.totalAmount / g.members.length));
    const newStatus = fullyPaid ? 'paid' : 'partial_paid';
    return updateGroup(groupId, { members: g.members, status: newStatus });
  }

  // ============================================================
  // 🔔 알림 설정 (카테고리별 + 방해 금지 시간)
  // ============================================================
  function getNotifSettings(){
    return read(KEYS.notifSettings, {
      booking:    true,    // 예약 확정/D-day/취소
      payment:    true,    // 결제 완료/실패/환불
      promotion:  true,    // 특가/쿠폰/이벤트
      system:     true,    // 공지/업데이트
      social:     false,   // 팔로우/좋아요
      quietHours: { enabled: false, start: 22, end: 7 }  // 방해 금지 시간 (22시~7시)
    });
  }
  function setNotifSettings(settings){
    const current = getNotifSettings();
    const merged = { ...current, ...settings };
    write(KEYS.notifSettings, merged);
    return merged;
  }

  // ============================================================
  // 📍 사용자 출발지 위치 (권역)
  // ============================================================
  function getUserLocation(){
    return read(KEYS.userLocation, {
      region: 'seoul',         // 'seoul' | 'busan' | 'daegu' | 'gwangju' | 'jeju'
      airport: 'ICN'           // ICN(인천) | GMP(김포) | PUS(김해) | TAE(대구) | KWJ(광주) | CJU(제주)
    });
  }
  function setUserLocation(location){
    const current = getUserLocation();
    const merged = { ...current, ...location };
    write(KEYS.userLocation, merged);
    return merged;
  }

  // ============================================================
  // 🎯 사용자 선호 (온보딩 + 개인화)
  // ============================================================
  function getPreferences(){
    return read(KEYS.preferences, {
      skill: null,        // 'beginner' | 'intermediate' | 'advanced'
      budget: null,       // 'budget' | 'balanced' | 'premium'
      companion: null,    // 'solo' | 'couple' | 'group' | 'family'
      country: null,      // '일본' | '베트남' | '태국' | '필리핀' | 'any'
      goal: null          // 'relax' | 'challenge' | 'social'
    });
  }
  function setPreferences(prefs){
    const current = getPreferences();
    const merged = { ...current, ...prefs };
    write(KEYS.preferences, merged);
    return merged;
  }
  function isOnboarded(){
    return read(KEYS.onboarded, false) === true;
  }
  function markOnboarded(){
    write(KEYS.onboarded, true);
  }

  // ============================================================
  // 💾 저장된 여행 (AI 플래너) — 회원이 짠 여행 계획을 저장하고 마이페이지에서 재진입
  // ============================================================
  function getSavedTrips(){
    return read(KEYS.savedTrips, []);
  }
  function saveTrip(trip){
    // trip: { id?, name, destination, style, duration, pax, budget, savedAt }
    const list = getSavedTrips();
    const id = trip.id || `trip-${Date.now().toString(36)}`;
    const entry = {
      id,
      name: trip.name || `${trip.destination || ''} ${trip.style || ''}`.trim() || '내 여행',
      destination: trip.destination || null,
      style: trip.style || null,
      duration: trip.duration || null,
      pax: trip.pax || null,
      budget: trip.budget || null,
      savedAt: new Date().toISOString()
    };
    // 같은 id가 있으면 업데이트 (맨 앞으로)
    const existing = list.findIndex(x => x.id === id);
    if(existing >= 0) list.splice(existing, 1);
    list.unshift(entry);
    if(list.length > 10) list.length = 10;
    write(KEYS.savedTrips, list);
    return entry;
  }
  function removeSavedTrip(id){
    const list = getSavedTrips().filter(x => x.id !== id);
    write(KEYS.savedTrips, list);
    return list;
  }

  // ============================================================
  // 🔴 라이브 시청 이력
  // ============================================================
  function getLiveHistory(){
    return read(KEYS.liveHistory, []);
  }
  function addLiveHistory(entry){
    // entry: { liveId, creatorName, productName, productId, productImage, viewedAt }
    const list = getLiveHistory();
    // 같은 liveId가 있으면 viewedAt만 갱신 + 맨 앞으로
    const existing = list.findIndex(x => x.liveId === entry.liveId);
    if(existing >= 0) list.splice(existing, 1);
    list.unshift({ ...entry, viewedAt: new Date().toISOString() });
    if(list.length > 20) list.length = 20;
    write(KEYS.liveHistory, list);
    return list;
  }

  // ============================================================
  // 알림 (NOTIFICATIONS) — 정적 mock + 사용자 예약 기반 동적 생성 + localStorage 읽음
  // ============================================================

  // 예약 dates 문자열에서 시작일 추출
  function _parseStartDate(dates){
    if(!dates) return null;
    const m = String(dates).match(/(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
    if(!m) return null;
    return new Date(+m[1], +m[2]-1, +m[3]);
  }

  // 예약 dates → 오늘 기준 D-day 차이
  function _ddayFromDates(dates){
    const d = _parseStartDate(dates); if(!d) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    return Math.round((d - today) / 86400000);
  }

  // 사용자 예약 기반 동적 알림 생성 (D-7 / D-3 / D-1 / 출발 당일)
  function _buildDynamicNotifications(){
    const userBookings = (read(KEYS.bookings, null) || []).filter(b =>
      b.status === 'confirmed' || b.status === 'pending'
    );
    const todayStr = new Date().toISOString().slice(0,10);
    const out = [];
    userBookings.forEach(b => {
      const d = _ddayFromDates(b.dates);
      if(d === null) return;
      const isGT = b.productType === 'golftel' || b.productType === 'golftel-air' || (b.productId && b.productId.startsWith('gt-'));
      const link = isGT
        ? `complete.html?bk=${b.bookingNumber}`
        : `complete.html?bk=${b.bookingNumber}`;
      const productName = b.productName || (b.productId ? b.productId : '예약 상품');

      // D-7
      if(d === 7){
        out.push({
          id: `dyn-${b.id}-d7`, type:'reminder', icon: isGT ? '⛳' : '✈️',
          title: isGT ? '골프 라운딩 D-7' : '출발 D-7',
          body: `${productName} · ${b.dates.split(' - ')[0]} 출발 · 장비 / 여권 점검 시작`,
          date: todayStr, daysAgo:0, read:false,
          link, actionLabel: '체크리스트 →'
        });
      }
      // D-3
      if(d === 3){
        out.push({
          id: `dyn-${b.id}-d3`, type:'reminder', icon:'📋',
          title: '출국 D-3 체크리스트',
          body: `${productName} · 여권 유효기간 6개월 / 캐디팁 환전 / 항공 클래스·수하물 확인`,
          date: todayStr, daysAgo:0, read:false,
          link, actionLabel: '예약 확인 →'
        });
      }
      // D-1
      if(d === 1){
        out.push({
          id: `dyn-${b.id}-d1`, type:'reminder', icon:'🛫',
          title: '내일 출발이에요',
          body: `${productName} · 공항 도착 권장 2.5h 전 · 픽업 차량 확인`,
          date: todayStr, daysAgo:0, read:false,
          link, actionLabel: '예약 확인 →'
        });
      }
      // D-Day
      if(d === 0){
        out.push({
          id: `dyn-${b.id}-d0`, type:'reminder', icon:'🎉',
          title: '오늘 출발 — 즐거운 여행 되세요!',
          body: `${productName} · 비상 연락: 1588-0000`,
          date: todayStr, daysAgo:0, read:false,
          link, actionLabel: '예약 확인 →'
        });
      }
    });
    return out;
  }

  // 사용자 발생 알림 (예약 확정/문의 답변/결제 실패 등)
  function getUserNotifications(){
    return read(KEYS.userNotifs, []);
  }
  function addUserNotification(notif){
    // notif: { id?, type, icon, title, body, link?, actionLabel? }
    const list = getUserNotifications();
    // 중복 방지 (같은 id가 이미 있으면 skip)
    if(notif.id && list.some(n => n.id === notif.id)) return false;
    const now = new Date();
    const entry = {
      id: notif.id || ('user-' + Date.now()),
      type: notif.type || 'system',
      icon: notif.icon || '🔔',
      title: notif.title || '알림',
      body: notif.body || '',
      link: notif.link || null,
      actionLabel: notif.actionLabel || null,
      date: now.toISOString().slice(0,10),
      daysAgo: 0,
      read: false,
      createdAt: now.toISOString()
    };
    list.unshift(entry);
    // 최대 50건 유지
    if(list.length > 50) list.length = 50;
    write(KEYS.userNotifs, list);
    notify('notifications', list);
    return true;
  }

  function getNotifications(){
    const staticNotifs = (window.OMT?.DATA?.NOTIFICATIONS || []);
    const dynamicNotifs = _buildDynamicNotifications();
    const userNotifs = getUserNotifications();
    const readIds = read(KEYS.notifReadIds, []);
    // 사용자 알림 → 동적 → 정적 순 (사용자 알림이 최신)
    return [...userNotifs, ...dynamicNotifs, ...staticNotifs].map(n => ({
      ...n, read: n.read || readIds.includes(n.id)
    }));
  }
  function getUnreadNotifCount(){
    return getNotifications().filter(n => !n.read).length;
  }
  function markNotifRead(id){
    const readIds = read(KEYS.notifReadIds, []);
    if(!readIds.includes(id)){ readIds.push(id); write(KEYS.notifReadIds, readIds); }
  }
  function markAllNotifsRead(){
    const all = getNotifications().map(n => n.id);
    write(KEYS.notifReadIds, all);
  }

  /* =====================================================================
     MEMBERSHIP (Subscription) — 오마이트립 PASS
     - 월 9,900원으로 호텔 최저가 (OTA 수수료 없는 실제 원가) 이용
     - 호텔은 OTA 수수료 20% 절감, 고객은 절약분 그대로 수령
     - 메인 BM: 구독료 / 부가: 단독 패키지 마진
     ===================================================================== */
  const MEMBER_DISCOUNT_RATE = 0.15;   // 15% 할인 (OTA 수수료 절감분 반영)
  const MONTHLY_PRICE = 9900;
  const ANNUAL_PRICE = 99000;          // 2개월 무료

  function getMembership(){
    return read(KEYS.membership, { active: false, plan: null, since: null, renewsAt: null, savedTotal: 0 });
  }
  function isMember(){
    return !!getMembership().active;
  }
  function subscribeMembership(plan='monthly'){
    const now = new Date();
    const renew = new Date(now);
    if(plan === 'annual') renew.setFullYear(renew.getFullYear() + 1);
    else renew.setMonth(renew.getMonth() + 1);
    const m = {
      active: true,
      plan,
      since: now.toISOString(),
      renewsAt: renew.toISOString(),
      savedTotal: getMembership().savedTotal || 0
    };
    write(KEYS.membership, m);
    notify('membership', m);
    return m;
  }
  function cancelMembership(){
    const m = getMembership();
    m.active = false;
    m.cancelledAt = new Date().toISOString();
    write(KEYS.membership, m);
    notify('membership', m);
    return m;
  }
  function addMemberSavings(amount){
    const m = getMembership();
    m.savedTotal = (m.savedTotal || 0) + amount;
    write(KEYS.membership, m);
    notify('membership', m);
    return m.savedTotal;
  }
  // 멤버 가격 계산 (15% 할인)
  function memberPrice(originalPrice){
    return Math.round(originalPrice * (1 - MEMBER_DISCOUNT_RATE) / 1000) * 1000;
  }
  function memberSavings(originalPrice){
    return originalPrice - memberPrice(originalPrice);
  }

  const read = (k, fallback=null) => {
    try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; }
    catch(e){ return fallback; }
  };
  const write = (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); return v; }
    catch(e){ console.warn('State write failed', e); return v; }
  };

  /* =====================================================================
     CART
     ===================================================================== */
  function getCart(){
    return read(KEYS.cart, []);
  }
  function addToCart(item){
    const cart = getCart();
    const entry = {
      cartId: 'c-' + Date.now() + '-' + Math.floor(Math.random()*1000),
      addedAt: new Date().toISOString(),
      checked: true,
      ...item
    };
    cart.unshift(entry);
    write(KEYS.cart, cart);
    notify('cart', cart);
    return entry;
  }
  function removeFromCart(cartId){
    const cart = getCart().filter(i => i.cartId !== cartId);
    write(KEYS.cart, cart);
    notify('cart', cart);
    return cart;
  }
  function updateCartItem(cartId, patch){
    const cart = getCart().map(i => i.cartId === cartId ? {...i, ...patch} : i);
    write(KEYS.cart, cart);
    notify('cart', cart);
    return cart;
  }
  function clearCart(){
    write(KEYS.cart, []);
    notify('cart', []);
  }
  function cartCount(){
    return getCart().length;
  }

  /* =====================================================================
     BOOKINGS
     ===================================================================== */
  function getBookings(){
    let list = read(KEYS.bookings, null);
    if(!list){
      // Seed with initial bookings from DATA
      list = (root.DATA?.INITIAL_BOOKINGS || []).slice();
      write(KEYS.bookings, list);
    }
    return list;
  }
  function getBooking(id){
    return getBookings().find(b => b.id === id || b.bookingNumber === id);
  }
  function createBooking(payload){
    const bookingNumber = 'OMT-' + Date.now().toString(36).toUpperCase().slice(-8);
    const booking = {
      id: 'bk-' + Date.now(),
      bookingNumber,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...payload
    };
    const list = getBookings();
    list.unshift(booking);
    write(KEYS.bookings, list);
    notify('bookings', list);
    // 크리에이터 매직 링크 유입이 있으면 전환 자동 기록 (cart/checkout 공통)
    try { recordCreatorConversion(booking); } catch(e){ console.warn('creator conversion record failed', e); }
    return booking;
  }
  function cancelBooking(id){
    const list = getBookings().map(b =>
      (b.id === id || b.bookingNumber === id) ? {...b, status:'cancelled', cancelledAt:new Date().toISOString()} : b
    );
    write(KEYS.bookings, list);
    notify('bookings', list);
    return list;
  }
  function updateBookingStatus(id, status){
    const list = getBookings().map(b =>
      (b.id === id || b.bookingNumber === id) ? {...b, status} : b
    );
    write(KEYS.bookings, list);
    notify('bookings', list);
    return list;
  }

  /* =====================================================================
     WISHLIST
     ===================================================================== */
  function getWishlist(){ return read(KEYS.wishlist, ['gt-vn-danang-ba-na-4n','gt-jp-okinawa-kanucha-3n','h-granvia-osaka']); }
  function isWished(productId){ return getWishlist().includes(productId); }
  function toggleWishlist(productId){
    const list = getWishlist();
    const idx = list.indexOf(productId);
    if(idx >= 0) list.splice(idx, 1); else list.unshift(productId);
    write(KEYS.wishlist, list);
    notify('wishlist', list);
    return list;
  }

  /* =====================================================================
     CREATOR FOLLOW / POST LIKE·SAVE
     ===================================================================== */
  const boolSet = (key, id) => {
    const list = read(key, []);
    const idx = list.indexOf(id);
    if(idx >= 0) list.splice(idx, 1); else list.unshift(id);
    write(key, list);
    return list.includes(id);
  };

  function isFollowing(creatorId){ return (read(KEYS.followed, []) || []).includes(creatorId); }
  function toggleFollow(creatorId){ const nowFollowing = boolSet(KEYS.followed, creatorId); notify('follow', creatorId); return nowFollowing; }
  function isPostLiked(postId){ return (read(KEYS.likedPosts, []) || []).includes(postId); }
  function togglePostLike(postId){ const v = boolSet(KEYS.likedPosts, postId); notify('likedPost', postId); return v; }
  function isPostSaved(postId){ return (read(KEYS.savedPosts, []) || []).includes(postId); }
  function togglePostSave(postId){ const v = boolSet(KEYS.savedPosts, postId); notify('savedPost', postId); return v; }

  /* =====================================================================
     REVIEWS (user-written)
     ===================================================================== */
  function getMyReviews(){ return read(KEYS.myReviews, []); }
  function addReview(review){
    const list = getMyReviews();
    const entry = {
      id:'my-rv-'+Date.now(),
      userInitial:'홍', userName:'홍길동', date: new Date().toISOString().slice(0,10),
      ...review
    };
    list.unshift(entry);
    write(KEYS.myReviews, list);
    notify('reviews', list);
    return entry;
  }
  function getReviewsForProduct(productId){
    const mine = getMyReviews().filter(r => r.productId === productId);
    const seed = (root.DATA?.REVIEWS || []).filter(r => r.productId === productId);
    return [...mine, ...seed];
  }

  /* =====================================================================
     COUPONS & POINTS
     ===================================================================== */
  function getUsedCoupons(){ return read(KEYS.couponsUsed, []); }
  function useCoupon(code){
    const list = getUsedCoupons();
    if(!list.includes(code)){
      list.push(code);
      write(KEYS.couponsUsed, list);
    }
    return list;
  }
  function getAvailableCoupons(){
    const used = getUsedCoupons();
    return (root.DATA?.COUPONS || []).filter(c => !used.includes(c.code));
  }
  function getPointsBalance(){
    const stored = read(KEYS.points, null);
    return stored !== null ? stored : (root.DATA?.USER?.points || 0);
  }
  function addPoints(delta, label){
    const cur = getPointsBalance();
    const next = cur + delta;
    write(KEYS.points, next);
    notify('points', next);
    return next;
  }

  /* =====================================================================
     SEARCH HISTORY & RECENTLY VIEWED
     ===================================================================== */
  function getSearchHistory(){ return read(KEYS.searchHistory, []); }
  function addSearchHistory(q){
    const list = getSearchHistory().filter(x => x !== q);
    list.unshift(q);
    const trimmed = list.slice(0, 10);
    write(KEYS.searchHistory, trimmed);
    return trimmed;
  }
  function getRecentlyViewed(){ return read(KEYS.recentlyViewed, []); }
  function addRecentlyViewed(productId){
    const list = getRecentlyViewed().filter(x => x !== productId);
    list.unshift(productId);
    const trimmed = list.slice(0, 8);
    write(KEYS.recentlyViewed, trimmed);
    return trimmed;
  }

  /* =====================================================================
     USER / SESSION
     ===================================================================== */
  function getUser(){
    return read(KEYS.user, null) || root.DATA?.USER || null;
  }
  function setUser(u){
    write(KEYS.user, u);
    notify('user', u);
    return u;
  }
  function logout(){
    localStorage.removeItem(KEYS.user);
    notify('user', null);
  }

  /* =====================================================================
     EVENT EMITTER (pub/sub)
     ===================================================================== */
  const listeners = {};
  function on(evt, fn){
    (listeners[evt] = listeners[evt] || []).push(fn);
    return () => off(evt, fn);
  }
  function off(evt, fn){
    if(!listeners[evt]) return;
    listeners[evt] = listeners[evt].filter(f => f !== fn);
  }
  function notify(evt, data){
    (listeners[evt] || []).forEach(fn => { try{ fn(data); }catch(e){ console.warn(e); } });
  }

  /* =====================================================================
     UTIL: checkout payload composer
     ===================================================================== */
  function composeCheckoutPayload(source, items, options={}){
    // Source: 'cart' | 'product' | 'feed' | 'packages' | 'ai-planner'
    // items: [{productId, paxCount, dates}] or [{flight, hotel, activities, paxCount, nights, dates}]
    if(!Array.isArray(items)) items = [items];
    const first = items[0];
    if(first.productId){
      const pack = root.productAsPackage(first.productId, first.paxCount || 2, first.dates);
      return { ...pack, source, items: items.map(i => ({productId:i.productId, paxCount:i.paxCount})) };
    }
    return { ...first, source };
  }

  /* =====================================================================
     Expose
     ===================================================================== */
  root.State = {
    // Cart
    getCart, addToCart, removeFromCart, updateCartItem, clearCart, cartCount,
    // Bookings
    getBookings, getBooking, createBooking, cancelBooking, updateBookingStatus,
    // Wishlist
    getWishlist, isWished, toggleWishlist,
    // Social
    isFollowing, toggleFollow,
    isPostLiked, togglePostLike,
    isPostSaved, togglePostSave,
    // Reviews
    getMyReviews, addReview, getReviewsForProduct,
    // Coupons / Points
    getUsedCoupons, useCoupon, getAvailableCoupons,
    getPointsBalance, addPoints,
    // Search / Recents
    getSearchHistory, addSearchHistory,
    getRecentlyViewed, addRecentlyViewed,
    // Notifications
    getNotifications, getUnreadNotifCount, markNotifRead, markAllNotifsRead,
    getUserNotifications, addUserNotification,
    // Live history
    getLiveHistory, addLiveHistory,
    // Saved trips (AI planner)
    getSavedTrips, saveTrip, removeSavedTrip,
    // Preferences (온보딩 + 개인화)
    getPreferences, setPreferences, isOnboarded, markOnboarded,
    // Notification settings + User location
    getNotifSettings, setNotifSettings,
    getUserLocation, setUserLocation,
    // Group bookings (단체)
    getGroups, getGroup, createGroup, updateGroup,
    addGroupMember, removeGroupMember, payGroupMember,
    // Price alerts (시트립 스타일)
    getPriceAlerts, addPriceAlert, removePriceAlert,
    // Creator attribution (매직 링크 ?ref= 추적 + 전환 기록)
    setCreatorRef, getCreatorRef, clearCreatorRef,
    recordCreatorConversion, getCreatorConversions,
    // 🆕 사이클 27 — 시트립 추가 패턴
    getUserTier, getTierBenefit,
    getMiles, useMiles, earnMiles,
    getReturningVisit, incrementVisit,
    getExpressBookingProfile,
    // User
    getUser, setUser, logout,
    // Membership (Subscription)
    getMembership, isMember, subscribeMembership, cancelMembership, addMemberSavings,
    memberPrice, memberSavings,
    MEMBER_DISCOUNT_RATE, MONTHLY_PRICE, ANNUAL_PRICE,
    // Events
    on, off,
    // Utils
    composeCheckoutPayload,
    KEYS
  };

})();
