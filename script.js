/**
 * [Phase 1] 초기 세팅 및 데이터 불러오기
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 기존 데이터 불러오기
    loadTasks();

    // 2. 2026년 연간 진행률 계산기 함수 정의
    function updateYearProgress() {
        const now = new Date(); // 현재 시간
        const year = now.getFullYear();

        // 올해의 시작일 (1월 1일)과 내년의 시작일 계산
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);

        // 진행률 계산
        const progress = ((now - start) / (end - start)) * 100;

        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');

        if (fill && text) {
            text.innerText = progress.toFixed(1) + '%';

            // 애니메이션 효과
            setTimeout(() => {
                fill.style.width = progress.toFixed(1) + '%';
            }, 100);
        }
    }

    // 3. ⭐️ 함수를 바로 실행!
    updateYearProgress();
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

/**
 * [Phase 7] 3페이지 유비의 캘린더 & 메모장 구동 로직
 */

const todayDate = new Date(); // 컴퓨터의 진짜 오늘 날짜와 시간을 가져옵니다.
let currentCalYear = todayDate.getFullYear(); // 현재 캘린더가 띄우고 있는 연도를 저장합니다.
let currentCalMonth = todayDate.getMonth(); // 현재 캘린더가 띄우고 있는 월을 저장합니다.

function renderCalendar() { // 캘린더를 화면에 그려주는 함수입니다.
    const titleElement = document.getElementById('calendar-title'); // 달력 제목 태그를 찾아옵니다.
    const datesElement = document.getElementById('calendar-dates'); // 날짜 격자 컨테이너를 찾아옵니다.

    const firstDayOfMonth = new Date(currentCalYear, currentCalMonth, 1); // 이번 달 1일 날짜 객체를 만듭니다.
    const lastDayOfMonth = new Date(currentCalYear, currentCalMonth + 1, 0); // 이번 달 마지막 날짜 객체를 만듭니다.
    const startDayOfWeek = firstDayOfMonth.getDay(); // 이번 달 1일이 무슨 요일인지 숫자로 가져옵니다.
    const totalDaysInMonth = lastDayOfMonth.getDate(); // 이번 달이 총 며칠까지 있는지 알아냅니다.

    titleElement.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월`; // 달력 제목에 연도와 월을 씁니다.
    datesElement.innerHTML = ''; // 이전에 그려놨던 날짜들을 싹 지웁니다.

    const realToday = new Date(); // 하이라이트를 위해 '진짜 오늘 날짜'를 다시 한 번 확인합니다.
    const isThisMonth = (currentCalYear === realToday.getFullYear() && currentCalMonth === realToday.getMonth()); // 지금 보고 있는 달력이 현실의 이번 달이 맞는지 검사합니다.

    for (let i = 0; i < startDayOfWeek; i++) { // 1일 시작 전 빈칸 개수만큼 반복합니다.
        const emptySlot = document.createElement('div'); // 빈칸 태그를 만듭니다.
        emptySlot.classList.add('empty'); // 투명하게 설정합니다.
        datesElement.appendChild(emptySlot); // 화면에 집어넣습니다.
    }

    for (let day = 1; day <= totalDaysInMonth; day++) { // 1일부터 마지막 날까지 반복합니다.
        const dateSlot = document.createElement('div'); // 날짜 칸을 만듭니다.
        dateSlot.innerText = day; // 칸에 숫자를 적습니다.

        // ⭐️ [오늘 날짜 하이라이트 기능]
        if (isThisMonth && day === realToday.getDate()) { // 보고 있는 달력이 이번 달이고, 그리는 숫자가 오늘 날짜와 같다면?
            dateSlot.classList.add('today'); // 'today' 클래스를 붙여서 파란색 불을 켭니다!
        }

        // ⭐️ [날짜 클릭 이벤트 (열고 닫기 토글 기능 완벽 적용)]
        dateSlot.addEventListener('click', () => { // 날짜 칸을 마우스로 클릭했을 때 실행되는 구역입니다.
            
            // 1. 방금 유비가 클릭한 날짜가 이미 '선택된 상태(selected)'인지 확인합니다.
            const isAlreadySelected = dateSlot.classList.contains('selected'); 
            
            if (isAlreadySelected) { // 만약 이미 파란 테두리가 쳐진 날짜를 '한 번 더' 누른 거라면? (메모장 닫기 모드)
                
                dateSlot.classList.remove('selected'); // 클릭한 날짜의 파란 테두리를 지워서 선택을 취소합니다.
                
                document.querySelector('.calendar-wrapper').classList.remove('show-memo'); // 캘린더 래퍼에서 'show-memo' 이름표를 떼어서 메모장을 숨기고 달력을 100%로 되돌립니다.
                
            } else { // 선택되지 않은 새로운 날짜를 누른 거라면? (메모장 열기 모드)
                
                // 기존에 선택되어 있던 다른 날짜들의 파란 테두리(selected)를 모두 지워 초기화합니다.
                document.querySelectorAll('.calendar-dates div').forEach(el => el.classList.remove('selected')); 
                
                // 방금 클릭한 새로운 날짜 칸에만 'selected' 클래스를 붙여 파란 테두리를 씌웁니다.
                dateSlot.classList.add('selected'); 
                
                // 캘린더 전체 래퍼에 'show-memo' 이름표를 붙여서 메모장을 스르륵 나타나게 합니다.
                document.querySelector('.calendar-wrapper').classList.add('show-memo'); 
                
                // 우측 메모장 제목을 'OOO년 O월 O일 일정'으로 맞춰서 바꿔줍니다.
                document.getElementById('memo-date-title').innerText = `${currentCalYear}년 ${currentCalMonth + 1}월 ${day}일 일정`; 
                
                // 이 날짜만의 고유 열쇠(Key)를 만듭니다. (예: yoobiMemo_2026_3_9)
                const memoKey = `yoobiMemo_${currentCalYear}_${currentCalMonth}_${day}`; 
                
                // 로컬 스토리지(브라우저 금고)에서 그 열쇠로 저장해 둔 메모가 있는지 찾아옵니다.
                const savedMemo = localStorage.getItem(memoKey); 
                
                // 저장된 메모가 있다면 텍스트창에 띄워주고, 없다면 창을 깨끗하게 비웁니다.
                document.getElementById('memo-input').value = savedMemo ? savedMemo : ''; 
                
                // 저장 버튼이 현재 날짜의 열쇠를 기억하도록 속성(data-key)에 몰래 적어둡니다.
                document.getElementById('save-memo-btn').setAttribute('data-key', memoKey); 
                
            } // 조건문 끝!
        });

        datesElement.appendChild(dateSlot); // 완성된 날짜 칸을 화면에 집어넣습니다.
    }
}

// 초기 실행 및 화살표 버튼 이벤트 (기존과 동일합니다)
document.addEventListener('DOMContentLoaded', () => { renderCalendar(); });

document.getElementById('prev-month').addEventListener('click', () => {
    currentCalMonth--;
    if (currentCalMonth < 0) { currentCalMonth = 11; currentCalYear--; }
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentCalMonth++;
    if (currentCalMonth > 11) { currentCalMonth = 0; currentCalYear++; }
    renderCalendar();
});

// ⭐️ [메모장 저장 버튼 이벤트 추가]
document.getElementById('save-memo-btn').addEventListener('click', () => { // 메모 저장하기 버튼을 클릭하면 실행됩니다.
    const btn = document.getElementById('save-memo-btn'); // 클릭된 버튼을 가져옵니다.
    const memoKey = btn.getAttribute('data-key'); // 날짜 클릭 시 버튼에 숨겨뒀던 고유 열쇠를 꺼냅니다.

    if (!memoKey) { // 만약 날짜를 클릭하지도 않고 다짜고짜 저장 버튼부터 눌렀다면?
        alert('왼쪽 달력에서 날짜를 먼저 선택해주세요! 📅'); // 경고창을 띄웁니다.
        return; // 아래 코드는 무시하고 함수를 끝냅니다.
    }

    const memoText = document.getElementById('memo-input').value; // 텍스트 창에 유비가 적은 글씨를 통째로 가져옵니다.
    localStorage.setItem(memoKey, memoText); // 로컬 스토리지 금고에 열쇠와 내용을 짝지어 영구 저장합니다.
    alert('이 날의 일정이 성공적으로 저장되었습니다! 💾'); // 저장 완료 안내창을 띄웁니다.
});