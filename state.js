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
    liveHistory:   'omt_live_history_v1' // 라이브 시청 이력 (최대 20개)
  };

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
  function getWishlist(){ return read(KEYS.wishlist, ['prod-ph-01','prod-th-01','prod-jp-03']); }
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
