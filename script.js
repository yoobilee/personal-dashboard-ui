/**
 * [Phase 1] 초기 세팅 및 데이터 불러오기
 */
document.addEventListener('DOMContentLoaded', () => {
    // 페이지가 열리자마자 브라우저 금고(LocalStorage)에서 데이터를 꺼내와 화면에 뿌립니다.
    loadTasks();
});

// 1. 화살표 버튼 클릭 시 부드럽게 스크롤 이동 (기존 기능 유지)
const scrollDownBtn = document.querySelector('.scroll-down-indicator');
const secondPage = document.querySelectorAll('.page')[1];

scrollDownBtn.addEventListener('click', () => {
    secondPage.scrollIntoView({ behavior: 'smooth' });
});

/**
 * [Phase 2] 할 일(Task) 관리 핵심 로직
 */

// 2. 새로운 할 일 추가 버튼 클릭
const addBtn = document.querySelector('.add-btn');
addBtn.addEventListener('click', () => {
    const taskText = prompt('새로운 일정을 입력하세요 (예: 깃허브 잔디 심기)');

    // QA 방어 로직: 입력값이 없으면 무시
    if (!taskText || taskText.trim() === '') return;

    // 카드를 생성하여 'To Do' 기둥(0번)에 넣고 저장합니다.
    createTaskCard(taskText, 0);
    saveTasks(); 
});

// 3. ⭐️ 카드 생성 함수 (중복 코드를 줄이고 저장/삭제 기능을 통합 관리합니다.)
function createTaskCard(text, columnIndex) {
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true'); // 드래그 가능하게 설정
    
    // 카드 내용 조립 (유비님이 기획한 신규 태그와 텍스트)
    card.innerHTML = `
        <button class="delete-btn">×</button>
        <span class="tag">신규</span>
        <p class="task-title">${text}</p>
    `;

    // [삭제 기능 연결]
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('정말 이 일정을 삭제하시겠습니까? 🗑️')) {
            card.remove();
            saveTasks(); // 삭제 후 금고 최신화
        }
    });

    // [드래그 이벤트 연결]
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        saveTasks(); // 이동이 끝난 후 금고 최신화
    });

    // 지정된 기둥(index)에 카드를 꽂습니다.
    const columns = document.querySelectorAll('.column');
    columns[columnIndex].appendChild(card);
}

/**
 * [Phase 3] 브라우저 금고(LocalStorage) 시스템
 */

// 4. ⭐️ 저장 함수: 현재 모든 기둥의 할 일 목록을 텍스트로 저장합니다.
function saveTasks() {
    const columns = document.querySelectorAll('.column');
    const taskData = [[], [], []]; // [todo, doing, done] 데이터를 담을 바구니

    columns.forEach((column, index) => {
        const titles = column.querySelectorAll('.task-title');
        titles.forEach(title => {
            taskData[index].push(title.innerText); // 각 기둥의 글자만 추출해서 저장
        });
    });

    // 브라우저 로컬 저장소에 'yoobiTasks'라는 이름으로 저장 (문자열 형태로 변환)
    localStorage.setItem('yoobiTasks', JSON.stringify(taskData));
}

// 5. ⭐️ 로드 함수: 저장된 데이터를 바탕으로 카드를 다시 그려냅니다.
function loadTasks() {
    const savedData = localStorage.getItem('yoobiTasks');
    if (!savedData) return; // 저장된 게 없으면 종료

    const taskData = JSON.parse(savedData); // 문자열을 다시 배열로 변환
    
    // 화면에 기본으로 있던 샘플 카드들을 지우고 시작 (중복 방지)
    document.querySelectorAll('.task-card').forEach(card => card.remove());

    // 데이터 바구니를 열어 각 기둥에 맞게 카드를 복구합니다.
    taskData.forEach((columnTasks, columnIndex) => {
        columnTasks.forEach(text => {
            createTaskCard(text, columnIndex);
        });
    });
}

/**
 * [Phase 4] 드래그 앤 드롭 배경 로직
 */
const columns = document.querySelectorAll('.column');
columns.forEach(column => {
    column.addEventListener('dragover', (event) => {
        event.preventDefault(); // 드롭을 허용하는 필수 방어막
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            column.appendChild(draggingCard);
        }
    });
});

/**
 * [Phase 5] 스타일리시 다크 모드 스위치 연동
 */
const themeCheckbox = document.getElementById('theme-checkbox');
const body = document.body;

// 1. 금고(LocalStorage)에서 이전 테마 설정 꺼내오기
const savedTheme = localStorage.getItem('yoobiTheme');

// 2. 만약 이전에 다크모드를 켰었다면? 화면을 까맣게 만들고 스위치도 '켬' 상태로 변경!
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeCheckbox) {
        themeCheckbox.checked = true; // 스위치를 오른쪽(달🌙)으로 이동
    }
}

// 3. 스위치를 클릭(change)할 때마다 동작
if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
        if (themeCheckbox.checked) {
            // 스위치 켜짐 -> 다크모드 실행 및 저장
            body.classList.add('dark-mode');
            localStorage.setItem('yoobiTheme', 'dark');
        } else {
            // 스위치 꺼짐 -> 라이트모드로 복귀 및 저장
            body.classList.remove('dark-mode');
            localStorage.setItem('yoobiTheme', 'light');
        }
    });
}