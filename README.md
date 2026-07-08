# YooBi's Personal Dashboard & Portfolio

<div align="center">

> *QA 엔지니어의 꼼꼼한 시선으로, 버그가 없는 코드를 짜는 개발자를 목표로 합니다.*

**[🔗 Live Demo](https://yoobilee.github.io/personal-dashboard-ui/)**

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

외부 프레임워크 없이 Vanilla JS + Three.js로만 구현

</div>

<br/>

## 소개

QA Engineer → Frontend Developer 전환 과정을 담은 개인 포트폴리오 겸 실사용 대시보드 SPA입니다.

단순한 이력서 페이지가 아니라, 실제로 매일 쓰는 칸반 보드 · 캘린더 · 지식 아카이브를 하나의 앱으로 통합했습니다. 토스 디자인 시스템에서 영향을 받은 글라스모피즘 UI를 기반으로 시각적 완성도와 실용성을 함께 추구했습니다.

<br/>

## 스크린샷

<div align="center">

| Portfolio | Dashboard |
|:---------:|:---------:|
| ![Portfolio](images/Portfolio_Page.png) | ![Dashboard](images/Dashboard_Page.png) |

</div>

<br/>

## 주요 기능

| 페이지 | 기능 |
|--------|------|
| **Home** | Portfolio / Dashboard 탭 전환, 배경 Orb 그라데이션 페이드, 레이어드 글래스 카드 |
| **Portfolio** | Dynamic Island 네비, 스크롤 reveal 애니메이션, 프로젝트 카드 |
| **Tech Stack Journey** | SVG S자 곡선 로드맵으로 기술 스택 성장 서사 시각화, 단계별 완료 처리, 달성률 실시간 반영 |
| **Kanban Board** | 드래그 앤 드롭, 우선순위 설정, 카드 상세 모달 |
| **Calendar & Memo** | 월간 달력, 날짜별 메모 · 타임라인 탭 전환 |
| **Knowledge Archive** | 참고 링크 아카이브, 카테고리 필터 |

<br/>

## 로컬 설정

Firebase 동기화 기능을 사용하려면 `config.js` 파일을 프로젝트 루트에 생성해야 합니다. (`.gitignore`에 포함되어 있어 GitHub에는 올라가지 않습니다.)

```bash
cp config.example.js config.js
# config.js 안의 시크릿 키를 본인 키로 수정
```

**배포 환경 (GitHub Pages / Vercel 등)** 에서는 `config.js` 없이 콘솔에서 직접 활성화할 수 있습니다.

```javascript
enableSync("YOUR-SYNC-KEY")  // 동기화 활성화 — 이후 로컬과 동일하게 동작
```

<br/>

## 구현 포인트

**Hash 기반 SPA 라우팅**
`window.location.hash`로 페이지 전환을 처리하며 새로고침 시에도 마지막 위치를 복원합니다. 다크모드 상태는 `localStorage`를 통해 resume.html까지 모든 페이지에서 동기화됩니다.

**Firebase 멀티 디바이스 자동 동기화**
데이터 변경 시 2초 후 Firebase에 자동 업로드합니다. 페이지 로드 시 서버의 `updatedAt` 타임스탬프와 로컬의 `lastSync`를 비교해 서버가 더 최신이면 자동 다운로드합니다. 다운로드 중에는 `localStorage.setItem` override를 우회해 자동 업로드가 발동되지 않도록 처리했습니다. 배포 환경에서는 콘솔에서 `enableSync(key)`로 활성화합니다.

**GitHub API 연동**
`api.github.com/users/yoobilee/events`에서 실제 PushEvent를 가져와 날짜별 커밋 횟수를 집계해 잔디밭을 렌더링합니다. 월이 바뀌면 자동으로 업데이트되며 API 실패 시 빈 그리드로 fallback 처리했습니다.

**콘솔 개발자 도구**
QA 경험을 살려 브라우저 콘솔에서 실행 가능한 두 가지 도구를 구현했습니다. `analyzeStack()`은 script/link 태그를 분석해 프로젝트의 기술 스택을 자동으로 감지하고, `detectBugs()`는 깨진 이미지, 깨진 링크, 콘솔 에러, localStorage 용량, 필수 DOM 요소 존재 여부를 자동으로 점검합니다.

**글라스모피즘 렌더링 최적화**
다중 글라스 요소 겹침 시 발생하는 크롬 컴포지터 레이어 충돌을 `transform: translateZ(0)` + `will-change`로 GPU 레이어를 분리해 해결했습니다.

**사이드바 토글**
`position: sticky` + `getBoundingClientRect()` 조합으로 사이드바 width transition과 완전히 동기화되는 슬라이드 토글을 구현했습니다.

**CTA 버튼 다크모드 버그**
`backdrop-filter`가 적용된 부모에서 `z-index` 스태킹 컨텍스트가 충돌해 호버 시 텍스트가 사라지는 버그를 `isolation: isolate`로 해결했습니다.

**GitHub 툴팁 overflow 탈출**
`overflow: hidden` 컨테이너 안에 갇힌 툴팁을 `getBoundingClientRect()`로 위치를 계산해 `position: fixed`로 렌더링해 해결했습니다.

**캘린더 그리드 높이 일관성**
5주/6주 달력이 `grid-auto-rows: 1fr`로 실제 행 개수에 맞춰 남는 공간을 나누다 보니 달마다 셀 크기가 달라지던 문제를, `grid-template-rows: repeat(6, 1fr)`로 항상 6행 기준 분할하도록 고쳤습니다. 브라우저 확대 시 날짜가 잘려 보이던 현상도 flex 자식의 `min-height: auto` 기본값이 콘텐츠를 축소하지 못하게 막던 것이 원인이었는데, `min-height: 0`으로 재정의해 해결했습니다.

<br/>

---

<div align="center">

Developed by **YooBi LEE** · QA Engineer → Frontend Developer

</div>