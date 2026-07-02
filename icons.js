/* =====================================================================
   OMT 아이콘 시스템 — 이모지 → 미니멀 라인 아이콘(SVG, Lucide 계열) 자동 치환
   - 페이지에 <script src="icons.js"></script> 한 줄만 추가하면 전 사이트 적용
   - 정적 + 동적 렌더(MutationObserver) 모두 커버
   - 국기(🇰🇷 등)·화살표(→)·별점(★)은 그대로 유지 (트렌디/클린)
   ===================================================================== */
(function () {
  'use strict';

  // viewBox 24 기준 stroke 라인 아이콘 path (Lucide/Feather 계열)
  const I = {
    plane:    '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    bed:      '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    flag:     '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    home:     '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell:     '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    pin:      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    wallet:   '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    card:     '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    message:  '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    users:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    ticket:   '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    flame:    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    star:     '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    target:   '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    bulb:     '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    luggage:  '<path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/><path d="M10 20h4"/><circle cx="9" cy="21" r="1"/><circle cx="15" cy="21" r="1"/>',
    umbrella: '<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
    alert:    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    box:      '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    play:     '<polygon points="6 3 20 12 6 21 6 3"/>',
    gift:     '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    shield:   '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    trendUp:  '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    trendDown:'<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    mic:      '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    phone:    '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    rocket:   '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    camera:   '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
    clock:    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    zap:      '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2M5 2v20M11 2v20"/><path d="M21 15V2a5 5 0 0 0-3 4.5v6.5c0 1 1 2 2 2z"/>',
    rain:     '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 14v6M8 14v6M12 16v6"/>',
    mail:     '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    call:     '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    gem:      '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    trophy:   '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    check:    '<polyline points="20 6 9 17 4 12"/>'
  };

  // 이모지 → 아이콘 키 매핑 (VS16는 매칭 시 optional 처리)
  const MAP = {
    '✈': 'plane', '🛫': 'plane', '🛬': 'plane',
    '🏨': 'bed', '🏩': 'bed', '🛏': 'bed',
    '⛳': 'flag', '🚩': 'flag',
    '🏠': 'home', '🏡': 'home',
    '🔍': 'search', '🔎': 'search',
    '🔔': 'bell',
    '📅': 'calendar', '📆': 'calendar', '🗓': 'calendar',
    '📍': 'pin', '📌': 'pin',
    '💰': 'wallet', '💵': 'banknote', '💸': 'banknote',
    '💳': 'card',
    '💬': 'message', '🗨': 'message',
    '👥': 'users', '👤': 'users',
    '🎫': 'ticket', '🎟': 'ticket',
    '🔥': 'flame',
    '⭐': 'star', '🌟': 'star',
    '✦': 'sparkles', '✨': 'sparkles', '🤖': 'sparkles', '🎉': 'sparkles', '🆕': 'sparkles', '💫': 'sparkles',
    '🎯': 'target',
    '💡': 'bulb',
    '🌏': 'globe', '🌍': 'globe', '🌎': 'globe',
    '🧳': 'luggage',
    '🏖': 'umbrella', '⛱': 'umbrella', '🌴': 'umbrella',
    '⚠': 'alert', '❗': 'alert', '❕': 'alert',
    '📦': 'box',
    '▶': 'play', '⏵': 'play',
    '🎁': 'gift',
    '🛡': 'shield',
    '📈': 'trendUp', '📊': 'trendUp',
    '📉': 'trendDown',
    '🎙': 'mic', '🎤': 'mic',
    '📱': 'phone',
    '🚀': 'rocket',
    '📷': 'camera', '📸': 'camera',
    '🕐': 'clock', '⏱': 'clock', '⏰': 'clock', '🕒': 'clock',
    '⚡': 'zap',
    '🍽': 'utensils', '🍴': 'utensils',
    '🌧': 'rain',
    '📩': 'mail', '📧': 'mail', '✉': 'mail',
    '📞': 'call', '☎': 'call',
    '💎': 'gem',
    '🏆': 'trophy',
    '✓': 'check', '✔': 'check', '☑': 'check'
  };

  const keys = Object.keys(MAP).sort((a, b) => b.length - a.length);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const PAT = '(' + keys.map(esc).join('|') + ')\\uFE0F?';
  // replace용(전역) / test용(비전역, lastIndex 부작용 방지)을 분리
  const RE = new RegExp(PAT, 'gu');
  const HAS = new RegExp(PAT, 'u');
  const has = s => !!s && HAS.test(s);

  function svgFor(key) {
    return '<svg class="omt-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + I[key] + '</svg>';
  }
  // 별점(star)은 채움이 자연스러움
  function svgStar() {
    return '<svg class="omt-ico" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false">' + I.star + '</svg>';
  }
  const htmlEsc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, SVG: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };

  function processTextNode(node) {
    const txt = node.nodeValue;
    if (!has(txt)) return;
    RE.lastIndex = 0;
    const html = htmlEsc(txt).replace(RE, (m, base) => {
      const key = MAP[base];
      if (!key) return m;
      return key === 'star' ? svgStar() : svgFor(key);
    });
    const tmp = document.createElement('span');
    tmp.className = 'omt-icotext';
    tmp.innerHTML = html;
    node.parentNode.replaceChild(tmp, node);
  }

  function walk(root) {
    if (!root) return;
    // 요소 자체가 스킵 대상이면 건너뜀
    if (root.nodeType === 1 && (SKIP[root.tagName] || root.classList?.contains('no-icon'))) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentNode;
        if (!p || p.nodeType !== 1) return NodeFilter.FILTER_REJECT;
        if (SKIP[p.tagName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('svg, .no-icon, .omt-icotext')) return NodeFilter.FILTER_REJECT;
        return has(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    let cur;
    while ((cur = tw.nextNode())) nodes.push(cur);
    nodes.forEach(processTextNode);
  }

  function init() {
    // 아이콘 CSS 주입 (1em, 텍스트 라인에 맞춤)
    const st = document.createElement('style');
    st.textContent = '.omt-ico{width:1em;height:1em;display:inline-block;vertical-align:-0.14em;flex-shrink:0;}.omt-icotext{display:contents;}';
    document.head.appendChild(st);

    walk(document.body);

    // 동적 렌더 대응 — 추가되는 노드도 치환
    const obs = new MutationObserver(muts => {
      for (const mu of muts) {
        mu.addedNodes.forEach(n => {
          if (n.nodeType === 3) { // text node
            if (has(n.nodeValue)) processTextNode(n);
          } else if (n.nodeType === 1) {
            walk(n);
          }
        });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
