// ============================================================
// 오마이트립 데이터 정합성 검사 (npm run test:data)
// data.js를 로드해 참조 무결성·필수 필드·표기 매핑을 검증한다.
// 스키마가 바뀌면 여기도 함께 갱신할 것 (ELLIS 백엔드 MD 명세와 동기).
// ============================================================
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ctx = {
  window: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  console
};
vm.createContext(ctx);
vm.runInContext(readFileSync(join(ROOT, 'data.js'), 'utf8'), ctx, { filename: 'data.js' });
const D = ctx.window.OMT?.DATA;

let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗ ' + msg); };
const section = (name) => console.log('\n■ ' + name);

if (!D) { console.error('data.js 로드 실패 — window.OMT.DATA 없음'); process.exit(1); }

// ---------- GOLFTELS ----------
section(`GOLFTELS (${D.GOLFTELS.length}개)`);
for (const g of D.GOLFTELS) {
  for (const cid of g.courseIds || []) {
    if (!D.GOLF_COURSES.find(c => c.id === cid)) fail(`${g.id}: 코스 참조 깨짐 → ${cid}`);
  }
  if (!D.OWNERSHIP[g.country]) fail(`${g.id}: OWNERSHIP에 없는 국가 → ${g.country}`);
  if (!D.GOLF_CITY_NAMES[g.city]) fail(`${g.id}: GOLF_CITY_NAMES에 없는 도시 → ${g.city}`);
  if (!(g.images?.length >= 5)) fail(`${g.id}: 갤러리 ${g.images?.length ?? 0}장 (<5) — _GOLFTEL_GALLERIES 등록 필요`);
  if (!(g.pricePerPerson > 0)) fail(`${g.id}: pricePerPerson 누락`);
  if (!(g.nights > 0 && g.rounds > 0)) fail(`${g.id}: nights/rounds 누락`);
  if (!g.hotelName) fail(`${g.id}: hotelName 누락`);
  if (!g.reviewStats || typeof g.reviewStats.count !== 'number') fail(`${g.id}: reviewStats.count 누락`);
}

// ---------- GOLF_COURSES ----------
section(`GOLF_COURSES (${D.GOLF_COURSES.length}개)`);
for (const c of D.GOLF_COURSES) {
  if (!D.CHANNEL_MANAGERS[c.channelManager]) fail(`${c.id}: 채널매니저 미정의 → ${c.channelManager}`);
  if (!D.GOLF_CITY_NAMES[c.city]) fail(`${c.id}: GOLF_CITY_NAMES에 없는 도시 → ${c.city}`);
}

// ---------- FLIGHTS ----------
section(`FLIGHTS (${D.FLIGHTS.length}편)`);
for (const f of D.FLIGHTS) {
  if (!D.AIRLINES[f.code]) fail(`${f.id}: 항공사 미정의 → ${f.code}`);
  if (f.operatedBy && !D.AIRLINES[f.operatedBy]) fail(`${f.id}: 실제운항사 미정의 → ${f.operatedBy}`);
  if (typeof f.baggage !== 'number') fail(`${f.id}: baggage(PC) 누락`);
  if (!(f.seats >= 1)) fail(`${f.id}: seats 누락`);
  if (!(f.fares?.length >= 2)) fail(`${f.id}: fares 운임옵션 누락`);
  if (!(f.price > 0)) fail(`${f.id}: price 누락`);
  if (!D.CITIES[f.from]) fail(`${f.id}: 출발 공항 CITIES에 없음 → ${f.from}`);
  if (!D.CITIES[f.to]) fail(`${f.id}: 도착 공항 CITIES에 없음 → ${f.to}`);
}

// ---------- HOTELS ----------
section(`HOTELS (${D.HOTELS.length}개)`);
for (const h of D.HOTELS) {
  if (!(h.price > 0)) fail(`${h.id}: price 누락`);
  if (!h.img && !h.gallery?.length) fail(`${h.id}: 이미지 없음`);
}

// ---------- 집계 ----------
const direct = D.GOLFTELS.filter(g => D.OWNERSHIP[g.country]?.model === 'direct').length;
console.log(`\n요약: 골프텔 ${D.GOLFTELS.length} (직영 ${direct}/파트너 ${D.GOLFTELS.length - direct}) · 코스 ${D.GOLF_COURSES.length} · 항공 ${D.FLIGHTS.length} · 호텔 ${D.HOTELS.length}`);

if (failures) {
  console.error(`\n✗ 데이터 정합성 실패 ${failures}건`);
  process.exit(1);
}
console.log('✓ 데이터 정합성 통과');
