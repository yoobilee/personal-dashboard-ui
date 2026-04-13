# 🚀 YooBi's 2026 Personal Dashboard

> **"QA Engineer에서 Frontend Developer로의 도약을 기록하는 나만의 관제탑"**
> 목표 달성률을 시각화하고, 매일의 일정을 관리하기 위해 제작한 **글래스모피즘(Glassmorphism)** 기반의 개인 대시보드 웹 애플리케이션입니다.

🔗 **Live Demo:** [유비의 대시보드 보러가기](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## ✨ Key Features (주요 기능)

### 1. 🌓 Pure CSS 다크 모드 토글 (Day & Night)
* 이미지(SVG/PNG) 없이 **오직 CSS만으로 구현**한 고퀄리티 해/달 전환 애니메이션
* 우측 상단 고정 배치(`position: fixed`)로 언제든 접근 가능
* `localStorage`를 활용해 사용자의 테마 설정(Light/Dark) 영구 기억

### 2. 📊 다이내믹 아일랜드 스타일 연간 진행률 바
* 현재 날짜를 계산해 **2026년 한 해의 달성률을 실시간으로 보여주는 Progress Bar**
* 첫 페이지(로드맵) 상단에 다이내믹 아일랜드 스타일로 배치(`position: absolute`)하여 공간 활용도 극대화

### 3. 📋 Drag & Drop 칸반 보드 (Kanban Board)
* To Do, Doing, Done 3단계로 일정을 관리하는 직관적인 보드
* HTML5 Drag and Drop API를 활용한 부드러운 카드 이동 및 쫀득한(Bouncy) 플레이스홀더 애니메이션 적용
* `localStorage`와 연동하여 새로고침해도 할 일 데이터와 위치 완벽 보존

### 4. 📅 반응형 글래스모피즘 캘린더 & 스마트 다중 메모장
* 바닐라 JS로 직접 렌더링하는 **글래스모피즘(Glassmorphism)** 스타일의 달력
* **다중 메모 리스트 & 실시간 알림 배지**: 하루에 여러 개의 메모를 리스트로 관리하며, 메모가 있는 날짜엔 실시간으로 개수를 알려주는 스마트 배지 표시
* **인터랙티브 UX (Line-clamp)**: 긴 메모는 5줄까지만 말줄임표 처리되고, 클릭 시 전체 내용이 부드럽게 펼쳐지는 접기/펴기 기능 적용
* 날짜 클릭 시 **점진적 공개(Progressive Disclosure)** 패턴을 적용하여 메모장이 7:3 비율로 부드럽게 3D 슬라이드 등장
* 깜빡임(Layout Thrashing)과 텍스트 찌그러짐을 방지한 최적화된 CSS 애니메이션 적용
* `localStorage`를 활용해 날짜별 메모를 단일 문자열이 아닌 배열(Array) 형태로 저장 및 즉시 렌더링

### 5. 📍 Scroll Spy 페이지네이션 & 플로팅 네비게이션
* `IntersectionObserver`를 활용해 현재 보고 있는 페이지 위치를 실시간으로 감지하고 우측 미니멀 라인 인디케이터에 반영 (Scroll Spy)
* 마우스 호버 시 글래스모피즘 툴팁을 통해 현재 섹션 정보 제공
* 스크롤 뎁스에 따라 아래에서 위로 쫀득하게 등장하는 '최상단 이동(Back to Top)' 커스텀 버튼 구현

### 6. 💎 커스텀 글래스모피즘 UI 엔진
* 투박한 브라우저 기본 `<select>` 태그의 한계를 극복하기 위해 HTML/CSS/JS를 조합한 커스텀 드롭다운 리스트 직접 구현
* 대시보드 전체의 디자인 톤앤매너(Tone & Manner)를 일관된 투명 유리 질감으로 완벽히 통일

### 7. 🚀 Narrative UX: Launch Sequence & Aura Glow
* **Aura Glow Interaction**: 2026 디자인 트렌드인 '후광 효과(Aura)'를 적용하여 마우스 호버 시 버튼 뒤에서 은은한 빛이 뿜어져 나오는 역동적인 인터랙션 구현
* **System Booting Logs**: QA 엔지니어의 정체성을 담아, 대시보드 진입 시 시스템 초기화 및 버그 스캔 로그가 출력되는 시각적 서사 부여
* **Three.js Background**: WebGL 기반의 살아 숨 쉬는 노드 연결망 배경을 구축하여 마우스 위치에 따른 유동적인 입자 인터랙션 제공

### 8. 🕹️ Developer Admin Mode (Console Control)
* 브라우저 콘솔창에서 `toggleAdminMode(false)` 명령어를 통해 시스템 시퀀스 사용 여부를 실시간으로 제어할 수 있는 어드민 디버깅 기능 탑재

### 9. 🌿 깃허브 잔디밭 커스텀 툴팁 (GitHub Contributions)
* 깃허브 오리지널 레이아웃(세로 7일 단위 정렬)을 CSS Grid 속성(`grid-auto-flow: column`)을 활용해 완벽하게 재현
* 대시보드의 메인 테마인 **'토스 블루(Toss Blue)'** 컬러를 적용하여 4단계의 기여도 색상 커스터마이징
* 자바스크립트의 `Date` 객체를 활용해 매월 현실 시간에 맞춰 영문 월 이름(Apr, May 등)이 자동으로 업데이트되는 로직 구현

<br/>

## 🛠️ Tech Stack (기술 스택)

<div align="center">

  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />

  <br/>

  <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  <img src="https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages" />

</div>

<br/>

## 💡 What I Learned (개발 주안점 및 트러블 슈팅)

* **브라우저 기본 UI 제어 한계 극복**: 시스템 기본 `<select>`와 팝업의 디자인적 한계를 인지하고, 이벤트 버블링(`e.stopPropagation()`)과 전역 클릭 감지를 활용한 커스텀 드롭다운 및 스크롤바를 직접 구현하여 일관된 글래스모피즘 UX를 완성했습니다.
* **스냅 스크롤(Scroll Snap) 환경에서의 이벤트 감지**: `body`가 아닌 특정 `.scroll-container` 내부에서 스크롤이 발생하는 구조를 파악하고, 스크롤 이벤트 리스너의 타겟을 정확히 지정하여 플로팅 버튼과 페이지네이션의 스크롤 스파이(Scroll Spy) 로직을 최적화했습니다.
* **DOM 요소 생성 및 CSS 스타일 상속 충돌 해결**: 자바스크립트로 동적 생성하는 알림 배지의 태그를 `<div>`에서 `<span>`으로 변경하여, 달력 날짜 칸의 기존 레이아웃 스타일이 원치 않게 상속되는 버그를 방어했습니다.
* **Z-Index 및 스태킹 컨텍스트 최적화**: 커스텀 툴팁이 캘린더나 칸반 보드 등 다른 컴포넌트에 가려지는 현상을 해결하기 위해, 최상위 부모 요소(`aside`)에 `position: relative`와 높은 `z-index`를 부여하여 화면의 레이어 위계를 명확히 재설정했습니다.
* **CSS 그리드(Grid)를 활용한 복잡한 레이아웃 구현**: `grid-auto-flow: column` 속성을 활용하여 가로가 아닌 세로로 먼저 채워지는 깃허브 잔디밭 특유의 레이아웃을 바닥부터 커스텀 구현했습니다.
* **CSS 우선순위 제어 (`!important` 활용 및 지양)**: 과도한 `!important` 사용을 줄이고 CSS의 계층 구조를 리팩토링하여 유지보수성을 높이는 한편, 꼭 필요한 포커스(Focus) 효과와 다크모드 대응 등에는 전략적으로 우선순위를 제어했습니다.
* **사용자 경험(UX)에 서사 부여**: 단순한 페이지 전환을 넘어 시스템 가동 로그를 통해 개발자의 백그라운드(QA)를 사용자에게 효과적으로 전달하는 스토리텔링 UX를 구현했습니다.
* **점진적 공개(Progressive Disclosure) UI 구현**: 캘린더와 메모장의 노출 비율을 `flex`와 CSS 애니메이션으로 제어하여, 화면 공간을 효율적으로 사용하고 UX를 개선했습니다.
* **상태 유지**: 외부 데이터베이스 없이 브라우저의 로컬 스토리지만을 활용하여 사용자 설정(다크모드)과 데이터(칸반, 메모 배열 데이터)를 실시간으로 동기화 및 유지하는 클라이언트 사이드 데이터 관리 방법을 터득했습니다.

---

*Developed by YooBi LEE* 🙋‍♀️