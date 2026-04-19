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
    bookings:      'omt_bookings_v2',
    wishlist:      'omt_wishlist_v2',
    followed:      'omt_followed_creators',
    likedPosts:    'omt_liked_posts',
    savedPosts:    'omt_saved_posts',
    myReviews:     'omt_my_reviews',
    couponsUsed:   'omt_coupons_used',
    points:        'omt_points_balance',
    searchHistory: 'omt_search_history',
    recentlyViewed:'omt_recently_viewed',
    user:          'omt_user_session'
  };

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
    // User
    getUser, setUser, logout,
    // Events
    on, off,
    // Utils
    composeCheckoutPayload,
    KEYS
  };

})();
