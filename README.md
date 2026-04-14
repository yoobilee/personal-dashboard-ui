# 🚀 YooBi's 2026 Personal Dashboard & Portfolio

> **"QA 엔지니어링의 정밀함을 프론트엔드 개발의 가치로 전환하는 개인화 대시보드"**
> 목표 달성률 시각화와 일정 관리를 위해 설계된 **글래스모피즘(Glassmorphism)** 기반의 고성능 웹 애플리케이션입니다.

🔗 **Live Demo:** [프로젝트 라이브 데모 확인하기](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## ✨ Key Features (주요 기능)

### 1. 🚦 하이브리드 투 트랙(Two-Track) SPA 라우팅
* **Lobby & Workspace 분리**: 진입점(Lobby)과 실제 작업 공간(Dashboard/Portfolio)을 논리적으로 분리한 SPA 구조를 설계했습니다.
* **Hash-based Navigation**: 브라우저의 해시(`#`) 경로를 감지하여 새로고침 시에도 상태를 유지하며, 페이지 간 부드러운 전환을 보장하는 커스텀 라우팅 엔진을 구현했습니다.

### 2. 🍏 iOS 스타일 '다이내믹 아일랜드' 내비게이션
* **Adaptive Interaction**: 스크롤 상태에 따라 위치와 크기가 가변적으로 변하는 내비게이션 바를 구현했습니다. 평소에는 콘텐츠와 조화를 이루다 스크롤 시 상단에 자석처럼 밀착되는 인터랙션을 제공합니다.
* **Glass Reflection Detail**: 로고 호버 시 실제 유리 재질에 빛이 반사되는 듯한 빗금 광채 효과(`::after` 가상 요소 활용)를 적용하여 시각적 완성도를 높였습니다.
* **Haptic-like Feedback**: 마우스 호버 시 미세한 위치 이동과 그림자 확산을 통해 사용자에게 명확한 클릭 가능 여부(Affordance)를 전달합니다.

### 3. 📍 컨텍스트 인지형 스티키 헤더 (Sticky Labels)
* **Real-time Context Tracking**: 사용자가 현재 탐색 중인 섹션의 제목(About, Skills 등)이 화면 상단에 고정되어 정보의 맥락을 즉각적으로 파악할 수 있도록 돕습니다.
* **Advanced Layering**: `backdrop-filter`의 블러 효과를 활용해 고정된 레이블 뒤로 본문이 투영되는 다층적(Layered) 레이아웃을 완성했습니다.

### 4. 🌓 Pure CSS 다크 모드 & Three.js WebGL 배경
* **SVG-free Animation**: 이미지 없이 오직 CSS의 속성 제어만으로 해와 달이 전환되는 고퀄리티 테마 토글 기능을 구현했습니다.
* **Node-based WebGL Field**: Three.js를 활용하여 사용자의 마우스 위치에 반응하는 인터랙티브 노드 연결망 배경을 구축, 정적인 웹에 생동감을 부여했습니다.

### 5. 📋 인터랙티브 칸반 보드 & 스마트 캘린더
* **Drag & Drop Engine**: HTML5 API를 기반으로 카드 이동 시 쫀득한(Bouncy) 플레이스홀더 애니메이션을 적용한 직관적 일정 관리 보드입니다.
* **Multi-Memo System**: 하루에 여러 개의 메모를 독립적인 배열로 관리하며, 달력상에 실시간으로 기록 개수가 업데이트되는 배지 시스템을 탑재했습니다.

### 6. 🌿 커스텀 깃허브 컨트리뷰션 그리드 (GitHub Style)
* **CSS Grid Visualization**: `grid-auto-flow: column` 속성을 활용해 깃허브 특유의 세로 정렬 레이아웃을 완벽히 재현했습니다.
* **Dynamic Date Logic**: JS `Date` 객체를 활용해 현실 시간에 맞춰 영문 월 이름(Apr, May 등)이 자동으로 갱신되는 로직을 구현했습니다.

<br/>

## 🛠️ Tech Stack (기술 스택)

<div align="center">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
</div>

<br/>

## 💡 What I Learned (트러블 슈팅 및 인사이트)

* **브라우저 기본 UI 제약 극복**: 표준 `<select>` 태그의 디자인 한계를 극복하기 위해 이벤트 버블링 제어(`stopPropagation`)를 활용한 커스텀 드롭다운을 구현하며 디자인 일관성을 확보했습니다.
* **복합 스크롤 환경의 이벤트 최적화**: 스냅 스크롤(Scroll Snap) 컨테이너 내부에서 발생하는 스크롤 이벤트를 정밀하게 감지하여 페이지네이션(Scroll Spy)과 플로팅 내비게이션의 전환 로직을 안정화했습니다.
* **다이내믹 UI의 정밀 좌표 설계**: `fixed` 포지션 요소가 스크롤 뎁스에 따라 특정 위치로 '빨려 들어가는' 이동 궤적을 설계하며, `transition`과 물리적 애니메이션 임계값(Threshold) 설정을 최적화했습니다.
* **Z-Index 및 스태킹 컨텍스트 체계화**: 컴포넌트 간 레이어 충돌을 방지하기 위해 화면의 위계를 명확히 재설정하고 유지보수가 용이한 CSS 구조를 확립했습니다.
* **점진적 공개(Progressive Disclosure) 패턴 적용**: 캘린더와 메모장의 노출 비율을 상황에 따라 유동적으로 제어하여 제한된 화면 공간에서의 정보 전달 효율을 극대화했습니다.
* **QA 기반의 예외 처리**: 사용자의 잘못된 경로 진입이나 데이터 누락 상황을 고려한 방어적 프로그래밍을 통해 시스템의 안정성을 높였습니다.

---
*Developed by YooBi LEE* 🙋‍♀️"""