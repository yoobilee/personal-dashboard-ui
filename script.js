// ==========================================
// [전역 변수] Phase 9/10에서 공통으로 쓰이는 변수들
// ==========================================
const homeView = document.getElementById('home-view');
const dashboardView = document.getElementById('dashboard-view');
const goDashboardBtn = document.getElementById('go-to-dashboard-btn');
const goToHomeBtn = document.getElementById('go-to-home-btn');
const deleteModal = document.getElementById('delete-modal'); 
const deleteConfirmBtn = document.getElementById('delete-confirm-btn'); 
const deleteCancelBtn = document.getElementById('delete-cancel-btn'); 

let cardToDeleteId = null; // ⭐️ 삭제할 카드의 ID를 임시로 담아둘 공간
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
            homeView.classList.remove('active'); 
            dashboardView.classList.add('active'); 
        } else {
            dashboardView.classList.remove('active'); 
            homeView.classList.add('active'); 
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

// ==========================================
// 🚀 [통합 고도화] 칸반 보드 & 사이드바 연동 엔진
// ==========================================

// 1. 필요한 요소 선언 (사이드바 버튼과 공유하기 위해 괄호 밖으로 빼거나 명확히 정의합니다)
const taskModal = document.getElementById('task-modal');
const modalAddBtn = document.getElementById('modal-add-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const detailModal = document.getElementById('card-detail-modal');
const detailSaveBtn = document.getElementById('detail-save-btn');
const detailCancelBtn = document.getElementById('detail-cancel-btn');
const columns = document.querySelectorAll('.column');

let kanbanData = []; // ⭐️ 모든 데이터의 심장

// ⭐️ [함수 1] 화면을 새로 그리는 핵심 (State -> UI)
function renderBoard() {
    columns.forEach(col => {
        col.querySelectorAll('.task-card').forEach(card => card.remove());
    });

    kanbanData.forEach(cardObj => {
        const cardEl = createCardElement(cardObj);
        const colIdx = cardObj.status === 'todo' ? 0 : cardObj.status === 'doing' ? 1 : 2;
        columns[colIdx].appendChild(cardEl);
    });
    
    // ⭐️ 데이터 저장 (금고 v2)
    localStorage.setItem('yoobiTasks_v2', JSON.stringify(kanbanData));
}

// ⭐️ [함수 2] 카드 생성 (부드러운 드래그 & 우선순위 포함)
function createCardElement(cardObj) {
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true');
    card.dataset.id = cardObj.id;

    const priorityMap = { low: '낮음', medium: '보통', high: '긴급' };

    card.innerHTML = `
        <button class="delete-btn">×</button>
        <span class="tag ${cardObj.priority}">${priorityMap[cardObj.priority]}</span>
        <p class="task-title">${cardObj.title}</p>
        ${cardObj.dueDate ? `<span class="task-date">📅 ${cardObj.dueDate}</span>` : ''}
    `;

    // 드래그 시 쫀득한 플레이스홀더 전환
    card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging'); // (기둥 사이 위치 계산용)
        
        // 브라우저가 예쁜 카드 모양을 복사(Ghost)해 가도록 아주 찰나의 시간을 준 뒤,
        // 남은 원본 카드를 '점선 박스(placeholder)'로 변신시킵니다!
        setTimeout(() => {
            card.classList.add('placeholder');
            card.style.opacity = '1'; // 투명해지지 않고 점선을 유지합니다.
        }, 0);
    });

    card.addEventListener('dragend', () => {
        // 드롭하는 순간 원래의 예쁜 카드로 샥! 돌아옵니다.
        card.classList.remove('placeholder');
        card.classList.remove('dragging');
    });

    // 클릭 시 상세 모달 열기
    card.addEventListener('click', (e) => {
        if(e.target.classList.contains('delete-btn')) return;
        openDetailModal(cardObj);
    });

    // 삭제 버튼 누르면 즉시 삭제하지 않고 확인 모달 띄우기
    card.querySelector('.delete-btn').addEventListener('click', () => {
        cardToDeleteId = cardObj.id; // 삭제할 ID를 타겟으로 지정
        if(deleteModal) deleteModal.style.display = 'flex'; // 모달 열기
    });

    return card;
}

// ⭐️ [함수 3] 상세 모달 데이터 매핑
function openDetailModal(cardObj) {
    document.getElementById('edit-card-id').value = cardObj.id;
    document.getElementById('edit-card-title').value = cardObj.title;
    document.getElementById('edit-card-desc').value = cardObj.desc || '';
    document.getElementById('edit-card-priority').value = cardObj.priority;
    const pText = cardObj.priority === 'high' ? '긴급 (High)' : cardObj.priority === 'medium' ? '보통 (Medium)' : '낮음 (Low)';
    document.getElementById('detail-priority-selected').innerText = pText; // ⭐️ 여기도 삭제
    document.getElementById('edit-card-date').value = cardObj.dueDate || '';
    detailModal.style.display = 'flex';
}

// --- 이벤트 리스너 (모달 제어) ---

// 1. 빠른 할 일 추가 로직 (사이드바)
if(modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
        const input = document.getElementById('modal-task-input');
        const priorityInput = document.getElementById('modal-task-priority'); // ⭐️ 새로 추가된 드롭다운
        
        if(!input.value.trim()) return showToast('할 일을 입력해 주세요! ✏️');
        
        kanbanData.push({
            id: Date.now(), 
            title: input.value, 
            desc: '',
            priority: priorityInput ? priorityInput.value : 'low', // ⭐️ 선택된 중요도 값 가져오기
            dueDate: '', 
            status: 'todo'
        });
        
        renderBoard();
        input.value = '';
        if(priorityInput) priorityInput.value = 'low'; // 다음을 위해 '낮음'으로 초기화
        taskModal.style.display = 'none';
        showToast('빠른 할 일이 추가되었습니다. ⚡');
    });
}

// ⭐️ 상세 저장: 실시간 색상 반영 핵심!
// 3. 상세 저장 로직: '새로 추가'와 '기존 수정' 완벽 구분!
if(detailSaveBtn) {
    detailSaveBtn.addEventListener('click', () => {
        const idValue = document.getElementById('edit-card-id').value; // 숨겨진 ID 가져오기
        const titleInput = document.getElementById('edit-card-title').value;
        const descInput = document.getElementById('edit-card-desc').value;
        const priorityInput = document.getElementById('edit-card-priority').value;
        const dateInput = document.getElementById('edit-card-date').value;

        if(!titleInput.trim()) return showToast('제목을 입력해 주세요! ✏️');

        if (idValue === '') {
            // ⭐️ ID가 비어있다 = 칸반 보드에서 새로 만들기를 눌렀다!
            kanbanData.push({
                id: Date.now(),
                title: titleInput,
                desc: descInput,
                priority: priorityInput,
                dueDate: dateInput,
                status: 'todo' // 무조건 To Do 기둥으로 들어감
            });
            showToast('상세한 할 일이 추가되었습니다. 📋');
        } else {
            // ⭐️ ID가 있다 = 기존 카드를 클릭해서 수정 중이다!
            const id = parseInt(idValue);
            const cardObj = kanbanData.find(c => c.id === id);
            if(cardObj) {
                cardObj.title = titleInput;
                cardObj.desc = descInput;
                cardObj.priority = priorityInput;
                cardObj.dueDate = dateInput;
                showToast('변경 사항이 저장되었습니다. ✨');
            }
        }
        
        renderBoard(); 
        detailModal.style.display = 'none';
    });
}

if(modalCancelBtn) modalCancelBtn.addEventListener('click', () => { taskModal.style.display = 'none'; });
if(detailCancelBtn) detailCancelBtn.addEventListener('click', () => { detailModal.style.display = 'none'; });

// ==========================================
// ⭐️ 삭제 확인 팝업 버튼 로직
// ==========================================
if(deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', () => {
        if (cardToDeleteId !== null) {
            // 진짜로 데이터 삭제!
            kanbanData = kanbanData.filter(c => c.id !== cardToDeleteId);
            renderBoard(); // 화면 다시 그리기
            
            deleteModal.style.display = 'none'; // 팝업 닫기
            showToast('일정이 안전하게 삭제되었습니다. 🗑️');
            cardToDeleteId = null; // 임시 타겟 초기화
        }
    });
}

if(deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none'; // 취소 시 팝업만 닫기
        cardToDeleteId = null; // 임시 타겟 초기화
    });
}

// ⭐️ [부드러운 드래그] 기둥 사이 위치 계산 로직
columns.forEach((column, index) => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(column, e.clientY);
        
        if (afterElement == null) {
            column.appendChild(draggingCard);
        } else {
            column.insertBefore(draggingCard, afterElement);
        }
    });

    column.addEventListener('drop', () => {
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            const cardId = parseInt(draggingCard.dataset.id);
            const cardObj = kanbanData.find(c => c.id === cardId);
            const newStatus = index === 0 ? 'todo' : index === 1 ? 'doing' : 'done';
            
            if (cardObj.status !== newStatus) {
                cardObj.status = newStatus;
                renderBoard(); 
                showToast(`상태 변경: ${newStatus.toUpperCase()} 🚀`);
            }
        }
    });
});

// 드래그 시 삽입 지점 찾는 헬퍼 함수
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ⭐️ 데이터 로드 (v2)
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('yoobiTasks_v2');
    if (saved) {
        kanbanData = JSON.parse(saved);
        renderBoard();
    }
});

/**
 * [Phase 5] 스타일리시 다크 모드 스위치 연동
 */ 
const themeCheckbox = document.getElementById('theme-checkbox'); 
const body = document.body; 
const savedTheme = localStorage.getItem('yoobiTheme'); 

if (savedTheme === 'dark') { 
    body.classList.add('dark-mode'); 
    if (themeCheckbox) themeCheckbox.checked = true; 
} 

if (themeCheckbox) { 
    themeCheckbox.addEventListener('change', () => { 
        if (themeCheckbox.checked) { 
            body.classList.add('dark-mode'); 
            localStorage.setItem('yoobiTheme', 'dark'); 
        } else { 
            body.classList.remove('dark-mode'); 
            localStorage.setItem('yoobiTheme', 'light'); 
        } 
    }); 
} 

/**
 * [Phase 7] 3페이지 유비의 캘린더 & 메모장 구동 로직
 */ 
const todayDate = new Date(); 
let currentCalYear = todayDate.getFullYear(); 
let currentCalMonth = todayDate.getMonth(); 

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

    // 요일 시작점을 맞춰주는 투명 빈칸 채우기
    for (let i = 0; i < startDayOfWeek; i++) { 
        const emptySlot = document.createElement('div'); 
        emptySlot.classList.add('empty'); 
        datesElement.appendChild(emptySlot); 
    } 

    // 실제 날짜 채우기 (배지용 data-date 포함)
    for (let day = 1; day <= totalDaysInMonth; day++) { 
        const dateSlot = document.createElement('div'); 
        dateSlot.innerText = day; 
        
        dateSlot.setAttribute('data-date', day); 

        if (isThisMonth && day === realToday.getDate()) { 
            dateSlot.classList.add('today'); 
        } 

        // 날짜 클릭 시 동작 (메모 입력창 클리어 + 리스트 렌더링)
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

                const memoInput = document.getElementById('memo-input');
                if(memoInput) memoInput.value = ''; 

                const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`; 
                const saveBtn = document.getElementById('save-memo-btn');
                if(saveBtn) saveBtn.setAttribute('data-base-key', baseKey); 

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
    
    // 달력을 다 그린 후 마지막에 메모 개수 배지 달기
    if(window.updateCalendarBadges) window.updateCalendarBadges(); 
}

document.addEventListener('DOMContentLoaded', () => { renderCalendar(); }); 

const prevMonthBtn = document.getElementById('prev-month');
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => { 
        currentCalMonth--;
        if (currentCalMonth < 0) { currentCalMonth = 11; currentCalYear--; }
        renderCalendar();
    });
}

const nextMonthBtn = document.getElementById('next-month');
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => { 
        currentCalMonth++;
        if (currentCalMonth > 11) { currentCalMonth = 0; currentCalYear++; }
        renderCalendar();
    });
}

// ==========================================
// 🔀 [Phase 9] 세이프 해시 라우팅 (초기 로드 최적화)
// ==========================================
let isInitialLoad = true; 

function handleRouting() {
    const hash = window.location.hash || '#home';
    const homeView = document.getElementById('home-view'); 
    const dashboardView = document.getElementById('dashboard-view'); 

    if (routeTimeout) clearTimeout(routeTimeout);

    if (isInitialLoad) {
        if (hash === '#dashboard') {
            if (homeView) homeView.classList.remove('active'); 
            if (dashboardView) dashboardView.classList.add('active'); 
        } else {
            if (dashboardView) dashboardView.classList.remove('active'); 
            if (homeView) homeView.classList.add('active'); 
        }
        isInitialLoad = false; 
        return; 
    }

    if (homeView) homeView.classList.remove('active'); 
    if (dashboardView) dashboardView.classList.remove('active'); 

    routeTimeout = setTimeout(() => {
        if (hash === '#dashboard') {
            if (dashboardView) dashboardView.classList.add('active'); 
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
            if (homeView) homeView.classList.add('active'); 
        }
        routeTimeout = null;
    }, 300); 
}

window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', handleRouting);

if (goDashboardBtn) goDashboardBtn.addEventListener('click', () => { window.location.hash = 'dashboard'; });
if (goToHomeBtn) goToHomeBtn.addEventListener('click', () => { window.location.hash = 'home'; });

/**
 * [Phase 10 최종] Three.js WebGL: Neural Network Field
 */
if (homeView && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    Object.assign(renderer.domElement.style, {
        position: 'absolute', 
        top: '0', left: '0',
        width: '100%', height: '100%',
        zIndex: '0',         
        pointerEvents: 'none' 
    });
    homeView.appendChild(renderer.domElement);
    camera.position.z = 42;

    const NODE_COUNT = 180;  
    const LINK_DIST = 9.0;  
    const W = 98, H = 47;     

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: (Math.random() - 0.5) * W,
        y: (Math.random() - 0.5) * H,
        z: (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.012, 
        vy: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2, 
    }));

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

    const MAX_LINES = NODE_COUNT * NODE_COUNT;
    const lineGeo = new THREE.BufferGeometry();
    const linePosArr = new Float32Array(MAX_LINES * 6); 
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

    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-9999, -9999); 
    let mouse3D = null; 

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

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObject(hitPlane);
        mouse3D = hits.length > 0 ? hits[0].point : null;

        nodes.forEach((n, i) => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x > W / 2 || n.x < -W / 2) n.vx *= -1;
            if (n.y > H / 2 || n.y < -H / 2) n.vy *= -1;

            if (mouse3D) {
                const dx = n.x - mouse3D.x;
                const dy = n.y - mouse3D.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const REPEL = 5.0; 
                if (d < REPEL && d > 0.01) {
                    const force = (1 - d / REPEL) * 0.04;
                    n.x += (dx / d) * force;
                    n.y += (dy / d) * force;
                }
            }

            nodePosArr[i * 3] = n.x;
            nodePosArr[i * 3 + 1] = n.y;
            nodePosArr[i * 3 + 2] = n.z;

            const isDark = document.body.classList.contains('dark-mode');
            let tr = isDark ? 0.18 : 0.06;
            let tg = isDark ? 0.38 : 0.14;
            let tb = isDark ? 0.65 : 0.28;
            const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + n.phase); 

            if (mouse3D) {
                const dx = n.x - mouse3D.x;
                const dy = n.y - mouse3D.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const GLOW = 9.0; 
                if (d < GLOW) {
                    const intensity = (1 - d / GLOW) * (0.6 + 0.4 * pulse);
                    tr += 0.0 * intensity; 
                    tg += 0.85 * intensity; 
                    tb += 1.0 * intensity; 
                }
            }

            tr += 0.02 * pulse;
            tg += 0.04 * pulse;
            tb += 0.07 * pulse;

            nodeColorArr[i * 3] += (tr - nodeColorArr[i * 3]) * 0.12;
            nodeColorArr[i * 3 + 1] += (tg - nodeColorArr[i * 3 + 1]) * 0.12;
            nodeColorArr[i * 3 + 2] += (tb - nodeColorArr[i * 3 + 2]) * 0.12;
        });

        nodeGeo.attributes.position.needsUpdate = true;
        nodeGeo.attributes.color.needsUpdate = true;

        let lineIdx = 0;
        for (let a = 0; a < NODE_COUNT; a++) {
            for (let b = a + 1; b < NODE_COUNT; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dz = nodes[a].z - nodes[b].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < LINK_DIST) {
                    const alpha = 1 - dist / LINK_DIST;
                    const isDarkLine = document.body.classList.contains('dark-mode');

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
                    linePosArr[base] = nodes[a].x;
                    linePosArr[base + 1] = nodes[a].y;
                    linePosArr[base + 2] = nodes[a].z;
                    lineColorArr[base] = lr;
                    lineColorArr[base + 1] = lg;
                    lineColorArr[base + 2] = lb;
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

        for (let k = lineIdx * 6; k < MAX_LINES * 6; k++) linePosArr[k] = 0;

        lineGeo.setDrawRange(0, lineIdx * 2); 
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function scrollToBoard() {
    const target = document.querySelector('.board-container');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
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

        const shX = moveX * -5;
        const shY = (moveY * -5) + 10; 
        content.style.setProperty('--sh-x', `${shX}px`);
        content.style.setProperty('--sh-y', `${shY}px`);
    });
    item.addEventListener('mouseleave', () => {
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
// [Phase 13 수정] GitHub 수동 잔디 데이터 설정
// ==========================================
document.addEventListener('DOMContentLoaded', () => { 
    const githubGrid = document.getElementById('github-grid');
    const githubMonth = document.querySelector('.github-month'); 

    if (githubGrid) {
        if (githubMonth) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentMonthIndex = new Date().getMonth(); 
            githubMonth.innerText = monthNames[currentMonthIndex];
        }

        const myContributions = [
            0, 0, 0, 0, 0, 0, 0, 
            0, 1, 2, 4, 0, 3, 0, 
            2, 1, 0, 0, 0, 0, 0, 
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
 * [Phase 14 수정] 전역 중앙 토스트 시스템
 */
function showToast(message) {
    const container = document.getElementById('toast-center-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = message;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); 
    }, 3000); 
}

// ==========================================
// 🚀 [사이드바 & 칸반 액션 제어: 모든 무감 버튼 해결 및 동기화]
// ==========================================
const btnQuickTask = document.getElementById('btn-quick-task');
const btnQuickNote = document.getElementById('btn-quick-note');

// 1. 새로운 할 일: 모달 열기 (사이드바 버튼)
if (btnQuickTask) {
    btnQuickTask.addEventListener('click', () => {
        if (taskModal) {
            taskModal.style.display = 'flex';
            const modalInput = document.getElementById('modal-task-input');
            if (modalInput) modalInput.focus();
        }
    });
}

// 2. 칸반 보드 안의 '+ 새로운 할 일' 버튼 연결
const addBtn = document.querySelector('.add-btn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        // ⭐️ 칸반 보드에서 누르면 '상세 설정 모달'을 빈칸으로 엽니다!
        document.getElementById('edit-card-id').value = ''; // 핵심: ID를 비워서 '수정'이 아니라 '새 카드'임을 알림
        document.getElementById('edit-card-title').value = '';
        document.getElementById('edit-card-desc').value = '';
        document.getElementById('edit-card-priority').value = 'low';
        document.getElementById('edit-card-date').value = '';
        
        if (detailModal) {
            detailModal.style.display = 'flex';
            document.getElementById('edit-card-title')?.focus(); // 제목 칸에 커서 바로 놓기
        }
    });
}

// 3. 데일리 메모: 전용 팝업 → 오늘 날짜 key로 바로 저장
const dailyMemoModal = document.getElementById('daily-memo-modal');
const dailyMemoInput = document.getElementById('daily-memo-input');
const dailyMemoCancelBtn = document.getElementById('daily-memo-cancel-btn');
const dailyMemoSaveBtn = document.getElementById('daily-memo-save-btn');
const memoModalDate = document.getElementById('memo-modal-date');

function getTodayInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();   
    const day = now.getDate();
    const label = `${year}년 ${month + 1}월 ${day}일`;
    const key = `yoobiMemo_${year}_${month}_${day}`;
    return { label, key };
}

if (btnQuickNote) {
    btnQuickNote.addEventListener('click', () => {
        const { label } = getTodayInfo();
        if (memoModalDate) memoModalDate.innerText = `📅 ${label}`;
        if (dailyMemoInput) dailyMemoInput.value = ''; 
        if (dailyMemoModal) {
            dailyMemoModal.style.display = 'flex';
            if (dailyMemoInput) dailyMemoInput.focus();
        }
    });
}

if (dailyMemoCancelBtn) {
    dailyMemoCancelBtn.addEventListener('click', () => {
        if (dailyMemoModal) dailyMemoModal.style.display = 'none';
        if (dailyMemoInput) dailyMemoInput.value = '';
    });
}

if (dailyMemoSaveBtn) {
    dailyMemoSaveBtn.addEventListener('click', () => {
        const { label, key } = getTodayInfo();
        const text = dailyMemoInput ? dailyMemoInput.value.trim() : '';
        
        if (!text) {
            showToast('내용을 입력해 주세요! ✏️');
            return;
        }

        let memoArray = [];
        try {
            memoArray = JSON.parse(localStorage.getItem(key) || '[]');
        } catch(e) {
            memoArray = localStorage.getItem(key) ? [localStorage.getItem(key)] : [];
        }

        memoArray.push(text);
        localStorage.setItem(key, JSON.stringify(memoArray));

        // ⭐️ [버그 픽스] 현재 달력에서 선택된 날짜와 일치하면 즉시 화면에 띄우기!
        const saveBtn = document.getElementById('save-memo-btn');
        const currentSelectedBaseKey = saveBtn?.getAttribute('data-base-key');
        const todayBaseKey = key.replace('yoobiMemo_', '');

        if (currentSelectedBaseKey === todayBaseKey) {
            const btnViewMemo = document.getElementById('btn-view-memo');
            if (btnViewMemo && btnViewMemo.classList.contains('active')) {
                renderMemoList(memoArray, key);
            } else if (btnViewMemo) {
                btnViewMemo.click(); // 타임라인 모드였다면 메모 모드로 강제 전환
            }
        }

        if (dailyMemoModal) dailyMemoModal.style.display = 'none';
        showToast(`${label} 메모가 추가되었습니다. 📝`);
        
        if (window.updateCalendarBadges) window.updateCalendarBadges(); 
    });
}

if (dailyMemoModal) {
    dailyMemoModal.addEventListener('click', (e) => {
        if (e.target === dailyMemoModal) dailyMemoModal.style.display = 'none';
    });
}

window.updateCalendarBadges = function() {
    const dateSlots = document.querySelectorAll('.calendar-dates div:not(.empty)');
    
    dateSlots.forEach(slot => {
        const day = slot.getAttribute('data-date');
        if(!day) return;
        
        const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`;
        const memoArr = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
        const timeArr = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');
        
        const existingBadge = slot.querySelector('.event-badge');
        if(existingBadge) existingBadge.remove();

        const existingDot = slot.querySelector('.timeline-dot');
        if(existingDot) existingDot.remove();

        if (memoArr.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'event-badge';
            badge.innerText = memoArr.length;
            slot.appendChild(badge);
        }

        if (timeArr.length > 0) {
            const dot = document.createElement('span');
            dot.className = 'timeline-dot';
            slot.appendChild(dot);
        }
    });
};

function renderMemoList(memoArray, memoKey) {
    const listContainer = document.getElementById('memo-list');
    if(!listContainer) return;
    
    listContainer.innerHTML = ''; 
    
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
        
        textSpan.addEventListener('click', () => {
            textSpan.classList.toggle('expanded');
        });
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-memo-btn';
        delBtn.innerText = '×';
        
        delBtn.addEventListener('click', () => {
            let currentArr = JSON.parse(localStorage.getItem(memoKey) || '[]');
            currentArr.splice(index, 1); 
            localStorage.setItem(memoKey, JSON.stringify(currentArr)); 
            renderMemoList(currentArr, memoKey); 
            showToast('메모가 삭제되었습니다. 🗑️');
            
            if (window.updateCalendarBadges) {
                window.updateCalendarBadges(); 
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
const saveMemoBtn = document.getElementById('save-memo-btn'); 
const memoInput = document.getElementById('memo-input'); 
const btnViewMemo = document.getElementById('btn-view-memo'); 
const btnViewTimeline = document.getElementById('btn-view-timeline'); 
const memoListArea = document.getElementById('memo-list'); 
const plannerTimelineArea = document.getElementById('planner-timeline'); 

if (btnViewMemo && btnViewTimeline) { 
    btnViewMemo.addEventListener('click', () => { 
        memoListArea.style.display = 'flex'; 
        plannerTimelineArea.style.display = 'none'; 
        btnViewMemo.classList.add('active'); 
        btnViewTimeline.classList.remove('active'); 
        
        if(memoInput) memoInput.placeholder = "새로운 메모를 추가해보세요...";
        if(saveMemoBtn) saveMemoBtn.innerText = "메모 추가하기 💾";

        const baseKey = saveMemoBtn.getAttribute('data-base-key'); 
        if (baseKey) {
            const memoArray = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
            renderMemoList(memoArray, `yoobiMemo_${baseKey}`); 
        }
    }); 

    btnViewTimeline.addEventListener('click', () => { 
        memoListArea.style.display = 'none'; 
        plannerTimelineArea.style.display = 'flex'; 
        btnViewTimeline.classList.add('active'); 
        btnViewMemo.classList.remove('active'); 
        
        if(memoInput) memoInput.placeholder = "일정을 입력하세요 (예: 14:00 미팅)";
        if(saveMemoBtn) saveMemoBtn.innerText = "일정 추가하기 ⏰";

        const baseKey = saveMemoBtn.getAttribute('data-base-key'); 
        if (baseKey) {
            const timeArray = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');
            renderTimeline(timeArray, `yoobiTimeline_${baseKey}`);  
        } 
    }); 
} 

if (saveMemoBtn) {
    saveMemoBtn.addEventListener('click', () => {
        const baseKey = saveMemoBtn.getAttribute('data-base-key'); 
        if (!baseKey) return showToast('왼쪽 달력에서 날짜를 먼저 선택해주세요! 📅');

        const text = memoInput.value.trim();
        if (!text) return showToast('내용을 입력해 주세요! ✏️');

        const isTimelineMode = btnViewTimeline.classList.contains('active');

        if (isTimelineMode) {
            if (!/(\d{1,2}:\d{2})/.test(text)) {
                return showToast('시간을 포함해주세요! (예: 14:00 미팅) ⏰');
            }
            const timeKey = `yoobiTimeline_${baseKey}`;
            const timeArray = JSON.parse(localStorage.getItem(timeKey) || '[]');
            timeArray.push(text);
            localStorage.setItem(timeKey, JSON.stringify(timeArray));
            
            renderTimeline(timeArray, timeKey); 
            showToast('타임라인 일정이 추가되었습니다. ⏰'); 
        } else {
            const memoKey = `yoobiMemo_${baseKey}`;
            const memoArray = JSON.parse(localStorage.getItem(memoKey) || '[]');
            memoArray.push(text);
            localStorage.setItem(memoKey, JSON.stringify(memoArray));
            
            renderMemoList(memoArray, memoKey); 
            showToast('새로운 메모가 추가되었습니다. 📝'); 
        }

        memoInput.value = ''; 
        if (window.updateCalendarBadges) window.updateCalendarBadges(); 
    });
}

function renderTimeline(timeArray, timeKey) { 
    if (!plannerTimelineArea) return; 
    plannerTimelineArea.innerHTML = ''; 

    const timelineData = timeArray 
        .map((text, index) => { 
            const timeMatch = text.match(/(\d{1,2}:\d{2})/); 
            return { 
                originalIndex: index, 
                time: timeMatch ? timeMatch[0] : '00:00', 
                content: text.replace(/(\d{1,2}:\d{2})/, '').trim() 
            }; 
        }) 
        .sort((a, b) => a.time.localeCompare(b.time)); 

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

// ==========================================
// ⭐️ 커스텀 드롭다운 작동 로직 (수정된 버전)
// ==========================================
function setupCustomDropdown(selectedId, listId, inputId) {
    const selected = document.getElementById(selectedId);
    const list = document.getElementById(listId);
    const input = document.getElementById(inputId);

    if (!selected || !list || !input) return;

    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-list').forEach(el => {
            if(el !== list) el.classList.remove('show');
        });
        list.classList.toggle('show');
    });

    list.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            selected.innerText = item.innerText; // ⭐️ 화살표 뺀 텍스트 적용
            input.value = item.getAttribute('data-value');
            list.classList.remove('show');
        });
    });
}

// ⭐️ 질문하신 바로 그 부분! (절대 지우면 안 됩니다)
// 두 개의 모달 드롭다운 각각 세팅 
setupCustomDropdown('quick-priority-selected', 'quick-priority-list', 'modal-task-priority');
setupCustomDropdown('detail-priority-selected', 'detail-priority-list', 'edit-card-priority');

// 화면 아무 곳이나 누르면 열려있는 드롭다운 닫기
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-list').forEach(el => el.classList.remove('show'));
});

// 페이지 로드가 완료된 시점에 실행될 이벤트를 등록합니다.
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top'); // HTML에서 최상단 이동 버튼 요소를 가져옵니다.
    const scrollContainer = document.querySelector('.scroll-container'); // 실제 스크롤이 일어나는 컨테이너 박스를 찾습니다.

    // 버튼과 스크롤 박스가 둘 다 정상적으로 존재할 때만 로직을 실행합니다.
    if (backToTopBtn && scrollContainer) {
        
        // 스냅 스크롤 박스 안에서 스크롤이 일어날 때마다 위치를 감지합니다.
        scrollContainer.addEventListener('scroll', () => {
            // 현재 브라우저 창의 높이(1페이지의 높이)를 가져옵니다.
            const viewportHeight = window.innerHeight; 
            
            // 현재 스크롤된 높이가 1.5페이지 지점(2페이지 하단부)을 넘었는지 확인합니다.
            // 이렇게 하면 1페이지(Home), 2페이지(Board)에서는 버튼이 안 보이고, 
            // 3페이지(Calendar)에 도달했을 때만 버튼이 나타납니다.
            if (scrollContainer.scrollTop > viewportHeight * 1.5) {
                backToTopBtn.classList.add('show'); // 버튼을 쫀득하게 화면에 띄웁니다.
            } else {
                backToTopBtn.classList.remove('show'); // 1, 2페이지로 다시 올라가면 버튼을 숨깁니다.
            }
        });

        // 사용자가 버튼을 클릭했을 때의 동작을 정의합니다.
        backToTopBtn.addEventListener('click', () => {
            // 컨테이너를 맨 위(0점)로 부드럽게 이동시킵니다.
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth' // ⭐️ 텔레포트하지 않고 스르륵 부드럽게 올라갑니다.
            });
        });
    }
});

// ==========================================
// 📍 우측 라인 페이지네이션 (스크롤 스파이)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 3개의 페이지 화면과 우측의 3개의 선을 가져옵니다.
    const pages = document.querySelectorAll('#dashboard-view .page');
    const pageLines = document.querySelectorAll('.page-line');
    const scrollContainer = document.querySelector('.scroll-container');

    if (pages.length === 0 || pageLines.length === 0 || !scrollContainer) return;

    // 1. [스크롤 감지] 화면에 50% 이상 나타난 페이지를 추적합니다.
    const observerOptions = {
        root: scrollContainer,
        rootMargin: '0px',
        threshold: 0.5 // 화면에 절반 이상 보일 때 인식
    };

    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 현재 화면에 나타난 페이지가 몇 번째인지 알아냅니다.
                const pageIndex = Array.from(pages).indexOf(entry.target);
                
                // 모든 선의 색상을 연하게 되돌린 뒤, 현재 화면에 맞는 선만 진하게 칠합니다.
                pageLines.forEach(line => line.classList.remove('active'));
                if(pageLines[pageIndex]) {
                    pageLines[pageIndex].classList.add('active');
                }
            }
        });
    }, observerOptions);

    // 감시 카메라를 각 페이지에 달아줍니다.
    pages.forEach(page => pageObserver.observe(page));

    // 2. [클릭 이동] 우측 선을 클릭하면 해당 페이지로 스르륵 이동합니다.
    pageLines.forEach((line, index) => {
        line.addEventListener('click', () => {
            if(pages[index]) {
                pages[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});