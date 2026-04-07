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
* HTML5 Drag and Drop API를 활용한 부드러운 카드 이동
* `localStorage`와 연동하여 새로고침해도 할 일 데이터와 위치 완벽 보존

### 4. 📅 반응형 글래스모피즘 캘린더 & 동적 메모장
* 바닐라 JS로 직접 렌더링하는 **글래스모피즘(Glassmorphism)** 스타일의 달력
* 날짜 클릭 시 **점진적 공개(Progressive Disclosure)** 패턴을 적용하여 메모장이 7:3 비율로 부드럽게 등장
* 깜빡임(Layout Thrashing)과 텍스트 찌그러짐을 방지한 최적화된 CSS 애니메이션 적용
* `localStorage`를 활용한 날짜별 개별 메모 저장 및 불러오기 기능

### 5. 🚀 Narrative UX: Launch Sequence & Aura Glow (New!)
* **Aura Glow Interaction**: 2026 디자인 트렌드인 '후광 효과(Aura)'를 적용하여 마우스 호버 시 버튼 뒤에서 은은한 빛이 뿜어져 나오는 역동적인 인터랙션 구현
* **System Booting Logs**: QA 엔지니어의 정체성을 담아, 대시보드 진입 시 시스템 초기화 및 버그 스캔 로그가 출력되는 시각적 서사 부여
* **Three.js Background**: WebGL 기반의 살아 숨 쉬는 노드 연결망 배경을 구축하여 마우스 위치에 따른 유동적인 입자 인터랙션 제공

### 6. 🕹️ Developer Admin Mode (Console Control)
* 브라우저 콘솔창에서 `toggleAdminMode(false)` 명령어를 통해 시스템 시퀀스 사용 여부를 실시간으로 제어할 수 있는 어드민 디버깅 기능 탑재

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

* **사용자 경험(UX)에 서사 부여**: 단순한 페이지 전환을 넘어 시스템 가동 로그를 통해 개발자의 백그라운드(QA)를 사용자에게 효과적으로 전달하는 스토리텔링 UX를 구현했습니다.
* **점진적 공개(Progressive Disclosure) UI 구현**: 캘린더와 메모장의 노출 비율을 `flex`와 CSS 애니메이션으로 제어하여, 화면 공간을 효율적으로 사용하고 사용자 경험(UX)을 개선했습니다.
* **전역 상태 제어 및 디버깅**: `window` 객체를 활용해 콘솔에서 특정 UI 시퀀스를 토글하는 어드민 제어 로직을 구현하여 개발 및 테스트 효율성을 높였습니다.
* **렌더링 최적화(Layout Thrashing 방지)**: `display: none`과 `flex` 전환 시 발생하는 0.1초 깜빡임 버그와 텍스트 줄바꿈 현상을 `width`, `opacity`, `white-space` 속성을 조합한 애니메이션으로 매끄럽게 해결했습니다.
* **상태 유지**: 외부 데이터베이스 없이 브라우저의 로컬 스토리지만을 활용하여 사용자 설정(다크모드)과 데이터(칸반, 캘린더 메모)를 유지하는 클라이언트 사이드 데이터 관리 방법을 터득했습니다.

---

*Developed by YooBi LEE (유비)* 🙋‍♀️