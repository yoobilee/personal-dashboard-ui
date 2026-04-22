# 🚀 YooBi's 2026 Personal Dashboard & Portfolio

> **"QA 엔지니어링의 정밀함과 프론트엔드 개발의 감각을 결합한 통합 관리 시스템"**
> 
> 성능 최적화와 유지보수성을 위해 전면적인 CSS 리팩토링과 렌더링 엔진 최적화를 거친 글래스모피즘(Glassmorphism) 기반의 하이엔드 웹 애플리케이션입니다.

🔗 **Live Demo:** [프로젝트 라이브 데모 확인하기](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## 💎 Core Value: QA-Driven Development
본 프로젝트는 **'QA의 눈으로 코드를 짜고 검증한다'**는 철학을 바탕으로 개발되었습니다. 소프트웨어 품질 관리 역량을 프론트엔드 최적화 로직으로 승화시켰습니다.

* **Performance Precision**: 단순 평균이 아닌 **90분위수(P90)**를 고려한 렌더링 최적화 및 방어적 아키텍처 설계.
* **Defensive Programming**: 경계값 분석(BVA) 및 입력 보안 가이드라인을 적용하여 데이터 무결성을 확보하는 예외 처리 로직 구현.
* **UI/UX Integrity**: 1px의 오차와 렌더링 딜레이를 허용하지 않는 집요함으로 하이엔드 인터랙션 마감 처리.

<br/>

## ✨ Key Features (주요 기능)

### 1. 하이브리드 투 트랙(Two-Track) SPA 엔진
* **Lobby & Workspace 분리**: 진입점(Lobby)과 실제 작업 공간(Dashboard/Portfolio/Resume)을 논리적으로 분리하여 사용자 목적에 맞는 화면을 제공합니다.
* **Hash-based Navigation**: 브라우저의 해시 경로를 감지하여 새로고침 시에도 사용자가 보던 상태를 완벽히 유지하는 커스텀 라우팅 시스템을 구축했습니다.
* **Cross-Page State Sync**: 로컬 스토리지를 활용해 대시보드, 포트폴리오, 이력서 등 독립된 HTML 페이지 간의 다크모드 테마 상태를 실시간으로 동기화합니다.

### 2. 커리어 로드맵 (Roadmap Tracker)
* **SVG Animation**: IntersectionObserver와 CSS 애니메이션을 활용한 SVG 곡선 로드맵 렌더링을 구현했습니다.
* **Data Tracking**: localStorage를 활용하여 사용자의 진행 달성도를 실시간 퍼센트로 시각화하고 세션 간 상태를 유지합니다.

### 3. 고도화된 인터랙티브 칸반 보드 & 벤토 그리드
* **State Synchronization**: 칸반 보드의 특정 상태값(`doing`, `in-progress`)을 정밀하게 트래킹하여 대시보드 메인 화면의 벤토 그리드(Bento Grid) 통계와 오차 없이 100% 동기화합니다.
* **Drag & Drop Engine**: HTML5 API를 기반으로 카드 이동 시 쫀득한 플레이스홀더 애니메이션을 적용하여 직관적인 UX를 제공합니다.
* **Sticky Header UI**: 할 일 추가 버튼과 컬럼 제목을 상단에 고정하고 카드 리스트만 독립적으로 스크롤되는 전용 바구니 구조를 설계했습니다.

### 4. 스마트 캘린더 & 3D 슬라이드 메모장
* **Dynamic Badge System**: 날짜별 메모 개수를 실시간으로 감지하여 달력 위에 알림 배지를 표시하며 데이터 유무를 시각적으로 전달합니다.
* **Progressive Disclosure**: 날짜 클릭 시 메모장이 부드럽게 3D 슬라이드로 등장하며 달력 컨테이너와 7:3 비율로 공간을 동적으로 분할하는 애니메이션을 구현했습니다.

### 5. 지식 보관소 & 대시보드 벤토 그리드
* **Bento Grid Layout**: 필터링 애니메이션이 적용된 반응형 벤토 그리드 레이아웃을 통해 정보 밀도가 높고 균형 잡힌 화면 구성을 실현했습니다.
* **Smart Briefing**: 단순한 D-Day 숫자 표기를 넘어 localStorage와 연동하여 가장 가까운 일정의 제목을 실시간으로 브리핑하는 지능형 카드를 구현했습니다.

### 6. iOS 스타일 '다이내믹 아일랜드' 내비게이션
* **Adaptive Pill UI**: 스크롤 상태를 감지하여 위치와 크기가 가변적으로 변하고, 내부 텍스트가 유연하게 숨겨지는 내비게이션 바를 구현했습니다.
* **High-End Glass Reflection**: 마우스 위치를 1:1로 정밀하게 추적하여 버튼 표면에 창문 조명이 맺히는 듯한 리얼한 유리 반사광 효과를 적용했습니다.
* **Toss Blue Interaction**: 호버 시 투명한 유리가 시그니처 블루(#3182f6) 컬러로 부드럽게 물들며 강렬한 시각적 피드백을 제공합니다.

### 7. 하이엔드 다크 모드 & WebGL 배경 엔진
* **Interactive Background**: Portfolio 모드의 유기적인 신경망과 Dashboard 모드의 몽환적인 원형 빛(Orbs) 매트릭스가 탭 전환 시 상호 변환되는 환경을 구축했습니다.
* **Keyframe Persistence**: 다크 모드 전환 시에도 배경 빛의 미세한 곡선 이동 반경과 타이밍이 끊김 없이 유지되도록 CSS 엔진을 최적화했습니다.

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
* **전면적인 CSS 아키텍처 리팩토링**: 유지보수성을 극대화하기 위해 파편화된 코드를 13개의 섹션으로 모듈화했습니다. 기존 디자인의 픽셀 값과 애니메이션 프레임을 100% 보존하면서 코드의 논리적 그룹화를 달성했습니다.
* **복합 스크롤 환경의 이벤트 최적화**: 스냅 스크롤 컨테이너 내부의 이벤트를 정밀하게 감지하여 내비게이션 상태 전환 로직을 안정화했습니다.
* **데이터 무결성(Data Integrity) 확보**: 파편화된 로컬 스토리지 키값을 통합(`yoobiTasks_v2`)하고, 화면(DOM)과 실제 데이터(State) 간의 불일치로 인한 '유령 데이터' 현상을 추적하여 카운트 로직을 완벽하게 교정했습니다.

### 🐛 Deep Dive: Troubleshooting
* **WebKit Clipping Bug 해결**: `background-clip: text`와 `display: flex` 혼용 시 텍스트 바운딩 박스가 깎이는 크롬/사파리 렌더링 버그를 우회하여 시각적 결함을 해결했습니다.
* **Flexbox Ghost Gap 제거**: 스크롤 애니메이션 시 `display: none`을 활용하여 보이지 않는 요소가 차지하는 잉여 여백(Gap)을 완전히 제거해 완벽한 대칭형 UI를 유지했습니다.
* **크롬 컴포지터 레이어 충돌**: 다중 글래스모피즘 요소 겹침 시 발생하는 뷰포트 찢어짐 현상을 `transform: translateZ(0)`와 `will-change`를 활용한 GPU 레이어 강제 분리로 해결하여 렌더링 퍼포먼스를 끌어올렸습니다.

---
*Developed by YooBi LEE | QA Engineer & Frontend Developer*