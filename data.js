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
    CJU: { code:'CJU', name:'제주', country:'KR', isOrigin:true },
    KWJ: { code:'KWJ', name:'광주', country:'KR', isOrigin:true },
    RSU: { code:'RSU', name:'여수', country:'KR', isOrigin:true },
    USN: { code:'USN', name:'울산', country:'KR', isOrigin:true },
    WJU: { code:'WJU', name:'원주', country:'KR', isOrigin:true },
    CJJ: { code:'CJJ', name:'청주', country:'KR', isOrigin:true },
    MWX: { code:'MWX', name:'무안', country:'KR', isOrigin:true },
    KPO: { code:'KPO', name:'포항경주', country:'KR', isOrigin:true },
    // Japan
    NRT: { code:'NRT', name:'도쿄(나리타)', country:'japan', city:'tokyo' },
    HND: { code:'HND', name:'도쿄(하네다)', country:'japan', city:'tokyo' },
    KIX: { code:'KIX', name:'오사카', country:'japan', city:'osaka' },
    FUK: { code:'FUK', name:'후쿠오카', country:'japan', city:'fukuoka' },
    CTS: { code:'CTS', name:'삿포로', country:'japan', city:'sapporo' },
    NGO: { code:'NGO', name:'나고야', country:'japan', city:'nagoya' },
    OKA: { code:'OKA', name:'오키나와', country:'japan', city:'okinawa' },
    // China
    PEK: { code:'PEK', name:'베이징', country:'china', city:'beijing' },
    PVG: { code:'PVG', name:'상해(푸동)', country:'china', city:'shanghai' },
    SHA: { code:'SHA', name:'상해(홍차오)', country:'china', city:'shanghai' },
    TAO: { code:'TAO', name:'청도', country:'china', city:'qingdao' },
    SHE: { code:'SHE', name:'심양', country:'china', city:'shenyang' },
    YNJ: { code:'YNJ', name:'연길', country:'china', city:'yanji' },
    DLC: { code:'DLC', name:'대련', country:'china', city:'dalian' },
    CAN: { code:'CAN', name:'광저우', country:'china', city:'guangzhou' },
    HRB: { code:'HRB', name:'하얼빈', country:'china', city:'harbin' },
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
    PPS: { code:'PPS', name:'팔라완', country:'philippines', city:'palawan' },
    // Asia (others)
    DMK: { code:'DMK', name:'방콕(돈무앙)', country:'thailand', city:'bangkok' },
    HKG: { code:'HKG', name:'홍콩', country:'hongkong', city:'hongkong' },
    TPE: { code:'TPE', name:'타이페이', country:'taiwan', city:'taipei' },
    SIN: { code:'SIN', name:'싱가포르', country:'singapore', city:'singapore' },
    DPS: { code:'DPS', name:'발리', country:'indonesia', city:'bali' },
    ULN: { code:'ULN', name:'울란바토르', country:'mongolia', city:'ulaanbaatar' },
    // North America
    LAX: { code:'LAX', name:'로스앤젤레스', country:'usa', city:'losangeles' },
    JFK: { code:'JFK', name:'뉴욕(JFK)', country:'usa', city:'newyork' },
    LGA: { code:'LGA', name:'뉴욕(라구아디아)', country:'usa', city:'newyork' },
    EWR: { code:'EWR', name:'뉴욕(뉴왁)', country:'usa', city:'newyork' },
    SFO: { code:'SFO', name:'샌프란시스코', country:'usa', city:'sanfrancisco' },
    HNL: { code:'HNL', name:'호놀룰루(오하우)', country:'usa', city:'honolulu' },
    LAS: { code:'LAS', name:'라스베이거스', country:'usa', city:'lasvegas' },
    ATL: { code:'ATL', name:'애틀란타', country:'usa', city:'atlanta' },
    YVR: { code:'YVR', name:'벤쿠버', country:'canada', city:'vancouver' },
    YYZ: { code:'YYZ', name:'토론토', country:'canada', city:'toronto' },
    GRU: { code:'GRU', name:'상파울로', country:'brazil', city:'saopaulo' },
    CUN: { code:'CUN', name:'칸쿤', country:'mexico', city:'cancun' },
    // Europe
    CDG: { code:'CDG', name:'파리', country:'france', city:'paris' },
    LHR: { code:'LHR', name:'런던', country:'uk', city:'london' },
    FCO: { code:'FCO', name:'로마', country:'italy', city:'rome' },
    PRG: { code:'PRG', name:'프라하', country:'czech', city:'prague' },
    FRA: { code:'FRA', name:'프랑크푸르트', country:'germany', city:'frankfurt' },
    AMS: { code:'AMS', name:'암스테르담', country:'netherlands', city:'amsterdam' },
    MAD: { code:'MAD', name:'마드리드', country:'spain', city:'madrid' },
    BCN: { code:'BCN', name:'바르셀로나', country:'spain', city:'barcelona' },
    ZRH: { code:'ZRH', name:'취리히', country:'switzerland', city:'zurich' },
    IST: { code:'IST', name:'이스탄불', country:'turkey', city:'istanbul' },
    HEL: { code:'HEL', name:'헬싱키', country:'finland', city:'helsinki' },
    // Oceania
    GUM: { code:'GUM', name:'괌', country:'guam', city:'guam' },
    SPN: { code:'SPN', name:'사이판', country:'cnmi', city:'saipan' },
    SYD: { code:'SYD', name:'시드니', country:'australia', city:'sydney' },
    MEL: { code:'MEL', name:'멜번', country:'australia', city:'melbourne' },
    AKL: { code:'AKL', name:'오클랜드', country:'newzealand', city:'auckland' }
  };

  /* CITY_GRID — 인터파크 스타일 도시 선택 모달용 그룹 매핑 */
  const CITY_GRID = {
    '국내': ['GMP','ICN','CJU','PUS','TAE','KWJ','RSU','USN','WJU','CJJ','MWX','KPO'],
    '일본': ['NRT','HND','KIX','FUK','CTS','NGO','OKA'],
    '중국': ['PEK','PVG','SHA','TAO','SHE','YNJ','DLC','CAN','HRB'],
    '아시아': ['BKK','DMK','HKG','TPE','MNL','CEB','SIN','SGN','HAN','DAD','CXR','DPS','ULN'],
    '미주': ['LAX','JFK','LGA','EWR','SFO','HNL','LAS','ATL'],
    '캐나다': ['YVR','YYZ'],
    '중남미': ['GRU','CUN'],
    '유럽': ['CDG','LHR','FCO','PRG','FRA','AMS','MAD','BCN','ZRH','IST','HEL'],
    '대양주': ['GUM','SPN','SYD','MEL','AKL']
  };

  /* 나고야 NGO 노선 — 스크린샷 참고 8건 */
  const NAGOYA_FLIGHTS = [
    { id:'f-7C2105', code:'7C', number:'7C2105', from:'ICN', to:'NGO', outDep:'09:30', outArr:'11:30', outDur:'2h 00m', retDep:'13:00', retArr:'15:00', retDur:'2h 00m', stops:0, price:375400, class:'economy', depTime:'morning' },
    { id:'f-LJ631',  code:'LJ', number:'LJ631',  from:'ICN', to:'NGO', outDep:'07:30', outArr:'09:25', outDur:'1h 55m', retDep:'11:00', retArr:'13:10', retDur:'2h 10m', stops:0, price:379000, class:'economy', depTime:'morning' },
    { id:'f-7C2107', code:'7C', number:'7C2107', from:'ICN', to:'NGO', outDep:'15:05', outArr:'17:00', outDur:'1h 55m', retDep:'18:30', retArr:'20:40', retDur:'2h 10m', stops:0, price:390400, class:'economy', depTime:'afternoon' },
    { id:'f-KE757',  code:'KE', number:'KE757',  from:'ICN', to:'NGO', outDep:'10:00', outArr:'12:00', outDur:'2h 00m', retDep:'13:30', retArr:'15:40', retDur:'2h 10m', stops:0, price:437200, class:'economy', depTime:'morning' },
    { id:'f-OZ134',  code:'OZ', number:'OZ134',  from:'ICN', to:'NGO', outDep:'12:20', outArr:'14:05', outDur:'1h 45m', retDep:'15:30', retArr:'17:40', retDur:'2h 10m', stops:0, price:625200, class:'economy', depTime:'afternoon' },
    { id:'f-NH158',  code:'NH', number:'NH158',  from:'ICN', to:'NGO', outDep:'14:50', outArr:'16:50', outDur:'2h 00m', retDep:'18:00', retArr:'20:10', retDur:'2h 10m', stops:0, price:803400, class:'economy', depTime:'afternoon' },
    { id:'f-LJ633',  code:'LJ', number:'LJ633',  from:'ICN', to:'NGO', outDep:'16:00', outArr:'17:55', outDur:'1h 55m', retDep:'19:30', retArr:'21:40', retDur:'2h 10m', stops:0, price:419000, class:'economy', depTime:'afternoon' },
    { id:'f-7C2109', code:'7C', number:'7C2109', from:'ICN', to:'NGO', outDep:'19:30', outArr:'21:30', outDur:'2h 00m', retDep:'22:30', retArr:'00:40', retDur:'2h 10m', stops:1, price:489400, class:'economy', depTime:'evening' }
  ];

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
    PR: { code:'PR', name:'필리핀항공',      tier:'FSC',  color:'linear-gradient(135deg,#003F87,#1565C0)' },
    NH: { code:'NH', name:'ANA항공',        tier:'FSC',  color:'linear-gradient(135deg,#003E92,#1565C0)' },
    JL: { code:'JL', name:'일본항공(JAL)',  tier:'FSC',  color:'linear-gradient(135deg,#B70519,#E74C3C)' },
    CA: { code:'CA', name:'중국국제항공',    tier:'FSC',  color:'linear-gradient(135deg,#C8102E,#E74C3C)' },
    CX: { code:'CX', name:'캐세이퍼시픽',    tier:'FSC',  color:'linear-gradient(135deg,#006564,#0B8888)' }
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
    { id:'f-PR488',  code:'PR', number:'PR488',  from:'ICN', to:'KLO', outDep:'06:30', outArr:'10:30', outDur:'4h 30m', retDep:'12:00', retArr:'19:00', retDur:'4h 30m', stops:0, price:489000, class:'economy', depTime:'morning' },

    // Korea → Vietnam (Phu Quoc) — 인기 노선
    { id:'f-VJ975',  code:'VJ', number:'VJ975',  from:'ICN', to:'PQC', outDep:'20:30', outArr:'00:20', outDur:'5h 00m', retDep:'01:40', retArr:'09:10', retDur:'5h 00m', stops:0, price:419000, class:'economy', depTime:'evening' },
    { id:'f-KE467',  code:'KE', number:'KE467',  from:'ICN', to:'PQC', outDep:'18:20', outArr:'22:10', outDur:'5h 00m', retDep:'23:40', retArr:'07:10', retDur:'5h 00m', stops:0, price:559000, class:'economy', depTime:'evening' },
    { id:'f-7C3905', code:'7C', number:'7C3905', from:'ICN', to:'PQC', outDep:'09:10', outArr:'13:00', outDur:'5h 00m', retDep:'14:20', retArr:'21:50', retDur:'5h 00m', stops:0, price:389000, class:'economy', depTime:'morning' },

    // Korea → Japan (Okinawa) — 인기 노선
    { id:'f-7C1383', code:'7C', number:'7C1383', from:'ICN', to:'OKA', outDep:'08:40', outArr:'11:10', outDur:'2h 30m', retDep:'12:10', retArr:'14:50', retDur:'2h 40m', stops:0, price:259000, class:'economy', depTime:'morning' },
    { id:'f-TW289',  code:'TW', number:'TW289',  from:'ICN', to:'OKA', outDep:'14:30', outArr:'17:00', outDur:'2h 30m', retDep:'18:00', retArr:'20:40', retDur:'2h 40m', stops:0, price:279000, class:'economy', depTime:'afternoon' },
    { id:'f-KE757O', code:'KE', number:'KE757',  from:'ICN', to:'OKA', outDep:'10:20', outArr:'12:50', outDur:'2h 30m', retDep:'14:00', retArr:'16:40', retDur:'2h 40m', stops:0, price:359000, class:'economy', depTime:'morning' },

    // Korea → Japan (Tokyo Haneda) — ohmytrip 실측 정합 · 직항 10편 (대한1/아시아나1/일본항공4/ANA4)
    { id:'f-OZ1085', code:'OZ', number:'OZ1085', from:'ICN', to:'HND', outDep:'21:10', outArr:'23:30', outDur:'2h 20m', retDep:'10:30', retArr:'13:00', retDur:'2h 30m', stops:0, price:443400,  class:'economy', depTime:'evening',   operatedBy:'NH' }, // 아시아나 최저 · ANA 공동운항
    { id:'f-KE2001', code:'KE', number:'KE2001', from:'ICN', to:'HND', outDep:'08:00', outArr:'10:20', outDur:'2h 20m', retDep:'12:00', retArr:'14:30', retDur:'2h 30m', stops:0, price:488300,  class:'economy', depTime:'morning',   operatedBy:'JL' }, // 대한항공 · JAL 공동운항
    { id:'f-JL092',  code:'JL', number:'JL092',  from:'ICN', to:'HND', outDep:'09:30', outArr:'11:50', outDur:'2h 20m', retDep:'13:30', retArr:'16:00', retDur:'2h 30m', stops:0, price:686500,  class:'economy', depTime:'morning' },
    { id:'f-JL094',  code:'JL', number:'JL094',  from:'ICN', to:'HND', outDep:'12:40', outArr:'15:00', outDur:'2h 20m', retDep:'16:40', retArr:'19:10', retDur:'2h 30m', stops:0, price:724000,  class:'economy', depTime:'afternoon' },
    { id:'f-JL096',  code:'JL', number:'JL096',  from:'ICN', to:'HND', outDep:'15:20', outArr:'17:40', outDur:'2h 20m', retDep:'19:20', retArr:'21:50', retDur:'2h 30m', stops:0, price:812000,  class:'economy', depTime:'afternoon' },
    { id:'f-JL090',  code:'JL', number:'JL090',  from:'ICN', to:'HND', outDep:'18:10', outArr:'20:30', outDur:'2h 20m', retDep:'08:30', retArr:'11:00', retDur:'2h 30m', stops:0, price:905000,  class:'economy', depTime:'evening' },
    { id:'f-NH862',  code:'NH', number:'NH862',  from:'ICN', to:'HND', outDep:'07:40', outArr:'10:00', outDur:'2h 20m', retDep:'11:30', retArr:'14:00', retDur:'2h 30m', stops:0, price:1004200, class:'economy', depTime:'morning' },
    { id:'f-NH864',  code:'NH', number:'NH864',  from:'ICN', to:'HND', outDep:'11:20', outArr:'13:40', outDur:'2h 20m', retDep:'15:10', retArr:'17:40', retDur:'2h 30m', stops:0, price:1058000, class:'economy', depTime:'morning' },
    { id:'f-NH866',  code:'NH', number:'NH866',  from:'ICN', to:'HND', outDep:'14:30', outArr:'16:50', outDur:'2h 20m', retDep:'18:20', retArr:'20:50', retDur:'2h 30m', stops:0, price:1102000, class:'economy', depTime:'afternoon' },
    { id:'f-NH868',  code:'NH', number:'NH868',  from:'ICN', to:'HND', outDep:'19:40', outArr:'22:00', outDur:'2h 20m', retDep:'09:00', retArr:'11:30', retDur:'2h 30m', stops:0, price:1187000, class:'economy', depTime:'evening' }
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
    { id:'h-monterey-namba',  city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
      name:'호텔 몬터레이 그래스미어', area:'난바', areaId:'namba', stars:4, score:8.7, reviews:1842, price:169000, oldPrice:199000,
      amenities:['조식 포함','와이파이','피트니스'],
      description:'난바 스카이오와 연결된 럭셔리 호텔. 쇼핑·교통 편리.' },
    { id:'h-hana-shinsaibashi', city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80'],
      name:'하나 호텔 신사이바시', area:'신사이바시', areaId:'shinsaibashi', stars:3, score:8.2, reviews:941, price:89000, oldPrice:109000,
      amenities:['와이파이','24시간 프론트'],
      description:'신사이바시 도보 5분의 합리적인 가격의 숙소.' },
    { id:'h-intercon-osaka',  city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80'],
      name:'인터컨티넨탈 호텔 오사카', area:'우메다', areaId:'umeda', stars:5, score:9.5, reviews:2184, price:489000, oldPrice:589000,
      amenities:['조식 포함','와이파이','스파','수영장','피트니스','라운지','역 직결'],
      description:'우메다역 직결 럭셔리 체인 호텔. 그랜드 프론트 오사카 인접.' },
    { id:'h-nikko-osaka',     city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80'],
      name:'호텔 닛코 오사카', area:'신사이바시', areaId:'shinsaibashi', stars:4, score:8.8, reviews:3012, price:219000, oldPrice:259000,
      amenities:['조식 포함','와이파이','피트니스','바/라운지'],
      description:'신사이바시역 도보 2분의 클래식 시티 호텔.' },
    { id:'h-swissotel-osaka', city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
      name:'스위스호텔 난카이 오사카', area:'난바', areaId:'namba', stars:5, score:9.3, reviews:3821, price:379000, oldPrice:449000,
      amenities:['조식 포함','와이파이','수영장','스파','피트니스','라운지','역 직결'],
      description:'난카이 난바역 직결 스카이 럭셔리 호텔. 간사이공항 접근 편리.' },
    { id:'h-prince-shinsaibashi', city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80'],
      name:'프린스 호텔 신사이바시', area:'신사이바시', areaId:'shinsaibashi', stars:4, score:8.6, reviews:1628, price:148000, oldPrice:179000,
      amenities:['조식 포함','와이파이','피트니스'],
      description:'신사이바시 중심의 깔끔한 체인 호텔.' },
    { id:'h-ryokan-umeda',    city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80'],
      name:'우메다 전통 료칸', area:'우메다', areaId:'umeda', stars:4, score:9.1, reviews:524, price:289000, oldPrice:329000,
      amenities:['조식 포함','석식 포함','온천','와이파이','다다미'],
      description:'다다미방·온천·가이세키 석식이 포함된 전통 료칸.' },
    { id:'h-hostel-osaka',    city:'osaka', country:'japan',
      img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80'],
      name:'오사카 백패커스 호스텔', area:'난바', areaId:'namba', stars:2, score:7.9, reviews:847, price:35000, oldPrice:45000,
      amenities:['와이파이','공용 주방','24시간 프론트','세탁실'],
      description:'도미토리 6인실 중심의 저렴한 배낭여행자용 호스텔.' },

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

    // Okinawa
    { id:'h-kanucha-okinawa',  city:'okinawa', country:'japan',
      img:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      gallery:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
      name:'카누차 베이 호텔&빌라', area:'안부 (얀바루)', areaId:'kanucha', stars:5, score:9.0, reviews:1248, price:298000, oldPrice:359000,
      amenities:['조식 포함','와이파이','수영장','스파','프라이빗 비치','골프장 부지내','셔틀'],
      description:'리조트 내 18홀 골프코스 보유 — 오션뷰 객실 + 셀프 라운딩 가능한 오키나와 대표 골프 리조트.' },

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
  // 에어텔(자유여행) 패키지 라인 폐지 — FIT 트렌드 대응 (사이클 38). 골프텔·항공·호텔로 전환.
  const PRODUCTS = [];

  /* =====================================================================
     6-A) Product Types (ELLIS backend enum)
     - 백엔드 상품 분류 키. UI 라벨과 분리되어 있어야 마이그레이션 용이
     ===================================================================== */
  const PRODUCT_TYPES = {
    GOLFTEL:     'golftel',      // 골프 + 호텔 (메인 SKU)
    GOLFTEL_AIR: 'golftel-air',  // 골프 + 호텔 + 항공 (별도 상품 언어)
    PACKAGE:     'package',      // 일반 자유여행 패키지 (기존)
    HOTEL:       'hotel',        // 단품 호텔
    FLIGHT:      'flight',       // 단품 항공
    ACTIVITY:    'activity',     // 액티비티/티켓 (공급사 연동)
    RENT:        'rent'          // 렌트카 (공급사 연동)
  };

  /* =====================================================================
     6-B) Country Ownership Matrix
     - 직영(direct) vs 프랜차이즈(franchise) 운영 모델
     - 직영: OMT가 골프장·호텔 직접 운영, 마진 20-25%
     - 프랜차이즈: OMT 브랜드 위탁, 마진 일반 수준
     ===================================================================== */
  const OWNERSHIP = {
    japan:       { model:'direct',     label:'OMT 직영', margin:0.225 },
    vietnam:     { model:'direct',     label:'OMT 직영', margin:0.225 },
    thailand:    { model:'franchise',  label:'OMT 파트너', margin:0.15 },
    philippines: { model:'franchise',  label:'OMT 파트너', margin:0.15 }
  };

  /* =====================================================================
     6-C) Golf Courses (ELLIS-ready normalized catalog)
     - 골프텔 상품이 참조하는 코스 마스터
     - channelManager: ELLIS가 연동하는 외부 티시트/CMS 시스템 (호텔의 PMS-Channel Manager 대응)
       · direct       — OMT 직영 자체 인벤토리 (실시간 100%)
       · gdo          — Golf Digest Online (일본, 2,000+ 코스 마켓플레이스 겸 PMS)
       · gora         — Rakuten GORA (일본)
       · golfnow      — GolfNow Business (NBC Sports Next, 글로벌)
       · golfmanager  — Golfmanager (유럽 200+ 클럽, V3 REST API)
       · kakaogolf    — 카카오골프예약 (한국)
       · xgolf        — XGOLF / 신멤버스 (한국 400+)
       · golfdigg     — Golfdigg (태국 #1, 150+ 코스)
       · partner      — 직접 협약 (현지 골프장 직거래)
     - realTimeBooking: 슬롯 클릭 즉시 확정 가능 여부 (false면 24h 견적 모드)
     ===================================================================== */
  const GOLF_COURSES = [
    // Japan — 직영 OMT (수도권) + GDO 마켓플레이스 (지방)
    { id:'gc-jp-kanucha',     name:'카누차 골프코스',       country:'japan',      city:'okinawa',  holes:18, par:72, yardage:6798, designer:'Pete Dye',          greens:'벤트',  channelManager:'direct',  realTimeBooking:true },
    { id:'gc-jp-okinawa-cc',  name:'오키나와 컨트리클럽',   country:'japan',      city:'okinawa',  holes:18, par:72, yardage:7142, designer:'-',                 greens:'벤트',  channelManager:'gdo',     realTimeBooking:true },
    { id:'gc-jp-kita-ko',     name:'기타큐슈 골프CC',       country:'japan',      city:'fukuoka',  holes:18, par:72, yardage:6845, designer:'-',                 greens:'고려',  channelManager:'gdo',     realTimeBooking:true },
    // Vietnam — 직영 OMT (다낭) + Partner 직거래 (그 외)
    { id:'gc-vn-ba-na-hills', name:'바나힐스 골프클럽',     country:'vietnam',    city:'danang',   holes:18, par:72, yardage:7857, designer:'Luke Donald',       greens:'벤트',  channelManager:'direct',  realTimeBooking:true },
    { id:'gc-vn-montgomerie', name:'몽고메리 링크스',       country:'vietnam',    city:'danang',   holes:18, par:72, yardage:7159, designer:'Colin Montgomerie', greens:'벤트',  channelManager:'direct',  realTimeBooking:true },
    { id:'gc-vn-vinpearl-pq', name:'빈펄 골프 푸꾸옥',      country:'vietnam',    city:'phuquoc',  holes:27, par:72, yardage:7548, designer:'IMG',               greens:'씨쇼어',channelManager:'partner', realTimeBooking:false },
    // Thailand — Golfdigg 마켓플레이스 + 프랜차이즈 직거래
    { id:'gc-th-thana-city',  name:'타나시티 컨트리클럽',   country:'thailand',   city:'bangkok',  holes:18, par:72, yardage:6928, designer:'Greg Norman',       greens:'씨쇼어',channelManager:'golfdigg',realTimeBooking:true },
    { id:'gc-th-siam-cc',     name:'사이암 컨트리클럽',     country:'thailand',   city:'pattaya',  holes:18, par:72, yardage:7308, designer:'-',                 greens:'씨쇼어',channelManager:'golfdigg',realTimeBooking:true },
    // Philippines — Partner 직거래 (분산된 시장)
    { id:'gc-ph-alta-vista',  name:'알타비스타 골프코스',   country:'philippines',city:'cebu',     holes:18, par:72, yardage:6916, designer:'-',                 greens:'버뮤다',channelManager:'partner', realTimeBooking:false },
    { id:'gc-ph-mimosa',      name:'미모사+ 골프코스',      country:'philippines',city:'clark',    holes:36, par:72, yardage:7204, designer:'-',                 greens:'버뮤다',channelManager:'partner', realTimeBooking:true }
  ];

  // 채널 매니저 메타 (UI 라벨용)
  const CHANNEL_MANAGERS = {
    direct:      { label:'OMT 직영 인벤토리', short:'OMT', tier:'tier-1' },
    gdo:         { label:'Golf Digest Online (일본)', short:'GDO', tier:'tier-1' },
    gora:        { label:'Rakuten GORA (일본)', short:'GORA', tier:'tier-2' },
    golfnow:     { label:'GolfNow Business (글로벌)', short:'GolfNow', tier:'tier-1' },
    golfmanager: { label:'Golfmanager (유럽)', short:'GM', tier:'tier-2' },
    kakaogolf:   { label:'카카오골프예약 (한국)', short:'카카오', tier:'tier-2' },
    xgolf:       { label:'XGOLF / 신멤버스 (한국)', short:'XGOLF', tier:'tier-2' },
    golfdigg:    { label:'Golfdigg (태국 #1)', short:'Golfdigg', tier:'tier-1' },
    partner:     { label:'직접 협약 파트너', short:'Partner', tier:'tier-3' }
  };

  /* =====================================================================
     6-D) GOLFTELS — 메인 SKU
     ELLIS 백엔드 호환 스키마:
       - id              : 안정적 슬러그 (URL-safe)
       - type            : PRODUCT_TYPES.GOLFTEL | GOLFTEL_AIR
       - country/city    : 국가·도시 ID
       - hotelId         : HOTELS 참조 (없으면 hotelInline)
       - courseIds[]     : GOLF_COURSES 참조 배열
       - nights / rounds : 박수·라운딩 횟수
       - inclusions      : 그린피·카트피·캐디피·픽업·식사 boolean flags
       - pricePerPerson  : 2인 1실 기준
       - priceBasis      : 가격 산정 단위 (per-person-twin / per-person-single)
     ===================================================================== */
  // ===========================================================================
  // 6-E) GOLFTELS 공통 기본값 (몽키 표준 패턴)
  // - cartPolicy / teeTimeWindows / operatingInfo / roomOptions / facilities / rules
  // - 각 골프텔에서 override 가능
  // ===========================================================================
  const _DEFAULT_TEE_WINDOWS = ['morning','afternoon','twilight'];
  const _DEFAULT_OPERATING = {
    checkIn:'14:00', checkOut:'12:00', breakfast:'06:30~10:00',
    teeOff:{ morning:'06:00~10:30', afternoon:'11:00~13:30', twilight:'14:00~15:30' }
  };
  const _DEFAULT_ROOM_OPTIONS = [
    { type:'2인 1실', occupancy:2, supplement:0,      isDefault:true },
    { type:'1인 1실', occupancy:1, supplement:300000, isDefault:false }
  ];
  const _DEFAULT_RULES = [
    '티오프 30분 전 골프장 도착·체크인 필수',
    '우천 시 코스 캔슬 불가 — 레인체크(추후 사용권) 제공',
    '여권 잔여 유효기간 6개월 이상 필수'
  ];

  // 시설 운영 시간 (몽키 표준)
  const _DEFAULT_FACILITY_HOURS = [
    { key:'proshop',       label:'프로샵',         hours:'06:00~20:00' },
    { key:'drivingRange',  label:'드라이빙 레인지', hours:'05:30~19:30' },
    { key:'chippingGreen', label:'치핑 그린',      hours:'06:00~17:00' },
    { key:'puttingGreen',  label:'퍼팅 그린',      hours:'06:00~17:00' },
    { key:'practiceBunker',label:'연습 벙커',      hours:'06:00~17:00' },
    { key:'restaurant',    label:'레스토랑',       hours:'05:30~20:00' },
    { key:'locker',        label:'락커룸',         hours:'24시간' },
    { key:'shower',        label:'샤워실',         hours:'24시간' }
  ];

  // 복장 규정 (글로벌 공통)
  const _DEFAULT_DRESSCODE = [
    '라운드 티/축구 유니폼/보드 셔츠/청바지/짧은 반바지 입장 불가',
    '카라티(피케티) 권장 — 차이나 카라티는 일부 클럽 입장 불가',
    '무릎 길이의 반바지는 허용',
    '메탈 스파이크 골프화 금지 — 소프트 스파이크 권장'
  ];

  // 악천후 / 우천 규정 (몽키 베트남 표준)
  const _DEFAULT_WEATHER_POLICY = [
    '골프장에서 사전 폐장 결정한 경우가 아니면 우천에도 골프장 방문 필수',
    '비바람 심해도 골프장 결정 전엔 환불 불가 — 1일~3개월 사용 가능한 레인체크(바우처) 발급',
    '9홀만 완료 후 폐장 시 18홀 요금의 약 70% 차지 + 9홀 분 환불',
    '현장 환불 거부 시 OMT 비상연락망으로 즉시 문의'
  ];

  // 예약 인원 규정 (베트남 표준)
  const _DEFAULT_PARTY_RULES = [
    '1~3인 예약 가능 — 골프장 측 4인 1조 조인 플레이로 진행',
    '단독 플레이 불가 — 골프장에서 임의 조인',
    '5인 1팀 플레이 불가 — 3/2 또는 4/1로 임의 배정',
    '예약 없는 시간엔 조인 안 됨'
  ];

  // 카트 이용 안내 (공통)
  const _DEFAULT_CART_RULES = [
    '기본 2인 1카트(쉐어) 이용 기준',
    '홀수 인원 예약 시 조인 분과 카트 쉐어 필요',
    '조인 없으면 1인 싱글 카트 (추가 요금 없음)',
    '개별 싱글 카트 원할 경우 당일 현장 결제'
  ];

  // 주니어 / 동반자 (글로벌 공통)
  const _DEFAULT_JUNIOR_POLICY = {
    minAge: 8, maxAge: 15,
    note: '주니어 요금은 시즌별로 변경. 여권 정보면 사진 제출 후 적용',
    weekdayRate: '주중 1,550,000동~ (조인카트 포함)',
    weekendRate: '주말 1,650,000동~ (조인카트 포함)'
  };
  const _DEFAULT_COMPANION_POLICY = {
    allowed: true,
    minAge: 8,
    note: '갤러리(동반자) 입장 가능 — 성수기 예외 가능. 사전 채팅 신청 후 현장 결제',
    weekdayFee: '1,900,000동',
    weekendFee: '2,400,000동'
  };

  // 14:00 이후 라운딩 안내 (공통)
  const _DEFAULT_LATE_NOTE = '14:00 이후 라운딩은 인원·플레이 속도에 따라 18홀 완주 어려울 수 있습니다. 환불 불가.';

  // 현장 문제 / 책임 소재 (공통)
  const _DEFAULT_ONSITE_NOTE = '예약 외 골프장 운영상 문제는 OMT가 도움드릴 수 있으나 책임 소재는 골프장에 있습니다.';

  // 2026년 베트남 공휴일 (베트남 골프텔에 적용)
  const _VN_HOLIDAYS_2026 = [
    '01월 01일',
    '02월 15일~21일 (구정)',
    '04월 26일~27일 (훙왕)',
    '04월 30일~05월 01일 (해방일/노동절)',
    '09월 01일~02일 (독립기념일)'
  ];
  // 2026년 일본 공휴일 (주요)
  const _JP_HOLIDAYS_2026 = [
    '01월 01~03일 (설날 연휴)',
    '04월 29일 (쇼와의 날)',
    '05월 03~05일 (헌법기념일~어린이날)',
    '07월 20일 (바다의 날)',
    '08월 11일 (산의 날)'
  ];

  // 운영사 답변 템플릿 함수 (리뷰 답변)
  const _omtReplyTo = (highlight, suggestion) =>
    `안녕하세요, 고객님! 오마이트립입니다. 😊\n소중한 후기 감사드립니다.\n\n${highlight ? highlight + '\n\n' : ''}${suggestion ? suggestion + '\n\n' : ''}다음 이용 시에도 더 좋은 서비스로 준비하겠습니다. 오늘도 좋은 하루 보내세요 🥰`;

  // ============================================================
  // 6-E.1) 갤러리 이미지 풀 (Unsplash CDN)
  // 카테고리별로 묶어두고 _GOLFTEL_GALLERIES에서 골프텔별 8장 조립
  // ============================================================
  const _IMG = (id, w=1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  const _IMAGE_POOL = {
    // 골프 코스 / 라운딩 풍경
    golf: [
      _IMG('1535131749006-b7f58c99034b'),  // 골프공 + 홀
      _IMG('1587174486073-ae5e5cff23aa'),  // 페어웨이 와이드
      _IMG('1592919505780-303950717480'),  // 그린 잔디
      _IMG('1530648787-d8e2e1cffa4f'),     // 골프 카트
      _IMG('1606744824163-985d376605aa'),  // 골프 플래그
      _IMG('1593114175017-30056d3a3a8b'),  // 클럽하우스
      _IMG('1606744837616-56c9a5c6a6eb'),  // 골프 스윙
      _IMG('1531058020387-3be344556be6'),  // 코스 경로
      _IMG('1592822874642-9eb15b7a0c34')   // 항공샷
    ],
    // 호텔 / 리조트 외관 + 공간
    resort: [
      _IMG('1551882547-ff40c63fe5fa'),     // 럭셔리 호텔
      _IMG('1564501049412-61c2a3083791'),  // 호텔 외관
      _IMG('1611892440504-42a792e24d32'),  // 모던 호텔
      _IMG('1566073771259-6a8506099945'),  // 호텔 빌딩
      _IMG('1578683010236-d716f9a3f461'),  // 로비
      _IMG('1545569341-9eb8b30979d9'),     // 리조트 외부
      _IMG('1582719478250-c89cae4dc85b'),  // 리조트 풀
      _IMG('1571896349842-33c89424de2d'),  // 풀빌라
      _IMG('1559592413-7cec4d0cae2b')      // 비치 리조트
    ],
    // 객실 / 인테리어
    room: [
      _IMG('1445019980597-93fa8acb246c'),
      _IMG('1522383225653-ed111181a951'),
      _IMG('1596436889106-be35e843f974')   // 레스토랑
    ]
  };
  // 골프텔별 갤러리 (메인 1 + 작은 4 + 더보기 슬롯 = 시각 6, 실제 8장 권장)
  const _pick = (arr, idxs) => idxs.map(i => arr[i % arr.length]);
  const _GOLFTEL_GALLERIES = {
    'gt-jp-okinawa-kanucha-3n':  [..._pick(_IMAGE_POOL.golf,[0,1,4]), ..._pick(_IMAGE_POOL.resort,[7,5,8,2]), _IMAGE_POOL.room[0]],
    'gt-jp-fukuoka-kitakyushu-2n':[..._pick(_IMAGE_POOL.golf,[2,7,5]), ..._pick(_IMAGE_POOL.resort,[1,2,3,4]), _IMAGE_POOL.room[2]],
    'gt-vn-danang-ba-na-4n':     [..._pick(_IMAGE_POOL.golf,[1,0,8,6]), ..._pick(_IMAGE_POOL.resort,[7,5,6]), _IMAGE_POOL.room[1]],
    'gt-vn-phuquoc-vinpearl-5n': [..._pick(_IMAGE_POOL.golf,[4,1,3]), ..._pick(_IMAGE_POOL.resort,[8,7,5,6]), _IMAGE_POOL.room[0]],
    'gt-th-bangkok-thanacity-3n':[..._pick(_IMAGE_POOL.golf,[5,2,7]), ..._pick(_IMAGE_POOL.resort,[0,2,3,4]), _IMAGE_POOL.room[2]],
    'gt-th-pattaya-siamcc-4n':   [..._pick(_IMAGE_POOL.golf,[3,1,8]), ..._pick(_IMAGE_POOL.resort,[8,7,5,6]), _IMAGE_POOL.room[1]],
    'gt-ph-cebu-alta-vista-4n':  [..._pick(_IMAGE_POOL.golf,[6,2,0]), ..._pick(_IMAGE_POOL.resort,[7,5,8,3]), _IMAGE_POOL.room[0]],
    'gt-ph-clark-mimosa-5n':     [..._pick(_IMAGE_POOL.golf,[5,7,1,6]), ..._pick(_IMAGE_POOL.resort,[1,3,4]), _IMAGE_POOL.room[2]]
  };

  // 공통 FAQ 6종
  const _DEFAULT_FAQS = [
    { q:'예약 후 결제는 언제 되나요?',
      a:'골프텔 예약 확정 후 즉시 결제됩니다. 골프장 현장에서는 캐디팁·렌탈비·추가 옵션만 결제하시면 됩니다.' },
    { q:'1인이나 3인도 예약 가능한가요?',
      a:'네, 1~3인 예약 모두 가능합니다. 골프장 측에서 4인 1조 조인으로 진행됩니다. 5인 1팀은 불가합니다.' },
    { q:'우천 시 환불은 되나요?',
      a:'골프장이 사전에 폐장 결정한 경우만 환불 가능합니다. 그 외에는 1일~3개월 사용 가능한 레인체크(바우처)를 발급해 드립니다.' },
    { q:'골프 클럽을 가져가지 않아도 되나요?',
      a:'네, 현지 골프장에서 클럽 렌탈 가능합니다 (1세트 약 99만동~). 예약 후 카카오채널로 [예약번호+남/여+왼손/오른손+세트수] 남겨주세요.' },
    { q:'캐디팁은 얼마를 드려야 하나요?',
      a:'국가·골프장별로 다릅니다. 베트남은 18홀당 약 400,000VND, 태국은 약 500바트, 필리핀은 약 500페소가 적정 수준입니다. 서비스 만족도에 따라 더 주셔도 좋습니다.' },
    { q:'한국인 캐디 신청 가능한가요?',
      a:'OMT 직영 골프텔(일본·베트남)은 100% 한국인 캐디 보장. 파트너 골프텔은 사전 신청 시 가능 여부 확인 후 안내드립니다.' },
    { q:'어린이 라운드는 몇 살부터 가능한가요?',
      a:'대부분 만 8세부터 가능합니다. 만 8~15세는 주니어 요금이 적용되며, 여권 사진을 채팅으로 보내주시면 자동 적용됩니다.' },
    { q:'예약 변경·취소 규정은 어떻게 되나요?',
      a:'출발 21일 전: 위약금 없음 / 14일 전: 30% / 7일 전: 50% / 3일 이내: 100%. 자세한 사항은 예약 안내 탭을 확인해 주세요.' }
  ];

  const GOLFTELS = [
    // ===== JAPAN (직영) =====
    { id:'gt-jp-okinawa-kanucha-3n', type:PRODUCT_TYPES.GOLFTEL,
      country:'japan', city:'okinawa',
      name:'오키나와 카누차 베이 골프&리조트 3박4일',
      tagline:'리조트 내 18홀 + 셀프 라운딩 2회',
      hotelId:'h-kanucha-okinawa',
      hotelName:'카누차 베이 호텔&빌라', roomType:'디럭스 트윈 오션뷰',
      nights:3, rounds:2,
      courseIds:['gc-jp-kanucha'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:false, golfShuttle:true, airportPickup:true, breakfast:true, dinner:false },
      pricePerPerson:1180000, oldPricePerPerson:1390000, priceBasis:'per-person-twin',
      cartPolicy:'2인 1카트', teeTimeWindows:_DEFAULT_TEE_WINDOWS,
      operatingInfo:_DEFAULT_OPERATING,
      distance:{ city:'나하 시내 50km', airport:'나하 공항 65km' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['pool','spa','restaurant','beach','korean-staff','driving-range'],
      rules:['셀프 라운딩 가능 (캐디 옵션)','리조트 내 코스 — 도보 5분', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1600&q=80'],
      highlights:['리조트 부지 내 골프장','셀프 라운딩 가능','오션뷰 객실 보장'],
      includes:['카누차 베이 호텔 3박 (조식 포함)','그린피·카트피 (2라운딩)','공항-호텔 왕복 픽업','골프장 셔틀'],
      excludes:['항공권','캐디피','중식/석식','개인 경비'],
      rating:9.4, reviews:184 },

    { id:'gt-jp-fukuoka-kitakyushu-2n', type:PRODUCT_TYPES.GOLFTEL,
      country:'japan', city:'fukuoka',
      name:'기타큐슈 골프 2박3일 (라운딩 2회)',
      tagline:'후쿠오카 인기 코스 + 텐진 시내 호텔',
      hotelId:'h-nishitetsu-tenjin',
      hotelName:'솔라리아 니시테츠 호텔', roomType:'스탠다드 트윈',
      nights:2, rounds:2,
      courseIds:['gc-jp-kita-ko'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:false },
      pricePerPerson:598000, oldPricePerPerson:720000, priceBasis:'per-person-twin',
      cartPolicy:'2인 1카트', teeTimeWindows:_DEFAULT_TEE_WINDOWS,
      operatingInfo:_DEFAULT_OPERATING,
      distance:{ city:'후쿠오카 시내 도보권', airport:'후쿠오카 공항 8km' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['fitness','restaurant','korean-staff','shuttle'],
      rules:['한국인 캐디 가능 (사전 신청)','텐진역 도보 5분', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1600&q=80'],
      highlights:['텐진 쇼핑 도보권','한국인 캐디 가능','당일 라운딩 셔틀'],
      includes:['솔라리아 호텔 2박 (조식 포함)','그린피·카트피·캐디피 (2라운딩)','공항-호텔 왕복','골프장 셔틀'],
      excludes:['항공권','석식','개인 경비'],
      rating:9.2, reviews:127 },

    // ===== VIETNAM (직영) =====
    { id:'gt-vn-danang-ba-na-4n', type:PRODUCT_TYPES.GOLFTEL,
      country:'vietnam', city:'danang',
      name:'다낭 바나힐스 골프 4박5일 (라운딩 3회)',
      tagline:'루크 도널드 설계 코스 + 미케 비치 5성',
      hotelId:'h-premier-danang',
      hotelName:'프리미어빌리지 다낭 리조트', roomType:'1베드룸 풀빌라',
      nights:4, rounds:3,
      courseIds:['gc-vn-ba-na-hills','gc-vn-montgomerie'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:true },
      pricePerPerson:1380000, oldPricePerPerson:1680000, priceBasis:'per-person-twin',
      cartPolicy:'2인 1카트 (페어웨이 진입가능)', teeTimeWindows:['morning','afternoon','twilight','night'],
      operatingInfo:{ checkIn:'15:00', checkOut:'12:00', breakfast:'06:00~10:00',
        teeOff:{ morning:'05:30~10:30', afternoon:'11:00~13:30', twilight:'14:00~15:30', night:'17:00~19:00' }},
      distance:{ city:'다낭 시내 6km', airport:'다낭 공항 8km' },
      roomOptions:[
        { type:'2인 1실 (풀빌라)', occupancy:2, supplement:0,      isDefault:true },
        { type:'1인 1실 (풀빌라)', occupancy:1, supplement:450000, isDefault:false }
      ],
      facilities:['pool','spa','beach','kidsclub','fitness','restaurant','korean-staff','shuttle','driving-range'],
      rules:['한국인 캐디 100% 보장','야간 라운딩 가능 (16시 이후)', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1600&q=80'],
      highlights:['풀빌라 + 조식·석식 전일 포함','한국인 캐디 보장','다낭 인기 2개 코스'],
      includes:['프리미어빌리지 풀빌라 4박','조식·석식 전일','그린피·카트피·캐디피 (3라운딩)','공항-리조트 왕복','코스 셔틀'],
      excludes:['항공권','주류','개인 경비'],
      rating:9.6, reviews:312 },

    { id:'gt-vn-phuquoc-vinpearl-5n', type:PRODUCT_TYPES.GOLFTEL,
      country:'vietnam', city:'phuquoc',
      name:'푸꾸옥 빈펄 골프 5박6일 (언리미티드 라운딩)',
      tagline:'27홀 무제한 + 워터파크 무료',
      hotelId:'h-vinpearl-nhatrang',
      hotelName:'빈펄 리조트 푸꾸옥', roomType:'디럭스 가든뷰',
      nights:5, rounds:4,
      courseIds:['gc-vn-vinpearl-pq'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:false },
      pricePerPerson:1580000, oldPricePerPerson:1980000, priceBasis:'per-person-twin',
      cartPolicy:'1인 1카트 (언리미티드)', teeTimeWindows:_DEFAULT_TEE_WINDOWS,
      operatingInfo:_DEFAULT_OPERATING,
      distance:{ city:'즈엉동 시내 18km', airport:'푸꾸옥 공항 12km' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['pool','spa','beach','kidsclub','restaurant','korean-staff','shuttle','driving-range'],
      rules:['투숙 기간 내 무제한 라운딩','워터파크·사파리 1회 입장 무료', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1600&q=80'],
      highlights:['27홀 무제한 라운딩','빈펄 워터파크·사파리 무료','풀빌라 옵션 가능'],
      includes:['빈펄 리조트 5박 (조식 포함)','그린피·카트피·캐디피','워터파크·사파리 입장','공항 왕복'],
      excludes:['항공권','석식','주류'],
      rating:9.4, reviews:248 },

    // ===== THAILAND (프랜차이즈) =====
    { id:'gt-th-bangkok-thanacity-3n', type:PRODUCT_TYPES.GOLFTEL,
      country:'thailand', city:'bangkok',
      name:'방콕 타나시티 골프 3박4일 (라운딩 2회)',
      tagline:'그렉 노먼 설계 + 수쿰빗 4성',
      hotelId:'h-novotel-bangkok',
      hotelName:'노보텔 방콕 수쿰빗', roomType:'슈피리어 트윈',
      nights:3, rounds:2,
      courseIds:['gc-th-thana-city'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:false },
      pricePerPerson:780000, oldPricePerPerson:920000, priceBasis:'per-person-twin',
      cartPolicy:'2인 1카트', teeTimeWindows:_DEFAULT_TEE_WINDOWS,
      operatingInfo:_DEFAULT_OPERATING,
      distance:{ city:'방콕 시내 28km (BTS 아속역 직결)', airport:'수완나품 공항 25km' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['pool','fitness','restaurant','shuttle','korean-staff'],
      rules:['BTS 아속역 직결 호텔','캐디 팁 별도 (한화 약 5천원/라운드)', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1600&q=80'],
      highlights:['그렉 노먼 설계 코스','BTS 아속역 직결','시내 + 골프 동시'],
      includes:['노보텔 방콕 3박 (조식 포함)','그린피·카트피·캐디피 (2라운딩)','공항-호텔 왕복','골프장 셔틀'],
      excludes:['항공권','석식','팁'],
      rating:9.1, reviews:96 },

    { id:'gt-th-pattaya-siamcc-4n', type:PRODUCT_TYPES.GOLFTEL,
      country:'thailand', city:'pattaya',
      name:'파타야 사이암CC 4박5일 (라운딩 3회)',
      tagline:'태국 명문 코스 + 해변 리조트',
      hotelId:'h-novotel-bangkok',
      hotelName:'센타라 그랜드 파타야', roomType:'디럭스 오션뷰',
      nights:4, rounds:3,
      courseIds:['gc-th-siam-cc'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:false },
      pricePerPerson:1080000, oldPricePerPerson:1290000, priceBasis:'per-person-twin',
      cartPolicy:'2인 1카트', teeTimeWindows:_DEFAULT_TEE_WINDOWS,
      operatingInfo:_DEFAULT_OPERATING,
      distance:{ city:'파타야 비치 1km', airport:'수완나품 공항 130km (전용차 1.5h)' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['pool','spa','beach','restaurant','shuttle','korean-staff'],
      rules:['방콕 공항 ↔ 파타야 전용차 무료 (왕복)','캐디 팁 별도', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1600&q=80'],
      highlights:['태국 베스트 코스 TOP 10','오션뷰 객실','시내 + 해변 + 골프'],
      includes:['센타라 그랜드 4박 (조식 포함)','그린피·카트피·캐디피 (3라운딩)','방콕-파타야 전용차','골프장 셔틀'],
      excludes:['항공권','석식','팁'],
      rating:9.0, reviews:142 },

    // ===== PHILIPPINES (프랜차이즈) =====
    { id:'gt-ph-cebu-alta-vista-4n', type:PRODUCT_TYPES.GOLFTEL,
      country:'philippines', city:'cebu',
      name:'세부 알타비스타 골프 4박5일 (라운딩 3회)',
      tagline:'산속 골프장 + 막탄 해변 리조트',
      hotelId:'h-shangrila-mactan',
      hotelName:'샹그릴라 막탄 리조트', roomType:'디럭스 시뷰',
      nights:4, rounds:3,
      courseIds:['gc-ph-alta-vista'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:false },
      pricePerPerson:1180000, oldPricePerPerson:1390000, priceBasis:'per-person-twin',
      cartPolicy:'2인 1카트', teeTimeWindows:_DEFAULT_TEE_WINDOWS,
      operatingInfo:_DEFAULT_OPERATING,
      distance:{ city:'세부 시내 20km', airport:'세부 막탄 공항 5km' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['pool','spa','beach','kidsclub','fitness','restaurant','korean-staff','shuttle','driving-range'],
      rules:['한국인 캐디 100%','캐디 보너스 별도 (한화 약 1만원/라운드)', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1600&q=80'],
      highlights:['세부 시내 전망','샹그릴라 프라이빗 비치','한국인 캐디'],
      includes:['샹그릴라 막탄 4박 (조식 포함)','그린피·카트피·캐디피 (3라운딩)','공항-리조트 왕복','코스 셔틀'],
      excludes:['항공권','석식','팁','캐디 보너스'],
      rating:9.3, reviews:178 },

    { id:'gt-ph-clark-mimosa-5n', type:PRODUCT_TYPES.GOLFTEL,
      country:'philippines', city:'clark',
      name:'클락 미모사 36홀 5박6일 (언리미티드)',
      tagline:'한국인 운영 코스 + 마닐라 1시간',
      hotelId:'h-shangrila-mactan',
      hotelName:'미모사 골프 리조트', roomType:'스탠다드 트윈',
      nights:5, rounds:5,
      courseIds:['gc-ph-mimosa'],
      inclusions:{ greenFee:true, cartFee:true, caddyFee:true, golfShuttle:true, airportPickup:true, breakfast:true, dinner:true },
      pricePerPerson:980000, oldPricePerPerson:1180000, priceBasis:'per-person-twin',
      cartPolicy:'1인 1카트 가능', teeTimeWindows:['morning','afternoon','twilight','night'],
      operatingInfo:{ checkIn:'14:00', checkOut:'12:00', breakfast:'06:00~10:00',
        teeOff:{ morning:'05:30~10:30', afternoon:'11:00~13:30', twilight:'14:00~15:30', night:'17:00~18:30' }},
      distance:{ city:'클락 시내 5km', airport:'클락 공항 8km (마닐라 공항 90km)' },
      roomOptions:_DEFAULT_ROOM_OPTIONS,
      facilities:['pool','fitness','restaurant','driving-range','korean-staff','shuttle'],
      rules:['한국인 운영 100%','36홀 무제한 라운딩','마닐라 공항 픽업 시 +50,000원/인', ..._DEFAULT_RULES],
      images:['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1600&q=80'],
      highlights:['36홀 무제한 라운딩','한국인 캐디 100%','조식·석식 전일'],
      includes:['미모사 리조트 5박','조식·석식 전일','그린피·카트피·캐디피 무제한','마닐라-클락 픽업'],
      excludes:['항공권','중식','팁','주류'],
      rating:9.5, reviews:421 }
  ];

  // ============================================================
  // 6-F) 골프텔별 상세 콘텐츠 (시설/팁/리뷰/FAQ/위치) 머지
  // - GOLFTELS 항목에 _DEFAULT 적용 + 골프텔별 차별화 데이터 주입
  // - ELLIS 백엔드 이관 시 별도 컬렉션(Golftel.details)으로 분리 가능
  // ============================================================
  const _GOLFTEL_DETAILS = {
    // ----- JAPAN -----
    'gt-jp-okinawa-kanucha-3n': {
      caddyTip:    { included:false, amount:'1라운드당 약 4,000~6,000엔', note:'셀프 라운딩 시 캐디 미제공' },
      equipmentRental:{ available:true, price:'1세트 6,000엔', brands:['Honma','Mizuno','PRGR'] },
      pickupZones: [{ zone:'나하 시내', fee:'10,000엔' },{ zone:'얀바루(원거리)', fee:'25,000엔' }],
      address:'905-2433 沖縄県名護市安部156-2 カヌチャベイホテル&ヴィラズ',
      phone:'+81-980-55-8880',
      coords:{ lat:26.6131, lng:128.1322 },
      holidays:_JP_HOLIDAYS_2026,
      reviewStats: { rating:4.7, count:184,
        positives:[{tag:'코스 관리상태', n:142},{tag:'리조트 부지내 골프', n:118},{tag:'오션뷰', n:96},{tag:'접근성', n:54}],
        negatives:[{tag:'캐디 부재', n:38},{tag:'가격대비', n:21},{tag:'식당 가격', n:14}] },
      reviews: [
        { id:'r1', author:'jp_yoon82', initial:'윤', rating:5, date:'2026-05-12', text:'리조트 안에 코스가 있어서 새벽 라운딩 후 바로 객실로 돌아갈 수 있는 게 최고. 오션뷰 객실은 일출이 환상적입니다.', positives:['오션뷰','접근성'], reply:_omtReplyTo('리조트 부지내 코스의 장점을 가장 잘 활용해 주신 후기네요!','다음 방문 때는 야간 라운딩도 추천드립니다.') },
        { id:'r2', author:'kim_golf', initial:'김', rating:4, date:'2026-04-28', text:'셀프 라운딩이라 가격은 합리적인데, 한국 캐디 익숙한 분들은 처음에 좀 어색할 수 있어요. 코스 자체는 페어웨이 넓고 좋습니다.', positives:['페어웨이/그린'], negatives:['캐디 부재'], reply:_omtReplyTo('','다음 방문 시 추가 비용으로 한국어 캐디 옵션도 가능합니다. 채팅으로 문의 부탁드려요.') },
        { id:'r3', author:'park_kim', initial:'박', rating:5, date:'2026-04-15', text:'카누차 리조트 자체가 휴양지 느낌이라 가족과 같이 가도 만족합니다. 풀빌라 + 골프 조합이 좋아요.', positives:['리조트 부지내 골프','오션뷰','접근성'], reply:'' },
        { id:'r4', author:'jeong_oki', initial:'정', rating:4, date:'2026-03-22', text:'골프 + 리조트는 최고인데 리조트 내 식당 가격이 좀 비쌌어요. 시내까지 50km라 외식 나가기도 애매. 다음엔 식사 옵션 미리 정해놓고 갈게요.', positives:['리조트 부지내 골프'], negatives:['식당 가격','가격대비'], reply:_omtReplyTo('','얀바루 지역 특성상 외식 옵션이 제한적이라 식사 포함 옵션을 검토 중입니다.') },
        { id:'r5', author:'choi_oki5', initial:'최', rating:5, date:'2026-03-10', text:'3대 가족 여행 — 어르신은 풀빌라에서 휴식, 30~40대 부부는 새벽 셀프 라운딩. 누구도 빠지지 않는 완벽한 골프 패키지였어요.', positives:['리조트 부지내 골프','오션뷰'], reply:'' }
      ]
    },
    'gt-jp-fukuoka-kitakyushu-2n': {
      caddyTip:    { included:true, amount:'한국인 캐디 사전 신청 가능 (+3,000엔/라운드)', note:'기본 셀프 가능' },
      equipmentRental:{ available:true, price:'1세트 5,500엔', brands:['Mizuno','Bridgestone'] },
      pickupZones: [{ zone:'후쿠오카 시내(텐진/하카타)', fee:'무료' },{ zone:'기타큐슈', fee:'5,000엔' }],
      address:'810-0004 福岡県福岡市中央区渡辺通2-1-82 ソラリア西鉄ホテル',
      phone:'+81-92-752-5555',
      coords:{ lat:33.5849, lng:130.3973 },
      holidays:_JP_HOLIDAYS_2026,
      reviewStats: { rating:4.6, count:127,
        positives:[{tag:'시내 호텔', n:89},{tag:'한국인 캐디', n:72},{tag:'가성비', n:54},{tag:'쇼핑 도보', n:38}],
        negatives:[{tag:'골프장 이동시간', n:28},{tag:'코스 난이도', n:12}] },
      reviews: [
        { id:'r1', author:'lee_fk', initial:'이', rating:5, date:'2026-05-10', text:'텐진 한복판 호텔이라 골프 끝나고 시내 쇼핑까지 한 번에. 2박3일이 짧게 느껴질 만큼 알찼습니다. 한국인 캐디 신청은 강추!', positives:['시내 호텔','한국인 캐디'], reply:_omtReplyTo('텐진의 도심+골프 조합 만족해 주셔서 감사합니다!','다음 방문 시 인근 코스 추가 라운딩도 추천드려요.') },
        { id:'r2', author:'kim_fukuoka', initial:'김', rating:4, date:'2026-04-22', text:'호텔에서 골프장까지 약 1시간 이동이 좀 부담. 그래도 후쿠오카 시내가 좋아서 만족.', positives:['시내 호텔','가성비'], negatives:['골프장 이동시간'], reply:_omtReplyTo('','이동 시간 단축을 위해 골프장 인근 호텔 옵션도 신규 도입 검토 중입니다.') },
        { id:'r3', author:'shin_yj', initial:'신', rating:5, date:'2026-04-08', text:'가성비 최고. 2박에 그린피·캐디까지 다 포함이라 한국 1박 골프보다 싸요.', positives:['가성비','쇼핑 도보'], reply:'' },
        { id:'r4', author:'park_pus', initial:'박', rating:5, date:'2026-03-19', text:'부산에서 비행기 55분이면 도착. 텐진역 도보 5분 + 호텔에서 바로 셔틀이라 가족 4인 짐 들고도 너무 편했어요. 단풍 시즌 추천.', positives:['가성비','쇼핑 도보'], reply:'' },
        { id:'r5', author:'oh_fk', initial:'오', rating:4, date:'2026-02-28', text:'평일 라운딩이라 그런지 코스가 한산해서 좋았어요. 다만 한국 캐디는 사전 신청 안 하면 불가. 채팅 상담으로 미리 잡으세요.', positives:['한국인 캐디'], negatives:['골프장 이동시간'], reply:_omtReplyTo('한국인 캐디는 인기가 많아 사전 신청 필수예요!','') }
      ]
    },

    // ----- VIETNAM -----
    'gt-vn-danang-ba-na-4n': {
      caddyTip:    { included:false, amount:'18홀당 400,000 VND', note:'서비스 만족도에 따라 추가 가능. 한국인 캐디는 +200,000동' },
      equipmentRental:{ available:true, price:'990,000동', brands:['Ping','Mizuno'], note:'예약 후 카카오채널로 [예약번호+남/여+왼손/오른손+세트수] 신청' },
      pickupZones: [
        { zone:'다낭 시내(미케/한강)', fee:'무료' },
        { zone:'호이안', fee:'150,000동' },
        { zone:'인터컨티넨탈/선월드', fee:'100,000동' },
        { zone:'랑코', fee:'700,000동' }
      ],
      address:'Hoa Hai Ward, Ngu Hanh Son, Da Nang City, Vietnam',
      phone:'+84-236-3958-111',
      coords:{ lat:15.9759, lng:108.2627 },
      holidays:_VN_HOLIDAYS_2026,
      reviewStats: { rating:4.8, count:312,
        positives:[{tag:'코스 관리상태', n:248},{tag:'한국인 캐디', n:201},{tag:'풀빌라', n:178},{tag:'코스 난이도/재미', n:156},{tag:'페어웨이/그린', n:142}],
        negatives:[{tag:'캐디팁', n:42},{tag:'가격대비', n:38},{tag:'페어웨이/그린(우기)', n:21}] },
      reviews: [
        { id:'r1', author:'ka_3858954533', initial:'서', rating:5, date:'2026-05-14', text:'바나힐스 코스 페어웨이 정말 잘 관리되어 있고, 풀빌라+석식 포함이라 4박 5일 내내 호텔에서 안 나갔는데도 만족스러웠어요. 한국 캐디 100%라 첫 베트남이어도 편했습니다.', positives:['코스 관리상태','풀빌라','한국인 캐디'], reply:_omtReplyTo('바나힐스 코스 관리상태에 만족해 주셔서 감사합니다. 한국인 캐디 보장은 OMT 직영 골프텔의 핵심 강점입니다!','다음 방문 때는 몽고메리 링크스 코스도 함께 추천드려요.') },
        { id:'r2', author:'park_golf99', initial:'박', rating:5, date:'2026-05-08', text:'몽고메리 링크스 코스가 진짜 챔피언십급. 야간 라운딩까지 가능해서 더위 피해서 라운딩하기 좋아요. 풀빌라 조식이 진심 최고.', positives:['코스 난이도/재미','풀빌라'], reply:_omtReplyTo('','다낭은 16시 이후 야간 라운딩이 인기인 시즌이라 좋은 선택이셨네요!') },
        { id:'r3', author:'jang_lee', initial:'장', rating:4, date:'2026-04-25', text:'코스는 정말 좋은데 캐디팁이 별도라 예상치 못한 비용이 발생했어요. 4인 팀이라 인당 10만원 정도 추가로 나갔습니다. 사전에 더 명확히 안내해주시면 좋을 것 같아요.', positives:['코스 난이도/재미'], negatives:['캐디팁'], reply:_omtReplyTo('캐디팁 안내 부족으로 불편드려 죄송합니다.','상품 안내에 캐디팁 약 40만동(18홀) 명시하도록 즉시 수정 반영하겠습니다.') },
        { id:'r4', author:'sung_kim', initial:'성', rating:5, date:'2026-04-19', text:'7박 8일 다녀왔는데 매일 다른 시간대 라운딩 하면서도 풀빌라 + 조석식 덕분에 정말 편안했어요. 인터컨티넨탈 픽업도 10만동만 추가하면 되어서 합리적.', positives:['풀빌라','한국인 캐디','코스 관리상태'], reply:'' },
        { id:'r5', author:'oh_yes', initial:'오', rating:4, date:'2026-04-02', text:'우기 시작 직전이라 후반엔 페어웨이가 약간 질긴 부분 있었는데 그래도 충분히 즐겼습니다. 다음엔 건기에 다시 가고 싶어요.', positives:['페어웨이/그린'], negatives:['페어웨이/그린(우기)'], reply:'' }
      ]
    },
    'gt-vn-phuquoc-vinpearl-5n': {
      caddyTip:    { included:false, amount:'18홀당 400,000 VND', note:'1인 1카트 가능' },
      equipmentRental:{ available:true, price:'900,000동', brands:['Vinpearl Premium'] },
      pickupZones: [{ zone:'즈엉동/푸꾸옥 시내', fee:'무료' },{ zone:'섬 남부', fee:'200,000동' }],
      address:'Vinpearl Golf Phu Quoc, Long Beach, Phu Quoc',
      phone:'+84-297-3550-555',
      coords:{ lat:10.0500, lng:103.9700 },
      holidays:_VN_HOLIDAYS_2026,
      reviewStats: { rating:4.7, count:248,
        positives:[{tag:'27홀 무제한', n:198},{tag:'워터파크 무료', n:172},{tag:'1인 1카트', n:124},{tag:'섬 풍경', n:102}],
        negatives:[{tag:'섬 외부 이동', n:36},{tag:'식당 옵션', n:21}] },
      reviews: [
        { id:'r1', author:'cho_golfer', initial:'조', rating:5, date:'2026-05-09', text:'5박 동안 4라운딩 했는데 매번 1인 1카트라 정말 쾌적했어요. 빈펄 워터파크도 가족이 좋아했고 진짜 풀패키지 그 자체.', positives:['27홀 무제한','워터파크 무료','1인 1카트'], reply:_omtReplyTo('1인 1카트의 쾌적함 + 워터파크 만족도가 푸꾸옥의 장점이지요!','') },
        { id:'r2', author:'na_phuquoc', initial:'나', rating:5, date:'2026-04-14', text:'섬이라 한적하고 코스 자체도 27홀로 다양해서 4박 5박이 짧게 느껴졌어요. 빈펄 사파리도 무료라 가성비 최고.', positives:['섬 풍경','27홀 무제한'], reply:'' },
        { id:'r3', author:'park_pq', initial:'박', rating:4, date:'2026-03-28', text:'리조트 내부는 완벽한데 섬 외부로 나가려면 차량 부르기 좀 번거롭습니다. 그래도 무제한 라운딩이 좋아서 만족.', positives:['27홀 무제한'], negatives:['섬 외부 이동'], reply:'' },
        { id:'r4', author:'kim_pq4', initial:'김', rating:5, date:'2026-03-15', text:'직항 4시간이라 부담 없고, 골프 + 휴양 둘 다 가능. 27홀 무제한이라 같이 간 일행 실력 차이 있어도 모두 만족했어요.', positives:['27홀 무제한','섬 풍경'], reply:_omtReplyTo('실력별로 코스 선택이 가능한 27홀이 푸꾸옥의 매력입니다!','') },
        { id:'r5', author:'jang_pq', initial:'장', rating:4, date:'2026-02-25', text:'식당 선택지가 리조트 안에 한정적이라 5박 동안 같은 메뉴 반복. 차로 즈엉동 시내 나가야 하는데 우버 잡기 힘들 때 있어요.', positives:['1인 1카트'], negatives:['섬 외부 이동','식당 옵션'], reply:_omtReplyTo('','즈엉동 시내 셔틀 도입 검토 중입니다.') }
      ]
    },

    // ----- THAILAND -----
    'gt-th-bangkok-thanacity-3n': {
      caddyTip:    { included:false, amount:'18홀당 약 500~600바트', note:'캐디팁 별도 / 한화 약 18,000원' },
      equipmentRental:{ available:true, price:'2,500바트', brands:['Honma','Callaway'] },
      pickupZones: [{ zone:'아속/스쿰빗 (BTS 직결)', fee:'무료' },{ zone:'수완나품 공항', fee:'1,200바트' }],
      address:'Bangna-Trad Rd, Bang Phli, Samut Prakan, Thailand',
      phone:'+66-2-336-1968',
      coords:{ lat:13.6500, lng:100.7800 },
      reviewStats: { rating:4.5, count:96,
        positives:[{tag:'그렉 노먼 설계 코스', n:68},{tag:'BTS 직결', n:54},{tag:'시내 + 골프', n:42}],
        negatives:[{tag:'캐디팁', n:24},{tag:'식당 가격', n:12}] },
      reviews: [
        { id:'r1', author:'lee_bkk', initial:'이', rating:5, date:'2026-05-11', text:'시내 호텔에서 골프장까지 30분이 적당. 그렉 노먼 설계라 그런지 진짜 챔피언십 분위기 나요. 시내 쇼핑·맛집 즐기면서 골프까지 한 번에.', positives:['그렉 노먼 설계 코스','시내 + 골프'], reply:_omtReplyTo('타나시티 코스의 진가를 알아봐 주셨네요!','') },
        { id:'r2', author:'choi_bkk', initial:'최', rating:4, date:'2026-04-19', text:'코스는 만족. 다만 캐디팁이 500바트인 줄 모르고 갔다가 4인 합치니 부담. 사전 안내 강조 부탁드려요.', positives:['BTS 직결'], negatives:['캐디팁'], reply:_omtReplyTo('캐디팁 안내 강조 즉시 반영하겠습니다.','') },
        { id:'r3', author:'kim_thana', initial:'김', rating:5, date:'2026-04-02', text:'BTS 아속역 직결이라 짐 들고 이동 정말 편해요. 골프 안 치는 가족도 시내 구경하기 좋고.', positives:['BTS 직결','시내 + 골프'], reply:'' },
        { id:'r4', author:'park_bk', initial:'박', rating:5, date:'2026-03-08', text:'아침 라운딩 → 호텔 풀에서 휴식 → 저녁 야시장. 3박4일이 가장 효율적인 패키지인 듯. 노보텔 조식도 만족.', positives:['시내 + 골프','BTS 직결'], reply:'' },
        { id:'r5', author:'jeong_thana', initial:'정', rating:4, date:'2026-02-12', text:'캐디 분이 한국말 한두 마디 하셨는데 친절했어요. 다만 식당 가격이 예상보다 비쌌네요. 야시장 추천!', positives:['그렉 노먼 설계 코스'], negatives:['식당 가격'], reply:'' }
      ]
    },
    'gt-th-pattaya-siamcc-4n': {
      caddyTip:    { included:false, amount:'18홀당 약 500바트', note:'사이암CC 한국인 캐디 가능' },
      equipmentRental:{ available:true, price:'3,000바트', brands:['Honma','Mizuno'] },
      pickupZones: [{ zone:'파타야 비치/조이', fee:'무료' },{ zone:'방콕 ↔ 파타야', fee:'무료 (왕복 1회)' }],
      address:'50 Moo 9, Pattaya, Chonburi, Thailand',
      phone:'+66-38-909-300',
      coords:{ lat:12.9236, lng:100.8825 },
      reviewStats: { rating:4.5, count:142,
        positives:[{tag:'사이암CC 명문', n:108},{tag:'오션뷰 객실', n:86},{tag:'해변 + 골프', n:72},{tag:'방콕→파타야 전용차', n:54}],
        negatives:[{tag:'캐디팁', n:32},{tag:'성수기 가격', n:18}] },
      reviews: [
        { id:'r1', author:'han_pty', initial:'한', rating:5, date:'2026-05-06', text:'사이암CC 처음 가봤는데 진짜 명불허전. 4박 동안 3라운딩 모두 다른 코스로 돌았어요. 센타라 오션뷰 객실에서 일출 보며 시작하는 라운딩이 일품.', positives:['사이암CC 명문','오션뷰 객실','해변 + 골프'], reply:_omtReplyTo('태국 베스트 코스 TOP 10을 경험해 주셔서 감사합니다!','') },
        { id:'r2', author:'min_thai', initial:'민', rating:4, date:'2026-04-20', text:'방콕→파타야 전용차 무료가 컸어요. 짐 들고 이동할 일 없이 편하게.', positives:['방콕→파타야 전용차'], reply:'' },
        { id:'r3', author:'oh_pty', initial:'오', rating:4, date:'2026-03-30', text:'성수기라 그런지 캐디팁이랑 추가 비용이 약간 부담스러웠지만 코스 자체는 훌륭.', positives:['사이암CC 명문'], negatives:['캐디팁','성수기 가격'], reply:'' },
        { id:'r4', author:'son_pty', initial:'손', rating:5, date:'2026-03-18', text:'코스 컨디션 진짜 좋습니다. 일행 중 70대 어르신도 18홀 완주 가능할 정도로 카트가 잘 다녀요. 페어웨이 진입 가능한 게 큰 장점.', positives:['사이암CC 명문','해변 + 골프'], reply:_omtReplyTo('연배 있으신 분들도 편하게 즐기실 수 있는 코스죠!','') },
        { id:'r5', author:'lim_pty', initial:'임', rating:4, date:'2026-02-22', text:'호텔이 해변가라 골프 끝나고 비치 워크 산책이 일상이 됨. 다만 파타야 시내 워킹스트리트는 너무 시끄러워서 비추.', positives:['오션뷰 객실','해변 + 골프'], reply:'' }
      ]
    },

    // ----- PHILIPPINES -----
    'gt-ph-cebu-alta-vista-4n': {
      caddyTip:    { included:false, amount:'18홀당 약 500~700페소', note:'캐디 보너스 별도 (한화 약 1만원)' },
      equipmentRental:{ available:true, price:'1,500페소', brands:['TaylorMade','Ping'] },
      pickupZones: [{ zone:'막탄 섬', fee:'무료' },{ zone:'세부 시내', fee:'500페소' }],
      address:'Alta Vista Drive, Pardo, Cebu City, Philippines',
      phone:'+63-32-417-0888',
      coords:{ lat:10.2856, lng:123.8347 },
      reviewStats: { rating:4.7, count:178,
        positives:[{tag:'한국인 캐디', n:142},{tag:'시내 전망', n:96},{tag:'샹그릴라 비치', n:88},{tag:'산속 코스', n:62}],
        negatives:[{tag:'캐디 보너스', n:32},{tag:'시내 ↔ 골프장 이동', n:24}] },
      reviews: [
        { id:'r1', author:'song_cebu', initial:'송', rating:5, date:'2026-05-13', text:'알타비스타 산속 코스라 시내 전망 끝내줘요. 샹그릴라 막탄 비치 + 산속 골프 조합이 일품.', positives:['시내 전망','산속 코스','샹그릴라 비치'], reply:_omtReplyTo('알타비스타의 시내 전망 + 샹그릴라 막탄의 비치 조합은 세부만의 매력입니다!','') },
        { id:'r2', author:'kang_ph', initial:'강', rating:5, date:'2026-04-26', text:'한국인 캐디라 처음 필리핀 가는데도 편했어요. 코스 난이도도 적당.', positives:['한국인 캐디'], reply:'' },
        { id:'r3', author:'jung_pdc', initial:'정', rating:4, date:'2026-04-11', text:'막탄 ↔ 알타비스타 골프장 이동이 좀 멉니다 (1시간). 그래도 코스 좋아서 만족.', positives:['산속 코스'], negatives:['시내 ↔ 골프장 이동'], reply:_omtReplyTo('이동시간 단축을 위해 셔틀 시간 최적화를 진행 중입니다.','') },
        { id:'r4', author:'kim_cebu', initial:'김', rating:5, date:'2026-03-25', text:'아이 둘 데리고 갔는데 샹그릴라 키즈클럽이 정말 잘 되어 있어요. 부부는 오전 라운딩 갔다가 오후엔 가족 시간. 패밀리 골프 여행 강추.', positives:['샹그릴라 비치','한국인 캐디'], reply:_omtReplyTo('가족 골프 여행지로 막탄 샹그릴라는 정말 좋은 선택이지요!','') },
        { id:'r5', author:'choi_pdo', initial:'최', rating:4, date:'2026-02-19', text:'캐디 보너스가 별도로 한화 1만원 정도 — 이거 사전 안내 더 강하게 해주세요. 4인 라운딩이면 적지 않은 돈이라.', positives:['산속 코스'], negatives:['캐디 보너스'], reply:_omtReplyTo('캐디 보너스 안내를 상품 상세에 굵게 표시하도록 즉시 반영하겠습니다.','') }
      ]
    },
    'gt-ph-clark-mimosa-5n': {
      caddyTip:    { included:true, amount:'한국인 캐디 — 라운드 보너스 1,000페소 정도', note:'한국인 운영' },
      equipmentRental:{ available:true, price:'2,000페소', brands:['Mizuno','Callaway','TaylorMade'] },
      pickupZones: [{ zone:'클락 공항', fee:'무료' },{ zone:'마닐라 공항', fee:'2,500페소 (인당)' }],
      address:'Mimosa Drive, Clark Freeport Zone, Pampanga, Philippines',
      phone:'+63-45-499-7000',
      coords:{ lat:15.1700, lng:120.5500 },
      reviewStats: { rating:4.8, count:421,
        positives:[{tag:'36홀 무제한', n:312},{tag:'한국인 캐디 100%', n:284},{tag:'조식·석식 전일', n:198},{tag:'가성비', n:172}],
        negatives:[{tag:'마닐라 공항 픽업비', n:48},{tag:'클락 외 관광 부족', n:22}] },
      reviews: [
        { id:'r1', author:'baek_clark', initial:'백', rating:5, date:'2026-05-15', text:'5박 동안 매일 라운딩하고도 시간이 남아 18홀 추가까지. 진짜 무제한 맞아요. 한국인 운영이라 의사소통도 편하고.', positives:['36홀 무제한','한국인 캐디 100%'], reply:_omtReplyTo('미모사 36홀 무제한은 골프 매니아들의 성지죠!','') },
        { id:'r2', author:'oh_clark', initial:'오', rating:5, date:'2026-04-30', text:'조식·석식 전일 포함이라 5박 동안 추가 식비가 거의 없었어요. 클럽도 좋은 거 빌릴 수 있고.', positives:['조식·석식 전일','가성비'], reply:'' },
        { id:'r3', author:'park_mimosa', initial:'박', rating:4, date:'2026-04-18', text:'마닐라 공항으로 들어가시는 분들은 픽업비 2,500페소 별도라 약간 부담. 가능하면 클락 공항 추천.', positives:['한국인 캐디 100%'], negatives:['마닐라 공항 픽업비'], reply:_omtReplyTo('','클락 공항 직항이 가장 효율적입니다. 필요 시 안내드릴게요.') },
        { id:'r4', author:'kim_omc', initial:'김', rating:5, date:'2026-04-02', text:'골프만 하기엔 완벽한데, 5박 동안 클락 외 관광지가 좀 부족. 그래도 골프 목적이면 진짜 추천!', positives:['36홀 무제한','한국인 캐디 100%'], negatives:['클락 외 관광 부족'], reply:'' },
        { id:'r5', author:'lee_clk', initial:'이', rating:5, date:'2026-03-12', text:'한국인 사장님이 직접 운영하셔서 정산·문의 모두 한국말로 처리. 5박 동안 6라운딩에 클럽 렌탈까지 했는데도 가격이 합리적이었어요.', positives:['한국인 캐디 100%','가성비','조식·석식 전일'], reply:_omtReplyTo('한국인 직접 운영의 안심감을 가장 잘 표현해 주셨네요!','') }
      ]
    }
  };

  // 모든 GOLFTELS에 default + 디테일 머지
  GOLFTELS.forEach(g => {
    const detail = _GOLFTEL_DETAILS[g.id] || {};
    // 갤러리 풀에서 8장 적용 (메인 + 작은 7장)
    const gallery = _GOLFTEL_GALLERIES[g.id];
    if(gallery && gallery.length) g.images = gallery;
    g.facilityHours       = g.facilityHours    || _DEFAULT_FACILITY_HOURS;
    g.dresscode           = g.dresscode        || _DEFAULT_DRESSCODE;
    g.weatherPolicy       = g.weatherPolicy    || _DEFAULT_WEATHER_POLICY;
    g.partyRules          = g.partyRules       || _DEFAULT_PARTY_RULES;
    g.cartRules           = g.cartRules        || _DEFAULT_CART_RULES;
    g.juniorPolicy        = g.juniorPolicy     || _DEFAULT_JUNIOR_POLICY;
    g.companionPolicy     = g.companionPolicy  || _DEFAULT_COMPANION_POLICY;
    g.lateNote            = g.lateNote         || _DEFAULT_LATE_NOTE;
    g.onsiteNote          = g.onsiteNote       || _DEFAULT_ONSITE_NOTE;
    g.faqs                = g.faqs             || _DEFAULT_FAQS;
    // 디테일 머지
    Object.assign(g, detail);
    // 기본값 폴백
    g.caddyTip            = g.caddyTip         || { included:false, amount:'국가별 적정 팁 안내', note:'골프장별 상이' };
    g.equipmentRental     = g.equipmentRental  || { available:true, price:'현장 문의', brands:['현지 브랜드'] };
    g.pickupZones         = g.pickupZones      || [];
    g.address             = g.address          || g.city + ' (주소 준비 중)';
    g.phone               = g.phone            || '+82-2-OMT-OMT';
    g.coords              = g.coords           || { lat:0, lng:0 };
    g.holidays            = g.holidays         || [];
    g.reviewStats         = g.reviewStats      || { rating:(g.rating/2), count:g.reviews||0, positives:[], negatives:[] };
    g.reviews             = g.reviews          || [];
  });

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
  // 동적 dates 헬퍼 — 오늘 기준 ±N일 → "2026.MM.DD" 포맷
  const _bkDateStr = (offsetDays) => {
    const d = new Date(); d.setDate(d.getDate() + offsetDays);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  };
  const _bkRange = (startOffset, nights) => `${_bkDateStr(startOffset)} - ${_bkDateStr(startOffset + nights)}`;

  const INITIAL_BOOKINGS = [
    // ----- ⛳ 골프텔 시드 (NEW) -----
    {
      id:'bk-seed-gt1', bookingNumber:'OMT-3DK21A', status:'confirmed',
      productId:'gt-vn-danang-ba-na-4n', productType:'golftel',
      productName:'다낭 바나힐스 골프 4박5일 (라운딩 3회)',
      country:'vietnam', city:'danang', ownership:'direct',
      nights:4, rounds:3,
      dates: _bkRange(3, 4),  // D-3 출발 (홈 대시보드 강조)
      paxCount:2, total:2760000,
      paymentMethod:'kakao', leadName:'홍길동', phone:'010-1234-5678',
      packageSnapshot:{
        roomOption:'2인 1실 (풀빌라)', roomSupplement:0,
        selectedSlots:[
          { window:'morning',   time:'06:00', courseId:'gc-vn-ba-na-hills', courseName:'바나힐스 골프클럽', price:275000 },
          { window:'twilight',  time:'14:00', courseId:'gc-vn-montgomerie',  courseName:'몽고메리 링크스',  price:192500 },
          { window:'afternoon', time:'11:30', courseId:'gc-vn-ba-na-hills', courseName:'바나힐스 골프클럽', price:247500 }
        ]
      },
      createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
    },
    {
      id:'bk-seed-gt2', bookingNumber:'OMT-CLK55B', status:'pending',
      productId:'gt-ph-clark-mimosa-5n', productType:'golftel-air',
      productName:'클락 미모사 36홀 5박6일 (언리미티드) + 항공',
      country:'philippines', city:'clark', ownership:'franchise',
      nights:5, rounds:5,
      dates: _bkRange(28, 5),  // D-28
      paxCount:2, total:2960000,
      paymentMethod:'bank', leadName:'홍길동', phone:'010-1234-5678',
      packageSnapshot:{
        roomOption:'2인 1실', roomSupplement:0,
        selectedSlots:[
          { window:'morning', time:'06:30', courseId:'gc-ph-mimosa', courseName:'미모사+ 골프코스', price:205000 }
        ]
      },
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
    },
    {
      id:'bk-seed-gt3', bookingNumber:'OMT-OKI09C', status:'completed',
      productId:'gt-jp-okinawa-kanucha-3n', productType:'golftel',
      productName:'오키나와 카누차 베이 골프&리조트 3박4일',
      country:'japan', city:'okinawa', ownership:'direct',
      nights:3, rounds:2,
      dates: _bkRange(-45, 3),  // 45일 전 완료 (리뷰 미작성 → 리뷰 쓰기 버튼 노출 테스트)
      paxCount:2, total:2360000,
      paymentMethod:'card', leadName:'홍길동', phone:'010-1234-5678',
      packageSnapshot:{
        roomOption:'2인 1실 (오션뷰)', roomSupplement:0,
        selectedSlots:[
          { window:'morning', time:'07:00', courseId:'gc-jp-kanucha', courseName:'카누차 골프코스', price:223000 }
        ]
      },
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
    },

    // ----- 📦 패키지 (기존) -----
    {
      id:'bk-seed-1', bookingNumber:'OMT-K3X9LP2M', status:'confirmed', productId:'gt-th-bangkok-thanacity-3n',
      productType:'golftel', productName:'방콕 타나시티 골프 3박4일 (라운딩 2회)',
      dates:'2026.05.10 - 2026.05.13', paxCount:2, total:1796000,
      paymentMethod:'kakao', leadName:'홍길동', phone:'010-1234-5678',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id:'bk-seed-2', bookingNumber:'OMT-J7N2QW4K', status:'pending', productId:'gt-jp-fukuoka-kitakyushu-2n',
      productType:'golftel', productName:'후쿠오카 기타큐슈 골프 2박3일',
      dates:'2026.06.07 - 2026.06.12', paxCount:2, total:1290000,
      paymentMethod:'bank', leadName:'홍길동', phone:'010-1234-5678',
      createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
    },
    {
      id:'bk-seed-4', bookingNumber:'OMT-B1D4FG7C', status:'completed', productId:'gt-vn-phuquoc-vinpearl-5n',
      productType:'golftel', productName:'푸꾸옥 빈펄 골프 5박6일',
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
    { id:'pt-6', date:'2026-01-15', label:'생일 축하 마일리지',     delta:+5000  }
  ];

  /* =====================================================================
     11) Creator Grade System & Stats (Mock)
     ===================================================================== */
  const CREATOR_GRADES = [
    { id:'bronze',   label:'브론즈',  icon:'🥉', min:0,        max:500000,    bonus:0,      color:'#CD7F32',
      perks:['기본 커미션 (일반 5% / 직영 10%)','월간 인사이트 리포트'] },
    { id:'silver',   label:'실버',   icon:'🥈', min:500000,   max:2000000,   bonus:0.005,  color:'#9FA2A8',
      perks:['+0.5%p 추가 커미션','분기별 팸투어 신청 가능','전용 에디터 툴'] },
    { id:'gold',     label:'골드',   icon:'🥇', min:2000000,  max:5000000,   bonus:0.01,   color:'#D4AF37',
      perks:['+1%p 추가 커미션','월간 팸투어 우선권','프로필 배지 노출','직영 신상품 선공개'] },
    { id:'platinum', label:'플래티넘',icon:'💎', min:5000000,  max:Infinity,  bonus:0.02,   color:'#B9F2FF',
      perks:['+2%p 추가 커미션','전담 파트너 매니저 1:1','오리지널 상품 공동 기획 참여','연 2회 해외 컨퍼런스 초청'] }
  ];

  // 신규 크리에이터 온보딩 보너스 (첫 90일)
  const NEW_CREATOR_BONUS = {
    days: 90,
    extraDirect: 0.02,  // 직영 +2%p
    extraGeneral: 0.01, // 일반 +1%p
    label: '온보딩 보너스',
    note: '가입 후 90일 동안 직영 판매 +2%p, 일반 +1%p 추가 커미션'
  };

  // Mock 크리에이터 통계 (로그인 유저 = 홍길동 기준 시뮬레이션)
  const CREATOR_MOCK_STATS = {
    joinedAt: new Date(Date.now() - 86400000 * 52).toISOString(),  // 52일 전 가입 (= 신규 보너스 적용 중)
    isApproved: true,
    thisMonth: {
      totalSales: 3280000,          // 이번달 판매액
      directSales: 2040000,          // 이번달 직영 판매액
      commission: 246400,            // 이번달 커미션
      views: 48200,                  // 이번달 영상 조회수
      posts: 4,                      // 이번달 게시
      conversionRate: 2.3,           // 조회 → 판매 전환율 (%)
      bonusEarned: 42800             // 신규 보너스로 추가 적립된 금액
    },
    cumulative: {
      totalSales: 4280000,           // 누적 전체
      directSales: 2840000,          // 누적 직영 (등급 기준)
      totalCommission: 520400,       // 누적 커미션
      totalPayout: 418000,           // 실제 정산된 금액
      pending: 102400,               // 정산 예정
      subscribers: 68000,            // 구독자 수
      followers: 4120,               // 오마이트립 내 팔로워
      currentGrade: 'gold',          // 현재 등급 (2,840,000원 누적으로 골드)
      rankPercentile: 12             // 전체 크리에이터 중 상위 %
    },
    // 최근 30일 일별 매출 (차트용)
    dailyRevenue: Array.from({length: 30}, (_, i) => ({
      date: new Date(Date.now() - (29-i)*86400000).toISOString().slice(0,10),
      sales: Math.round(80000 + Math.random() * 200000 + (i > 20 ? 150000 : 0)),
      direct: Math.round(40000 + Math.random() * 140000 + (i > 20 ? 80000 : 0))
    })),
    // 최근 판매 피드 (골프텔 포함)
    recentSales: [
      { id:'s1', minutesAgo:8,    productId:'gt-vn-danang-ba-na-4n',    buyerInitial:'서', buyerName:'서○○', price:2760000, commission:330400, postTitle:'다낭 골프 4박5일 - 바나힐스 완벽 후기' },
      { id:'s2', minutesAgo:42,   productId:'gt-jp-okinawa-kanucha-3n', buyerInitial:'한', buyerName:'한○○', price:2360000, commission:283200, postTitle:'오키나와 골프텔 3박 — OMT 직영 첫 후기' },
      { id:'s3', minutesAgo:134,  productId:'prod-vn-01',               buyerInitial:'박', buyerName:'박○○', price:1290000, commission:154800, postTitle:'다낭 신혼여행 5박 리얼 후기' },
      { id:'s4', minutesAgo:312,  productId:'gt-ph-clark-mimosa-5n',    buyerInitial:'최', buyerName:'최○○', price:1960000, commission:98000,  postTitle:'클락 36홀 무제한 — 골프 입문자 추천' },
      { id:'s5', minutesAgo:628,  productId:'prod-jp-01',               buyerInitial:'김', buyerName:'김○○', price:689000,  commission:82680,  postTitle:'오사카 2박3일 가성비 완벽 루트' },
      { id:'s6', minutesAgo:1127, productId:'gt-th-bangkok-thanacity-3n',buyerInitial:'윤', buyerName:'윤○○', price:1560000, commission:78000,  postTitle:'방콕 그렉 노먼 코스 라운딩' }
    ],
    // 인기 콘텐츠 TOP 3 (by 수익)
    topContent: [
      { postId:'fp-01', title:'오사카 2박3일 가성비 완벽 루트', views:28400, sales:8, revenue:661440, isDirect:true },
      { postId:'fp-02', title:'다낭 신혼여행 5박 리얼 후기', views:19200, sales:4, revenue:619200, isDirect:true },
      { postId:'fp-03', title:'후쿠오카 온천 당일치기', views:12800, sales:6, revenue:176700, isDirect:false }
    ],
    // 다음 정산 예정일
    nextPayout: {
      date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0,10),
      amount: 102400
    }
  };

  /* =====================================================================
     Expose + Helpers
     ===================================================================== */
  /* =====================================================================
     12) 알림 / 문의 (마이페이지 mock)
     ===================================================================== */
  const NOTIFICATIONS = [
    { id:'n1', type:'booking',   icon:'✅', title:'예약 확정',         body:'다낭 바나힐스 골프 4박5일 예약이 확정되었어요. 예약번호: OMT-3DK21A',  date:'2026-05-19', daysAgo:1,  read:false,
      link:'complete.html?bk=OMT-3DK21A', actionLabel:'예약 확인서 →' },
    { id:'n2', type:'reminder',  icon:'⛳', title:'골프 라운딩 D-7',    body:'오키나와 카누차 골프&리조트 라운딩이 7일 남았어요. 필요 장비 준비 안내.',  date:'2026-05-14', daysAgo:6,  read:false,
      link:'golftel.html?id=gt-jp-okinawa-kanucha-3n#info', actionLabel:'준비 안내 보기 →' },
    { id:'n3', type:'promotion', icon:'🔥', title:'단독 특가 알림',     body:'다낭 직영 풀빌라가 한정 수량 -25% 할인 중! 5/25까지.',                date:'2026-05-13', daysAgo:7,  read:false,
      link:'golftel.html?id=gt-vn-danang-ba-na-4n', actionLabel:'할인 상품 →' },
    { id:'n4', type:'coupon',    icon:'🎟️', title:'쿠폰 만료 임박',     body:'10% 할인 쿠폰이 3일 후 만료됩니다. 예약 시 자동 적용 가능.',           date:'2026-05-17', daysAgo:3,  read:true,
      link:'mypage.html#coupons', actionLabel:'쿠폰함 보기 →' },
    { id:'n5', type:'points',    icon:'💰', title:'마일리지 적립',       body:'결제 1% 적립 — 12,890 마일이 적립되었어요. 다음 예약 시 사용 가능.',   date:'2026-05-12', daysAgo:8,  read:true,
      link:'mypage.html#points', actionLabel:'마일리지 내역 →' },
    { id:'n6', type:'review',    icon:'✏️', title:'리뷰 작성 요청',     body:'세부 알타비스타 골프 4박5일 잘 다녀오셨어요? 리뷰 작성 시 5,000 마일 적립.',date:'2026-05-11', daysAgo:9,  read:true,
      link:'mypage.html#bookings', actionLabel:'리뷰 작성 →' },
    { id:'n7', type:'system',    icon:'📢', title:'시스템 공지',         body:'5/22(목) 02:00~05:00 정기점검으로 예약 시스템이 일시 중단됩니다.',   date:'2026-05-10', daysAgo:10, read:true  },
    { id:'n8', type:'booking',   icon:'⛳', title:'티타임 확정',         body:'다낭 바나힐스 골프 첫 라운딩 시간이 06:00로 확정되었습니다.',          date:'2026-05-19', daysAgo:1,  read:true,
      link:'complete.html?bk=OMT-3DK21A', actionLabel:'예약 상세 →' },
    { id:'n9', type:'promotion', icon:'🎁', title:'GOLD 등급 혜택',      body:'GOLD 등급 한정 — 다낭 직영 골프텔 추가 5% 할인 코드: GOLDDA5',         date:'2026-05-05', daysAgo:15, read:true,
      link:'golftels.html?c=vietnam', actionLabel:'직영 골프텔 →' },
    { id:'n10',type:'reminder',  icon:'✈️', title:'출국 D-3 체크리스트', body:'여권 유효기간 6개월 이상, 골프 클럽 휴대수하물 규정 확인 필요.',        date:'2026-05-22', daysAgo:0,  read:false,
      link:'mypage.html#home', actionLabel:'체크리스트 →' }
  ];

  const INQUIRIES = [
    { id:'q1', subject:'다낭 골프텔 캐디 한국인 신청',         status:'answered',  date:'2026-05-15',
      messages:[
        { who:'me',  body:'안녕하세요, 다낭 골프텔 예약했는데 한국인 캐디 신청 가능한가요?',  date:'2026-05-15 14:22' },
        { who:'omt', body:'안녕하세요 고객님! 한국인 캐디 100% 보장 골프텔입니다. 추가 비용 없이 자동 배정됩니다 :)', date:'2026-05-15 14:38' }
      ] },
    { id:'q2', subject:'클럽 렌탈 사이즈 문의',                status:'answered',  date:'2026-05-08',
      messages:[
        { who:'me',  body:'미모사 골프 리조트에서 여성 왼손 클럽 가능한가요?',                date:'2026-05-08 11:05' },
        { who:'omt', body:'네 고객님, 여성 왼손 세트도 보유 중입니다. 카카오채널로 예약번호+희망 세트수 보내주시면 사전 예약 도와드릴게요.', date:'2026-05-08 11:32' }
      ] },
    { id:'q3', subject:'우천 시 환불 가능 여부',                status:'pending',   date:'2026-05-18',
      messages:[
        { who:'me',  body:'다음 주 출발인데 우기라 비 예보가 있어요. 우천 시 환불되나요?',     date:'2026-05-18 16:40' }
      ] },
    { id:'q4', subject:'2인 1실 → 1인 1실 변경 가능?',          status:'answered',  date:'2026-04-30',
      messages:[
        { who:'me',  body:'결제 후에 1인 1실로 변경할 수 있나요? 동행자 일정 변동.',          date:'2026-04-30 09:12' },
        { who:'omt', body:'출발 14일 전까지 변경 가능합니다. 1인 1실 서플리먼트 차액 결제 안내드릴게요.', date:'2026-04-30 09:50' }
      ] }
  ];

  // NAGOYA_FLIGHTS를 FLIGHTS에 병합
  Array.prototype.push.apply(FLIGHTS, NAGOYA_FLIGHTS);

  /* =====================================================================
     3-b) 항공편 정합 강화 (ohmytrip 카드 모델)
       실제운항사(코드셰어) · 무료 위탁수하물(PC) · 잔여 좌석 · 운임 옵션
       — 47편을 수동 재작성하지 않고 파생 필드를 일괄 주입
     ===================================================================== */
  const LCC_SET = new Set(Object.values(AIRLINES).filter(a => a.tier === 'LCC').map(a => a.code));
  // 마케팅 편명 ↔ 실제 운항 항공사 (코드셰어) — HND편은 인라인 operatedBy로 지정, 그 외 소수 지정
  const CODESHARE = { 'f-OZ174':'NH', 'f-TG747':'KE', 'f-NH158':'OZ' };
  // 잔여 좌석 — id 해시로 안정적 산출 (1~9석)
  const seatHash = (id) => { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return (h % 9) + 1; };
  const round1k = (n) => Math.round(n / 1000) * 1000;
  FLIGHTS.forEach(f => {
    const isLCC = LCC_SET.has(f.code);
    // 무료 위탁수하물 (PC 단위) — 비즈니스 2PC, FSC 일반석 1PC, LCC 0PC
    if (f.baggage == null) f.baggage = f.class === 'business' ? 2 : (isLCC ? 0 : 1);
    // 잔여 좌석
    if (f.seats == null) f.seats = seatHash(f.id);
    // 실제운항사(코드셰어) — 인라인 미지정 시 맵에서 보강
    if (!f.operatedBy && CODESHARE[f.id]) f.operatedBy = CODESHARE[f.id];
    // 운임 옵션 (요금 비교 모달용)
    if (!f.fares) {
      const base = f.price;
      if (f.class === 'business') {
        f.fares = [
          { key:'biz-saver', name:'비즈니스 세이버', price:base,               baggage:2, refundable:false, changeable:true,  seat:'비즈니스', desc:'비즈니스석 · 라운지 이용' },
          { key:'biz-flex',  name:'비즈니스 플렉스', price:round1k(base * 1.18), baggage:2, refundable:true,  changeable:true,  seat:'비즈니스', desc:'환불 가능 · 무료 일정 변경' }
        ];
      } else {
        const bag = isLCC ? 0 : 1;
        f.fares = [
          { key:'eco-saver', name:isLCC?'스탠다드':'일반석 세이버',   price:base,               baggage:bag,   refundable:false, changeable:false, seat:'일반석', desc: isLCC ? '위탁수하물 미포함 · 최저가' : '위탁수하물 1PC · 최저가' },
          { key:'eco-plus',  name:isLCC?'플러스':'일반석 스탠다드',   price:round1k(base*1.12), baggage:bag+1, refundable:false, changeable:true,  seat:'일반석', desc:'위탁수하물 '+(bag+1)+'PC · 좌석지정 무료' },
          { key:'eco-flex',  name:isLCC?'플렉스':'일반석 플렉스',     price:round1k(base*1.24), baggage:bag+1, refundable:true,  changeable:true,  seat:'일반석', desc:'환불 가능 · 무료 일정 변경' }
        ];
      }
    }
  });

  root.DATA = {
    COUNTRIES, CITIES, CITY_GRID, AIRLINES, FLIGHTS, HOTELS, ACTIVITIES,
    PRODUCTS, PRODUCT_TYPES, OWNERSHIP, GOLF_COURSES, GOLFTELS, CHANNEL_MANAGERS,
    CREATORS, FEED_POSTS, REVIEWS, USER,
    INITIAL_BOOKINGS, COUPONS, POINTS_HISTORY,
    CREATOR_GRADES, NEW_CREATOR_BONUS, CREATOR_MOCK_STATS,
    NOTIFICATIONS, INQUIRIES
  };

  // 누적 직영 판매액 기준 등급 조회
  root.getCreatorGrade = (directSales = 0) => {
    return CREATOR_GRADES.find(g => directSales >= g.min && directSales < g.max) || CREATOR_GRADES[0];
  };
  // 다음 등급까지 필요한 금액
  root.getNextGrade = (directSales = 0) => {
    const current = root.getCreatorGrade(directSales);
    const nextIdx = CREATOR_GRADES.indexOf(current) + 1;
    return CREATOR_GRADES[nextIdx] || null;
  };
  // 가입 후 신규 보너스 유효 여부
  root.isNewCreator = (joinedAtIso) => {
    if(!joinedAtIso) return false;
    const diffDays = (Date.now() - new Date(joinedAtIso).getTime()) / 86400000;
    return diffDays < NEW_CREATOR_BONUS.days;
  };
  root.daysLeftInBonus = (joinedAtIso) => {
    if(!joinedAtIso) return 0;
    const diffDays = (Date.now() - new Date(joinedAtIso).getTime()) / 86400000;
    return Math.max(0, Math.ceil(NEW_CREATOR_BONUS.days - diffDays));
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

  // 골프텔 + 오너십 helpers
  root.getGolftel    = (id) => GOLFTELS.find(g => g.id === id);
  root.getGolfCourse = (id) => GOLF_COURSES.find(c => c.id === id);
  root.getOwnership  = (country) => OWNERSHIP[country] || { model:'partner', label:'파트너', margin:0.15 };
  root.isDirectRun   = (country) => OWNERSHIP[country]?.model === 'direct';

  root.searchGolftels = (opts={}) => {
    const {country, city, minRounds, maxPrice, ownership} = opts;
    return GOLFTELS.filter(g => {
      if(country && g.country !== country) return false;
      if(city && g.city !== city) return false;
      if(minRounds && g.rounds < minRounds) return false;
      if(maxPrice && g.pricePerPerson > maxPrice) return false;
      if(ownership && OWNERSHIP[g.country]?.model !== ownership) return false;
      return true;
    });
  };

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
