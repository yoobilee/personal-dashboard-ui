/**
 * [Phase 1] 초기 세팅 및 데이터 불러오기
 */ // [Phase 1] 초기 세팅 및 데이터 불러오기 구역입니다.
document.addEventListener('DOMContentLoaded', () => { // HTML 문서가 완전히 로드되면 내부 코드를 실행합니다.
    loadTasks(); // 저장된 할 일 데이터가 있다면 불러오는 함수를 실행합니다.

    function updateYearProgress() { // 2026년 진행률을 계산하는 함수를 정의합니다.
        const now = new Date(); // 현재 시간과 날짜 정보를 가져옵니다.
        const year = now.getFullYear(); // 현재 연도(예: 2026)를 가져옵니다.
        const start = new Date(year, 0, 1); // 올해 1월 1일의 날짜 객체를 생성합니다.
        const end = new Date(year + 1, 0, 1); // 내년 1월 1일의 날짜 객체를 생성합니다.
        const progress = ((now - start) / (end - start)) * 100; // 1년 중 현재까지 지난 시간을 백분율(%)로 계산합니다.

        const fill = document.getElementById('progress-fill'); // 게이지바의 채워지는 부분을 담당하는 HTML 요소를 가져옵니다.
        const text = document.getElementById('progress-text'); // 진행률 숫자가 적히는 HTML 요소를 가져옵니다.

        if (fill && text) { // 게이지바와 텍스트 요소가 화면에 정상적으로 존재한다면 내부 코드를 실행합니다.
            text.innerText = progress.toFixed(1) + '%'; // 진행률을 소수점 첫째 자리까지 잘라서 텍스트로 띄워줍니다.
            setTimeout(() => { // 0.1초(100밀리초) 뒤에 애니메이션을 시작하도록 타이머를 설정합니다.
                fill.style.width = progress.toFixed(1) + '%'; // 계산된 진행률만큼 게이지바의 가로 길이를 늘려줍니다.
            }, 100); // 타이머 지연 시간을 100밀리초로 설정합니다.
        } // if문 끝
    } // updateYearProgress 함수 끝

    updateYearProgress(); // 방금 만든 진행률 계산 함수를 즉시 한 번 실행시킵니다.
}); // DOMContentLoaded 이벤트 리스너 끝

const scrollDownBtn = document.querySelector('.scroll-down-indicator'); // 화면 아래로 내려가는 화살표 버튼을 찾습니다.
// ⭐️ 핵심: 전체 페이지가 아니라, '대시보드 뷰' 안에서의 두 번째 페이지(칸반 보드)를 콕 집어옵니다!
const kanbanPage = document.querySelectorAll('#dashboard-view .page')[1];

if(scrollDownBtn && kanbanPage) { // 요소가 화면에 잘 렌더링 된 경우에만 이벤트를 달아줍니다.
    scrollDownBtn.addEventListener('click', () => { // 화살표 버튼을 클릭했을 때 실행할 이벤트를 등록합니다.
        kanbanPage.scrollIntoView({ behavior: 'smooth' }); // 칸반 보드 위치로 스크롤을 아주 부드럽게 스르륵 내립니다.
    }); // 스크롤 이벤트 리스너 끝
}

/**
 * [Phase 2] 할 일(Task) 관리 핵심 로직
 */ // [Phase 2] 할 일 관리 로직 구역입니다.

const addBtn = document.querySelector('.add-btn'); // "새로운 할 일" 버튼입니다.
const taskModal = document.getElementById('task-modal'); // 추가 팝업창 배경입니다.
const cancelBtn = document.getElementById('modal-cancel-btn'); // 추가 팝업창 취소 버튼입니다.
const modalAddBtn = document.getElementById('modal-add-btn'); // 추가 팝업창 확인 버튼입니다.

const deleteModal = document.getElementById('delete-modal'); // 삭제 팝업창 배경입니다.
const deleteCancelBtn = document.getElementById('delete-cancel-btn'); // 삭제 팝업창 취소 버튼입니다.
const deleteConfirmBtn = document.getElementById('delete-confirm-btn'); // 삭제 팝업창 확인(빨간색) 버튼입니다.

let cardToDelete = null; // ⭐️ 어떤 카드를 지울지 임시로 기억해둘 빈 변수(메모장)를 하나 만듭니다!

if(addBtn) { // 버튼이 존재할 때만 이벤트를 답니다.
    addBtn.addEventListener('click', () => { // 버튼 클릭 시 실행됩니다.
        taskModal.style.display = 'flex'; // 추가 모달창을 화면에 띄웁니다.
        document.getElementById('modal-task-input').focus(); // 타자를 바로 칠 수 있게 커서를 둡니다.
    }); // 버튼 클릭 이벤트 끝
}

if(cancelBtn) {
    cancelBtn.addEventListener('click', () => { // 취소 버튼 클릭 시 실행됩니다.
        taskModal.style.display = 'none'; // 모달창을 숨깁니다.
        document.getElementById('modal-task-input').value = ''; // 적어둔 글자를 비웁니다.
    }); // 취소 이벤트 끝
}

if(modalAddBtn) {
    modalAddBtn.addEventListener('click', () => { // 추가 버튼 클릭 시 실행됩니다.
        const taskText = document.getElementById('modal-task-input').value; // 입력칸의 글씨를 가져옵니다.
        if (!taskText || taskText.trim() === '') { // 텅 비어있다면?
            alert('할 일을 입력해 주세요! 📝'); // 경고합니다.
            return; // 함수를 멈춥니다.
        } // 유효성 검사 끝
        createTaskCard(taskText, 0); // 글씨와 0번(To Do)을 넘겨서 화면에 카드를 그립니다.
        saveTasks(); // 변경된 상태를 금고에 저장합니다.
        taskModal.style.display = 'none'; // 모달창을 닫습니다.
        document.getElementById('modal-task-input').value = ''; // 입력칸을 다시 비워둡니다.
    }); // 추가 이벤트 끝
}

if(deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => { // 삭제 모달에서 '취소'를 눌렀을 때 발동합니다.
        deleteModal.style.display = 'none'; // 삭제 모달창을 닫아서 숨깁니다.
        cardToDelete = null; // 기억해뒀던 암살 대상(?) 카드를 머릿속에서 잊어버립니다.
    }); // 삭제 취소 이벤트 끝
}

if(deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', () => { // 삭제 모달에서 '삭제하기(빨간버튼)'를 눌렀을 때 발동합니다.
        if (cardToDelete) { // 만약 지우기로 약속하고 기억해둔 카드가 진짜 있다면?
            cardToDelete.remove(); // 그 카드를 화면에서 가차 없이 날려버립니다.
            saveTasks(); // 카드가 지워져서 비어있는 현재 상태를 로컬 스토리지에 덮어씁니다.
            deleteModal.style.display = 'none'; // 임무가 끝났으니 삭제 모달창을 닫습니다.
            cardToDelete = null; // 다음 타겟을 위해 변수(기억)를 다시 초기화합니다.
        } // 조건문 끝
    }); // 삭제 확인 이벤트 끝
}

function createTaskCard(text, columnIndex) { // 카드를 그리는 함수입니다.
    const card = document.createElement('div'); // 카드 껍데기를 만듭니다.
    card.classList.add('task-card'); // 디자인을 붙입니다.
    card.setAttribute('draggable', 'true'); // 드래그 가능하게 만듭니다.
    card.innerHTML = ` 
        <button class="delete-btn">×</button> 
        <span class="tag">신규</span> 
        <p class="task-title">${text}</p> 
    `; // 카드 안쪽 구조를 조립합니다.

    const deleteBtn = card.querySelector('.delete-btn'); // 만들어진 카드의 X 버튼을 찾습니다.
    deleteBtn.addEventListener('click', () => { // X 버튼을 클릭하면 발동합니다.
        cardToDelete = card; // 지금 사용자가 누른 X 버튼의 부모인 '이 카드'를 지울 타겟으로 기억해둡니다!
        deleteModal.style.display = 'flex'; // 브라우저 기본 경고창 대신 우리가 짠 영롱한 삭제 모달을 띄웁니다!
    }); // 삭제 버튼 리스너 끝

    card.addEventListener('dragstart', () => card.classList.add('dragging')); // 드래그 시작 시 투명해집니다.
    card.addEventListener('dragend', () => { // 드래그 끝날 때 발동합니다.
        card.classList.remove('dragging'); // 투명도를 원래대로 돌립니다.
        saveTasks(); // 옮겨진 위치를 금고에 저장합니다.
    }); // 드래그 이벤트 끝

    const columns = document.querySelectorAll('.column'); // 기둥 3개를 가져옵니다.
    columns[columnIndex].appendChild(card); // 기둥 맨 아래에 카드를 붙입니다.
} // createTaskCard 함수 끝

/**
 * [Phase 3] 브라우저 금고(LocalStorage) 시스템
 */ // [Phase 3] 로컬 스토리지 시스템 구역입니다.
function saveTasks() { // 카드의 현재 상태를 저장하는 함수입니다.
    const columns = document.querySelectorAll('.column'); // 화면에 있는 모든 기둥을 다시 찾아옵니다.
    const taskData = [[], [], []]; // To Do, Doing, Done 카드의 텍스트를 담을 3칸짜리 빈 바구니(이중 배열)를 만듭니다.
    columns.forEach((column, index) => { // 각각의 기둥들을 하나씩 순서대로 꺼내어 확인합니다.
        const titles = column.querySelectorAll('.task-title'); // 현재 확인 중인 기둥 안에 있는 모든 카드의 제목 요소들을 찾습니다.
        titles.forEach(title => { // 찾아낸 제목 요소들을 또 하나씩 순서대로 확인합니다.
            taskData[index].push(title.innerText); // 제목에 적혀있는 진짜 글자만 쏙 빼서 해당 기둥 번호의 바구니에 밀어 넣습니다.
        }); // 제목 순회 끝
    }); // 기둥 순회 끝
    localStorage.setItem('yoobiTasks', JSON.stringify(taskData)); // 가득 찬 이중 배열 바구니를 문자열로 압축하여 로컬 스토리지 금고에 넣습니다.
} // saveTasks 함수 끝

function loadTasks() { // 금고에 저장된 데이터를 가져와 화면에 복원하는 함수입니다.
    const savedData = localStorage.getItem('yoobiTasks'); // 브라우저 금고에서 데이터를 꺼내옵니다.
    if (!savedData) return; // 만약 금고가 비어있다면 함수를 여기서 멈춥니다.
    const taskData = JSON.parse(savedData); // 문자열로 압축되어 있던 데이터를 배열로 풉니다.
    document.querySelectorAll('.task-card').forEach(card => card.remove()); // 화면에 임시로 떠 있던 하드코딩 카드들을 모두 날려버립니다.
    taskData.forEach((columnTasks, columnIndex) => { // 풀려난 배열 바구니 3개를 하나씩 확인합니다.
        columnTasks.forEach(text => { // 각 기둥 바구니 안에 들어있는 할 일 글자들을 하나씩 꺼냅니다.
            createTaskCard(text, columnIndex); // 꺼낸 글자와 기둥 번호를 전달하여 카드를 만들고 제자리에 꽂아줍니다.
        }); // 할 일 글자 순회 끝
    }); // 기둥 배열 순회 끝
} // loadTasks 함수 끝

/**
 * [Phase 4] 드래그 앤 드롭 배경 로직
 */ // [Phase 4] 드래그 앤 드롭 로직 구역입니다.
const columns = document.querySelectorAll('.column'); // 드래그한 카드를 받아줄 기둥들을 모두 찾아옵니다.
columns.forEach(column => { // 각 기둥에 대해 아래 이벤트를 하나씩 붙여줍니다.
    column.addEventListener('dragover', (event) => { // 누군가 카드를 마우스로 쥔 채로 이 기둥 위를 지나갈 때 발생하는 이벤트입니다.
        event.preventDefault(); // 브라우저 기본 방해 동작을 막습니다.
        const draggingCard = document.querySelector('.dragging'); // 끌려다니는 카드를 찾습니다.
        if (draggingCard) { // 끌려다니는 카드가 있다면
            column.appendChild(draggingCard); // 그 카드를 지금 마우스가 올라가 있는 기둥의 맨 아래쪽으로 옮겨버립니다.
        } // if문 끝
    }); // dragover 이벤트 리스너 끝
}); // columns 순회 끝

/**
 * [Phase 5] 스타일리시 다크 모드 스위치 연동
 */ // [Phase 5] 다크 모드 스위치 연동 구역입니다.
const themeCheckbox = document.getElementById('theme-checkbox'); // 화면 우측 상단의 다크모드 스위치를 찾아옵니다.
const body = document.body; // 전체 화면 배경색을 바꾸기 위해 body 태그를 통째로 가져옵니다.
const savedTheme = localStorage.getItem('yoobiTheme'); // 사용자가 이전에 다크모드를 켰는지 기록을 찾아봅니다.

if (savedTheme === 'dark') { // 찾아본 기록이 'dark'라면
    body.classList.add('dark-mode'); // 화면 전체 요소에 'dark-mode' 옷을 입혀서 까맣게 만듭니다.
    if (themeCheckbox) themeCheckbox.checked = true; // 스위치를 물리적으로 켠 상태로 변경합니다.
} // if문 끝

if (themeCheckbox) { // 다크모드 스위치 요소가 존재하는 경우에만 이벤트를 붙입니다.
    themeCheckbox.addEventListener('change', () => { // 스위치가 켜지거나 꺼지는 변화가 생겼을 때 실행됩니다.
        if (themeCheckbox.checked) { // 켜진 상태라면
            body.classList.add('dark-mode'); // 까맣게 만듭니다.
            localStorage.setItem('yoobiTheme', 'dark'); // 금고에 저장합니다.
        } else { // 꺼진 상태라면
            body.classList.remove('dark-mode'); // 하얗게 만듭니다.
            localStorage.setItem('yoobiTheme', 'light'); // 금고에 저장합니다.
        } // 조건문 끝
    }); // 스위치 change 이벤트 리스너 끝
} // if문 끝

/**
 * [Phase 7] 3페이지 유비의 캘린더 & 메모장 구동 로직
 */ // [Phase 7] 캘린더 구동 구역입니다.
const todayDate = new Date(); // 오늘 날짜를 가져옵니다.
let currentCalYear = todayDate.getFullYear(); // 캘린더 헤더에 띄울 연도를 저장합니다.
let currentCalMonth = todayDate.getMonth(); // 캘린더 헤더에 띄울 월을 저장합니다.

function renderCalendar() { // 캘린더를 화면에 그려주는 함수입니다.
    const titleElement = document.getElementById('calendar-title'); // 달력 제목 태그를 찾아옵니다.
    const datesElement = document.getElementById('calendar-dates'); // 날짜 숫자칸 격자 부모를 찾아옵니다.

    if(!titleElement || !datesElement) return; // 요소가 없으면 실행을 멈춥니다.

    const firstDayOfMonth = new Date(currentCalYear, currentCalMonth, 1); // 현재 띄울 달력의 1일 날짜 객체입니다.
    const lastDayOfMonth = new Date(currentCalYear, currentCalMonth + 1, 0); // 마지막 날짜 객체입니다.
    const startDayOfWeek = firstDayOfMonth.getDay(); // 그 달 1일이 무슨 요일인지 알아냅니다.
    const totalDaysInMonth = lastDayOfMonth.getDate(); // 이번 달이 총 며칠까지 있는지 확인합니다.

    titleElement.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월`; // 예쁜 달력 제목으로 띄워줍니다.
    datesElement.innerHTML = ''; // 저번 달 달력을 지웁니다.

    const realToday = new Date(); // 현실의 진짜 오늘 날짜를 확인합니다.
    const isThisMonth = (currentCalYear === realToday.getFullYear() && currentCalMonth === realToday.getMonth()); // 지금 그리는 달력이 이번 달인지 판별합니다.

    for (let i = 0; i < startDayOfWeek; i++) { // 빈 요일 칸 개수만큼 뺑뺑이를 돕니다.
        const emptySlot = document.createElement('div'); // 빈칸을 만듭니다.
        emptySlot.classList.add('empty'); // 투명하게 만듭니다.
        datesElement.appendChild(emptySlot); // 끼워 넣습니다.
    } // 빈칸 채우기 끝

    for (let day = 1; day <= totalDaysInMonth; day++) { // 마지막 날까지 뺑뺑이를 돕니다.
        const dateSlot = document.createElement('div'); // 날짜 칸을 만듭니다.
        dateSlot.innerText = day; // 날짜 숫자를 적습니다.

        if (isThisMonth && day === realToday.getDate()) { // 오늘 날짜라면
            dateSlot.classList.add('today'); // 파란색 동그라미 불빛을 켭니다!
        } // 오늘 날짜 검사 끝

        dateSlot.addEventListener('click', () => { // 날짜 클릭 마법입니다.
            const isAlreadySelected = dateSlot.classList.contains('selected'); // 선택된 상태인지 확인합니다.
            if (isAlreadySelected) { // 이미 선택됐다면 (닫기 모드)
                dateSlot.classList.remove('selected'); // 선택을 해제합니다.
                document.querySelector('.calendar-wrapper').classList.remove('show-memo'); // 달력을 다시 넓게 펼칩니다.
            } else { // 새로운 날짜를 누른 거라면 (열기 모드)
                document.querySelectorAll('.calendar-dates div').forEach(el => el.classList.remove('selected')); // 전체 선택을 해제합니다.
                dateSlot.classList.add('selected'); // 지금 누른 칸만 선택합니다.
                document.querySelector('.calendar-wrapper').classList.add('show-memo'); // 메모장이 튀어나오게 합니다.
                
                const memoDateTitle = document.getElementById('memo-date-title');
                if(memoDateTitle) memoDateTitle.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월 ${day}일 일정`; // 메모장 제목 업데이트.

                const memoKey = `yoobiMemo_${currentCalYear}_${currentCalMonth}_${day}`; // 날짜 고유 열쇠입니다.
                const savedMemo = localStorage.getItem(memoKey); // 금고에서 수색합니다.
                
                const memoInput = document.getElementById('memo-input');
                if(memoInput) memoInput.value = savedMemo ? savedMemo : ''; // 저장된 내용이 있으면 띄웁니다.

                const saveBtn = document.getElementById('save-memo-btn');
                if(saveBtn) saveBtn.setAttribute('data-key', memoKey); // 버튼에 꼬리표를 답니다.
            } // 조건문 끝!
        }); // 날짜 클릭 이벤트 리스너 끝

        datesElement.appendChild(dateSlot); // 완성된 날짜 칸을 화면에 집어넣습니다.
    } // 일 반복문 끝
} // renderCalendar 함수 끝

document.addEventListener('DOMContentLoaded', () => { renderCalendar(); }); // 페이지가 열리면 달력을 1번 그립니다.

const prevMonthBtn = document.getElementById('prev-month');
if(prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => { // 이전 달 버튼입니다.
        currentCalMonth--; 
        if (currentCalMonth < 0) { currentCalMonth = 11; currentCalYear--; } 
        renderCalendar(); 
    });
}

const nextMonthBtn = document.getElementById('next-month');
if(nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => { // 다음 달 버튼입니다.
        currentCalMonth++; 
        if (currentCalMonth > 11) { currentCalMonth = 0; currentCalYear++; } 
        renderCalendar(); 
    });
}

const saveMemoBtn = document.getElementById('save-memo-btn');
if(saveMemoBtn) {
    saveMemoBtn.addEventListener('click', () => { // 메모장 저장 버튼입니다.
        const memoKey = saveMemoBtn.getAttribute('data-key'); // 고유 열쇠를 읽어옵니다.
        if (!memoKey) { // 날짜를 안 골랐다면
            alert('왼쪽 달력에서 날짜를 먼저 선택해주세요! 📅'); // 경고창을 띄웁니다.
            return; 
        } 
        const memoText = document.getElementById('memo-input').value; // 장문의 글을 가져옵니다.
        localStorage.setItem(memoKey, memoText); // 금고에 영구 저장합니다.
        alert('이 날의 일정이 성공적으로 저장되었습니다! 💾'); // 성공 알림을 띄웁니다.
    }); // 메모 저장 버튼 리스너 끝
}

/**
 * [Phase 9 최종] SPA 라우팅 (장막 제거 & 심플 페이드아웃)
 */ 

const goDashboardBtn = document.getElementById('go-to-dashboard-btn'); 
const goToHomeBtn = document.getElementById('go-to-home-btn'); 
const homeView = document.getElementById('home-view'); 
const dashboardView = document.getElementById('dashboard-view'); 

if (goDashboardBtn && goToHomeBtn && homeView && dashboardView) { 
    
    // ➡️ [1] 대문 -> 대시보드
    goDashboardBtn.addEventListener('click', () => { 
        dashboardView.classList.add('active'); // 1. 대시보드 화면을 켭니다.
        homeView.classList.add('fade-out'); // 2. 대문 화면을 투명하게 만듭니다.

        setTimeout(() => { 
            homeView.classList.remove('active'); // 3. 투명해지면 클릭 안 되게 끕니다.
        }, 600); 
    }); 

    // ⬅️ [2] 대시보드 -> 대문
    goToHomeBtn.addEventListener('click', () => {
        homeView.classList.add('active'); // 1. 대문을 다시 켭니다.
        
        // 0.05초 뒤에 fade-out을 떼서 부드럽게 나타나게 합니다.
        setTimeout(() => {
            homeView.classList.remove('fade-out'); 
        }, 50);

        setTimeout(() => { 
            dashboardView.classList.remove('active'); // 2. 대문이 다 덮이면 대시보드를 끕니다.
        }, 600);
    });

}