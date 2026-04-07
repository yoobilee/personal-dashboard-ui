/**
 * [Phase 1 수정] 로드맵 달성도 기반 진행률 엔진
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 필요한 요소들을 가져옵니다.
    const roadmapItems = document.querySelectorAll('.map-item'); // 모든 로드맵 지점들을 가져옵니다.
    const fill = document.getElementById('progress-fill'); // 게이지바의 채워지는 부분입니다.
    const text = document.getElementById('progress-text'); // 퍼센트 숫자가 적힐 텍스트입니다.

    // 2. [핵심] 달성률을 계산하고 UI를 업데이트하는 함수입니다.
    function updateVoyageProgress() {
        const total = roadmapItems.length; // 전체 단계 수 (예: 3개)
        const completed = document.querySelectorAll('.map-item.completed').length; // 완료된(클릭된) 단계 수
        
        // 퍼센트 계산: (완료된 수 / 전체 수) * 100
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const finalPercent = percentage.toFixed(1); // 소수점 첫째 자리까지 표시합니다.

        if (fill && text) {
            text.innerText = finalPercent + '%'; // 텍스트 업데이트
            fill.style.width = finalPercent + '%'; // 게이지바 길이 업데이트
        }

        // ⭐️ 현재 완료 상태를 브라우저(localStorage)에 저장합니다.
        const completedPhases = Array.from(document.querySelectorAll('.map-item.completed'))
                                     .map(item => item.getAttribute('data-phase'));
        localStorage.setItem('roadmap_status', JSON.stringify(completedPhases));
    }

    // 3. 로드맵 아이템들에 클릭 이벤트를 심고, 저장된 데이터를 불러옵니다.
    if (roadmapItems.length > 0) {
        // 이전에 저장된 완료 데이터가 있는지 확인합니다.
        const savedStatus = JSON.parse(localStorage.getItem('roadmap_status') || '[]');

        roadmapItems.forEach((item, index) => {
            // HTML에 data-phase가 없다면 순서대로 ID를 부여합니다.
            const phaseId = item.getAttribute('data-phase') || `phase-${index}`;
            item.setAttribute('data-phase', phaseId);

            // 저장된 데이터에 이 단계가 포함되어 있다면 미리 'completed' 클래스를 붙여줍니다.
            if (savedStatus.includes(phaseId)) {
                item.classList.add('completed');
            }

            // 아이콘이나 박스를 클릭하면 완료 상태를 토글(껐다 켰다) 합니다.
            item.addEventListener('click', () => {
                item.classList.toggle('completed'); // 'completed' 클래스를 추가/제거합니다.
                updateVoyageProgress(); // 클릭할 때마다 상단 게이지를 다시 계산합니다.
            });
        });
    }

    // 4. 페이지가 처음 열렸을 때 게이지를 한 번 세팅합니다.
    updateVoyageProgress();
});

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
 * [Phase 9 최종] SPA 라우팅 (사르르 크로스 페이드)
 */ /* 라우팅 섹션 주석입니다. */
const goDashboardBtn = document.getElementById('go-to-dashboard-btn'); /* 대시보드로 가는 버튼 요소를 찾아 변수에 넣습니다. */
const goToHomeBtn = document.getElementById('go-to-home-btn'); /* 홈으로 돌아가는 버튼 요소를 찾아 변수에 넣습니다. */
const homeView = document.getElementById('home-view'); /* 대문(Home) 화면 껍데기를 찾아옵니다. */
const dashboardView = document.getElementById('dashboard-view'); /* 대시보드 화면 껍데기를 찾아옵니다. */

if (goDashboardBtn && goToHomeBtn && homeView && dashboardView) { /* 4개의 요소가 화면에 전부 잘 렌더링되었는지 확인합니다. */
    
    // ➡️ [1] 대문 -> 대시보드 전환
    goDashboardBtn.addEventListener('click', () => { /* 버튼을 클릭했을 때 이 안의 코드가 실행됩니다. */
        homeView.classList.remove('active'); /* 대문의 불을 꺼서 사르르 투명하게 만듭니다. */
        
        setTimeout(() => { /* 일정 시간이 지난 후에 코드를 실행하는 타이머입니다. */
            dashboardView.classList.add('active'); /* 0.3초 대기 후 대시보드의 불을 켜서 사르르 나타나게 합니다. */
        }, 150); /* 150밀리초(0.15초) 동안 대기합니다. (잔상 겹침 방지!) */
    }); /* 대문 -> 대시보드 이벤트 리스너를 닫습니다. */

    // ⬅️ [2] 대시보드 -> 대문 전환
    goToHomeBtn.addEventListener('click', () => { /* 홈 버튼을 클릭했을 때 실행됩니다. */
        dashboardView.classList.remove('active'); /* 대시보드의 불을 먼저 꺼서 스르륵 사라지게 합니다. */
        
        setTimeout(() => { /* 겹치지 않게 타이머를 줍니다. */
            homeView.classList.add('active'); /* 0.3초 대기 후 대문 화면을 다시 사르르 나타나게 켭니다. */
        }, 150); /* 150밀리초(0.15초)를 기다립니다. */
    }); /* 대시보드 -> 대문 이벤트 리스너를 닫습니다. */

} /* 전체 if문을 닫습니다. */

/**
 * [Phase 10 최종] Three.js WebGL: Neural Network Field
 * - 살아 숨쉬는 노드 연결망이 배경에 깔리고
 * - 마우스가 지나갈 때 근처 노드들이 네온으로 활성화되는 인터랙션
 * - 2026 포트폴리오 트렌드: Fluid Particle + Mouse Reactive
 */
if (homeView && window.THREE) {
    // ── 1. 씬 / 카메라 / 렌더러 ──────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 성능 과부하 방지
    Object.assign(renderer.domElement.style, {
        position: 'absolute', top: '0', left: '0',
        zIndex: '-1', pointerEvents: 'none'
    });
    homeView.appendChild(renderer.domElement);
    camera.position.z = 42;
 
    // ── 2. 노드 데이터 정의 ───────────────────────────────────────
    const NODE_COUNT  = 180;  // 노드 수 늘려서 넓게 펼쳐도 촘촘하게
    const LINK_DIST   = 9.0;  // 연결 거리도 넓혀서 선이 화면 가득 연결되게
    const W = 98, H = 47;     // 화면 전체를 덮는 범위로 대폭 확장
 
    // 각 노드의 위치, 속도, 호흡 위상을 저장
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
        x:  (Math.random() - 0.5) * W,
        y:  (Math.random() - 0.5) * H,
        z:  (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.012, // 이동 속도 (매우 느림)
        vy: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2, // 호흡 애니메이션 위상
    }));
 
    // ── 3. 노드(점) 렌더링 ───────────────────────────────────────
    const nodeGeo = new THREE.BufferGeometry();
    const nodePosArr   = new Float32Array(NODE_COUNT * 3);
    const nodeColorArr = new Float32Array(NODE_COUNT * 3);
 
    nodes.forEach((n, i) => {
        nodePosArr[i*3]   = n.x;
        nodePosArr[i*3+1] = n.y;
        nodePosArr[i*3+2] = n.z;
        nodeColorArr[i*3]   = 0.1;
        nodeColorArr[i*3+1] = 0.18;
        nodeColorArr[i*3+2] = 0.28;
    });
 
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr,   3));
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(nodeColorArr, 3));
 
    const nodeMat = new THREE.PointsMaterial({
        size: 0.22, vertexColors: true,
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));
 
    // ── 4. 연결선(엣지) 렌더링 ──────────────────────────────────
    // 최대 연결선 수 미리 잡아두기 (동적 업데이트용)
    const MAX_LINES = NODE_COUNT * NODE_COUNT;
    const lineGeo   = new THREE.BufferGeometry();
    const linePosArr   = new Float32Array(MAX_LINES * 6); // 선 하나당 두 점 (x,y,z)*2
    const lineColorArr = new Float32Array(MAX_LINES * 6);
 
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr,   3));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineColorArr, 3));
 
    const lineMat = new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true, opacity: 0.35,
            blending: THREE.AdditiveBlending,
        })
    );
    scene.add(lineMat);
 
    // ── 5. 마우스 3D 좌표 추적 ───────────────────────────────────
    const raycaster   = new THREE.Raycaster();
    const mouseNDC    = new THREE.Vector2(-9999, -9999); // 정규화 좌표 (-1~1)
    let   mouse3D     = null; // 화면 평면 위의 실제 3D 좌표
 
    const hitPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(hitPlane);
 
    homeView.addEventListener('mousemove', (e) => {
        mouseNDC.x =  (e.clientX / window.innerWidth)  * 2 - 1;
        mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    homeView.addEventListener('mouseleave', () => {
        mouseNDC.set(-9999, -9999);
        mouse3D = null;
    });
 
    // ── 6. 애니메이션 루프 ────────────────────────────────────────
    let time = 0;
 
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;
 
        // 마우스 3D 위치 갱신
        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObject(hitPlane);
        mouse3D = hits.length > 0 ? hits[0].point : null;
 
        // 노드 이동 + 화면 경계 반사
        nodes.forEach((n, i) => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x >  W/2 || n.x < -W/2) n.vx *= -1;
            if (n.y >  H/2 || n.y < -H/2) n.vy *= -1;
 
            // ⭐️ 마우스 반발력: 가까이 오면 슬쩍 밀려남 (부드러운 물결 효과)
            if (mouse3D) {
                const dx = n.x - mouse3D.x;
                const dy = n.y - mouse3D.y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                const REPEL = 5.0; // 반발 반경
                if (d < REPEL && d > 0.01) {
                    const force = (1 - d / REPEL) * 0.04;
                    n.x += (dx / d) * force;
                    n.y += (dy / d) * force;
                }
            }
 
            // 노드 위치 버퍼 업데이트
            nodePosArr[i*3]   = n.x;
            nodePosArr[i*3+1] = n.y;
            nodePosArr[i*3+2] = n.z;
 
            // ⭐️ 노드 색상: 다크모드 여부에 따라 기본 밝기 분기
            const isDark = document.body.classList.contains('dark-mode');
            let tr = isDark ? 0.18 : 0.06;
            let tg = isDark ? 0.38 : 0.14;
            let tb = isDark ? 0.65 : 0.28;
            const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + n.phase); // 0~1 숨쉬는 값
 
            if (mouse3D) {
                const dx = n.x - mouse3D.x;
                const dy = n.y - mouse3D.y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                const GLOW = 9.0; // 발광 반경
                if (d < GLOW) {
                    const intensity = (1 - d / GLOW) * (0.6 + 0.4 * pulse);
                    tr += 0.0  * intensity; // R: 거의 안 올림 (파란 계열 유지)
                    tg += 0.85 * intensity; // G: 강하게 올려서 시안/민트 발광
                    tb += 1.0  * intensity; // B: 풀로 올려서 네온 블루
                }
            }
 
            // 호흡 효과: 평소에도 아주 살짝 반짝임
            tr += 0.02 * pulse;
            tg += 0.04 * pulse;
            tb += 0.07 * pulse;
 
            // Lerp (현재 색 → 목표 색)
            nodeColorArr[i*3]   += (tr - nodeColorArr[i*3])   * 0.12;
            nodeColorArr[i*3+1] += (tg - nodeColorArr[i*3+1]) * 0.12;
            nodeColorArr[i*3+2] += (tb - nodeColorArr[i*3+2]) * 0.12;
        });
 
        nodeGeo.attributes.position.needsUpdate = true;
        nodeGeo.attributes.color.needsUpdate    = true;
 
        // ── 연결선 업데이트 ──────────────────────────────────────
        let lineIdx = 0;
        for (let a = 0; a < NODE_COUNT; a++) {
            for (let b = a + 1; b < NODE_COUNT; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dz = nodes[a].z - nodes[b].z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
 
                if (dist < LINK_DIST) {
                    // 거리가 가까울수록 선이 밝아짐
                    const alpha = 1 - dist / LINK_DIST;
                    const isDarkLine = document.body.classList.contains('dark-mode');
 
                    // 마우스 근접 시 연결선도 함께 발광 (다크모드는 더 밝게)
                    let lr = (isDarkLine ? 0.18 : 0.08) * alpha;
                    let lg = (isDarkLine ? 0.38 : 0.15) * alpha;
                    let lb = (isDarkLine ? 0.65 : 0.30) * alpha;
                    if (mouse3D) {
                        const mx = (nodes[a].x + nodes[b].x) / 2 - mouse3D.x;
                        const my = (nodes[a].y + nodes[b].y) / 2 - mouse3D.y;
                        const md = Math.sqrt(mx*mx + my*my);
                        if (md < 8.0) {
                            const mi = (1 - md / 8.0) * alpha;
                            lg += 0.6 * mi;
                            lb += 0.8 * mi;
                        }
                    }
 
                    const base = lineIdx * 6;
                    // 선의 시작점
                    linePosArr[base]   = nodes[a].x;
                    linePosArr[base+1] = nodes[a].y;
                    linePosArr[base+2] = nodes[a].z;
                    lineColorArr[base]   = lr;
                    lineColorArr[base+1] = lg;
                    lineColorArr[base+2] = lb;
                    // 선의 끝점
                    linePosArr[base+3] = nodes[b].x;
                    linePosArr[base+4] = nodes[b].y;
                    linePosArr[base+5] = nodes[b].z;
                    lineColorArr[base+3] = lr;
                    lineColorArr[base+4] = lg;
                    lineColorArr[base+5] = lb;
 
                    lineIdx++;
                }
            }
        }
 
        // 사용하지 않는 선 구간은 원점으로 숨기기
        for (let k = lineIdx * 6; k < MAX_LINES * 6; k++) linePosArr[k] = 0;
 
        lineGeo.setDrawRange(0, lineIdx * 2); // 실제 사용한 선만 렌더링
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate    = true;
 
        renderer.render(scene, camera);
    }
    animate();
 
    // ── 7. 반응형 리사이징 ────────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * [Phase 11] Admin Control & Launch Sequence
 */ // [Phase 11] 어드민 제어 및 시스템 가동 로직 구역입니다.

// 1. 어드민 설정을 전역 객체로 선언하여 콘솔에서 접근 가능하게 합니다.
window.adminConfig = { // 브라우저 창(window) 어디서든 부를 수 있는 설정 바구니를 만듭니다.
    useLaunchSequence: true // 시스템 가동 시퀀스(로그 창) 사용 여부입니다. 기본값은 ON입니다.
}; // 설정 객체 끝

// 2. 콘솔에서 사용자가 직접 입력할 제어 함수를 정의합니다.
window.toggleAdminMode = function(status) { // toggleAdminMode(false) 처럼 입력하여 끕니다.
    if (typeof status === 'boolean') { // 입력값이 불리언(true/false) 형태인지 확인합니다.
        window.adminConfig.useLaunchSequence = status; // 입력받은 값으로 설정을 덮어씁니다.
        const msg = status ? "활성화" : "비활성화"; // 상태에 따른 메시지를 준비합니다.
        console.log(`%c[ADMIN] 시스템 가동 시퀀스가 ${msg} 되었습니다.`, "color: #3182f6; font-weight: bold;"); // 콘솔에 결과를 예쁘게 출력합니다.
    } else { // 잘못된 값을 입력했을 경우입니다.
        console.warn("[ADMIN] true 또는 false 값을 입력해주세요."); // 경고 메시지를 띄웁니다.
    } // 조건문 끝
}; // 제어 함수 끝

const bootMessages = [ // 시퀀스에 출력할 메시지 배열입니다.
    "> INITIALIZING QA_TO_DEV_BRIDGE_SYSTEM...", // 초기화 메시지입니다.
    "> SCANNING FOR BUGS... 0 FOUND.", // 버그 스캔 메시지입니다.
    "> DEPLOYING INTERACTIVE_DASHBOARD...", // 배포 메시지입니다.
    "> ACCESS GRANTED. WELCOME, YooBi." // 최종 승인 메시지입니다.
]; // 메시지 끝

if (goDashboardBtn) { // 버튼이 존재하는 경우에만 실행합니다.
    goDashboardBtn.addEventListener('click', () => { // 버튼 클릭 이벤트를 등록합니다.
        
        // ⭐️ 핵심: 어드민 설정이 꺼져(false) 있다면 즉시 화면을 전환합니다.
        if (!window.adminConfig.useLaunchSequence) { // 시퀀스 사용 안 함 설정인 경우입니다.
            homeView.classList.remove('active'); // 홈 화면을 즉시 끕니다.
            dashboardView.classList.add('active'); // 대시보드 화면을 즉시 켭니다.
            return; // 이후의 로그 출력 로직은 실행하지 않고 종료합니다.
        } // 조건문 끝

        // --- 여기서부터는 기존의 로그 출력 로직입니다 ---
        const overlay = document.createElement('div'); // 로그용 오버레이를 만듭니다.
        overlay.classList.add('boot-overlay'); // 디자인을 입힙니다.
        overlay.innerHTML = `<div class="log-container"></div><div class="cursor-blink"></div>`; // 구조를 잡습니다.
        document.body.appendChild(overlay); // 화면에 붙입니다.
        overlay.style.display = 'flex'; // 보이게 처리합니다.

        const logBox = overlay.querySelector('.log-container'); // 로그 박스를 찾습니다.
        let msgIndex = 0; // 메시지 번호를 초기화합니다.

        const printLog = () => { // 한 줄씩 찍는 함수입니다.
            if (msgIndex < bootMessages.length) { // 찍을 메시지가 남았다면 실행합니다.
                const p = document.createElement('div'); // 새 로그 줄을 만듭니다.
                p.innerText = bootMessages[msgIndex]; // 내용을 넣습니다.
                logBox.appendChild(p); // 화면에 추가합니다.
                msgIndex++; // 다음 순서로 넘깁니다.
                setTimeout(printLog, 300); // 0.3초 간격으로 반복합니다.
            } else { // 모든 메시지를 다 찍었다면 실행합니다.
                setTimeout(() => { // 완료 후 대기 시간을 줍니다.
                    overlay.style.opacity = '0'; // 투명하게 만듭니다.
                    setTimeout(() => { // 완전히 사라지면 실행합니다.
                        overlay.remove(); // 요소를 삭제합니다.
                        homeView.classList.remove('active'); // 대문을 닫습니다.
                        dashboardView.classList.add('active'); // 대시보드를 엽니다.
                    }, 500); // 0.5초 대기합니다.
                }, 500); // 0.5초 대기합니다.
            } // 조건문 끝
        }; // 함수 정의 끝
        printLog(); // 로그 출력 시작입니다.
    }); // 클릭 리스너 끝
} // 전체 if문 끝

/**
 * [Phase 11] 스크롤 다운 기능 보정
 */
function scrollToBoard() {
    // ⭐️ 다음 화면인 board-container 섹션을 찾습니다.
    const target = document.querySelector('.board-container');
    
    if (target) {
        // 스냅 스크롤 환경에서도 부드럽게 이동하도록 설정합니다.
        target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    } else {
        // 만약 클래스명이 다를 경우를 대비해 두 번째 'page'로 이동합니다.
        const pages = document.querySelectorAll('.page');
        if (pages.length > 1) {
            pages[1].scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * [Phase 12] 딥 다이내믹 쉐도우 (Deep Lighting)
 */
const mapItems = document.querySelectorAll('.map-item');

mapItems.forEach(item => {
    const content = item.querySelector('.map-content');
    
    item.addEventListener('mousemove', (e) => {
        const rect = content.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const moveX = (e.clientX - centerX) / (rect.width / 2);
        const moveY = (e.clientY - centerY) / (rect.height / 2);
        
        // ⭐️ 그림자를 조금 더 멀리 밀어서(30px) 진한 그림자의 깊이감을 살립니다.
        const shX = moveX * -15; 
        const shY = (moveY * -15) + 10; // 기본 Y축 깊이 20px
        
        content.style.setProperty('--sh-x', `${shX}px`);
        content.style.setProperty('--sh-y', `${shY}px`);
    });

    item.addEventListener('mouseleave', () => {
        // 원래 위치로 복구 (부드러운 복귀를 위해 transition 활용)
        content.style.setProperty('--sh-x', '0px');
        content.style.setProperty('--sh-y', '20px');
    });
});