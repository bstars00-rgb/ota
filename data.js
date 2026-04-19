/* =============================================================================
   OhMyTrip Mock Data Library
   - Every page loads this file via <script src="data.js"></script>
   - Exposes window.OMT.DATA (read-only mock) and helper accessors
   ============================================================================= */
(function(){
  'use strict';
  const root = window.OMT = window.OMT || {};

  const krw = n => (n || 0).toLocaleString('ko-KR') + '원';
  const daysFromNow = (d) => {
    const dt = new Date(); dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0,10);
  };

  /* =====================================================================
     1) Countries & Cities
     ===================================================================== */
  const COUNTRIES = {
    japan: {
      slug:'japan', name:'일본', epithet:'미식의 나라',
      tagline:'벚꽃부터 야경까지, 미식과 온천의 나라',
      accent:'#FFB7C5',
      landmark:'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&w=240&h=240&q=80',
      heroImages:[
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=80',
        'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?auto=format&fit=crop&w=1800&q=80',
        'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1800&q=80'
      ]
    },
    vietnam: {
      slug:'vietnam', name:'베트남', epithet:'휴양의 나라',
      tagline:'에메랄드 해변과 따뜻한 미소',
      accent:'#E63946',
      landmark:'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=240&h=240&q=80',
      heroImages:[
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=80',
        'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1800&q=80'
      ]
    },
    thailand: {
      slug:'thailand', name:'태국', epithet:'미소의 나라',
      tagline:'야시장부터 섬까지, 입맛 가득한 여행',
      accent:'#F4A261',
      landmark:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=240&h=240&q=80',
      heroImages:[
        'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1800&q=80',
        'https://images.unsplash.com/photo-1552550049-db097c9480d1?auto=format&fit=crop&w=1800&q=80'
      ]
    },
    philippines: {
      slug:'philippines', name:'필리핀', epithet:'섬의 나라',
      tagline:'에메랄드 바다와 호핑의 천국',
      accent:'#06A77D',
      landmark:'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=240&h=240&q=80',
      heroImages:[
        'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=1800&q=80',
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1800&q=80'
      ]
    }
  };

  const CITIES = {
    // Korea (origin)
    ICN: { code:'ICN', name:'인천', country:'KR', isOrigin:true },
    GMP: { code:'GMP', name:'김포', country:'KR', isOrigin:true },
    PUS: { code:'PUS', name:'부산(김해)', country:'KR', isOrigin:true },
    TAE: { code:'TAE', name:'대구', country:'KR', isOrigin:true },
    // Japan
    NRT: { code:'NRT', name:'도쿄(나리타)', country:'japan', city:'tokyo' },
    HND: { code:'HND', name:'도쿄(하네다)', country:'japan', city:'tokyo' },
    KIX: { code:'KIX', name:'오사카', country:'japan', city:'osaka' },
    FUK: { code:'FUK', name:'후쿠오카', country:'japan', city:'fukuoka' },
    CTS: { code:'CTS', name:'삿포로', country:'japan', city:'sapporo' },
    OKA: { code:'OKA', name:'오키나와', country:'japan', city:'okinawa' },
    // Vietnam
    DAD: { code:'DAD', name:'다낭', country:'vietnam', city:'danang' },
    CXR: { code:'CXR', name:'나트랑', country:'vietnam', city:'nhatrang' },
    HAN: { code:'HAN', name:'하노이', country:'vietnam', city:'hanoi' },
    SGN: { code:'SGN', name:'호치민', country:'vietnam', city:'hcmc' },
    PQC: { code:'PQC', name:'푸꾸옥', country:'vietnam', city:'phuquoc' },
    // Thailand
    BKK: { code:'BKK', name:'방콕', country:'thailand', city:'bangkok' },
    HKT: { code:'HKT', name:'푸켓', country:'thailand', city:'phuket' },
    CNX: { code:'CNX', name:'치앙마이', country:'thailand', city:'chiangmai' },
    KBV: { code:'KBV', name:'끄라비', country:'thailand', city:'krabi' },
    USM: { code:'USM', name:'코사무이', country:'thailand', city:'kosamui' },
    // Philippines
    CEB: { code:'CEB', name:'세부', country:'philippines', city:'cebu' },
    MNL: { code:'MNL', name:'마닐라', country:'philippines', city:'manila' },
    KLO: { code:'KLO', name:'보라카이(칼리보)', country:'philippines', city:'boracay' },
    PPS: { code:'PPS', name:'팔라완', country:'philippines', city:'palawan' }
  };

  /* =====================================================================
     2) Airlines
     ===================================================================== */
  const AIRLINES = {
    KE: { code:'KE', name:'대한항공',        tier:'FSC',  color:'linear-gradient(135deg,#00256C,#1E4A8A)' },
    OZ: { code:'OZ', name:'아시아나항공',    tier:'FSC',  color:'linear-gradient(135deg,#8B1F41,#B8284D)' },
    TW: { code:'TW', name:'티웨이항공',      tier:'LCC',  color:'linear-gradient(135deg,#EC1C24,#FF4949)' },
    '7C':{ code:'7C',name:'제주항공',        tier:'LCC',  color:'linear-gradient(135deg,#F47721,#FF9744)' },
    LJ: { code:'LJ', name:'진에어',          tier:'LCC',  color:'linear-gradient(135deg,#4A90E2,#6FA8E8)' },
    BX: { code:'BX', name:'에어부산',        tier:'LCC',  color:'linear-gradient(135deg,#0073B7,#3694D1)' },
    RS: { code:'RS', name:'에어서울',        tier:'LCC',  color:'linear-gradient(135deg,#E91E63,#F06292)' },
    VN: { code:'VN', name:'베트남항공',      tier:'FSC',  color:'linear-gradient(135deg,#D4AF37,#E6C860)' },
    VJ: { code:'VJ', name:'비엣젯항공',      tier:'LCC',  color:'linear-gradient(135deg,#ED1C24,#FF4949)' },
    TG: { code:'TG', name:'타이항공',        tier:'FSC',  color:'linear-gradient(135deg,#582D82,#7B4CA0)' },
    FD: { code:'FD', name:'에어아시아',      tier:'LCC',  color:'linear-gradient(135deg,#E31837,#FF4949)' },
    '5J':{ code:'5J',name:'세부퍼시픽',      tier:'LCC',  color:'linear-gradient(135deg,#FDD20C,#FFE54C)' },
    PR: { code:'PR', name:'필리핀항공',      tier:'FSC',  color:'linear-gradient(135deg,#003F87,#1565C0)' }
  };

  /* =====================================================================
     3) Flights (40+ across major routes)
     ===================================================================== */
  const FLIGHTS = [
    // Korea → Japan (Osaka)
    { id:'f-TW283',  code:'TW', number:'TW283',  from:'ICN', to:'KIX', outDep:'08:30', outArr:'10:15', outDur:'1h 45m', retDep:'11:00', retArr:'13:00', retDur:'2h 00m', stops:0, price:189000, class:'economy', depTime:'morning' },
    { id:'f-7C1156', code:'7C', number:'7C1156', from:'ICN', to:'KIX', outDep:'10:20', outArr:'12:00', outDur:'1h 40m', retDep:'14:30', retArr:'16:40', retDur:'2h 10m', stops:0, price:229000, class:'economy', depTime:'morning' },
    { id:'f-KE723',  code:'KE', number:'KE723',  from:'ICN', to:'KIX', outDep:'13:00', outArr:'14:45', outDur:'1h 45m', retDep:'18:20', retArr:'20:30', retDur:'2h 10m', stops:0, price:329000, class:'economy', depTime:'afternoon' },
    { id:'f-LJ201',  code:'LJ', number:'LJ201',  from:'ICN', to:'KIX', outDep:'18:15', outArr:'19:55', outDur:'1h 40m', retDep:'21:10', retArr:'23:25', retDur:'2h 15m', stops:0, price:209000, class:'economy', depTime:'evening' },
    { id:'f-OZ112',  code:'OZ', number:'OZ112',  from:'ICN', to:'KIX', outDep:'20:40', outArr:'22:25', outDur:'1h 45m', retDep:'09:30', retArr:'11:40', retDur:'2h 10m', stops:0, price:279000, class:'economy', depTime:'evening' },
    { id:'f-BX142',  code:'BX', number:'BX142',  from:'ICN', to:'KIX', outDep:'07:15', outArr:'09:00', outDur:'1h 45m', retDep:'13:00', retArr:'15:15', retDur:'2h 15m', stops:0, price:199000, class:'economy', depTime:'morning' },
    { id:'f-KE721',  code:'KE', number:'KE721',  from:'ICN', to:'KIX', outDep:'09:20', outArr:'11:05', outDur:'1h 45m', retDep:'12:30', retArr:'14:40', retDur:'2h 10m', stops:0, price:489000, class:'business', depTime:'morning' },

    // Korea → Japan (Tokyo)
    { id:'f-KE705',  code:'KE', number:'KE705',  from:'ICN', to:'NRT', outDep:'09:00', outArr:'11:30', outDur:'2h 30m', retDep:'13:00', retArr:'15:55', retDur:'2h 55m', stops:0, price:389000, class:'economy', depTime:'morning' },
    { id:'f-OZ174',  code:'OZ', number:'OZ174',  from:'ICN', to:'NRT', outDep:'14:20', outArr:'16:50', outDur:'2h 30m', retDep:'19:00', retArr:'21:55', retDur:'2h 55m', stops:0, price:359000, class:'economy', depTime:'afternoon' },
    { id:'f-TW295',  code:'TW', number:'TW295',  from:'ICN', to:'NRT', outDep:'15:45', outArr:'18:15', outDur:'2h 30m', retDep:'20:00', retArr:'22:55', retDur:'2h 55m', stops:0, price:259000, class:'economy', depTime:'afternoon' },
    { id:'f-KE2708', code:'KE', number:'KE2708', from:'GMP', to:'HND', outDep:'08:00', outArr:'10:30', outDur:'2h 30m', retDep:'14:30', retArr:'17:30', retDur:'3h 00m', stops:0, price:439000, class:'economy', depTime:'morning' },

    // Korea → Japan (Fukuoka)
    { id:'f-7C1401', code:'7C', number:'7C1401', from:'PUS', to:'FUK', outDep:'09:30', outArr:'10:25', outDur:'55m',    retDep:'12:00', retArr:'13:10', retDur:'1h 10m', stops:0, price:149000, class:'economy', depTime:'morning' },
    { id:'f-TW235',  code:'TW', number:'TW235',  from:'ICN', to:'FUK', outDep:'11:00', outArr:'12:45', outDur:'1h 45m', retDep:'14:00', retArr:'16:00', retDur:'2h 00m', stops:0, price:199000, class:'economy', depTime:'morning' },
    { id:'f-BX212',  code:'BX', number:'BX212',  from:'PUS', to:'FUK', outDep:'14:30', outArr:'15:25', outDur:'55m',    retDep:'17:00', retArr:'18:10', retDur:'1h 10m', stops:0, price:159000, class:'economy', depTime:'afternoon' },
    { id:'f-LJ215',  code:'LJ', number:'LJ215',  from:'ICN', to:'FUK', outDep:'07:20', outArr:'09:05', outDur:'1h 45m', retDep:'10:30', retArr:'12:30', retDur:'2h 00m', stops:0, price:89000,  class:'economy', depTime:'morning' },

    // Korea → Vietnam (Danang)
    { id:'f-VJ835',  code:'VJ', number:'VJ835',  from:'ICN', to:'DAD', outDep:'23:50', outArr:'03:20', outDur:'4h 30m', retDep:'05:00', retArr:'12:30', retDur:'4h 30m', stops:0, price:329000, class:'economy', depTime:'evening' },
    { id:'f-KE461',  code:'KE', number:'KE461',  from:'ICN', to:'DAD', outDep:'18:40', outArr:'22:15', outDur:'4h 35m', retDep:'23:45', retArr:'07:20', retDur:'4h 35m', stops:0, price:529000, class:'economy', depTime:'evening' },
    { id:'f-TW127',  code:'TW', number:'TW127',  from:'ICN', to:'DAD', outDep:'09:30', outArr:'13:05', outDur:'4h 35m', retDep:'14:30', retArr:'22:00', retDur:'4h 30m', stops:0, price:389000, class:'economy', depTime:'morning' },
    { id:'f-7C3812', code:'7C', number:'7C3812', from:'PUS', to:'DAD', outDep:'11:45', outArr:'15:25', outDur:'4h 40m', retDep:'17:00', retArr:'00:40', retDur:'4h 40m', stops:0, price:369000, class:'economy', depTime:'morning' },

    // Korea → Vietnam (Nha Trang, Hanoi)
    { id:'f-VN417',  code:'VN', number:'VN417',  from:'ICN', to:'CXR', outDep:'21:00', outArr:'01:30', outDur:'5h 30m', retDep:'03:00', retArr:'10:30', retDur:'4h 30m', stops:0, price:389000, class:'economy', depTime:'evening' },
    { id:'f-KE481',  code:'KE', number:'KE481',  from:'ICN', to:'HAN', outDep:'18:30', outArr:'21:30', outDur:'5h 00m', retDep:'23:30', retArr:'06:30', retDur:'4h 00m', stops:0, price:359000, class:'economy', depTime:'evening' },
    { id:'f-LJ073',  code:'LJ', number:'LJ073',  from:'ICN', to:'HAN', outDep:'09:20', outArr:'12:20', outDur:'5h 00m', retDep:'13:50', retArr:'20:50', retDur:'4h 00m', stops:0, price:279000, class:'economy', depTime:'morning' },
    { id:'f-VJ897',  code:'VJ', number:'VJ897',  from:'ICN', to:'SGN', outDep:'22:00', outArr:'01:40', outDur:'5h 40m', retDep:'03:30', retArr:'11:00', retDur:'4h 30m', stops:0, price:419000, class:'economy', depTime:'evening' },

    // Korea → Thailand (Bangkok)
    { id:'f-TG657',  code:'TG', number:'TG657',  from:'ICN', to:'BKK', outDep:'10:30', outArr:'14:20', outDur:'5h 50m', retDep:'16:00', retArr:'23:30', retDur:'5h 30m', stops:0, price:319000, class:'economy', depTime:'morning' },
    { id:'f-KE651',  code:'KE', number:'KE651',  from:'ICN', to:'BKK', outDep:'17:30', outArr:'21:20', outDur:'5h 50m', retDep:'23:00', retArr:'06:30', retDur:'5h 30m', stops:0, price:459000, class:'economy', depTime:'evening' },
    { id:'f-FD3501', code:'FD', number:'FD3501', from:'ICN', to:'BKK', outDep:'01:20', outArr:'05:10', outDur:'5h 50m', retDep:'07:00', retArr:'14:30', retDur:'5h 30m', stops:0, price:289000, class:'economy', depTime:'morning' },
    { id:'f-FD3502', code:'FD', number:'FD3502', from:'ICN', to:'HKT', outDep:'13:00', outArr:'17:30', outDur:'6h 30m', retDep:'19:00', retArr:'03:00', retDur:'6h 00m', stops:0, price:469000, class:'economy', depTime:'afternoon' },
    { id:'f-TG747',  code:'TG', number:'TG747',  from:'ICN', to:'CNX', outDep:'10:30', outArr:'15:10', outDur:'6h 40m', retDep:'16:30', retArr:'00:30', retDur:'6h 00m', stops:1, price:389000, class:'economy', depTime:'morning' },

    // Korea → Philippines (Cebu, Manila)
    { id:'f-5J187',  code:'5J', number:'5J187',  from:'ICN', to:'CEB', outDep:'19:30', outArr:'23:30', outDur:'4h 30m', retDep:'01:30', retArr:'08:30', retDur:'4h 30m', stops:0, price:389000, class:'economy', depTime:'evening' },
    { id:'f-PR469',  code:'PR', number:'PR469',  from:'ICN', to:'CEB', outDep:'08:30', outArr:'12:30', outDur:'4h 30m', retDep:'14:00', retArr:'21:00', retDur:'4h 30m', stops:0, price:419000, class:'economy', depTime:'morning' },
    { id:'f-5J189',  code:'5J', number:'5J189',  from:'ICN', to:'MNL', outDep:'23:00', outArr:'02:40', outDur:'4h 10m', retDep:'04:30', retArr:'11:00', retDur:'4h 00m', stops:0, price:349000, class:'economy', depTime:'evening' },
    { id:'f-PR467',  code:'PR', number:'PR467',  from:'ICN', to:'MNL', outDep:'11:00', outArr:'14:40', outDur:'4h 10m', retDep:'16:00', retArr:'22:30', retDur:'4h 00m', stops:0, price:379000, class:'economy', depTime:'morning' },
    { id:'f-PR488',  code:'PR', number:'PR488',  from:'ICN', to:'KLO', outDep:'06:30', outArr:'10:30', outDur:'4h 30m', retDep:'12:00', retArr:'19:00', retDur:'4h 30m', stops:0, price:489000, class:'economy', depTime:'morning' }
  ];

  /* =====================================================================
     4) Hotels (25+ across 10 cities)
     ===================================================================== */
  const HOTELS = [
    // Osaka
    { id:'h-granvia-osaka',   city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'호텔 그란비아 오사카', area:'우메다', areaId:'umeda', stars:5, score:9.2, reviews:4127, price:239000, oldPrice:289000,
      amenities:['조식 포함','와이파이','수영장','피트니스','역 직결'],
      description:'JR 오사카역과 직결된 특급 호텔. 쇼핑·교통·관광의 최적 거점.' },
    { id:'h-rigaroyal-osaka', city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'리가로얄 호텔 오사카', area:'나카노시마', areaId:'nakanoshima', stars:5, score:9.0, reviews:3528, price:329000, oldPrice:389000,
      amenities:['조식 포함','와이파이','수영장','스파','비즈니스 센터'],
      description:'나카노시마 강변의 클래식 5성 호텔. 비즈니스 여행객에 인기.' },
    { id:'h-cross-osaka',     city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'크로스 호텔 오사카', area:'신사이바시', areaId:'shinsaibashi', stars:4, score:8.9, reviews:2145, price:189000, oldPrice:229000,
      amenities:['조식 포함','와이파이','바/라운지','역 인근'],
      description:'신사이바시 쇼핑 중심지에 위치한 부티크 호텔.' },
    { id:'h-apa-namba',       city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
      name:'APA 호텔 난바', area:'난바', areaId:'namba', stars:4, score:8.5, reviews:5284, price:129000, oldPrice:159000,
      amenities:['와이파이','24시간 프론트','역 도보 3분'],
      description:'가성비 최고의 비즈니스 호텔. 난바역 도보 3분.' },

    // Tokyo
    { id:'h-parkhyatt-tokyo',  city:'tokyo', country:'japan',
      img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
      name:'파크 하얏트 도쿄', area:'신주쿠', areaId:'shinjuku', stars:5, score:9.4, reviews:2847, price:589000, oldPrice:689000,
      amenities:['조식 포함','와이파이','수영장','피트니스','스파'],
      description:'도쿄 스카이라인이 내려다보이는 럭셔리 호텔. 영화 "Lost in Translation" 촬영지.' },
    { id:'h-hilton-tokyo',     city:'tokyo', country:'japan',
      img:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'],
      name:'힐튼 도쿄', area:'신주쿠', areaId:'shinjuku', stars:5, score:9.1, reviews:3901, price:358000, oldPrice:419000,
      amenities:['조식 포함','와이파이','수영장','피트니스'],
      description:'신주쿠 서쪽의 대형 체인 호텔. 고속 셔틀 이용 편리.' },
    { id:'h-apa-shinjuku',     city:'tokyo', country:'japan',
      img:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80'],
      name:'APA 호텔 신주쿠', area:'신주쿠', areaId:'shinjuku', stars:4, score:8.7, reviews:5284, price:129000, oldPrice:149000,
      amenities:['와이파이','24시간 프론트','역 도보 5분'],
      description:'가성비 좋은 비즈니스 호텔, 신주쿠역 인근.' },

    // Fukuoka
    { id:'h-hyatt-fukuoka',    city:'fukuoka', country:'japan',
      img:'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'],
      name:'그랜드 하얏트 후쿠오카', area:'하카타', areaId:'hakata', stars:5, score:9.3, reviews:1892, price:268000, oldPrice:319000,
      amenities:['조식 포함','와이파이','수영장','스파'],
      description:'하카타역 직결 럭셔리 호텔. 쇼핑몰 Canal City 인접.' },
    { id:'h-nishitetsu-tenjin',city:'fukuoka', country:'japan',
      img:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'],
      name:'솔라리아 니시테츠 호텔', area:'텐진', areaId:'tenjin', stars:4, score:8.8, reviews:2341, price:158000, oldPrice:189000,
      amenities:['조식 포함','와이파이','피트니스'],
      description:'텐진 쇼핑가 중심의 모던 호텔.' },

    // Danang
    { id:'h-intercon-danang',  city:'danang', country:'vietnam',
      img:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'],
      name:'인터컨티넨탈 다낭 선페닌슐라', area:'선짜 반도', areaId:'sontra', stars:5, score:9.6, reviews:2184, price:489000, oldPrice:589000,
      amenities:['조식 포함','수영장','스파','프라이빗 비치','무료 셔틀'],
      description:'다낭 선짜 반도의 럭셔리 리조트. 빌 벤슬리 디자인.' },
    { id:'h-premier-danang',   city:'danang', country:'vietnam',
      img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'프리미어빌리지 다낭 리조트', area:'미케 비치', areaId:'mykhe', stars:5, score:9.3, reviews:3247, price:398000, oldPrice:489000,
      amenities:['조식/석식 포함','풀빌라','키즈클럽','프라이빗 비치'],
      description:'가족·허니문에 최적화된 풀빌라 리조트.' },

    // Nha Trang
    { id:'h-vinpearl-nhatrang',city:'nhatrang', country:'vietnam',
      img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
      name:'빈펄 럭셔리 나트랑', area:'혼째 섬', areaId:'hontre', stars:5, score:9.2, reviews:4521, price:298000, oldPrice:359000,
      amenities:['조식 포함','워터파크 무료','수영장','키즈클럽'],
      description:'빈펄 혼째 섬 리조트, 워터파크·동물원 무제한.' },

    // Hanoi
    { id:'h-sofitel-hanoi',    city:'hanoi', country:'vietnam',
      img:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'],
      name:'소피텔 레전드 메트로폴 하노이', area:'구시가지', areaId:'oldquarter', stars:5, score:9.4, reviews:3672, price:458000, oldPrice:529000,
      amenities:['조식 포함','와이파이','수영장','스파'],
      description:'1901년부터 이어진 역사적 명문 호텔.' },

    // Bangkok
    { id:'h-mandarin-bangkok', city:'bangkok', country:'thailand',
      img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'만다린 오리엔탈 방콕', area:'리버사이드', areaId:'riverside', stars:5, score:9.5, reviews:3241, price:529000, oldPrice:629000,
      amenities:['조식 포함','프라이빗 풀','스파','리버 뷰'],
      description:'차오프라야 강변의 전설적 호텔, 150년 역사.' },
    { id:'h-kempinski-siam',   city:'bangkok', country:'thailand',
      img:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'],
      name:'시암 켐핀스키 호텔', area:'시암', areaId:'siam', stars:5, score:9.2, reviews:2687, price:389000, oldPrice:459000,
      amenities:['조식 포함','수영장','스파','피트니스'],
      description:'시암 파라곤 직결 도심 리조트.' },
    { id:'h-novotel-bangkok',  city:'bangkok', country:'thailand',
      img:'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80'],
      name:'노보텔 방콕 수쿰빗', area:'수쿰빗', areaId:'sukhumvit', stars:4, score:8.7, reviews:4521, price:148000, oldPrice:179000,
      amenities:['조식 포함','와이파이','수영장','피트니스'],
      description:'BTS 아속역 직결, 쇼핑몰 Terminal 21 인접.' },

    // Phuket
    { id:'h-vinsetsi-phuket',  city:'phuket', country:'thailand',
      img:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'],
      name:'빈쯔찌 푸켓', area:'나이한 비치', areaId:'naiyang', stars:5, score:9.4, reviews:1824, price:428000, oldPrice:519000,
      amenities:['올인클루시브','프라이빗 비치','키즈클럽','스파'],
      description:'가족 친화 풀 이용가능 올인클루시브 리조트.' },

    // Chiang Mai
    { id:'h-fourseasons-cnx',  city:'chiangmai', country:'thailand',
      img:'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80'],
      name:'포시즌스 리조트 치앙마이', area:'매림', areaId:'maerim', stars:5, score:9.7, reviews:1128, price:689000, oldPrice:819000,
      amenities:['올인클루시브','프라이빗 풀빌라','스파','요가'],
      description:'치앙마이 산속 고요한 럭셔리 리조트.' },

    // Cebu
    { id:'h-shangrila-mactan', city:'cebu', country:'philippines',
      img:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'],
      name:'샹그릴라 막탄 리조트', area:'막탄 섬', areaId:'mactan', stars:5, score:9.5, reviews:2847, price:489000, oldPrice:589000,
      amenities:['조식 포함','프라이빗 비치','키즈클럽','호핑투어'],
      description:'막탄 섬의 프라이빗 비치를 보유한 최고급 리조트.' },
    { id:'h-crimson-mactan',   city:'cebu', country:'philippines',
      img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'크림슨 리조트 앤 스파', area:'막탄', areaId:'mactan', stars:5, score:9.2, reviews:1624, price:358000, oldPrice:429000,
      amenities:['조식 포함','수영장','스파','프라이빗 비치'],
      description:'한국인 선호도 1위 막탄 리조트. 가성비 호평.' },

    // Boracay
    { id:'h-henann-boracay',   city:'boracay', country:'philippines',
      img:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
      name:'헤난 크리스탈샌즈', area:'화이트 비치', areaId:'whitebeach', stars:5, score:9.3, reviews:1847, price:298000, oldPrice:359000,
      amenities:['조식 포함','수영장','프라이빗 비치','스파'],
      description:'화이트 비치 스테이션2 한국인 최다 선호 리조트.' }
  ];

  /* =====================================================================
     5) Activities (by category/city)
     ===================================================================== */
  const ACTIVITIES = [
    // Golf
    { id:'a-usj-1day',    city:'osaka',  country:'japan',   category:'ticket',
      img:'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=600&q=80',
      title:'유니버설 스튜디오 1일권', meta:'USJ 입장권 · 슈퍼 닌텐도 월드 포함', price:89000 },
    { id:'a-usj-express', city:'osaka',  country:'japan',   category:'ticket',
      img:'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=600&q=80',
      title:'USJ 익스프레스 패스 4', meta:'4개 어트랙션 우선입장', price:145000 },
    { id:'a-osaka-golf1', city:'osaka',  country:'japan',   category:'golf',
      img:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=600&q=80',
      title:'오사카 골프 라운딩 1회', meta:'18홀 + 카트 + 캐디', price:120000 },
    { id:'a-osaka-sakura',city:'osaka',  country:'japan',   category:'tour',
      img:'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=600&q=80',
      title:'오사카 성 벚꽃 크루즈', meta:'90분 · 한국어 가이드', price:65000 },
    { id:'a-kyoto-tour',  city:'osaka',  country:'japan',   category:'tour',
      img:'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80',
      title:'교토 1일 투어', meta:'기요미즈데라+후시미이나리+아라시야마', price:98000 },
    { id:'a-spaworld',    city:'osaka',  country:'japan',   category:'spa',
      img:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      title:'스파월드 오사카 1일권', meta:'온천 + 찜질방 + 수영장', price:35000 },
    { id:'a-kobe-wagyu',  city:'osaka',  country:'japan',   category:'restaurant',
      img:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80',
      title:'고베 와규 코스 디너', meta:'A5 등급 5코스 · 예약 확정', price:198000 },
    { id:'a-tokyo-tower', city:'tokyo',  country:'japan',   category:'ticket',
      img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
      title:'도쿄 타워 특별 전망대', meta:'야경 VIP 입장', price:48000 },
    { id:'a-tokyo-robot', city:'tokyo',  country:'japan',   category:'ticket',
      img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
      title:'신주쿠 로봇 레스토랑', meta:'공연+저녁식사 90분', price:88000 },
    { id:'a-fukuoka-onsen',city:'fukuoka',country:'japan', category:'spa',
      img:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      title:'유후인 온천 당일 이용', meta:'노천탕 + 가이세키 석식', price:78000 },
    { id:'a-danang-banahill',city:'danang',country:'vietnam', category:'tour',
      img:'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=600&q=80',
      title:'바나힐 1일 투어', meta:'골든브릿지 + 놀이공원', price:68000 },
    { id:'a-danang-goldenbridge',city:'danang',country:'vietnam', category:'tour',
      img:'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=600&q=80',
      title:'다낭 야경 크루즈', meta:'한강 크루즈 2시간', price:35000 },
    { id:'a-hoian-lantern',city:'danang',country:'vietnam', category:'tour',
      img:'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80',
      title:'호이안 등불 올드타운 투어', meta:'사이클릭 + 저녁', price:45000 },
    { id:'a-danang-golf',  city:'danang',country:'vietnam', category:'golf',
      img:'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=600&q=80',
      title:'BRG 다낭 골프 라운딩', meta:'18홀 + 카트 포함', price:150000 },
    { id:'a-nhatrang-spa', city:'nhatrang',country:'vietnam',category:'spa',
      img:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      title:'아미아나 스파 90분', meta:'허브 전신 마사지', price:65000 },
    { id:'a-nhatrang-hop', city:'nhatrang',country:'vietnam',category:'tour',
      img:'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
      title:'나트랑 4섬 호핑투어', meta:'점심 + 스노클링', price:48000 },
    { id:'a-bkk-tour',    city:'bangkok',country:'thailand', category:'tour',
      img:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
      title:'방콕 수상시장 + 철도시장', meta:'1일 투어 · 점심', price:58000 },
    { id:'a-bkk-rooftop', city:'bangkok',country:'thailand', category:'restaurant',
      img:'https://images.unsplash.com/photo-1552550049-db097c9480d1?auto=format&fit=crop&w=600&q=80',
      title:'시로코 루프탑바 2인 세트', meta:'예약 확정 · 정장 필수', price:168000 },
    { id:'a-phuket-phiphi',city:'phuket',country:'thailand', category:'tour',
      img:'https://images.unsplash.com/photo-1552550049-db097c9480d1?auto=format&fit=crop&w=600&q=80',
      title:'피피섬 1일 투어', meta:'점심 + 스노클링 + 마야베이', price:72000 },
    { id:'a-phuket-simon', city:'phuket',country:'thailand', category:'ticket',
      img:'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=600&q=80',
      title:'사이먼 카바레 쇼', meta:'VIP석 입장권', price:48000 },
    { id:'a-cnx-elephant', city:'chiangmai',country:'thailand',category:'tour',
      img:'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80',
      title:'치앙마이 코끼리 보호소', meta:'반일 투어 · 점심', price:85000 },
    { id:'a-cnx-massage',  city:'chiangmai',country:'thailand',category:'spa',
      img:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      title:'치앙마이 전통 마사지 2시간', meta:'허브 찜질 포함', price:38000 },
    { id:'a-cebu-hop',    city:'cebu',country:'philippines',   category:'tour',
      img:'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=600&q=80',
      title:'세부 호핑 투어', meta:'파당안/힐루퉁안 섬 + 점심', price:68000 },
    { id:'a-cebu-golf',   city:'cebu',country:'philippines',   category:'golf',
      img:'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=600&q=80',
      title:'세부 알타비스타 골프', meta:'18홀 + 카트 + 캐디 팁', price:120000 },
    { id:'a-boracay-sunset',city:'boracay',country:'philippines',category:'tour',
      img:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      title:'보라카이 선셋 세일링', meta:'원양 세일링 + 스노클링', price:49000 }
  ];

  /* =====================================================================
     6) Products (Packages)
     ===================================================================== */
  const PRODUCTS = [
    {
      id:'prod-jp-01', country:'japan', city:'osaka', category:'package',
      name:'[단독] 오사카 벚꽃 3박4일 프리미엄',
      subtitle:'티웨이항공 왕복 + 호텔 그란비아 + 벚꽃 크루즈',
      flight:'f-TW283', hotel:'h-granvia-osaka', activities:['a-usj-1day','a-osaka-sakura'],
      nights:3, price:689000, oldPrice:890000, originalFlag:true,
      score:9.4, reviews:2847,
      images:[
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80'
      ],
      description:'벚꽃 시즌에 맞춘 오마이트립 단독 기획 프리미엄 패키지. 역 직결 특급호텔 + 야간 벚꽃 크루즈 + 유니버설 스튜디오까지 빈틈없이.',
      includes:['왕복 항공권 (티웨이, 이코노미)','수하물 15kg + 기내 7kg','호텔 그란비아 3박 (조식 포함)','공항 픽업/샌딩','유니버설 스튜디오 1일권','오사카성 벚꽃 크루즈','24시간 한국어 카카오 상담','여행자 보험 기본형'],
      excludes:['중식/석식','현지 교통비','개인 쇼핑','옵션 투어'],
      itinerary:[
        { day:1, label:'도착·체크인', items:[
          { icon:'✈️', title:'인천 → 오사카', desc:'티웨이항공 TW283 · 08:30 출발 · 10:15 도착' },
          { icon:'🚐', title:'공항 픽업', desc:'전용 차량으로 호텔까지 샌딩' },
          { icon:'🏨', title:'호텔 체크인', desc:'호텔 그란비아 오사카 (15:00~)' }
        ]},
        { day:2, label:'벚꽃+USJ', items:[
          { icon:'🎢', title:'유니버설 스튜디오 1일권', desc:'슈퍼 닌텐도 월드 · 해리포터' },
          { icon:'🌸', title:'오사카성 벚꽃 크루즈 (저녁)', desc:'90분 · 한국어 가이드' }
        ]},
        { day:3, label:'자유여행', items:[
          { icon:'🗓️', title:'자유 일정', desc:'교토/나라 옵션 투어 추가 가능' }
        ]},
        { day:4, label:'귀국', items:[
          { icon:'✈️', title:'오사카 → 인천', desc:'티웨이항공 TW284 · 11:00 → 13:00' }
        ]}
      ]
    },
    {
      id:'prod-jp-02', country:'japan', city:'tokyo', category:'package',
      name:'도쿄 3박4일 인기 코스 (신주쿠)',
      subtitle:'대한항공 + APA 호텔 신주쿠 3박',
      flight:'f-KE705', hotel:'h-apa-shinjuku', activities:['a-tokyo-tower'],
      nights:3, price:589000, oldPrice:729000, originalFlag:false,
      score:9.0, reviews:1628,
      images:['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80'],
      description:'도쿄 첫 여행에 딱 맞는 베스트 셀러. 신주쿠 중심지 숙박 + 시부야/아사쿠사 반나절 가이드 투어.',
      includes:['왕복 항공권 (대한항공)','APA 신주쿠 3박','시부야·아사쿠사 반나절 투어','공항 픽업'],
      excludes:['중식/석식','입장권'],
      itinerary:[]
    },
    {
      id:'prod-jp-03', country:'japan', city:'fukuoka', category:'package',
      name:'후쿠오카 온천 힐링 2박3일',
      subtitle:'제주항공 + 유후인 료칸 + 가이세키 석식',
      flight:'f-7C1401', hotel:'h-nishitetsu-tenjin', activities:['a-fukuoka-onsen'],
      nights:2, price:589000, oldPrice:780000, originalFlag:true,
      score:9.5, reviews:1124,
      images:['https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1600&q=80'],
      description:'소규모 전통 료칸에서 즐기는 힐링 온천.',
      includes:['왕복 항공권','료칸 2박','가이세키 석식 2회','조식 2회'],
      excludes:['중식','개인 쇼핑'],
      itinerary:[]
    },
    {
      id:'prod-jp-04', country:'japan', city:'osaka', category:'package',
      name:'오사카 유니버설 패밀리 4박5일',
      subtitle:'티웨이 + 리가로얄 호텔 + USJ 2일권',
      flight:'f-TW283', hotel:'h-rigaroyal-osaka', activities:['a-usj-1day','a-usj-express'],
      nights:4, price:1180000, oldPrice:1450000, originalFlag:true,
      score:9.3, reviews:892,
      images:['https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1600&q=80'],
      description:'아이와 함께 USJ를 제대로 즐기는 4박5일.',
      includes:['왕복 항공권','5성 호텔 4박','USJ 2일권 + 익스프레스 패스'],
      excludes:['중식/석식'],
      itinerary:[]
    },
    {
      id:'prod-vn-01', country:'vietnam', city:'danang', category:'package',
      name:'[단독] 다낭 풀빌라 4박5일 올인클루시브',
      subtitle:'비엣젯 + 프리미어빌리지 + 조식/석식',
      flight:'f-VJ835', hotel:'h-premier-danang', activities:['a-danang-banahill','a-hoian-lantern'],
      nights:4, price:1290000, oldPrice:1590000, originalFlag:true,
      score:9.5, reviews:2184,
      images:['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80'],
      description:'커플·가족 허니문 1위. 풀빌라 전용 조석식 포함.',
      includes:['왕복 항공권 (비엣젯)','프리미어빌리지 풀빌라 4박','조식/석식 전일','바나힐 + 호이안 투어'],
      excludes:['주류','개인 쇼핑'],
      itinerary:[]
    },
    {
      id:'prod-vn-02', country:'vietnam', city:'nhatrang', category:'package',
      name:'나트랑 5성 리조트 3박 단독특가',
      subtitle:'베트남항공 + 빈펄 리조트',
      flight:'f-VN417', hotel:'h-vinpearl-nhatrang', activities:['a-nhatrang-hop'],
      nights:3, price:798000, oldPrice:980000, originalFlag:false,
      score:9.1, reviews:1324,
      images:['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80'],
      description:'빈펄 워터파크 무료 + 호핑투어.',
      includes:['왕복 항공권','빈펄 3박','워터파크 무제한','4섬 호핑'],
      excludes:['중식/석식'],
      itinerary:[]
    },
    {
      id:'prod-vn-03', country:'vietnam', city:'hanoi', category:'package',
      name:'하노이+하롱베이 3박4일',
      subtitle:'티웨이 + 소피텔 메트로폴 + 하롱베이 1박 크루즈',
      flight:'f-LJ073', hotel:'h-sofitel-hanoi', activities:[],
      nights:3, price:1090000, oldPrice:1350000, originalFlag:false,
      score:9.2, reviews:642,
      images:['https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1600&q=80'],
      description:'역사적인 명문 호텔 + 하롱베이 프리미엄 크루즈.',
      includes:['왕복 항공권','소피텔 3박','하롱베이 1박 크루즈 (식사 포함)'],
      excludes:['개인 쇼핑'],
      itinerary:[]
    },
    {
      id:'prod-th-01', country:'thailand', city:'bangkok', category:'package',
      name:'[단독] 방콕+파타야 5박6일 콤비',
      subtitle:'타이항공 + 수쿰빗 4성 + ONE15',
      flight:'f-TG657', hotel:'h-novotel-bangkok', activities:['a-bkk-tour'],
      nights:5, price:890000, oldPrice:1180000, originalFlag:true,
      score:9.0, reviews:1847,
      images:['https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80'],
      description:'방콕 시내 3박 + 파타야 2박 콤비 구성.',
      includes:['왕복 항공권','방콕 3박 + 파타야 2박','수상시장 투어','BTS 3일권'],
      excludes:['중식/석식','산호섬 투어'],
      itinerary:[]
    },
    {
      id:'prod-th-02', country:'thailand', city:'phuket', category:'package',
      name:'푸켓 빈쯔찌 올인클루시브 4박5일',
      subtitle:'에어아시아 + 빈쯔찌 푸켓 + 피피섬 투어',
      flight:'f-FD3502', hotel:'h-vinsetsi-phuket', activities:['a-phuket-phiphi','a-phuket-simon'],
      nights:4, price:1180000, oldPrice:1490000, originalFlag:true,
      score:9.4, reviews:1124,
      images:['https://images.unsplash.com/photo-1552550049-db097c9480d1?auto=format&fit=crop&w=1600&q=80'],
      description:'푸켓 올인클루시브 리조트 + 피피섬 럭셔리 크루즈.',
      includes:['왕복 항공권','빈쯔찌 4박 (올인클루시브)','피피섬 투어','사이먼 쇼 VIP'],
      excludes:['주류'],
      itinerary:[]
    },
    {
      id:'prod-th-03', country:'thailand', city:'chiangmai', category:'package',
      name:'치앙마이 힐링 3박4일',
      subtitle:'에어아시아 + 포시즌스 치앙마이',
      flight:'f-TG747', hotel:'h-fourseasons-cnx', activities:['a-cnx-elephant','a-cnx-massage'],
      nights:3, price:890000, oldPrice:1150000, originalFlag:false,
      score:9.7, reviews:324,
      images:['https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=80'],
      description:'산속 럭셔리 리조트에서 즐기는 완벽한 힐링.',
      includes:['왕복 항공권','포시즌스 3박','코끼리 보호소 투어','전통 마사지 2회'],
      excludes:['중식/석식'],
      itinerary:[]
    },
    {
      id:'prod-ph-01', country:'philippines', city:'cebu', category:'package',
      name:'[단독] 세부 샹그릴라 막탄 4박5일',
      subtitle:'세부퍼시픽 + 샹그릴라 막탄 + 호핑투어',
      flight:'f-5J187', hotel:'h-shangrila-mactan', activities:['a-cebu-hop','a-cebu-golf'],
      nights:4, price:1580000, oldPrice:1890000, originalFlag:true,
      score:9.5, reviews:1348,
      images:['https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=1600&q=80'],
      description:'세부 최고급 리조트 + 호핑 + 골프 라운딩.',
      includes:['왕복 항공권','샹그릴라 4박','호핑투어','골프 라운딩 1회'],
      excludes:['주류'],
      itinerary:[]
    },
    {
      id:'prod-ph-02', country:'philippines', city:'boracay', category:'package',
      name:'보라카이 5성 리조트 4박',
      subtitle:'필리핀항공 + 헤난 크리스탈샌즈',
      flight:'f-PR488', hotel:'h-henann-boracay', activities:['a-boracay-sunset'],
      nights:4, price:1380000, oldPrice:1690000, originalFlag:true,
      score:9.3, reviews:892,
      images:['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1600&q=80'],
      description:'화이트 비치 최고 평점 리조트.',
      includes:['왕복 항공권','헤난 4박','조식 전일','선셋 세일링'],
      excludes:['점심/석식'],
      itinerary:[]
    }
  ];

  /* =====================================================================
     7) Creators & Feed Posts
     ===================================================================== */
  const CREATORS = [
    { id:'cr-jp-lab',   name:'일본여행연구소',   initial:'일', subs:'48만', verified:false, official:false, bio:'일본 10년 살면서 알게 된 진짜 여행 꿀팁' },
    { id:'cr-vn-live',  name:'베트남살이',       initial:'베', subs:'23만', verified:true,  official:false, bio:'다낭 거주 5년차, 로컬 뷰 100%' },
    { id:'cr-th-master',name:'태국고수',         initial:'태', subs:'67만', verified:true,  official:false, bio:'방콕 맛집·호텔 리뷰 전문' },
    { id:'cr-omt',      name:'오마이트립 공식',  initial:'O',  subs:'ORIGINAL', verified:true, official:true,  bio:'오마이트립 단독 기획 상품 소개' },
    { id:'cr-couple',   name:'여행하는부부',     initial:'부', subs:'12만', verified:false, official:false, bio:'둘이 떠나는 가성비 여행' },
    { id:'cr-golf-jin', name:'골프덕후진',       initial:'골', subs:'8만',  verified:false, official:false, bio:'골프 여행 전문, 동남아 라운딩 리뷰' },
    { id:'cr-honey',    name:'허니문플래너',     initial:'허', subs:'19만', verified:true,  official:false, bio:'신혼여행 전문 플래너의 큐레이션' },
    { id:'cr-family',   name:'패밀리트립',       initial:'패', subs:'31만', verified:true,  official:false, bio:'아이와 함께 떠나는 해외 여행' }
  ];

  const FEED_POSTS = [
    { id:'fp-01', creatorId:'cr-jp-lab', productId:'prod-jp-01',
      bg:'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'오사카 2박3일 가성비 완벽 루트 (진짜 현지인 꿀팁)',
      description:'도톤보리·구로몬 시장·신사이바시까지 완벽 정복. 실제 지출 내역 영수증으로 공개합니다.',
      tags:['가성비','일본'], countries:['japan'],
      stats:{ likes:'12.4K', comments:'328', shares:'156', saves:'892' }
    },
    { id:'fp-02', creatorId:'cr-vn-live', productId:'prod-vn-01',
      bg:'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'다낭 신혼여행 5박 리얼 후기 - 예산 짜는 법부터 공개',
      description:'프리미어빌리지 풀빌라 4박, 바나힐 1일, 호이안 등불 투어까지. 실제 800만원 예산 분배법.',
      tags:['허니문','베트남'], countries:['vietnam'],
      stats:{ likes:'8.7K', comments:'512', shares:'234', saves:'1.2K' }
    },
    { id:'fp-03', creatorId:'cr-th-master', productId:'prod-th-01',
      bg:'https://images.unsplash.com/photo-1552550049-db097c9480d1?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'방콕 호텔 3만원 vs 30만원 직접 가봤다, 차이가 어마어마',
      description:'1박 3만원 게스트하우스부터 30만원 루프탑 호텔까지 실제 체류 영상.',
      tags:['태국'], countries:['thailand'],
      stats:{ likes:'24.1K', comments:'1.4K', shares:'892', saves:'3.2K' }
    },
    { id:'fp-04', creatorId:'cr-omt', productId:'prod-ph-01',
      bg:'https://images.unsplash.com/photo-1518509562904-e7ef99cddc85?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'필리핀 세부 골프 패키지 완전 비교 - 단독 특가',
      description:'세부 3대 골프장 라운딩 3회 + 샹그릴라 막탄 4박. 경쟁사 대비 28% 저렴.',
      tags:['필리핀','골프'], countries:['philippines'],
      stats:{ likes:'6.2K', comments:'187', shares:'421', saves:'1.8K' }
    },
    { id:'fp-05', creatorId:'cr-couple', productId:'prod-jp-03',
      bg:'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'후쿠오카 당일치기 완벽 코스 8시간 - 8만원대 가능',
      description:'아침 출국→점심 라멘→온천→야경→야식→귀국. 당일치기 풀타임 코스.',
      tags:['일본'], countries:['japan'],
      stats:{ likes:'3.8K', comments:'156', shares:'89', saves:'421' }
    },
    { id:'fp-06', creatorId:'cr-golf-jin', productId:'prod-th-01',
      bg:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'방콕 골프 4박5일 올인클루시브 실제 비용 공개',
      description:'시암 컨트리클럽 + 알파인 + 뉴스프링 3라운드. 80만원대.',
      tags:['골프','태국'], countries:['thailand'],
      stats:{ likes:'4.2K', comments:'298', shares:'178', saves:'1.1K' }
    },
    { id:'fp-07', creatorId:'cr-honey', productId:'prod-jp-03',
      bg:'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'교토 료칸 허니문 3박4일 - 벚꽃 시즌 완벽 플랜',
      description:'유후인 료칸 3박 + 교토 기모노 체험 + 아라시야마.',
      tags:['허니문','일본'], countries:['japan'],
      stats:{ likes:'15.7K', comments:'892', shares:'567', saves:'4.1K' }
    },
    { id:'fp-08', creatorId:'cr-family', productId:'prod-vn-01',
      bg:'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&h=1422&q=80',
      title:'아이와 함께 다낭 5박6일, 키즈 프렌들리 꿀팁 모음',
      description:'바나힐 테마파크+워터파크+풀빌라. 2세/5세 데리고 안 힘든 루트.',
      tags:['가족여행','베트남'], countries:['vietnam'],
      stats:{ likes:'9.4K', comments:'621', shares:'312', saves:'2.3K' }
    }
  ];

  /* =====================================================================
     8) Reviews (product-level)
     ===================================================================== */
  const REVIEWS = [
    { id:'rv-01', productId:'prod-jp-01', userInitial:'김', userName:'김○○', travelType:'커플', duration:'3박4일', score:9.8, date:'2026-04-10',
      text:'역 직결이라 정말 편했어요. 체크인 후 바로 도톤보리 산책하고 유니버설 다녀왔는데 피로도가 확실히 덜했습니다. 조식 퀄리티도 훌륭!' },
    { id:'rv-02', productId:'prod-jp-01', userInitial:'박', userName:'박○○', travelType:'가족', duration:'3박4일', score:9.2, date:'2026-04-05',
      text:'아이 둘 데리고 갔는데 공항 픽업이 있어서 너무 편했어요. 유니버설 티켓 포함된 게 가장 좋았습니다. 다음에도 오마이트립으로 예약할게요.' },
    { id:'rv-03', productId:'prod-jp-01', userInitial:'이', userName:'이○○', travelType:'친구', duration:'3박4일', score:9.5, date:'2026-03-28',
      text:'간사이 스루패스 덕분에 교토·나라까지 알차게 돌았어요. 가성비 끝판왕입니다. 호텔 뷰도 끝내줘요.' },
    { id:'rv-04', productId:'prod-jp-02', userInitial:'최', userName:'최○○', travelType:'가족', duration:'3박4일', score:9.1, date:'2026-03-15',
      text:'처음 가본 도쿄인데 호텔 위치가 정말 좋았어요. 신주쿠역 걸어서 다닐만하고 주변 식당도 많아서 밤마다 돌아다녔네요.' },
    { id:'rv-05', productId:'prod-vn-01', userInitial:'윤', userName:'윤○○', travelType:'허니문', duration:'5박6일', score:9.7, date:'2026-04-01',
      text:'허니문으로 선택했는데 대만족. 풀빌라 룸서비스 올인클루시브가 진짜 큰 매력이었어요. 프라이빗하고 편안합니다.' },
    { id:'rv-06', productId:'prod-vn-01', userInitial:'오', userName:'오○○', travelType:'커플', duration:'4박5일', score:9.4, date:'2026-03-20',
      text:'수영장이 최고. 아침마다 조식 먹으며 바다 보는게 루틴이었어요. 다음에 다낭 또 갈 때도 여기 올겁니다.' },
    { id:'rv-07', productId:'prod-th-02', userInitial:'정', userName:'정○○', travelType:'커플', duration:'4박5일', score:9.2, date:'2026-03-12',
      text:'올인클루시브라 지갑 걱정 없이 즐겼어요. 피피섬 투어 선명한 에메랄드 바다 잊을 수 없습니다.' },
    { id:'rv-08', productId:'prod-ph-01', userInitial:'한', userName:'한○○', travelType:'가족', duration:'4박5일', score:9.6, date:'2026-03-05',
      text:'샹그릴라 프라이빗 비치 진짜 굿. 호핑투어도 점심까지 잘 나왔고 가이드분 한국어도 잘하셨습니다.' }
  ];

  /* =====================================================================
     9) User profile (logged-in)
     ===================================================================== */
  const USER = {
    id:'u-me',
    name:'홍길동', nameEn:'HONG GILDONG',
    email:'gildong@ohmytrip.kr', phone:'010-1234-5678',
    birth:'1990-03-15', gender:'male',
    grade:'GOLD', points:48500,
    travelers:[
      { id:'tr-self',   name:'홍길동', nameEn:'HONG GILDONG', birth:'1990-03-15', phone:'010-1234-5678', relation:'본인' },
      { id:'tr-spouse', name:'홍길순', nameEn:'HONG GILSOON', birth:'1992-07-22', phone:'010-2345-6789', relation:'가족' }
    ]
  };

  /* =====================================================================
     10) Initial Bookings / Coupons / Points (for mypage seed)
     ===================================================================== */
  const INITIAL_BOOKINGS = [
    {
      id:'bk-seed-1', bookingNumber:'OMT-K3X9LP2M', status:'confirmed', productId:'prod-jp-01',
      dates:'2026.05.10 - 2026.05.13', paxCount:2, total:1796000,
      paymentMethod:'kakao', leadName:'홍길동', phone:'010-1234-5678',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id:'bk-seed-2', bookingNumber:'OMT-J7N2QW4K', status:'pending', productId:'prod-vn-01',
      dates:'2026.06.07 - 2026.06.12', paxCount:2, total:1290000,
      paymentMethod:'bank', leadName:'홍길동', phone:'010-1234-5678',
      createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
    },
    {
      id:'bk-seed-3', bookingNumber:'OMT-M5P8RT3H', status:'confirmed', productId:'prod-th-01',
      dates:'2026.04.29 - 2026.05.04', paxCount:2, total:1780000,
      paymentMethod:'card', leadName:'홍길동', phone:'010-1234-5678',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
    },
    {
      id:'bk-seed-4', bookingNumber:'OMT-B1D4FG7C', status:'completed', productId:'prod-jp-02',
      dates:'2026.02.15 - 2026.02.18', paxCount:2, total:1178000,
      paymentMethod:'kakao', leadName:'홍길동', phone:'010-1234-5678',
      createdAt: new Date(Date.now() - 86400000 * 65).toISOString()
    }
  ];

  const COUPONS = [
    { code:'OMTSPRING25', amount:25000,  type:'flat',    title:'봄 시즌 특가 쿠폰',   terms:'전체 상품 · 20만원 이상', expires:'2026-05-31', minAmount:200000 },
    { code:'JP10',        amount:10,     type:'percent', title:'일본 여행 10% 할인',   terms:'일본 상품 한정 · 최대 5만원', expires:'2026-06-30', maxAmount:50000, country:'japan' },
    { code:'GOLDVIP50',   amount:50000,  type:'flat',    title:'GOLD 회원 전용',      terms:'오리지널 상품 · 100만원 이상', expires:'2026-12-31', minAmount:1000000, grade:'GOLD' },
    { code:'FEED5',       amount:5,      type:'percent', title:'크리에이터 피드 쿠폰', terms:'피드 내 상품 결제 시',        expires:'2026-04-30' },
    { code:'NEWUSER',     amount:30000,  type:'flat',    title:'신규 회원 환영 쿠폰', terms:'첫 결제 시',                 expires:'2026-12-31', minAmount:300000 }
  ];

  const POINTS_HISTORY = [
    { id:'pt-1', date:'2026-04-15', label:'오사카 패키지 예약 적립', delta:+17960 },
    { id:'pt-2', date:'2026-04-10', label:'다낭 패키지 결제 사용',  delta:-10000 },
    { id:'pt-3', date:'2026-03-20', label:'리뷰 작성 보너스',       delta:+5000  },
    { id:'pt-4', date:'2026-02-28', label:'도쿄 패키지 적립',       delta:+11780 },
    { id:'pt-5', date:'2026-02-25', label:'회원가입 축하',          delta:+10000 },
    { id:'pt-6', date:'2026-01-15', label:'생일 축하 포인트',       delta:+5000  }
  ];

  /* =====================================================================
     Expose + Helpers
     ===================================================================== */
  root.DATA = {
    COUNTRIES, CITIES, AIRLINES, FLIGHTS, HOTELS, ACTIVITIES,
    PRODUCTS, CREATORS, FEED_POSTS, REVIEWS, USER,
    INITIAL_BOOKINGS, COUPONS, POINTS_HISTORY
  };

  root.getProduct    = (id) => PRODUCTS.find(p => p.id === id);
  root.getHotel      = (id) => HOTELS.find(h => h.id === id);
  root.getFlight     = (id) => FLIGHTS.find(f => f.id === id);
  root.getActivity   = (id) => ACTIVITIES.find(a => a.id === id);
  root.getCreator    = (id) => CREATORS.find(c => c.id === id);
  root.getPost       = (id) => FEED_POSTS.find(p => p.id === id);
  root.getAirport    = (code) => CITIES[code];
  root.getAirline    = (code) => AIRLINES[code];
  root.getReviewsFor = (productId) => REVIEWS.filter(r => r.productId === productId);

  root.searchFlights = (opts={}) => {
    const {from, to, maxPrice, airlines, stops, depTime} = opts;
    return FLIGHTS.filter(f => {
      if(from && f.from !== from) return false;
      if(to && f.to !== to) return false;
      if(maxPrice && f.price > maxPrice) return false;
      if(airlines && airlines.length && !airlines.includes(f.code)) return false;
      if(stops !== undefined && stops !== null && f.stops !== stops) return false;
      if(depTime && f.depTime !== depTime) return false;
      return true;
    });
  };

  root.searchHotels = (opts={}) => {
    const {city, country, minStars, maxPrice} = opts;
    return HOTELS.filter(h => {
      if(city && h.city !== city) return false;
      if(country && h.country !== country) return false;
      if(minStars && h.stars < minStars) return false;
      if(maxPrice && h.price > maxPrice) return false;
      return true;
    });
  };

  root.searchProducts = (opts={}) => {
    const {country, city, category, originalOnly} = opts;
    return PRODUCTS.filter(p => {
      if(country && p.country !== country) return false;
      if(city && p.city !== city) return false;
      if(category && p.category !== category) return false;
      if(originalOnly && !p.originalFlag) return false;
      return true;
    });
  };

  root.krw = krw;
  root.daysFromNow = daysFromNow;

  // Compact product view (used by cart/checkout)
  root.productAsPackage = (productId, paxCount=2, datesStr) => {
    const p = root.getProduct(productId);
    if(!p) return null;
    const flight = root.getFlight(p.flight);
    const hotel  = root.getHotel(p.hotel);
    const acts   = (p.activities || []).map(id => root.getActivity(id)).filter(Boolean);
    return {
      flight: flight ? {
        airline: AIRLINES[flight.code]?.name || flight.code,
        number: flight.number,
        out: { dep:flight.outDep, arr:flight.outArr, depAp:flight.from, arrAp:flight.to, dur:flight.outDur },
        ret: { dep:flight.retDep, arr:flight.retArr, depAp:flight.to, arrAp:flight.from, dur:flight.retDur },
        direct: flight.stops === 0, price: Math.round(p.price * 0.35)
      } : null,
      hotel: hotel ? {
        name: hotel.name, areaLabel: hotel.area,
        price: Math.round(p.price * 0.55 / Math.max(1, p.nights))
      } : null,
      activities: acts.map(a => ({ title:a.title, meta:a.meta, price:0 })),
      paxCount, nights:p.nights, dates:datesStr || '2026.05.10 - 2026.05.'+String(10+p.nights).padStart(2,'0'),
      productId: p.id,
      productName: p.name,
      productImage: p.images?.[0],
      final: p.price * paxCount
    };
  };

})();
