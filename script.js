// 1. HTML에서 '화살표 버튼'과 '두 번째 페이지'를 찾아서 변수에 담아!
const scrollDownBtn = document.querySelector('.scroll-down-indicator');
const secondPage = document.querySelectorAll('.page')[1]; // [1]은 두 번째라는 뜻이야 (0부터 세니까!)

// 2. 화살표 버튼에 '클릭(click)' 이벤트가 발생하는지 귀 기울이고 있어!
scrollDownBtn.addEventListener('click', () => {

    // 3. 클릭하면 두 번째 페이지로 부드럽게(smooth) 화면을 굴려줘!
    secondPage.scrollIntoView({ behavior: 'smooth' });

});

// ==========================================
// 1. 대상을 찾는다!
// ==========================================
const addBtn = document.querySelector('.add-btn'); // 아까 만든 버튼
const todoColumn = document.querySelectorAll('.column')[0]; // 기둥 3개 중에 첫 번째(To Do) 기둥!

// ==========================================
// 2. 감시한다! (버튼을 클릭하면 아래 함수를 실행해!)
// ==========================================
addBtn.addEventListener('click', () => {
  
  // 브라우저에 기본으로 있는 팝업창을 띄워서 사용자에게 글자를 입력받아!
  const taskText = prompt('새로운 일정을 입력하세요 (예: 깃허브 잔디 심기)');

  // ⭐️ QA 방어 로직: 만약 사용자가 '취소'를 누르거나 빈칸만 입력했다면? 
  // 아무 일도 하지 말고 그냥 종료(return)해버려! (버그 방지)
  if (!taskText || taskText.trim() === '') {
    return; 
  }

  // ==========================================
  // 3. 명령한다! (입력받은 글자로 새 카드를 조립해서 넣어라!)
  // ==========================================
  
  // 백틱(``)을 쓰면 HTML 코드 안에 자바스크립트 변수(${taskText})를 쏙 끼워 넣을 수 있어!
  const newCardHTML = `
    <div class="task-card">
        <button class="delete-btn">×</button> <span class="tag">신규</span>
        <p class="task-title">${taskText}</p>
    </div>
  `;

  // To Do 기둥의 맨 끝(beforeend)에 방금 조립한 새 카드 코드를 찰싹 붙여라!
  todoColumn.insertAdjacentHTML('beforeend', newCardHTML);

});

// ==========================================
// ⭐️ 대망의 카드 삭제 기능 (이벤트 위임 + 안전장치)
// ==========================================

const boardContainer = document.querySelector('.board-container');

boardContainer.addEventListener('click', (event) => {
  
  // 1. 클릭한 게 'delete-btn'이 맞는지 확인
  if (event.target.classList.contains('delete-btn')) {
    
    // ⭐️ QA 방어 로직: 진짜 지울 건지 한 번 더 물어보기!
    // confirm 창에서 '확인(true)'을 눌렀을 때만 아래 코드 실행
    const isConfirmed = confirm('정말 이 일정을 삭제하시겠습니까? 🗑️');
    
    if (isConfirmed) {
      // 확인을 눌렀다면 해당 카드를 찾아서 통째로 날려버려!
      const cardToRemove = event.target.closest('.task-card');
      cardToRemove.remove();
    }
    // 취소를 누르면? 아무 일도 안 일어나고 팝업만 닫힘!
    
  }
});

// ==========================================
// ⭐️ 드래그 앤 드롭 마법!
// ==========================================

const columns = document.querySelectorAll('.column'); // To Do, Doing, Done 기둥 3개 다 찾기

// 1. 카드에 드래그 능력을 부여하는 함수 만들기
function addDragEvents(card) {
  // 마우스로 카드를 꾹 쥐었을 때
  card.addEventListener('dragstart', () => {
    card.classList.add('dragging'); // CSS에서 만든 반투명 옷 입히기
  });

  // 마우스에서 손을 뗐을 때
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging'); // 반투명 옷 벗기기
  });
}

// 2. 처음에 HTML에 만들어둔 샘플 카드들에게 드래그 능력 부여!
const existingCards = document.querySelectorAll('.task-card');
existingCards.forEach(card => {
  addDragEvents(card);
});

// 3. 기둥(Column)들이 카드를 받아들이도록 설정하기
columns.forEach(column => {
  // 카드가 기둥 위를 지나갈 때
  column.addEventListener('dragover', (event) => {
    event.preventDefault(); // ⭐️ [핵심 방어막] 원래 브라우저는 요소가 겹치는 걸 튕겨내는데, 그걸 허락해 주는 마법!
    
    const draggingCard = document.querySelector('.dragging'); // 지금 공중에 떠 있는 그 카드 찾기
    column.appendChild(draggingCard); // 내 기둥의 맨 밑에 찰싹 붙여라!
  });
});