# YooBi's Personal Dashboard & Portfolio

> QA 엔지니어의 꼼꼼한 시선으로, 버그가 없는 코드를 짜는 개발자를 목표로 합니다.

🔗 **Live Demo:** [yoobilee.github.io/personal-dashboard-ui](https://yoobilee.github.io/personal-dashboard-ui/)

<br/>

## 소개

QA Engineer에서 Frontend Developer로의 전환 과정을 담은 개인 포트폴리오 겸 실사용 대시보드입니다. 단순한 이력서 페이지가 아니라, 실제로 매일 쓰는 칸반 보드·캘린더·메모·지식 아카이브를 하나의 SPA로 통합했습니다.

토스 디자인 시스템의 영향을 받은 글라스모피즘 UI와 Three.js 기반 인터랙티브 배경을 결합해, 포트폴리오로서의 시각적 완성도와 실용적인 대시보드 기능을 함께 추구했습니다.

<br/>

## 기술 스택

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)

외부 라이브러리 없이 Vanilla JS + Three.js만으로 구현했습니다.

<br/>

## 주요 기능

### 포트폴리오 메인화면 (`#home`)
두 개의 탭으로 구성된 진입점입니다. 탭 전환 시 배경 Orb 그라데이션이 사르르 교체됩니다.

- **PORTFOLIO 탭** — 이름·소개·CTA 버튼으로 구성된 미니멀 타이포 레이아웃. 우측에 Three.js로 구현한 유리 재질 구체가 천천히 자전합니다.
- **SYSTEM DASHBOARD 탭** — 시계·연도 달성률·진행 중 할 일·D-Day·커리어 로드맵을 한눈에 보여주는 벤토 그리드 브리핑.

### 포트폴리오 페이지 (`#portfolio`)
스크롤 기반 포트폴리오 페이지입니다. iOS Dynamic Island 스타일 네비게이션 바가 스크롤 위치에 따라 크기와 내용이 변합니다.

- Hero / About / Skills / Experience / Projects / Footer 구성
- Intersection Observer 기반 스크롤 reveal 애니메이션

### 대시보드 (`#dashboard`)

**1페이지 — 커리어 로드맵**
SVG 곡선 위에 7단계 항로를 배치한 로드맵. 단계 클릭 시 완료 처리되고, 달성률이 상단 바와 사이드바에 실시간 반영됩니다.

**2페이지 — 칸반 보드**
드래그 앤 드롭으로 카드를 이동할 수 있는 칸반 보드. 진행 중 카드 수가 대시보드 메인화면 벤토 그리드와 동기화됩니다. 우선순위 설정·카드 상세 모달 지원.

**3페이지 — 캘린더 & 메모**
월간 달력에서 날짜 선택 시 메모장이 슬라이드 인. 메모와 타임라인 일정을 탭으로 전환. 날짜별 데이터는 localStorage에 독립적으로 저장됩니다.

**4페이지 — Knowledge Archive**
공부하며 참고한 자료를 모아두는 링크 아카이브. Linear 스타일 리스트 테이블 레이아웃으로 카테고리 필터 지원.

<br/>

## 구현 포인트

**Hash 라우팅 & 상태 유지**
`window.location.hash`를 감지해 페이지 전환을 처리하며, 새로고침 후에도 마지막 위치를 복원합니다. 다크모드 테마는 localStorage를 통해 resume.html까지 포함한 모든 페이지에서 동기화됩니다.

**글라스모피즘 렌더링 최적화**
다중 글라스 요소가 겹칠 때 발생하는 크롬 컴포지터 레이어 충돌을 `transform: translateZ(0)` + `will-change`로 GPU 레이어를 분리해 해결했습니다.

**데이터 무결성**
로컬 스토리지 키를 `yoobiTasks_v2`로 통합하고, DOM과 State 간 불일치로 발생하는 유령 데이터 현상을 추적해 카운트 로직을 교정했습니다.

**WebKit 렌더링 버그 대응**
`background-clip: text`와 `display: flex` 혼용 시 텍스트 바운딩 박스가 잘리는 Chrome/Safari 버그를 `isolation: isolate`로 우회했습니다.

<br/>

---

*Developed by YooBi LEE · QA Engineer → Frontend Developer*