# 🚀 YooBi's 2026 Personal Dashboard

> **"QA Engineer에서 Frontend Developer로의 도약을 기록하는 나만의 관제탑"** > 
> 목표 달성률을 시각화하고, 매일의 일정을 관리하기 위해 제작한 **글래스모피즘(Glassmorphism)** 기반의 개인 대시보드 웹 애플리케이션입니다.

🔗 **Live Demo:** [유비의 대시보드 보러가기](https://yoobilee.github.io/여기에-리포지토리-이름-입력)

<br/>

## ✨ Key Features (주요 기능)

### 1. 🌓 Pure CSS 다크 모드 토글 (Day & Night)
* 이미지(SVG/PNG) 없이 **오직 CSS만으로 구현**한 고퀄리티 해/달 전환 애니메이션
* 우측 상단 고정 배치(`position: fixed`)로 언제든 접근 가능
* `localStorage`를 활용해 사용자의 테마 설정(Light/Dark) 영구 기억

### 2. 📊 다이내믹 아일랜드 스타일 연간 진행률 바
* 현재 날짜를 계산해 **2026년 한 해의 달성률을 실시간으로 보여주는 Progress Bar**
* 첫 페이지(로드맵) 상단에 다이내믹 아일랜드 스타일로 배치(`position: absolute`)하여 공간 활용도와 트렌디한 UI 감각 극대화

### 3. 📋 Drag & Drop 칸반 보드 (Kanban Board)
* To Do, Doing, Done 3단계로 일정을 관리하는 직관적인 보드
* HTML5 Drag and Drop API를 활용한 부드러운 카드 이동
* `localStorage`와 연동하여 새로고침해도 할 일 데이터와 위치 완벽 보존

### 4. 💎 트렌디한 UI/UX (Glassmorphism)
* 반투명한 배경과 `backdrop-filter`를 활용한 세련된 유리 질감 디자인
* 토스(Toss) 스타일의 맑은 블루 톤과 깊고 영롱한 다크 네이비 테마 적용

<br/>

## 🛠️ Tech Stack (기술 스택)

<div align="center">
  
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
  
  <br/>

  <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  <img src="https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages" />
  
</div>

<br/>

## 💡 What I Learned (개발 주안점 및 트러블 슈팅)

* **레이아웃 겹침 해결:** `position: fixed` 요소(다크모드 스위치)와 본문 콘텐츠 간의 Z-index 및 여백 충돌 문제를 패딩 조절로 해결했습니다.
* **JS DOM 제어와 생명주기:** 이벤트 리스너(`DOMContentLoaded`) 내에서의 함수 호출 타이밍 이슈를 디버깅하며 브라우저 렌더링 순서에 대한 이해도를 높였습니다.
* **상태 유지:** 데이터베이스(SQL) 없이 브라우저의 로컬 스토리지만을 활용하여 사용자 설정과 데이터를 유지하는 클라이언트 사이드 데이터 관리 방법을 터득했습니다.

---
*Developed by YooBi LEE (유비)* 🙋‍♀️