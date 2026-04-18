# 🚀 YooBi's 2026 Personal Dashboard & Portfolio

> **"QA 엔지니어링의 정밀함과 프론트엔드 개발의 감각을 결합한 통합 관리 시스템"**
> 
> 성능 최적화와 유지보수성을 위해 **전면적인 CSS 리팩토링**과 **렌더링 엔진 최적화**를 거친 글래스모피즘(Glassmorphism) 기반의 하이엔드 웹 애플리케이션입니다.

🔗 **Live Demo:** [프로젝트 라이브 데모 확인하기](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## ✨ Key Features (주요 기능)

### 1. 🚦 하이브리드 투 트랙(Two-Track) SPA 엔진
* **Lobby & Workspace 분리**: 진입점(Lobby)과 실제 작업 공간(Dashboard/Portfolio)을 논리적으로 분리하여 사용자 목적에 맞는 화면을 제공합니다.
* **Hash-based Navigation**: 브라우저의 해시(`#`) 경로를 감지하여 새로고침 시에도 사용자가 보던 상태를 완벽히 유지하는 커스텀 라우팅 시스템을 구축했습니다.

### 2. 🗺️ 커리어 로드맵 (Roadmap Tracker)
* **SVG Animation**: `IntersectionObserver`와 CSS 애니메이션을 활용한 SVG 곡선 로드맵 렌더링.
* **Data Tracking**: `localStorage`를 활용하여 사용자의 진행 달성도를 실시간 퍼센트로 시각화하고 세션 간 상태를 유지합니다.

### 3. 📋 고도화된 인터랙티브 칸반 보드
* **Sticky Header UI**: '할 일 추가' 버튼과 컬럼 제목을 상단에 고정하고, 카드 리스트만 독립적으로 스크롤되는 전용 바구니(`.task-list`) 구조를 설계하여 사용 편의성을 극대화했습니다.
* **Drag & Drop Engine**: HTML5 API를 기반으로 카드 이동 시 쫀득한(Bouncy) 플레이스홀더 애니메이션을 적용하여 직관적인 UX를 제공합니다.
* **Data Persistence**: 데이터 변경 사항이 로컬 스토리지와 실시간 동기화되어 안전하게 보존됩니다.

### 4. 🗓️ 스마트 캘린더 & 3D 슬라이드 메모장
* **Dynamic Badge System**: 날짜별 메모 개수를 실시간으로 감지하여 달력 위에 알림 배지를 표시하며, 데이터 유무를 시각적으로 전달합니다.
* **Progressive Disclosure**: 날짜 클릭 시 메모장이 부드럽게 3D 슬라이드로 등장하며, 달력 컨테이너와 7:3 비율로 공간을 동적으로 분할하는 애니메이션을 구현했습니다.

### 5. 📚 지식 보관소 (Knowledge Archive) & Bento Grid
* **Bento Grid Layout**: 필터링 애니메이션이 부드럽게 적용된 반응형 벤토 그리드 레이아웃.
* **Frosted Glass Tabs**: 최신 iOS 스타일의 프로스트 글래스(Frosted Glass) 탭 UI를 적용하여 깊이감을 더했습니다.

### 6. 🍏 iOS 스타일 '다이내믹 아일랜드' 내비게이션
* **Adaptive Pill UI**: 스크롤 상태를 감지하여 위치와 크기가 가변적으로 변하는 내비게이션 바를 구현했습니다. 평소에는 콘텐츠와 조화를 이루다 스크롤 시 상단에 자석처럼 밀착됩니다.
* **Glass Reflection Detail**: 로고 호버 시 실제 유리 재질에 빛이 반사되는 듯한 빗금 광채 효과(`::after` 활용)를 적용하여 시각적 완성도를 높였습니다.

### 7. 🌗 하이엔드 다크 모드 & WebGL 배경
* **Pure CSS Theme Toggle**: 이미지 없이 오직 CSS 속성 제어만으로 해와 달이 전환되는 고퀄리티 테마 토글 기능을 구현했습니다.
* **WebGL Neural Network**: `Three.js`를 활용하여 마우스 위치에 반응하는 인터랙티브 노드 연결망 배경을 구축, 정적인 웹에 생동감을 부여했습니다.

### 8. 🌿 커스텀 깃허브 잔디밭 & 디자인 시스템
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

## 💡 Engineering & QA Insight (엔지니어링 & 트러블슈팅)

### 🏗️ Architecture & Optimization
* **CSS Architecture Refactoring**: 유지보수성을 극대화하기 위해 파편화된 다크모드 코드를 컴포넌트 단위로 응집시키고 논리적인 그룹화를 진행하며 클린 코드의 중요성을 체득했습니다.
* **복합 스크롤 환경의 이벤트 최적화**: 스냅 스크롤(Scroll Snap) 컨테이너 내부에서 발생하는 스크롤 이벤트를 정밀하게 감지하여 페이지네이션(Scroll Spy)과 내비게이션의 상태 전환 로직을 안정화했습니다.
* **QA 기반의 방어적 프로그래밍**: 리팩토링 후 발생할 수 있는 레이아웃 무너짐이나 텍스트 시인성 이슈를 QA의 시각에서 전수 조사하고 수정하는 과정을 통해 탄탄한 UI 안정성을 확보했습니다.

### 🐛 Deep Dive: Rendering Bug Troubleshooting
QA 엔지니어의 집요함으로 브라우저 렌더링 엔진의 한계점(Edge Case)을 파악하고 최신 CSS 문법으로 우회한 경험입니다.

**1. 크롬(Chrome) 컴포지터 레이어 충돌 (가로선 찢어짐 버그 해결)**
* **Issue:** 다중 글래스모피즘 요소(아카이브 카드와 툴팁)가 겹친 상태에서 CSS 애니메이션(`opacity`, `transform`)이 발생할 때, 크롬 그래픽 엔진이 레이어를 찢어버리며 뷰포트에 검은 가로선을 렌더링하는 현상(Compositor Tearing) 발견.
* **Solution:** 1. `transform: translateZ(0)`와 `will-change` 속성을 부여하여 툴팁과 페이지네이션을 3D 하드웨어 가속(GPU) 레이어로 강제 분리.
  2. 최신 CSS 가상 클래스인 `:has()` 선택자를 도입. 툴팁에 마우스가 호버될 때 아주 찰나의 순간 동안 배경 카드의 `backdrop-filter`를 일시 해제하여 브라우저 엔진의 과부하 및 레이어 충돌을 완벽하게 원천 차단.

**2. 렌더링 엔진의 Blur Bleeding (각진 그림자/블러 깨짐 현상 해결)**
* **Issue:** 그라데이션 배경 위에서 카드가 커지는 호버 애니메이션(`scale`) 동작 시, 브라우저가 연산량 한계로 인해 둥근 모서리(`border-radius`)의 블러 연산을 누락하여 네모나게 깨지는 현상 발견.
* **Solution:** 복잡한 3D 가속 꼼수 대신 크기 변환 애니메이션을 `transform: translateY`로 단순화하여 GPU 연산 부담을 줄이고, 상태 변경 시 발생하는 서브픽셀 단위의 CSS 겹침(Sub-pixel desync)을 막기 위해 변환할 속성만 명시적으로 `transition`에 분리 할당하여 렌더링 안정성 확보.

---
*Developed by YooBi LEE* 🙋‍♀️