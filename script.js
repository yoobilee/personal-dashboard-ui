// ==========================================
// [전역 변수] Phase 9/10에서 공통으로 쓰이는 변수들
// ==========================================
const homeView = document.getElementById('home-view');
const dashboardView = document.getElementById('dashboard-view');
const goDashboardBtn = document.getElementById('go-to-dashboard-btn');
const goToHomeBtn = document.getElementById('go-to-home-btn');
let routeTimeout = null;

/**
 * [Phase 1] 로드맵 달성도 기반 진행률 엔진 (유비 원본 보존)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 필요한 요소들을 가져옵니다.
    const roadmapItems = document.querySelectorAll('.map-item');
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');

    // 2. [핵심] 달성률을 계산하고 UI를 업데이트하는 함수입니다.
    function updateVoyageProgress() {
        const total = roadmapItems.length;
        const completed = document.querySelectorAll('.map-item.completed').length;

        const percentage = total > 0 ? (completed / total) * 100 : 0;
        const finalPercent = percentage.toFixed(1);

        if (fill && text) {
            text.innerText = finalPercent + '%';
            fill.style.width = finalPercent + '%';
        }

        // ⭐️ 현재 완료 상태를 브라우저(localStorage)에 저장합니다.
        const completedPhases = Array.from(document.querySelectorAll('.map-item.completed'))
            .map(item => item.getAttribute('data-phase'));
        localStorage.setItem('roadmap_status', JSON.stringify(completedPhases));
    }

    // 3. 로드맵 아이템들에 클릭 이벤트를 심고, 저장된 데이터를 불러옵니다.
    if (roadmapItems.length > 0) {
        const savedStatus = JSON.parse(localStorage.getItem('roadmap_status') || '[]');

        roadmapItems.forEach((item, index) => {
            const phaseId = item.getAttribute('data-phase') || `phase-${index}`;
            item.setAttribute('data-phase', phaseId);

            if (savedStatus.includes(phaseId)) {
                item.classList.add('completed');
            }

            item.addEventListener('click', () => {
                // 1. 클릭한 아이템의 상태와 이름을 먼저 가져옵니다.
                const isCompleting = !item.classList.contains('completed');
                const phaseName = item.querySelector('h4').innerText;

                item.classList.toggle('completed');
                updateVoyageProgress();

                // 2. 방금 맨 밑에서 지웠던 토스트 알림을 여기에 안전하게 넣습니다!
                showToast(isCompleting ? `${phaseName} 단계를 완료했습니다!` : `${phaseName} 단계가 취소되었습니다.`);
            });
        });
    }

    // 4. 페이지가 처음 열렸을 때 게이지를 한 번 세팅합니다.
    updateVoyageProgress();

    // ==========================================
    // 🔀 [라우팅 추가] 뒤로가기 대응 해시 시스템
    // ==========================================
    function handleRouting() {
        const hash = window.location.hash || '#home';
        const homeView = document.getElementById('home-view');
        const dashboardView = document.getElementById('dashboard-view');

        if (hash === '#dashboard') {
            homeView.classList.remove('active'); //
            dashboardView.classList.add('active'); //
        } else {
            dashboardView.classList.remove('active'); //
            homeView.classList.add('active'); //
        }
    }

    window.addEventListener('hashchange', handleRouting);
    handleRouting(); // 초기 실행

    // 버튼 클릭 시 주소만 바꿔주면 위 handleRouting이 자동으로 감지합니다.
    const goDashboardBtn = document.getElementById('go-to-dashboard-btn');
    const goToHomeBtn = document.getElementById('go-to-home-btn');

    if (goDashboardBtn) goDashboardBtn.addEventListener('click', () => window.location.hash = 'dashboard');
    if (goToHomeBtn) goToHomeBtn.addEventListener('click', () => window.location.hash = 'home');
});

const scrollDownBtn = document.querySelector('.scroll-down-indicator'); // 화면 아래로 내려가는 화살표 버튼을 찾습니다.
// ⭐️ 핵심: 전체 페이지가 아니라, '대시보드 뷰' 안에서의 두 번째 페이지(칸반 보드)를 콕 집어옵니다!
const kanbanPage = document.querySelectorAll('#dashboard-view .page')[1];

if (scrollDownBtn && kanbanPage) { // 요소가 화면에 잘 렌더링 된 경우에만 이벤트를 달아줍니다.
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

if (addBtn) { // 버튼이 존재할 때만 이벤트를 답니다.
    addBtn.addEventListener('click', () => { // 버튼 클릭 시 실행됩니다.
        taskModal.style.display = 'flex'; // 추가 모달창을 화면에 띄웁니다.
        document.getElementById('modal-task-input').focus(); // 타자를 바로 칠 수 있게 커서를 둡니다.
    }); // 버튼 클릭 이벤트 끝
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => { // 취소 버튼 클릭 시 실행됩니다.
        taskModal.style.display = 'none'; // 모달창을 숨깁니다.
        document.getElementById('modal-task-input').value = ''; // 적어둔 글자를 비웁니다.
    }); // 취소 이벤트 끝
}

if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => { // 추가 버튼 클릭 시 실행됩니다.
        const taskText = document.getElementById('modal-task-input').value; // 입력칸의 글씨를 가져옵니다.
        if (!taskText || taskText.trim() === '') { // 텅 비어있다면?
            alert('할 일을 입력해 주세요! 📝'); // 경고합니다.
            return; // 함수를 멈춥니다.
        } // 유효성 검사 끝
        createTaskCard(taskText, 0); // 글씨와 0번(To Do)을 넘겨서 화면에 카드를 그립니다.
        saveTasks(); // 변경된 상태를 금고에 저장합니다.

        // ⭐️ 추가된 부분: 모달 닫기 전에 토스트 알림 띄우기
        showToast('새로운 할 일이 추가되었습니다. 📋');

        taskModal.style.display = 'none'; // 모달창을 닫습니다.
        document.getElementById('modal-task-input').value = ''; // 입력칸을 다시 비워둡니다.
    }); // 추가 이벤트 끝
}

if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => { // 삭제 모달에서 '취소'를 눌렀을 때 발동합니다.
        deleteModal.style.display = 'none'; // 삭제 모달창을 닫아서 숨깁니다.
        cardToDelete = null; // 기억해뒀던 암살 대상(?) 카드를 머릿속에서 잊어버립니다.
    }); // 삭제 취소 이벤트 끝
}

if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', () => { // 삭제 모달에서 '삭제하기(빨간버튼)'를 눌렀을 때 발동합니다.
        if (cardToDelete) { // 만약 지우기로 약속하고 기억해둔 카드가 진짜 있다면?
            cardToDelete.remove(); // 그 카드를 화면에서 가차 없이 날려버립니다.
            saveTasks(); // 카드가 지워져서 비어있는 현재 상태를 로컬 스토리지에 덮어씁니다.

            // ⭐️ 추가된 부분: 모달 닫기 전에 토스트 알림 띄우기
            showToast('할 일이 성공적으로 삭제되었습니다. 🗑️');

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

        // ⭐️ 추가된 부분: 드래그가 끝나면 토스트 알림 띄우기
        showToast('할 일의 진행 상태가 변경되었습니다. 🔄');
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

function renderCalendar() { 
    const titleElement = document.getElementById('calendar-title'); 
    const datesElement = document.getElementById('calendar-dates'); 

    if(!titleElement || !datesElement) return; 

    const firstDayOfMonth = new Date(currentCalYear, currentCalMonth, 1); 
    const lastDayOfMonth = new Date(currentCalYear, currentCalMonth + 1, 0); 
    const startDayOfWeek = firstDayOfMonth.getDay(); 
    const totalDaysInMonth = lastDayOfMonth.getDate(); 

    titleElement.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월`; 
    datesElement.innerHTML = ''; 

    const realToday = new Date(); 
    const isThisMonth = (currentCalYear === realToday.getFullYear() && currentCalMonth === realToday.getMonth()); 

    // 🚨 ⭐️ 여기가 사라졌던 마의 구간! 요일 시작점을 맞춰주는 투명 빈칸 채우기!
    for (let i = 0; i < startDayOfWeek; i++) { 
        const emptySlot = document.createElement('div'); 
        emptySlot.classList.add('empty'); 
        datesElement.appendChild(emptySlot); 
    } 

    // ⭐️ 실제 날짜 채우기 (여기에 배지용 data-date가 들어갑니다)
    for (let day = 1; day <= totalDaysInMonth; day++) { 
        const dateSlot = document.createElement('div'); 
        dateSlot.innerText = day; 
        
        // ⭐️ 배지 기능을 위해 날짜 번호를 심어줍니다.
        dateSlot.setAttribute('data-date', day); 

        if (isThisMonth && day === realToday.getDate()) { 
            dateSlot.classList.add('today'); 
        } 

        // ⭐️ 날짜 클릭 시 동작 (메모 입력창 클리어 + 리스트 렌더링)
        dateSlot.addEventListener('click', () => { 
            const isAlreadySelected = dateSlot.classList.contains('selected'); 
            if (isAlreadySelected) { 
                dateSlot.classList.remove('selected'); 
                document.querySelector('.calendar-wrapper').classList.remove('show-memo'); 
            } else { 
                document.querySelectorAll('.calendar-dates div').forEach(el => el.classList.remove('selected')); 
                dateSlot.classList.add('selected'); 
                document.querySelector('.calendar-wrapper').classList.add('show-memo'); 
                
                const memoDateTitle = document.getElementById('memo-date-title');
                if(memoDateTitle) memoDateTitle.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월 ${day}일 일정`; 

                // ⭐️ 클릭할 때마다 입력창을 깔끔하게 비워줍니다.
                const memoInput = document.getElementById('memo-input');
                if(memoInput) memoInput.value = ''; 

                // ⭐️ 기존의 memoKey 대신 공통 baseKey를 사용합니다.
                const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`; 
                const saveBtn = document.getElementById('save-memo-btn');
                if(saveBtn) saveBtn.setAttribute('data-base-key', baseKey); 

                // ⭐️ 현재 활성화된 탭에 맞춰서 데이터를 뿌려줍니다.
                if (document.getElementById('btn-view-timeline').classList.contains('active')) {
                    const timeArray = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');
                    renderTimeline(timeArray, `yoobiTimeline_${baseKey}`);
                } else {
                    const memoArray = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
                    renderMemoList(memoArray, `yoobiMemo_${baseKey}`);
                }
            } 
        });  

        datesElement.appendChild(dateSlot); 
    } 
    
    // ⭐️ 달력을 다 그린 후 마지막에 메모 개수 배지를 달아줍니다!
    updateCalendarBadges(); 
}

document.addEventListener('DOMContentLoaded', () => { renderCalendar(); }); // 페이지가 열리면 달력을 1번 그립니다.

const prevMonthBtn = document.getElementById('prev-month');
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => { // 이전 달 버튼입니다.
        currentCalMonth--;
        if (currentCalMonth < 0) { currentCalMonth = 11; currentCalYear--; }
        renderCalendar();
    });
}

const nextMonthBtn = document.getElementById('next-month');
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => { // 다음 달 버튼입니다.
        currentCalMonth++;
        if (currentCalMonth > 11) { currentCalMonth = 0; currentCalYear++; }
        renderCalendar();
    });
}

// ==========================================
// 🔀 [Phase 9] 세이프 해시 라우팅 (초기 로드 최적화)
// ==========================================

let isInitialLoad = true; // ⭐️ 첫 로드인지 확인하는 깃발(Flag)을 만듭니다.

function handleRouting() {
    const hash = window.location.hash || '#home';
    const homeView = document.getElementById('home-view'); //
    const dashboardView = document.getElementById('dashboard-view'); //

    if (routeTimeout) clearTimeout(routeTimeout);

    // 1. [초기 로드 대응] 첫 실행일 때는 사르르 효과 없이 즉시 화면을 세팅합니다.
    if (isInitialLoad) {
        if (hash === '#dashboard') {
            if (homeView) homeView.classList.remove('active'); //
            if (dashboardView) dashboardView.classList.add('active'); //
        } else {
            if (dashboardView) dashboardView.classList.remove('active'); //
            if (homeView) homeView.classList.add('active'); //
        }
        isInitialLoad = false; // ⭐️ 첫 로드가 끝났으므로 깃발을 내립니다.
        return; // 이후의 setTimeout 로직을 실행하지 않고 여기서 종료합니다.
    }

    // 2. [이후 클릭 시] 기존의 '사르르' 효과(300ms)를 그대로 유지합니다.
    if (homeView) homeView.classList.remove('active'); //
    if (dashboardView) dashboardView.classList.remove('active'); //

    routeTimeout = setTimeout(() => {
        if (hash === '#dashboard') {
            if (dashboardView) dashboardView.classList.add('active'); //
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' }); //
            if (homeView) homeView.classList.add('active'); //
        }
        routeTimeout = null;
    }, 300); // ⭐️ 페이지 이동 시에는 부드러운 전환을 위해 300ms 대기
}

// 브라우저 이벤트 연결
window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', handleRouting);

// 버튼 클릭 시 해시값만 변경
if (goDashboardBtn) goDashboardBtn.addEventListener('click', () => { window.location.hash = 'dashboard'; });
if (goToHomeBtn) goToHomeBtn.addEventListener('click', () => { window.location.hash = 'home'; });

/**
 * [Phase 10 최종] Three.js WebGL: Neural Network Field
 * - 살아 숨쉬는 노드 연결망이 배경에 깔리고
 * - 마우스가 지나갈 때 근처 노드들이 네온으로 활성화되는 인터랙션
 * - 2026 포트폴리오 트렌드: Fluid Particle + Mouse Reactive
 */
if (homeView && window.THREE) {
    // ── 1. 씬 / 카메라 / 렌더러 ──────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 성능 과부하 방지
    Object.assign(renderer.domElement.style, {
        position: 'absolute', // 부모인 home-view를 기준으로 배치합니다.
        top: '0', left: '0',
        width: '100%', height: '100%',
        zIndex: '0',         // ⭐️ 배경색보다는 위, 글자(10)보다는 아래에 둡니다.
        pointerEvents: 'none' // 클릭 방해 방지
    });
    homeView.appendChild(renderer.domElement);
    camera.position.z = 42;

    // ── 2. 노드 데이터 정의 ───────────────────────────────────────
    const NODE_COUNT = 180;  // 노드 수 늘려서 넓게 펼쳐도 촘촘하게
    const LINK_DIST = 9.0;  // 연결 거리도 넓혀서 선이 화면 가득 연결되게
    const W = 98, H = 47;     // 화면 전체를 덮는 범위로 대폭 확장

    // 각 노드의 위치, 속도, 호흡 위상을 저장
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: (Math.random() - 0.5) * W,
        y: (Math.random() - 0.5) * H,
        z: (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.012, // 이동 속도 (매우 느림)
        vy: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2, // 호흡 애니메이션 위상
    }));

    // ── 3. 노드(점) 렌더링 ───────────────────────────────────────
    const nodeGeo = new THREE.BufferGeometry();
    const nodePosArr = new Float32Array(NODE_COUNT * 3);
    const nodeColorArr = new Float32Array(NODE_COUNT * 3);

    nodes.forEach((n, i) => {
        nodePosArr[i * 3] = n.x;
        nodePosArr[i * 3 + 1] = n.y;
        nodePosArr[i * 3 + 2] = n.z;
        nodeColorArr[i * 3] = 0.1;
        nodeColorArr[i * 3 + 1] = 0.18;
        nodeColorArr[i * 3 + 2] = 0.28;
    });

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColorArr, 3));

    const nodeMat = new THREE.PointsMaterial({
        size: 0.22, vertexColors: true,
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    // ── 4. 연결선(엣지) 렌더링 ──────────────────────────────────
    // 최대 연결선 수 미리 잡아두기 (동적 업데이트용)
    const MAX_LINES = NODE_COUNT * NODE_COUNT;
    const lineGeo = new THREE.BufferGeometry();
    const linePosArr = new Float32Array(MAX_LINES * 6); // 선 하나당 두 점 (x,y,z)*2
    const lineColorArr = new Float32Array(MAX_LINES * 6);

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColorArr, 3));

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
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-9999, -9999); // 정규화 좌표 (-1~1)
    let mouse3D = null; // 화면 평면 위의 실제 3D 좌표

    const hitPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(hitPlane);

    homeView.addEventListener('mousemove', (e) => {
        mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
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
            if (n.x > W / 2 || n.x < -W / 2) n.vx *= -1;
            if (n.y > H / 2 || n.y < -H / 2) n.vy *= -1;

            // ⭐️ 마우스 반발력: 가까이 오면 슬쩍 밀려남 (부드러운 물결 효과)
            if (mouse3D) {
                const dx = n.x - mouse3D.x;
                const dy = n.y - mouse3D.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const REPEL = 5.0; // 반발 반경
                if (d < REPEL && d > 0.01) {
                    const force = (1 - d / REPEL) * 0.04;
                    n.x += (dx / d) * force;
                    n.y += (dy / d) * force;
                }
            }

            // 노드 위치 버퍼 업데이트
            nodePosArr[i * 3] = n.x;
            nodePosArr[i * 3 + 1] = n.y;
            nodePosArr[i * 3 + 2] = n.z;

            // ⭐️ 노드 색상: 다크모드 여부에 따라 기본 밝기 분기
            const isDark = document.body.classList.contains('dark-mode');
            let tr = isDark ? 0.18 : 0.06;
            let tg = isDark ? 0.38 : 0.14;
            let tb = isDark ? 0.65 : 0.28;
            const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + n.phase); // 0~1 숨쉬는 값

            if (mouse3D) {
                const dx = n.x - mouse3D.x;
                const dy = n.y - mouse3D.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const GLOW = 9.0; // 발광 반경
                if (d < GLOW) {
                    const intensity = (1 - d / GLOW) * (0.6 + 0.4 * pulse);
                    tr += 0.0 * intensity; // R: 거의 안 올림 (파란 계열 유지)
                    tg += 0.85 * intensity; // G: 강하게 올려서 시안/민트 발광
                    tb += 1.0 * intensity; // B: 풀로 올려서 네온 블루
                }
            }

            // 호흡 효과: 평소에도 아주 살짝 반짝임
            tr += 0.02 * pulse;
            tg += 0.04 * pulse;
            tb += 0.07 * pulse;

            // Lerp (현재 색 → 목표 색)
            nodeColorArr[i * 3] += (tr - nodeColorArr[i * 3]) * 0.12;
            nodeColorArr[i * 3 + 1] += (tg - nodeColorArr[i * 3 + 1]) * 0.12;
            nodeColorArr[i * 3 + 2] += (tb - nodeColorArr[i * 3 + 2]) * 0.12;
        });

        nodeGeo.attributes.position.needsUpdate = true;
        nodeGeo.attributes.color.needsUpdate = true;

        // ── 연결선 업데이트 ──────────────────────────────────────
        let lineIdx = 0;
        for (let a = 0; a < NODE_COUNT; a++) {
            for (let b = a + 1; b < NODE_COUNT; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dz = nodes[a].z - nodes[b].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

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
                        const md = Math.sqrt(mx * mx + my * my);
                        if (md < 8.0) {
                            const mi = (1 - md / 8.0) * alpha;
                            lg += 0.6 * mi;
                            lb += 0.8 * mi;
                        }
                    }

                    const base = lineIdx * 6;
                    // 선의 시작점
                    linePosArr[base] = nodes[a].x;
                    linePosArr[base + 1] = nodes[a].y;
                    linePosArr[base + 2] = nodes[a].z;
                    lineColorArr[base] = lr;
                    lineColorArr[base + 1] = lg;
                    lineColorArr[base + 2] = lb;
                    // 선의 끝점
                    linePosArr[base + 3] = nodes[b].x;
                    linePosArr[base + 4] = nodes[b].y;
                    linePosArr[base + 5] = nodes[b].z;
                    lineColorArr[base + 3] = lr;
                    lineColorArr[base + 4] = lg;
                    lineColorArr[base + 5] = lb;

                    lineIdx++;
                }
            }
        }

        // 사용하지 않는 선 구간은 원점으로 숨기기
        for (let k = lineIdx * 6; k < MAX_LINES * 6; k++) linePosArr[k] = 0;

        lineGeo.setDrawRange(0, lineIdx * 2); // 실제 사용한 선만 렌더링
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;

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
 * ⭐️ 딜레이 없이 스킵 처리 완료 ⭐️
 */
// 어드민 제어 및 시스템 가동 로직 구역입니다. (이전 코드는 주석 처리 및 삭제됨)

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


// ==========================================
// [사이드바 구체화] 1. Status 드롭다운 로직
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const statusToggle = document.getElementById('status-toggle');
    const statusMenu = document.getElementById('status-menu');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');

    if (statusToggle && statusMenu) {
        statusToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            statusMenu.classList.toggle('show');
        });

        statusMenu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const icon = item.getAttribute('data-icon');
                const text = item.getAttribute('data-text');
                if (statusIcon) statusIcon.innerText = icon;
                if (statusText) statusText.innerText = text;
                statusMenu.classList.remove('show');
                showToast(`${text} 상태로 변경되었습니다.`);
            });
        });

        document.addEventListener('click', () => {
            statusMenu.classList.remove('show');
        });
    }
});


// ==========================================
// [Phase 13 수정] GitHub 수동 잔디 데이터 설정 (월 자동화 포함)
// ==========================================
document.addEventListener('DOMContentLoaded', () => { 
    const githubGrid = document.getElementById('github-grid');
    const githubMonth = document.querySelector('.github-month'); // ⭐️ 추가: 월 글씨가 들어갈 요소를 찾습니다.

    if (githubGrid) {
        // ⭐️ 추가: 현실의 달을 영문 3글자로 변환해서 자동으로 꽂아줍니다.
        if (githubMonth) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentMonthIndex = new Date().getMonth(); // 0(1월) ~ 11(12월)
            githubMonth.innerText = monthNames[currentMonthIndex];
        }

        // 유비만의 잔디밭 패턴 배열 (5주 치)
        const myContributions = [
            0, 0, 0, 0, 0, 0, 0, 
            0, 0, 1, 2, 3, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0  
        ];

        myContributions.forEach(level => {
            const cube = document.createElement('div');
            cube.classList.add('git-cube');
            if (level > 0) cube.classList.add(`git-lv-${level}`);
            githubGrid.appendChild(cube);
        });
    }
});

/**
 * [Phase 14 수정] 전역 중앙 토스트 시스템 (Toast Notification)
 */
function showToast(message) {
    // 컨테이너 ID를 중앙 배치용으로 변경합니다.
    const container = document.getElementById('toast-center-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = message;

    container.appendChild(toast);

    // 강제 리플로우를 발생시켜 애니메이션이 트리거되도록 합니다.
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); // 0.4초 뒤 요소 삭제
    }, 3000); // 3초 뒤 숨김 시작
}

// ==========================================
// ⭐️ 토스트 팝업 6가지 상황 연동 ⭐️
// ==========================================

// 2. 할 일 생성 (Add Task)
if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
        const taskText = document.getElementById('modal-task-input').value;
        if (taskText.trim() !== '') {
            showToast('새로운 할 일이 추가되었습니다.');
        }
    });
}

// 3. 할 일 삭제 (Delete Task)
if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', () => {
        if (cardToDelete) {
            showToast('할 일이 목록에서 삭제되었습니다.');
        }
    });
}

// 4. 할 일 위치 이동 (Drag & Drop)
// dragend 이벤트 리스너를 찾아서 추가해줘.
function addDragEndListener(card) {
    card.addEventListener('dragend', () => {
        showToast('업무 순서가 변경되었습니다.');
    });
}

// [사이드바 액션 제어 - 실제 구현 버전]
const btnQuickTask = document.getElementById('btn-quick-task');
const btnQuickNote = document.getElementById('btn-quick-note');

// 1. 새로운 할 일: 모달 열기
if (btnQuickTask) {
    btnQuickTask.addEventListener('click', () => {
        if (taskModal) {
            taskModal.style.display = 'flex';
            const modalInput = document.getElementById('modal-task-input');
            if (modalInput) modalInput.focus();
        }
    });
}

// 2. 데일리 메모: 전용 팝업 → 오늘 날짜 key로 바로 저장
const dailyMemoModal = document.getElementById('daily-memo-modal');
const dailyMemoInput = document.getElementById('daily-memo-input');
const dailyMemoCancelBtn = document.getElementById('daily-memo-cancel-btn');
const dailyMemoSaveBtn = document.getElementById('daily-memo-save-btn');
const memoModalDate = document.getElementById('memo-modal-date');

// 오늘 날짜 포맷 + localStorage key 생성 (캘린더와 동일한 규칙)
function getTodayInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();   // 0-indexed
    const day = now.getDate();
    const label = `${year}년 ${month + 1}월 ${day}일`;
    const key = `yoobiMemo_${year}_${month}_${day}`;
    return { label, key };
}

if (btnQuickNote) {
    btnQuickNote.addEventListener('click', () => {
        const { label, key } = getTodayInfo();
        if (memoModalDate) memoModalDate.innerText = `📅 ${label}`;
        
        // ⭐️ 버그 픽스 1: 모달을 열 때 입력창을 항상 비워줍니다. (새로운 항목 추가용)
        if (dailyMemoInput) dailyMemoInput.value = ''; 
        
        if (dailyMemoModal) {
            dailyMemoModal.style.display = 'flex';
            if (dailyMemoInput) dailyMemoInput.focus();
        }
    });
}

// 취소 버튼
if (dailyMemoCancelBtn) {
    dailyMemoCancelBtn.addEventListener('click', () => {
        if (dailyMemoModal) dailyMemoModal.style.display = 'none';
        if (dailyMemoInput) dailyMemoInput.value = '';
    });
}

// 저장 버튼
if (dailyMemoSaveBtn) {
    dailyMemoSaveBtn.addEventListener('click', () => {
        const { label, key } = getTodayInfo();
        const text = dailyMemoInput ? dailyMemoInput.value.trim() : '';
        
        if (!text) {
            showToast('내용을 입력해 주세요! ✏️');
            return;
        }

        // ⭐️ 리스트 방식 적용: 기존 데이터를 배열로 가져와서 새 메모 추가
        let memoArray = [];
        try {
            memoArray = JSON.parse(localStorage.getItem(key) || '[]');
        } catch(e) {
            memoArray = localStorage.getItem(key) ? [localStorage.getItem(key)] : [];
        }

        memoArray.push(text);
        localStorage.setItem(key, JSON.stringify(memoArray));

        const currentMemoKey = document.getElementById('save-memo-btn')?.getAttribute('data-key');
        if (currentMemoKey === key) {
            renderMemoList(memoArray, key);
        }

        if (dailyMemoModal) dailyMemoModal.style.display = 'none';
        showToast(`${label} 메모가 추가되었습니다. 📝`);
        
        window.updateCalendarBadges(); // 👈 ⭐️ 데일리 메모를 써도 즉시 배지 업데이트!
    });
}

// 모달 바깥 클릭 시 닫기
if (dailyMemoModal) {
    dailyMemoModal.addEventListener('click', (e) => {
        if (e.target === dailyMemoModal) dailyMemoModal.style.display = 'none';
    });
}

// [script.js 교체] ⭐️ 무적의 캘린더 알림 업데이트 (메모는 빨간 배지, 타임라인은 파란 점)
window.updateCalendarBadges = function() {
    const dateSlots = document.querySelectorAll('.calendar-dates div:not(.empty)');
    
    dateSlots.forEach(slot => {
        const day = slot.getAttribute('data-date');
        if(!day) return;
        
        const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`;
        const memoArr = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
        const timeArr = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');
        
        // 1. 기존에 그려진 배지와 도트를 일단 싹 청소합니다.
        const existingBadge = slot.querySelector('.event-badge');
        if(existingBadge) existingBadge.remove();

        const existingDot = slot.querySelector('.timeline-dot');
        if(existingDot) existingDot.remove();

        // 2. [메모]가 1개 이상 있다면 기존처럼 우측 상단에 빨간 숫자 배지를 답니다.
        if (memoArr.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'event-badge';
            badge.innerText = memoArr.length;
            slot.appendChild(badge);
        }

        // 3. ⭐️ [타임라인] 일정이 1개라도 있다면 하단 중앙에 파란 점을 콕 찍어줍니다. (개수 무관)
        if (timeArr.length > 0) {
            const dot = document.createElement('span');
            dot.className = 'timeline-dot';
            slot.appendChild(dot);
        }
    });
};

// [script.js 하단 빈 공간에 새롭게 추가해 주세요]

function renderMemoList(memoArray, memoKey) {
    const listContainer = document.getElementById('memo-list');
    if(!listContainer) return;
    
    listContainer.innerHTML = ''; // 기존 목록 싹 비우기
    
    if(memoArray.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#8b95a1; font-size:13px; margin-top: 20px;">등록된 메모가 없습니다.</p>';
        return;
    }

    memoArray.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'memo-item';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'memo-text';
        textSpan.innerText = text; 
        
        // 텍스트 클릭 시 펼치기/접기
        textSpan.addEventListener('click', () => {
            textSpan.classList.toggle('expanded');
        });
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-memo-btn';
        delBtn.innerText = '×';
        
        // X 버튼 누르면 해당 메모만 삭제하고 배지 업데이트
        delBtn.addEventListener('click', () => {
            let currentArr = JSON.parse(localStorage.getItem(memoKey) || '[]');
            currentArr.splice(index, 1); // 클릭한 메모만 배열에서 쏙 빼기
            localStorage.setItem(memoKey, JSON.stringify(currentArr)); // 남은 거 다시 저장
            renderMemoList(currentArr, memoKey); // 새로고침
            showToast('메모가 삭제되었습니다. 🗑️');
            
            if (window.updateCalendarBadges) {
                window.updateCalendarBadges(); // 지웠을 때 달력 배지 업데이트!
            }
        });
        
        item.appendChild(textSpan);
        item.appendChild(delBtn);
        listContainer.appendChild(item);
    });
}

// ==========================================
// 🗓️ [Phase 7 업그레이드] 타임라인 & 메모 분리 제어 로직
// ==========================================

const saveMemoBtn = document.getElementById('save-memo-btn'); // 저장 버튼
const memoInput = document.getElementById('memo-input'); // 텍스트 입력창
const btnViewMemo = document.getElementById('btn-view-memo'); // 메모 탭
const btnViewTimeline = document.getElementById('btn-view-timeline'); // 타임라인 탭
const memoListArea = document.getElementById('memo-list'); // 메모 리스트 영역
const plannerTimelineArea = document.getElementById('planner-timeline'); // 타임라인 영역

// ⭐️ 1. 탭 전환 로직 (UI 변경 및 각각의 DB 불러오기)
if (btnViewMemo && btnViewTimeline) { 
    btnViewMemo.addEventListener('click', () => { 
        memoListArea.style.display = 'flex'; 
        plannerTimelineArea.style.display = 'none'; 
        btnViewMemo.classList.add('active'); 
        btnViewTimeline.classList.remove('active'); 
        
        // UI 변경: 메모 모드
        if(memoInput) memoInput.placeholder = "새로운 메모를 추가해보세요...";
        if(saveMemoBtn) saveMemoBtn.innerText = "메모 추가하기 💾";

        const baseKey = saveMemoBtn.getAttribute('data-base-key'); 
        if (baseKey) {
            const memoArray = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
            renderMemoList(memoArray, `yoobiMemo_${baseKey}`); // 메모 렌더링
        }
    }); 

    btnViewTimeline.addEventListener('click', () => { 
        memoListArea.style.display = 'none'; 
        plannerTimelineArea.style.display = 'flex'; 
        btnViewTimeline.classList.add('active'); 
        btnViewMemo.classList.remove('active'); 
        
        // UI 변경: 타임라인 모드
        if(memoInput) memoInput.placeholder = "일정을 입력하세요 (예: 14:00 미팅)";
        if(saveMemoBtn) saveMemoBtn.innerText = "일정 추가하기 ⏰";

        const baseKey = saveMemoBtn.getAttribute('data-base-key'); 
        if (baseKey) {
            const timeArray = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');
            renderTimeline(timeArray, `yoobiTimeline_${baseKey}`);  // 타임라인 렌더링
        } 
    }); 
} 

// ⭐️ 2. 스마트 저장 버튼 로직 (어느 탭이냐에 따라 다른 금고에 저장)
if (saveMemoBtn) {
    saveMemoBtn.addEventListener('click', () => {
        const baseKey = saveMemoBtn.getAttribute('data-base-key'); 
        if (!baseKey) return alert('왼쪽 달력에서 날짜를 먼저 선택해주세요! 📅');

        const text = memoInput.value.trim();
        if (!text) return showToast('내용을 입력해 주세요! ✏️');

        const isTimelineMode = btnViewTimeline.classList.contains('active');

        if (isTimelineMode) {
            // [타임라인 저장] 시간 포맷(00:00)이 있는지 검사!
            if (!/(\d{1,2}:\d{2})/.test(text)) {
                return showToast('시간을 포함해주세요! (예: 14:00 미팅) ⏰');
            }
            const timeKey = `yoobiTimeline_${baseKey}`;
            const timeArray = JSON.parse(localStorage.getItem(timeKey) || '[]');
            timeArray.push(text);
            localStorage.setItem(timeKey, JSON.stringify(timeArray));
            
            renderTimeline(timeArray, timeKey); // 타임라인 즉시 새로고침
            showToast('타임라인 일정이 추가되었습니다. ⏰'); // 알림 1개!
        } else {
            // [일반 메모 저장]
            const memoKey = `yoobiMemo_${baseKey}`;
            const memoArray = JSON.parse(localStorage.getItem(memoKey) || '[]');
            memoArray.push(text);
            localStorage.setItem(memoKey, JSON.stringify(memoArray));
            
            renderMemoList(memoArray, memoKey); // 메모 즉시 새로고침
            showToast('새로운 메모가 추가되었습니다. 📝'); // 알림 1개!
        }

        memoInput.value = ''; // 입력창 비우기
        if (window.updateCalendarBadges) window.updateCalendarBadges(); // 배지 즉시 갱신
    });
}

// ⭐️ 3. 완전히 새롭게 추가되는 타임라인 렌더링 함수!
function renderTimeline(timeArray, timeKey) { 
    if (!plannerTimelineArea) return; 
    plannerTimelineArea.innerHTML = ''; 

    const timelineData = timeArray 
        .map((text, index) => { 
            const timeMatch = text.match(/(\d{1,2}:\d{2})/); 
            return { 
                originalIndex: index, // 나중에 지울 때를 대비해 진짜 순서를 기억해둠
                time: timeMatch ? timeMatch[0] : '00:00', 
                content: text.replace(/(\d{1,2}:\d{2})/, '').trim() 
            }; 
        }) 
        .sort((a, b) => a.time.localeCompare(b.time)); // 시간순 정렬

    if (timelineData.length === 0) { 
        plannerTimelineArea.innerHTML = '<p style="text-align:center; color:#8b95a1; font-size:13px; margin-top: 20px;">등록된 일정이 없습니다.</p>'; 
        return; 
    } 

    timelineData.forEach(item => { 
        const div = document.createElement('div'); 
        div.className = 'timeline-item'; 
        div.innerHTML = ` 
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                <div>
                    <span class="timeline-time">${item.time}</span> 
                    <span class="timeline-text">${item.content}</span> 
                </div>
                <button class="delete-memo-btn" style="padding-top:0;">×</button>
            </div>
        `; 
        
        // ❌ X 버튼 누르면 타임라인 개별 삭제
        const delBtn = div.querySelector('.delete-memo-btn');
        delBtn.addEventListener('click', () => {
            let currentArr = JSON.parse(localStorage.getItem(timeKey) || '[]');
            currentArr.splice(item.originalIndex, 1); 
            localStorage.setItem(timeKey, JSON.stringify(currentArr)); 
            renderTimeline(currentArr, timeKey); 
            showToast('일정이 삭제되었습니다. 🗑️');
            if (window.updateCalendarBadges) window.updateCalendarBadges();
        });

        plannerTimelineArea.appendChild(div); 
    }); 
}