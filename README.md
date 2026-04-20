# 🚀 YooBi's 2026 Personal Dashboard & Portfolio

> **"QA 엔지니어링의 정밀함과 프론트엔드 개발의 감각을 결합한 통합 관리 시스템"**
> 
> 성능 최적화와 유지보수성을 위해 전면적인 CSS 리팩토링과 렌더링 엔진 최적화를 거친 글래스모피즘(Glassmorphism) 기반의 하이엔드 웹 애플리케이션입니다.

🔗 **Live Demo:** [프로젝트 라이브 데모 확인하기](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## 💎 Core Value: QA-Driven Development
본 프로젝트는 **'QA의 눈으로 코드를 짜고 검증한다'**는 철학을 바탕으로 개발되었습니다. 2년 2개월간 현대오토에버 CCS/CCI 통합 프로젝트 등을 수행하며 쌓은 품질 관리 역량을 프론트엔드 최적화 로직으로 승화시켰습니다.

* **Performance Precision**: 단순 평균이 아닌 **90분위수(P90)**를 고려한 렌더링 최적화 및 Google Colab 기반의 데이터 시각화 분석 기법 적용.
* **Defensive Programming**: 경계값 분석(BVA) 및 입력 보안 가이드라인을 적용하여 데이터 무결성을 확보하는 방어적 로직 구현.
* **UI/UX Integrity**: 1px의 오차와 렌더링 딜레이를 허용하지 않는 QA 특유의 집요함으로 하이엔드 인터랙션 마감 처리.

<br/>

## ✨ Key Features (주요 기능)

### 1. 하이브리드 투 트랙(Two-Track) SPA 엔진
* **Lobby & Workspace 분리**: 진입점(Lobby)과 실제 작업 공간(Dashboard/Portfolio)을 논리적으로 분리하여 사용자 목적에 맞는 화면을 제공합니다.
* **Hash-based Navigation**: 브라우저의 해시 경로를 감지하여 새로고침 시에도 사용자가 보던 상태를 완벽히 유지하는 커스텀 라우팅 시스템을 구축했습니다.

### 2. 커리어 로드맵 (Roadmap Tracker)
* **SVG Animation**: IntersectionObserver와 CSS 애니메이션을 활용한 SVG 곡선 로드맵 렌더링을 구현했습니다.
* **Data Tracking**: localStorage를 활용하여 사용자의 진행 달성도를 실시간 퍼센트로 시각화하고 세션 간 상태를 유지합니다.

### 3. 고도화된 인터랙티브 칸반 보드
* **Sticky Header UI**: 할 일 추가 버튼과 컬럼 제목을 상단에 고정하고 카드 리스트만 독립적으로 스크롤되는 전용 바구니 구조를 설계했습니다.
* **Drag & Drop Engine**: HTML5 API를 기반으로 카드 이동 시 쫀득한 플레이스홀더 애니메이션을 적용하여 직관적인 UX를 제공합니다.
* **Data Persistence**: 데이터 변경 사항이 로컬 스토리지와 실시간 동기화되어 안전하게 보존됩니다.

### 4. 스마트 캘린더 & 3D 슬라이드 메모장
* **Dynamic Badge System**: 날짜별 메모 개수를 실시간으로 감지하여 달력 위에 알림 배지를 표시하며 데이터 유무를 시각적으로 전달합니다.
* **Progressive Disclosure**: 날짜 클릭 시 메모장이 부드럽게 3D 슬라이드로 등장하며 달력 컨테이너와 7:3 비율로 공간을 동적으로 분할하는 애니메이션을 구현했습니다.

### 5. 지식 보관소 & 대시보드 벤토 그리드
* **Bento Grid Layout**: 필터링 애니메이션이 적용된 반응형 벤토 그리드 레이아웃을 통해 정보 밀도가 높고 균형 잡힌 화면 구성을 실현했습니다.
* **Smart Briefing**: 단순한 D-Day 숫자 표기를 넘어 localStorage와 연동하여 가장 가까운 일정의 제목을 실시간으로 브리핑하는 지능형 카드를 구현했습니다.

### 6. iOS 스타일 '다이내믹 아일랜드' 내비게이션
* **Adaptive Pill UI**: 스크롤 상태를 감지하여 위치와 크기가 가변적으로 변하는 내비게이션 바를 구현했습니다.
* **High-End Glass Reflection**: 마우스 위치를 1:1로 정밀하게 추적하여 버튼 표면에 창문 조명이 맺히는 듯한 리얼한 유리 반사광 효과를 적용했습니다.
* **Toss Blue Interaction**: 호버 시 투명한 유리가 토스 시그니처 블루(#3182f6) 컬러로 부드럽게 물들며 강렬한 시각적 피드백을 제공합니다.

### 7. 하이엔드 다크 모드 & WebGL 배경 엔진
* **Interactive Background**: Portfolio 모드의 유기적인 신경망과 Dashboard 모드의 질서 정연한 매트릭스 그리드가 탭 전환 시 상호 변환되는 WebGL 엔진을 구축했습니다.
* **Morphing & Elasticity**: 입자들이 타겟 좌표로 부드럽게 재정렬되는 Lerp 애니메이션과 마우스 반응에 따라 탄성 있게 움직이는 인터랙션을 구현했습니다.
* **Neon Boost Logic**: 다크 모드 시 Three.js 노드 연결 선의 밝기를 증폭시켜 선명한 가시성을 확보했습니다.

### 8. 커스텀 깃허브 잔디밭 & 디자인 시스템
* **Custom Grid Layout**: CSS Grid를 활용해 깃허브 특유의 세로 정렬 레이아웃을 재현했습니다.
* **Consistent Design Language**: 전체 톤앤매너를 일관된 투명 유리 질감과 시그니처 블루 컬러로 통일하여 브랜드 정체성을 강화했습니다.

<br/>

## 🛠️ Tech Stack (기술 스택)

<div align="center">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Google%20Colab-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white" alt="Google Colab" />
</div>

<br/>

## 💡 Engineering & QA Insight (엔지니어링 & 트러블슈팅)

### 🏗️ Architecture & Optimization
* **CSS Architecture Refactoring**: 유지보수성을 극대화하기 위해 파편화된 다크모드 코드를 컴포넌트 단위로 응집시키고 논리적인 그룹화를 진행했습니다.
* **복합 스크롤 환경의 이벤트 최적화**: 스냅 스크롤 컨테이너 내부의 이벤트를 정밀하게 감지하여 내비게이션 상태 전환 로직을 안정화했습니다.
* **QA 기반의 방어적 프로그래밍**: 리팩토링 후 발생할 수 있는 레이아웃 무너짐이나 텍스트 시인성 이슈를 전수 조사하고 수정하여 UI 안정성을 확보했습니다.

### 🐛 Deep Dive: Troubleshooting & Experience
**1. 렌더링 성능 최적화 및 버그 해결**
* **크롬 컴포지터 레이어 충돌**: 다중 글래스모피즘 요소 겹침 시 발생하는 뷰포트 찢어짐 현상을 `transform: translateZ(0)`와 `will-change`를 활용한 GPU 레이어 강제 분리로 해결했습니다.
* **비동기 데이터 정밀 제어**: 실무에서 체득한 '타이머 로직과 UI 액션 간의 불일치' 방지 기술을 적용하여, 1초 단위의 렌더링 딜레이까지 잡아내는 정밀한 상태 관리를 구현했습니다.

**2. 실무 커리어 기반의 품질 검증 성과**
* **컴즈(주) | 현대자동차 통합모바일 서비스**: P90 지표 도입 및 Google Colab 데이터 분석을 통한 성능 리포트 고도화로 시스템 성능 기준점 재수립 기여.
* **(주)와이즈와이어즈 | 현대오토에버 CCS/CCI 프로젝트**: 로그 분석을 통한 데이터 무결성 이슈 조기 발견 및 실차 평가 기반의 연동 안정성 확보.
* **가상화폐 플랫폼 Flipster**: API 환경 조작을 통한 데이터 기반 테스트(DDT) 수행 및 래더 페이지 정렬 로직 결함 발견.

---
*Developed by YooBi LEE | QA Engineer & Frontend Developer*