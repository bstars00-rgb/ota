// ============================================================
// 오마이트립 전 페이지 스모크 테스트 (npm run test:smoke)
// 실제 Chromium(puppeteer)으로 모든 HTML 페이지를 열어 검사:
//   1) JS 미처리 예외 (pageerror) — TDZ·참조 오류 등 페이지 전체를 죽이는 결함
//   2) 콘솔 error (외부 리소스 로드 실패 제외)
//   3) 화면에 보이는 undefined / NaN / [object Object]
//   4) 핵심 페이지의 목록이 비어있지 않은지 (총 0개 류 결함)
// 외부 도메인(Unsplash 등) 요청은 차단 — 속도·결정성 확보.
// ============================================================
import { createServer } from 'node:http';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import vm from 'node:vm';
import puppeteer from 'puppeteer';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------- data.js에서 동적 ID 추출 (하드코딩 방지 — 데이터 바뀌어도 테스트 유지) ----------
const dctx = { window: {}, localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(dctx);
vm.runInContext(readFileSync(join(ROOT, 'data.js'), 'utf8'), dctx, { filename: 'data.js' });
const D = dctx.window.OMT.DATA;
const firstGolftel = D.GOLFTELS[0].id;
const lastGolftel  = D.GOLFTELS[D.GOLFTELS.length - 1].id;
const firstHotel   = D.HOTELS[0].id;

// ---------- 검사 대상: 전 HTML + 파라미터 변형 ----------
const allPages = readdirSync(ROOT).filter(f => f.endsWith('.html'));
// {url, sel, min}: sel 셀렉터가 min개 이상 렌더돼야 통과 (목록 0개 결함 감지)
const targets = [
  ...allPages.map(f => ({ url: '/' + f })),
  { url: '/golftels.html', sel: '.card', min: 10, label: '골프텔 목록' },
  { url: `/golftel.html?id=${firstGolftel}`, sel: 'h1', min: 1, label: '골프텔 상세(기존)' },
  { url: `/golftel.html?id=${lastGolftel}`,  sel: 'h1', min: 1, label: '골프텔 상세(신규)' },
  { url: '/hotels.html', sel: '#hotelList > *', min: 5, label: '호텔 목록' },
  { url: `/hotel.html?id=${firstHotel}`, sel: 'h1', min: 1, label: '호텔 상세' },
  { url: '/flights-results.html?itineraries-0-originAirportCode=ICN&itineraries-0-destinationAirportCode=HND&itineraries-0-departureDate=2026-08-20&itineraries-1-departureDate=2026-08-23&tripTypeCode=RT&cabinClassCode=Y&adultCount=1',
    sel: '.flight-card', min: 5, label: '항공 결과 ICN→HND' },
  { url: '/country.html?c=japan', sel: 'h1', min: 1, label: '국가 페이지' }
];

// ---------- 정적 서버 (no-cache — serve의 캐시·리다이렉트 문제 회피) ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  const file = join(ROOT, path === '/' ? 'index.html' : decodeURIComponent(path));
  if (!existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(readFileSync(file));
});
await new Promise(r => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

// ---------- 브라우저 순회 ----------
const browser = await puppeteer.launch({
  headless: true,
  timeout: 120000,                       // 첫 기동 시 AV 스캔 지연 대비
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
await page.setRequestInterception(true);
page.on('request', req => {
  // 외부 도메인 차단 (이미지·폰트 CDN) — 로컬만 통과
  req.url().startsWith(BASE) ? req.continue() : req.abort();
});

const results = [];
for (const t of targets) {
  const errors = [];
  const onPageError = e => errors.push('예외: ' + e.message.split('\n')[0]);
  const onConsole = m => {
    if (m.type() !== 'error') return;
    const txt = m.text();
    if (/Failed to load resource|net::ERR|ERR_FAILED/.test(txt)) return; // 외부 리소스 차단으로 인한 노이즈
    errors.push('콘솔: ' + txt.split('\n')[0].slice(0, 120));
  };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  try {
    await page.goto(BASE + t.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 350)); // 렌더 정착 대기

    // 화면 노출 텍스트 검사 (innerText — script 태그 제외)
    const visible = await page.evaluate(() => document.body.innerText);
    const leak = visible.match(/\[object Object\]|\bundefined\b|(?<![\w.])NaN(?![\w])/);
    if (leak) errors.push(`화면 노출: "${leak[0]}" — …${visible.slice(Math.max(0, leak.index - 40), leak.index + 30).replace(/\s+/g, ' ')}…`);

    // 목록/콘텐츠 검사
    if (t.sel) {
      const n = await page.$$eval(t.sel, els => els.length).catch(() => 0);
      if (n < t.min) errors.push(`콘텐츠 부족: ${t.sel} ${n}개 (<${t.min})`);
    }
  } catch (e) {
    errors.push('로드 실패: ' + e.message.split('\n')[0]);
  }
  page.off('pageerror', onPageError);
  page.off('console', onConsole);
  results.push({ url: t.url, label: t.label, errors });
  process.stdout.write(errors.length ? 'F' : '.');
}
console.log('\n');

await browser.close();
server.close();

// ---------- 리포트 ----------
const failed = results.filter(r => r.errors.length);
for (const r of failed) {
  console.error(`✗ ${r.url}${r.label ? ` (${r.label})` : ''}`);
  r.errors.forEach(e => console.error('    ' + e));
}
console.log(`\n검사 ${results.length}건 · 통과 ${results.length - failed.length} · 실패 ${failed.length}`);
process.exit(failed.length ? 1 : 0);
