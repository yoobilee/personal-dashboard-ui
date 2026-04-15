# 🚀 YooBi's 2026 Personal Dashboard & Portfolio

> **"QA 엔지니어링의 정밀함과 프론트엔드 개발의 감각을 결합한 통합 관리 시스템"**
> 성능 최적화와 유지보수성을 위해 **전면적인 CSS 리팩토링**과 **렌더링 엔진 최적화**를 거친 글래스모피즘(Glassmorphism) 기반의 하이엔드 웹 애플리케이션입니다.

🔗 **Live Demo:** [프로젝트 라이브 데모 확인하기](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## ✨ Key Features (주요 기능)

### 1. 🚦 하이브리드 투 트랙(Two-Track) SPA 엔진
* **Lobby & Workspace 분리**: 진입점(Lobby)과 실제 작업 공간(Dashboard/Portfolio)을 논리적으로 분리하여 사용자 목적에 맞는 화면을 제공합니다.
* **Hash-based Navigation**: 브라우저의 해시(`#`) 경로를 감지하여 새로고침 시에도 사용자가 보던 상태를 완벽히 유지하는 커스텀 라우팅 시스템을 구축했습니다.

### 2. 📋 고도화된 인터랙티브 칸반 보드
* **Sticky Header UI**: '할 일 추가' 버튼과 컬럼 제목을 상단에 고정하고, 카드 리스트만 독립적으로 스크롤되는 전용 바구니(`.task-list`) 구조를 설계하여 사용 편의성을 극대화했습니다.
* **Drag & Drop Engine**: HTML5 API를 기반으로 카드 이동 시 쫀득한(Bouncy) 플레이스홀더 애니메이션을 적용하여 직관적인 UX를 제공합니다.
* **Data Persistence**: `localStorage`와 실시간 동기화되어 페이지를 닫아도 할 일 데이터와 상태가 안전하게 보존됩니다.

### 3. 🗓️ 스마트 캘린더 & 3D 슬라이드 메모장
* **Dynamic Badge System**: 날짜별 메모 개수를 실시간으로 감지하여 달력 위에 알림 배지를 표시하며, 데이터 유무를 시각적으로 전달합니다.
* **Progressive Disclosure**: 날짜 클릭 시 메모장이 부드럽게 3D 슬라이드로 등장하며, 달력 컨테이너와 7:3 비율로 공간을 동적으로 분할하는 애니메이션을 구현했습니다.

### 4. 🍏 iOS 스타일 '다이내믹 아일랜드' 내비게이션
* **Adaptive Pill UI**: 스크롤 상태를 감지하여 위치와 크기가 가변적으로 변하는 내비게이션 바를 구현했습니다. 평소에는 콘텐츠와 조화를 이루다 스크롤 시 상단에 자석처럼 밀착됩니다.
* **Glass Reflection Detail**: 로고 호버 시 실제 유리 재질에 빛이 반사되는 듯한 빗금 광채 효과(`::after` 활용)를 적용하여 시각적 완성도를 높였습니다.

### 5. 🌗 하이엔드 다크 모드 & WebGL 배경
* **Pure CSS Theme Toggle**: 이미지 없이 오직 CSS 속성 제어만으로 해와 달이 전환되는 고퀄리티 테마 토글 기능을 구현했습니다.
* **WebGL Neural Network**: Three.js를 활용하여 마우스 위치에 반응하는 인터랙티브 노드 연결망 배경을 구축, 정적인 웹에 생동감을 부여했습니다.

### 6. 🌿 커스텀 깃허브 잔디밭 & 디자인 시스템
* **Custom Grid Layout**: CSS Grid(`grid-auto-flow: column`)를 활용해 깃허브 특유의 세로 정렬 레이아웃을 완벽히 재현했습니다.
* **Consistent Design Language**: 대시보드 전체의 톤앤매너를 일관된 투명 유리 질감과 시그니처 블루 컬러로 통일하여 브랜드 정체성을 강화했습니다.

<br/>

## 🛠️ Tech Stack (기술 스택)

<div align="center">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
</div>

<br/>

## 💡 What I Learned (엔지니어링 인사이트)

* **CSS Architecture Refactoring**: 유지보수성을 극대화하기 위해 파편화된 다크모드 코드를 컴포넌트 단위로 응집시키고 논리적인 그룹화를 진행하며 클린 코드의 중요성을 체득했습니다.
* **Rendering Bug Debugging**: 글래스모피즘 구현 시 발생하는 브라우저의 '블러 찌꺼기(Blur Bleeding)' 현상을 `transform: translateZ(0)`와 GPU 가속을 통해 해결하며 브라우저 렌더링 엔진의 원리를 파악했습니다.
* **복합 스크롤 환경의 이벤트 최적화**: 스냅 스크롤(Scroll Snap) 컨테이너 내부에서 발생하는 스크롤 이벤트를 정밀하게 감지하여 페이지네이션(Scroll Spy)과 내비게이션의 상태 전환 로직을 안정화했습니다.
* **QA 기반의 방어적 프로그래밍**: 리팩토링 후 발생할 수 있는 레이아웃 무너짐이나 텍스트 시인성 이슈를 QA의 시각에서 전수 조사하고 수정하는 과정을 통해 탄탄한 UI 안정성을 확보했습니다.

---
*Developed by YooBi LEE* 🙋‍♀️