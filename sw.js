// ========================================
// OhMyTrip Service Worker (v1)
// 전략: data.js / state.js / 페이지는 stale-while-revalidate
// 외부 (Unsplash 등) 은 network-first
// ========================================
const CACHE_NAME = 'omt-20260718-1532';   // pre-commit 훅이 자동 범프 (.githooks/pre-commit)
const CORE_ASSETS = [
  './',
  './index.html',
  './data.js',
  './state.js',
  './golftels.html',
  './golftel.html',
  './country.html',
  './mypage.html',
  './manifest.json',
  './offline.html'                          // 오프라인 폴백 페이지
];

// 설치 — 핵심 자산 사전 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // .catch 처리 — 일부 자산 누락돼도 SW 등록 자체는 성공
      return Promise.all(
        CORE_ASSETS.map(url => cache.add(url).catch(err => {
          console.warn('[SW] cache miss:', url, err.message);
        }))
      );
    })
  );
  self.skipWaiting();
});

// 활성화 — 옛 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// 요청 인터셉트
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // POST 등은 패스
  if(req.method !== 'GET') return;

  const url = new URL(req.url);

  // 외부 도메인 (Unsplash 등) — network-first (실패 시 캐시)
  if(url.origin !== self.location.origin){
    event.respondWith(
      fetch(req).then(res => {
        // 이미지·CDN 응답은 캐시
        if(res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone).catch(() => {}));
        }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 같은 도메인 — stale-while-revalidate + 오프라인 폴백
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        if(res.ok){
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone).catch(() => {}));
        }
        return res;
      }).catch(() => {
        // 네트워크 실패 → 캐시 우선, 둘 다 없으면 HTML 요청만 offline.html 폴백
        if(cached) return cached;
        const accept = req.headers.get('accept') || '';
        if(req.mode === 'navigate' || accept.includes('text/html')){
          return caches.match('./offline.html');
        }
        // JS/CSS/이미지는 네트워크 에러 그대로 전파 (사용자가 오프라인 자동 인지)
        return new Response('', { status:503, statusText:'Offline · 캐시 없음' });
      });
      return cached || fetchPromise;
    })
  );
});
