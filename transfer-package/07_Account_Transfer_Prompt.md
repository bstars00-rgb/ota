# 07. OPS 계정 이전 프롬프트 (Account Transfer Prompt)

> 아래 **"최종 이전 프롬프트"**를 OPS 계정의 새 프로젝트 첫 메시지(또는 프로젝트 지침)로 입력하면, 기존 프로젝트의 맥락을 그대로 이어갈 수 있습니다. 함께 이 `transfer-package/` 7개 파일과 GitHub 레포를 연결/첨부하세요.

---

## ✅ 최종 이전 프롬프트 (복사해서 사용)

```
이 프로젝트는 기존 계정에서 이관된 "오마이트립(OhMyTrip / OMT)" 프로젝트다.
목표는 기존 프로젝트의 목적·작업 방식·결정사항·파일 구조·현재 상태를 그대로 이어받는 것이다.
새로 만드는 것이 아니라 기존 프로젝트를 이어서 진행한다. 기존 정보·설정을 임의로 요약/변경하지 말 것.

■ 프로젝트 정체
- 한국인 대상 아시아 아웃바운드 골프 관광 OTA 프로토타입. 메인 상품 = 골프텔(골프+호텔).
- 빌드 없는 순수 정적 사이트(Vanilla HTML/CSS/JS). npm 빌드·서버·DB 없음.
- 데이터는 data.js(목업) + state.js(localStorage). 비밀키·.env 없음.
- 백엔드(ELLIS)는 실코드 없이 MD 명세 문서로만 존재(의도된 설계).
- 레포: https://github.com/bstars00-rgb/ota · 라이브: https://bstars00-rgb.github.io/ota/
- ⚠️ PRD.md·ARCHITECTURE.md의 Next.js/TS/Supabase 스택은 "목표"이며 현재 코드와 다름. 실제는 정적 프로토타입.

■ 반드시 지킬 필수 규칙 (위반 시 폐지 기능 부활·정책 위반)
1. 메인 SKU는 골프텔. 항공 결합형은 golftel-air로 분리 관리.
2. 국가 오너십: 일본·베트남 직영(22.5%), 태국·필리핀 프랜차이즈(15%). data.js의 OWNERSHIP.
3. 백엔드 ELLIS는 MD 명세만(실코드 X). 프론트 변경 시 관련 MD 문서 동반 갱신.
4. 다크 모드 정책: 고객 화면에 라이트/다크 토글 추가 금지. 운영 콘솔(백오피스)만 다크 톤 유지.
5. 에어텔(고정 자유여행 패키지) 폐지: PRODUCTS·패키지 빌더 부활 금지(trip-builder/packages/product 삭제됨).
   단, 동적 항공+호텔 결합(airhotel.html)은 허용.
6. 리워드는 마일리지 1종(트립코인·별도 포인트 지갑 폐지, 2026-07-10 완전 통합). 1마일=1원.
   경쟁사(시트립 등) 명칭·색 차용 금지. 단 네이버페이 네이버 포인트·항공사 FFP는 외부 리워드라 별개 유지.
7. 골프 채널 매니저: GDO(일본)·GolfNow(글로벌)·카카오골프/XGOLF(한국)·Golfdigg(태국) — ELLIS 연동 대상.
8. JS 제거 시 주석 처리 말고 완전 삭제 후 검증.

■ 작업/검증 방식
- 실행: `npx -y serve -l 4178 .` → http://localhost:4178 (serve는 클린 URL로 301, 쿼리 드롭 주의).
- JS 문법 검증(빌드 없음): 외부 JS는 `node --check`, 인라인은 <script> 추출 후 new Function() 파싱.
- 한글 커밋 메시지는 `git commit -F msgfile`로.
- 자동 테스트 없음 → QA_CHECKLIST.md 수동 + 브라우저 런타임 eval 검증.
- 최신 상태 정본은 git log. PROJECT_STATUS.md 상세표는 2026-06-12 스냅샷.

■ 현재 상태 (2026-07-14)
- 인터랙티브 클릭 프로토타입 완성 단계. HTML 40 / JS 4 / MD 13. git main clean, 원격 동기화.
- 최신 커밋 fa6d73a(포인트→마일리지 완전 통합), 4c9cd7b(README+STATUS 갱신).

■ 먼저 할 일
transfer-package/ 폴더의 01~06 문서와 README.md, handover.md를 읽고 현재 상태를 코드와 대조 검증한 뒤,
06_Next_Actions.md의 우선순위에 따라 가장 우선순위 높은 작업을 제시하라.
확인되지 않은 내용은 추정하지 말고 "확인 필요"로 표시하라.
```

---

## 참고: 이 프롬프트와 함께 전달할 것
1. **GitHub 레포 연결**(소유권 이전 or 협업자 초대) — 소스 정본.
2. **transfer-package/ 7개 파일** — 01~07.
3. **핵심 문서**: README.md, handover.md, PROJECT_STATUS.md, ELLIS_SPEC.md, BACKOFFICE_SPEC.md, QA_CHECKLIST.md.
4. `.claude/launch.json` 재생성(04번 문서 F).

---

# ✅ [OPS 계정 이동 체크리스트]

| # | 항목 | 상태 | 방법/비고 |
|---|---|---|---|
| 1 | **프로젝트 생성** | ☐ | OPS 계정에서 새 프로젝트 생성 |
| 2 | **프로젝트 지침 입력** | ☐ | 위 "최종 이전 프롬프트"를 지침/첫 메시지로 입력 (02번 문서 규칙 포함) |
| 3 | **파일 재업로드** | ☐ | transfer-package/ 7종 + 핵심 문서 첨부, `.claude/launch.json` 재생성 |
| 4 | **GitHub/외부 서비스 재연결** | ☐ | 레포 소유권 이전 or 협업자 초대. Pages URL 확정·문서 링크 갱신. 폰트/OSM은 키 불필요 |
| 5 | **환경변수·API Key 재설정** | ☐ | 해당 없음(.env·키 없음). "없음" 확인만 |
| 6 | **기존 기능 테스트** | ☐ | `serve` 실행 → index/golftel/mypage(마일리지)/checkout/admin 렌더·동작 확인, 콘솔 에러 0 |
| 7 | **최신 결과물 비교** | ☐ | 라이브(Pages) vs 로컬 vs git log fa6d73a 일치 확인 |
| 8 | **누락 데이터 확인** | ☐ | 14번(누락 가능 정보) 점검: 메모리 규칙·launch.json·계정 명칭·SW 버전 결정 |
| 9 | **Personal 계정 프로젝트 보관/삭제** | ☐ | 이전 검증 완료 후 결정. 소스는 GitHub 정본이므로 로컬/계정 사본은 보관 또는 정리 |

---

## ⚠️ 이전 과정에서 누락될 가능성이 있는 정보 (반드시 확인)
1. **Claude 개인 메모리 규칙** — 계정 메모리는 자동 이동하지 않음. 02번 문서에 박제했으나, 새 계정에서 이 규칙을 메모리에 다시 저장할지 결정 필요.
2. **`.claude/` 설정·세션 이력** — 계정·PC 로컬이라 이동 안 됨. `launch.json` 재생성 필요.
3. **계정 명칭 방향** — handover.md는 "OPS→CEO Office", 이번은 "(현재)→OPS" 역방향. 어느 계정이 최종 운영 정본인지 ⚠️ 확인.
4. **레포 소유권/URL** — 이전 시 Pages URL·문서 내 링크 변경 가능.
5. **SW 캐시 버전업 결정** — 미결정. 배포 반영 이슈 대비.
6. **담당자 실명·역할** — 대화상 미확정(⚠️ 확인 필요).
7. **백오피스 일부 페이지 완성도** — admin-cs/admin-users 등 실제 완성도 ⚠️ 확인.
