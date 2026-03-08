# 🚀 나만의 일정 관리 대시보드 (My Kanban Dashboard)

## 💡 프로젝트 소개
단순한 이력서를 넘어, 저의 프론트엔드 개발자 성장 로드맵과 실제 일정 관리를 하나의 웹 페이지에 담아낸 **'인터랙티브 대시보드'**입니다. 
토스(Toss) 스타일의 깔끔한 UI와 글래스모피즘(Glassmorphism) 디자인을 적용하여 사용자 경험(UX)을 극대화했습니다.

## 🛠 기술 스택
- **Front-end:** HTML5, CSS3, Vanilla JavaScript (프레임워크 없이 순수 JS로 구현)
- **Design:** CSS Flexbox, Scroll Snap, Keyframes Animation

## ✨ 핵심 기능 (Key Features)

**1. 인터랙티브 로드맵 (Scroll Snap & Timeline)**
- 스크롤 한 번에 화면이 전환되는 풀페이지 스크롤(Scroll Snap) 적용
- 가로형 타임라인으로 퇴사부터 취업까지의 목표를 시각화

**2. 칸반 보드 (Kanban Board)**
- **Create:** 팝업(`prompt`)을 활용한 직관적인 새로운 할 일 추가
- **Delete:** 이벤트 위임(Event Delegation)을 활용한 동적 요소 삭제 및 `confirm` 안전장치 구현
- **Drag & Drop:** `draggable` 속성과 드래그 이벤트(`dragstart`, `dragover` 등)를 활용하여 To Do ↔ Doing ↔ Done 기둥 간의 자유로운 카드 이동 구현

## 🎯 QA 엔지니어 출신의 시선 (Troubleshooting & Insights)
- **예외 처리:** 빈칸이나 공백만 입력 시 카드가 생성되지 않도록 방어 로직(`trim()`) 추가
- **안전한 삭제 UX:** 실수로 데이터를 날리지 않도록 삭제 버튼 클릭 시 경고창 띄우기
- **이벤트 최적화:** 동적으로 추가되는 카드들에 일일이 이벤트를 달지 않고, 부모 요소에 '이벤트 위임'을 적용하여 메모리 낭비 방지