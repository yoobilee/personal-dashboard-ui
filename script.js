// ==========================================
// 🚦 1. 전역 변수 및 통합 SPA 라우팅 엔진 (최상단 배치)
// ==========================================
let routeTimeout = null;
let cardToDeleteId = null;

const homeView = document.getElementById('home-view');
const dashboardView = document.getElementById('dashboard-view');
const goDashboardBtn = document.getElementById('go-to-dashboard-btn');
const profileImage = document.querySelector('.profile-image');
const goToPortfolioBtn = document.getElementById('go-to-portfolio-btn');
const deleteModal = document.getElementById('delete-modal');
const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');

// script.js 상단의 handleRouting 함수 내부 수정

function handleRouting() {
    const hash = window.location.hash || '#home';
    const views = document.querySelectorAll('.app-view');
    const targetId = hash.replace('#', '') + '-view';
    let targetView = document.getElementById(targetId);

    if (!targetView) targetView = document.getElementById('home-view');

    if (routeTimeout) clearTimeout(routeTimeout);

    // ⭐️ 1. 새로 나타날 뷰를 먼저 최상단(z-index)으로 끌어올려 덮을 준비를 합니다.
    targetView.style.zIndex = '20';

    routeTimeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // ⭐️ 2. 모든 뷰의 불투명도를 끄고, 타겟만 켭니다.
        views.forEach(view => {
            if (view !== targetView) {
                view.classList.remove('active');
                view.style.zIndex = '1'; // 나머지 뷰는 뒤로 보냅니다.
            }
        });

        targetView.classList.add('active');
        routeTimeout = null;
    }, 50);
}

window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', handleRouting);

// 버튼 클릭 시 주소 변경 (사이드바 및 대문 버튼)
if (goDashboardBtn) goDashboardBtn.addEventListener('click', () => { window.location.hash = 'dashboard'; });
if (goToPortfolioBtn) goToPortfolioBtn.addEventListener('click', () => { window.location.hash = 'portfolio'; });
if (profileImage) {
    profileImage.style.cursor = 'pointer'; // 마우스를 올리면 손가락 모양으로 변하게 합니다.
    profileImage.addEventListener('click', () => { window.location.hash = 'home'; });
}

// ==========================================
// 🚀 여기서부터 유비님의 기존 기능 100% 원본 보존 영역
// ==========================================

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
        // 기둥 내부의 .task-list 영역을 찾습니다.
        const list = col.querySelector('.task-list');
        // 기존에 그려졌던 카드들만 쏙쏙 골라 삭제합니다.
        list.querySelectorAll('.task-card').forEach(card => card.remove());
    });

    kanbanData.forEach(cardObj => {
        // 데이터를 기반으로 새 카드 요소를 생성합니다.
        const cardEl = createCardElement(cardObj);
        // 상태에 따라 몇 번째 기둥에 넣을지 결정합니다.
        const colIdx = cardObj.status === 'todo' ? 0 : cardObj.status === 'doing' ? 1 : 2;
        // ⭐️ 해당 기둥의 .task-list 바구니 안에 카드를 집어넣습니다.
        columns[colIdx].querySelector('.task-list').appendChild(cardEl);
    });

    // 변경된 데이터를 로컬 스토리지에 저장합니다.
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
        if (e.target.classList.contains('delete-btn')) return;
        openDetailModal(cardObj);
    });

    // 삭제 버튼 누르면 즉시 삭제하지 않고 확인 모달 띄우기
    card.querySelector('.delete-btn').addEventListener('click', () => {
        cardToDeleteId = cardObj.id; // 삭제할 ID를 타겟으로 지정
        if (deleteModal) deleteModal.style.display = 'flex'; // 모달 열기
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
if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
        const input = document.getElementById('modal-task-input');
        const priorityInput = document.getElementById('modal-task-priority'); // ⭐️ 새로 추가된 드롭다운

        if (!input.value.trim()) return showToast('할 일을 입력해 주세요! ✏️');

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
        if (priorityInput) priorityInput.value = 'low'; // 다음을 위해 '낮음'으로 초기화
        taskModal.style.display = 'none';
        showToast('빠른 할 일이 추가되었습니다. ⚡');
    });
}

// ⭐️ 상세 저장: 실시간 색상 반영 핵심!
// 3. 상세 저장 로직: '새로 추가'와 '기존 수정' 완벽 구분!
if (detailSaveBtn) {
    detailSaveBtn.addEventListener('click', () => {
        const idValue = document.getElementById('edit-card-id').value; // 숨겨진 ID 가져오기
        const titleInput = document.getElementById('edit-card-title').value;
        const descInput = document.getElementById('edit-card-desc').value;
        const priorityInput = document.getElementById('edit-card-priority').value;
        const dateInput = document.getElementById('edit-card-date').value;

        if (!titleInput.trim()) return showToast('제목을 입력해 주세요! ✏️');

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
            if (cardObj) {
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

if (modalCancelBtn) modalCancelBtn.addEventListener('click', () => { taskModal.style.display = 'none'; });
if (detailCancelBtn) detailCancelBtn.addEventListener('click', () => { detailModal.style.display = 'none'; });

// ==========================================
// ⭐️ 삭제 확인 팝업 버튼 로직
// ==========================================
if (deleteConfirmBtn) {
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

if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none'; // 취소 시 팝업만 닫기
        cardToDeleteId = null; // 임시 타겟 초기화
    });
}

// ⭐️ [수정] 드래그 오버 로직: 이제 드래그 대상은 .task-list입니다.
columns.forEach((column, index) => {
    // 기둥 내의 리스트 영역을 타겟으로 잡습니다.
    const list = column.querySelector('.task-list');

    list.addEventListener('dragover', (e) => {
        e.preventDefault(); // 기본 드롭 방지 기능을 해제합니다.
        const draggingCard = document.querySelector('.dragging'); // 드래그 중인 카드를 찾습니다.
        const afterElement = getDragAfterElement(list, e.clientY); // 삽입될 위치를 계산합니다.

        if (afterElement == null) {
            list.appendChild(draggingCard); // 리스트의 맨 마지막에 추가합니다.
        } else {
            list.insertBefore(draggingCard, afterElement); // 계산된 위치 앞에 끼워넣습니다.
        }
    });

    // 카드를 떨어뜨렸을(Drop) 때의 상태 변경 로직입니다.
    list.addEventListener('drop', () => {
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            const cardId = parseInt(draggingCard.dataset.id);
            const cardObj = kanbanData.find(c => c.id === cardId);
            const newStatus = index === 0 ? 'todo' : index === 1 ? 'doing' : 'done';

            if (cardObj.status !== newStatus) {
                cardObj.status = newStatus;
                renderBoard(); // 상태가 변했으므로 화면을 다시 그립니다.
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

    if (!titleElement || !datesElement) return;

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
                if (memoDateTitle) memoDateTitle.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월 ${day}일 일정`;

                const memoInput = document.getElementById('memo-input');
                if (memoInput) memoInput.value = '';

                const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`;
                const saveBtn = document.getElementById('save-memo-btn');
                if (saveBtn) saveBtn.setAttribute('data-base-key', baseKey);

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
    if (window.updateCalendarBadges) window.updateCalendarBadges();
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

/**
 * [Phase 10 최종] Three.js WebGL: Neural Network Field & Matrix Grid
 * (폭발 효과 제거 & 우아한 재정렬 및 고무줄 탄성 적용 완료)
 */
window.yoobiDashMode = 'portfolio'; 

let nodes = [];
const W = 98, H = 47;

if (homeView && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    Object.assign(renderer.domElement.style, {
        position: 'absolute', top: '0', left: '0',
        width: '100%', height: '100%', zIndex: '0', pointerEvents: 'none'
    });
    homeView.appendChild(renderer.domElement);
    camera.position.z = 42;

    const NODE_COUNT = 180;
    const LINK_DIST = 9.0;

    nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
        const gx = (i % 12) - 5.5;
        const gy = (Math.floor(i / 12) % 5) - 2;
        const gz = Math.floor(i / 60) - 1.5;
        
        // ⭐️ 각 입자의 초기 포트폴리오(신경망) 좌표 부여
        const initialNetX = (Math.random() - 0.5) * W;
        const initialNetY = (Math.random() - 0.5) * H;
        const initialNetZ = (Math.random() - 0.5) * 8;

        return {
            x: initialNetX, y: initialNetY, z: initialNetZ,
            netX: initialNetX, netY: initialNetY, netZ: initialNetZ, // 👻 유령 신경망 좌표
            vx: (Math.random() - 0.5) * 0.012, vy: (Math.random() - 0.5) * 0.008,
            phase: Math.random() * Math.PI * 2,
            gridX: gx * 8, gridY: gy * 8, gridZ: gz * 8 // 🧊 대시보드 큐브 좌표
        };
    });

    const nodeGeo = new THREE.BufferGeometry();
    const nodePosArr = new Float32Array(NODE_COUNT * 3);
    const nodeColorArr = new Float32Array(NODE_COUNT * 3);

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColorArr, 3));

    const nodeMat = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    const MAX_LINES = NODE_COUNT * NODE_COUNT;
    const lineGeo = new THREE.BufferGeometry();
    const linePosArr = new Float32Array(MAX_LINES * 6);
    const lineColorArr = new Float32Array(MAX_LINES * 6);

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColorArr, 3));

    const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending }));
    scene.add(lineMat);

    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-9999, -9999);
    let mouse3D = null;
    const hitPlane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ visible: false }));
    scene.add(hitPlane);

    homeView.addEventListener('mousemove', (e) => {
        mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    homeView.addEventListener('mouseleave', () => { mouseNDC.set(-9999, -9999); mouse3D = null; });

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObject(hitPlane);
        mouse3D = hits.length > 0 ? hits[0].point : null;

        const isDash = window.yoobiDashMode === 'dashboard'; 

        nodes.forEach((n, i) => {
            // 1. 화면에 안 보일 때도 포트폴리오 유령 신경망(netX, netY)은 계속 둥둥 떠다니게 둡니다.
            n.netX += n.vx;
            n.netY += n.vy;
            if (n.netX > W / 2 || n.netX < -W / 2) n.vx *= -1;
            if (n.netY > H / 2 || n.netY < -H / 2) n.vy *= -1;

            // 2. 현재 탭 상태에 맞춰 입자가 찾아갈 타겟(Target) 지정
            let targetX = isDash ? n.gridX : n.netX;
            let targetY = isDash ? n.gridY : n.netY;
            let targetZ = isDash ? n.gridZ : n.netZ;

            // 3. 타겟을 향해 부드럽게(Lerp) 스르륵 이동! (폭발 없음, 우아한 재정렬)
            n.x += (targetX - n.x) * 0.08;
            n.y += (targetY - n.y) * 0.08;
            n.z += (targetZ - n.z) * 0.08;

            // 4. 마우스 호버 반발력 (대시보드 큐브 상태에서도 탄성 작용!)
            if (mouse3D) {
                const dx = n.x - mouse3D.x, dy = n.y - mouse3D.y, d = Math.sqrt(dx * dx + dy * dy), REPEL = isDash ? 6.0 : 5.0;
                if (d < REPEL && d > 0.01) { 
                    const force = (1 - d / REPEL) * (isDash ? 0.3 : 0.05); // 큐브 상태에선 더 강한 고무줄 탄성!
                    n.x += (dx / d) * force; n.y += (dy / d) * force; 
                }
            }

            nodePosArr[i * 3] = n.x; nodePosArr[i * 3 + 1] = n.y; nodePosArr[i * 3 + 2] = n.z;

            const isDark = document.body.classList.contains('dark-mode');
            let tr, tg, tb;

            // 5. 모드에 따른 색상 트랜지션
            if (isDash) {
                tr = 0.0; tg = 0.8; tb = 0.5; // 대시보드 초록
            } else {
                tr = isDark ? 0.18 : 0.06; tg = isDark ? 0.38 : 0.14; tb = isDark ? 0.65 : 0.28; // 포폴 파랑
            }

            const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + n.phase);
            
            // 6. 마우스 근처 입자 발광 효과 (공통)
            if (mouse3D) {
                const dx = n.x - mouse3D.x, dy = n.y - mouse3D.y, d = Math.sqrt(dx * dx + dy * dy), GLOW = 9.0;
                if (d < GLOW) {
                    const intensity = (1 - d / GLOW) * (0.6 + 0.4 * pulse);
                    tr += 0.0 * intensity; tg += 0.85 * intensity; tb += 1.0 * intensity;
                }
            }

            nodeColorArr[i * 3] += (tr - nodeColorArr[i * 3]) * 0.12;
            nodeColorArr[i * 3 + 1] += (tg - nodeColorArr[i * 3 + 1]) * 0.12;
            nodeColorArr[i * 3 + 2] += (tb - nodeColorArr[i * 3 + 2]) * 0.12;
        });

        nodeGeo.attributes.position.needsUpdate = true;
        nodeGeo.attributes.color.needsUpdate = true;

        let lineIdx = 0;
        for (let a = 0; a < NODE_COUNT; a++) {
            for (let b = a + 1; b < NODE_COUNT; b++) {
                const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < LINK_DIST) {
                    const alpha = 1 - dist / LINK_DIST;
                    const isDarkLine = document.body.classList.contains('dark-mode');
                    let lr, lg, lb;

                    // ⭐️ 다크모드일 때 선의 밝기를 3배 이상 폭발적으로 끌어올립니다!
                    if (isDash) {
                        lr = 0.0 * alpha; 
                        lg = (isDarkLine ? 1.8 : 0.6) * alpha; // 💻 다크모드 대시보드: 선명한 네온 그린
                        lb = (isDarkLine ? 1.2 : 0.4) * alpha;
                    } else {
                        lr = (isDarkLine ? 0.5 : 0.08) * alpha; 
                        lg = (isDarkLine ? 1.0 : 0.15) * alpha; 
                        lb = (isDarkLine ? 2.0 : 0.30) * alpha; // 🎨 다크모드 포트폴리오: 선명한 네온 블루
                    }

                    if (mouse3D) {
                        const mx = (nodes[a].x + nodes[b].x) / 2 - mouse3D.x, my = (nodes[a].y + nodes[b].y) / 2 - mouse3D.y, md = Math.sqrt(mx * mx + my * my);
                        if (md < 8.0) { const mi = (1 - md / 8.0) * alpha; lg += 0.8 * mi; lb += 1.0 * mi; }
                    }

                    const base = lineIdx * 6;
                    linePosArr[base] = nodes[a].x; linePosArr[base+1] = nodes[a].y; linePosArr[base+2] = nodes[a].z;
                    lineColorArr[base] = lr; lineColorArr[base+1] = lg; lineColorArr[base+2] = lb;
                    linePosArr[base+3] = nodes[b].x; linePosArr[base+4] = nodes[b].y; linePosArr[base+5] = nodes[b].z;
                    lineColorArr[base+3] = lr; lineColorArr[base+4] = lg; lineColorArr[base+5] = lb;
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

// ==========================================
// 🔀 대문 진입점 탭 & 버튼 동기화 엔진 (완성판)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.entry-tab');
    const ctaBtnPort = document.getElementById('hero-cta-btn');
    const ctaBtnDash = document.getElementById('hero-cta-btn-dash');

    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type'); 

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.hero-mode-content').forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(`hero-content-${type}`);
            if (targetContent) {
                targetContent.classList.add('active'); 
            }

            if (type === 'dashboard') {
                updateSystemBriefing();
                window.yoobiDashMode = 'dashboard'; 
            } else {
                window.yoobiDashMode = 'portfolio'; // 폭발 코드 삭제! 스르륵 재정렬됨.
            }
        });
    });

    if (ctaBtnPort) ctaBtnPort.onclick = () => { window.location.hash = 'portfolio'; };
    if (ctaBtnDash) ctaBtnDash.onclick = () => { window.location.hash = 'dashboard'; };

    tabs[0].click(); 
});

// ⭐️ [신규 함수] 큐브 상태의 입자들에게 펑! 터지는 강력한 '폭발 속도'를 부여합니다.
function burstParticles() {
    if (nodes.length > 0) {
        nodes.forEach(n => {
            n.vx = (Math.random() - 0.5) * 2.0; // 엄청난 속도로 사방으로 발사!
            n.vy = (Math.random() - 0.5) * 2.0;
            n.vz = (Math.random() - 0.5) * 2.0;
        });
    }
}

// ==========================================
// 🔀 대문 진입점 탭 & 버튼 동기화 엔진 (최종)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.entry-tab');
    const ctaBtnPort = document.getElementById('hero-cta-btn');
    const ctaBtnDash = document.getElementById('hero-cta-btn-dash');

    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type'); 

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.hero-mode-content').forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(`hero-content-${type}`);
            if (targetContent) {
                targetContent.classList.add('active'); 
            }

            if (type === 'dashboard') {
                updateSystemBriefing();
                window.yoobiDashMode = 'dashboard'; 
            } else {
                // ⭐️ 대시보드(큐브)에서 포트폴리오로 갈 때만 폭발(Burst) 애니메이션 실행!
                if (window.yoobiDashMode === 'dashboard') burstParticles();
                window.yoobiDashMode = 'portfolio'; 
            }
        });
    });

    if (ctaBtnPort) ctaBtnPort.onclick = () => { window.location.hash = 'portfolio'; };
    if (ctaBtnDash) ctaBtnDash.onclick = () => { window.location.hash = 'dashboard'; };

    tabs[0].click(); 
});

// ⭐️ [신규 함수] 포트폴리오로 돌아갈 때 입자들을 사방으로 흩뿌려줍니다.
function disperseParticles() {
    if (nodes.length > 0) {
        nodes.forEach(n => {
            // 위치를 다시 랜덤하게 세팅하여 큐브 구조를 즉시 파괴합니다.
            n.x = (Math.random() - 0.5) * W;
            n.y = (Math.random() - 0.5) * H;
            n.z = (Math.random() - 0.5) * 8;
        });
    }
}

// ==========================================
// 🔀 대문 진입점 탭 & 버튼 동기화 엔진 (최종 수정판)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.entry-tab');
    const ctaBtnPort = document.getElementById('hero-cta-btn');
    const ctaBtnDash = document.getElementById('hero-cta-btn-dash');

    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type'); 

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.hero-mode-content').forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(`hero-content-${type}`);
            if (targetContent) {
                targetContent.classList.add('active'); 
            }

            if (type === 'dashboard') {
                updateSystemBriefing();
                window.yoobiDashMode = 'dashboard'; 
            } else {
                window.yoobiDashMode = 'portfolio'; 
                disperseParticles(); // ⭐️ 큐브를 폭발시켜 다시 흩뿌립니다!
            }
        });
    });

    if (ctaBtnPort) ctaBtnPort.onclick = () => { window.location.hash = 'portfolio'; };
    if (ctaBtnDash) ctaBtnDash.onclick = () => { window.location.hash = 'dashboard'; };

    tabs[0].click(); 
});

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
            2, 1, 1, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0,
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
        } catch (e) {
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

window.updateCalendarBadges = function () {
    const dateSlots = document.querySelectorAll('.calendar-dates div:not(.empty)');

    dateSlots.forEach(slot => {
        const day = slot.getAttribute('data-date');
        if (!day) return;

        const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`;
        const memoArr = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
        const timeArr = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');

        const existingBadge = slot.querySelector('.event-badge');
        if (existingBadge) existingBadge.remove();

        const existingDot = slot.querySelector('.timeline-dot');
        if (existingDot) existingDot.remove();

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
    renderUpcomingEvent(); // 메모가 변경될 때마다 D-Day 위젯도 새로고침
};

function renderMemoList(memoArray, memoKey) {
    const listContainer = document.getElementById('memo-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (memoArray.length === 0) {
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

        if (memoInput) memoInput.placeholder = "새로운 메모를 추가해보세요...";
        if (saveMemoBtn) saveMemoBtn.innerText = "메모 추가하기 💾";

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

        if (memoInput) memoInput.placeholder = "일정을 입력하세요 (예: 14:00 미팅)";
        if (saveMemoBtn) saveMemoBtn.innerText = "일정 추가하기 ⏰";

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
            if (el !== list) el.classList.remove('show');
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
            if (scrollContainer.scrollTop > viewportHeight * 0.5) {
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
                if (pageLines[pageIndex]) {
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
            if (pages[index]) {
                pages[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ==========================================
// 📊 시스템 브리핑 데이터 업데이트 엔진
// ==========================================
function updateSystemBriefing() {
    // ── 1. 할 일 카드 통계 ──
    const cards = JSON.parse(localStorage.getItem('yoobiTasks') || '[]');
    const totalCount   = cards.length;
    const pendingCount = cards.filter(c => c.status !== 'done').length;

    const taskEl      = document.getElementById('briefing-task-count');
    const taskBar     = document.getElementById('bento-task-bar');
    const taskTotalEl = document.getElementById('bento-task-total');

    if (taskEl) taskEl.textContent = pendingCount;
    if (taskTotalEl) taskTotalEl.textContent = `/ ${totalCount} total`;
    if (taskBar) {
        const pct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0;
        setTimeout(() => { taskBar.style.width = pct + '%'; }, 200);
    }

    // ── 2. D-Day 일정 ──
    const dDayValueEl = document.getElementById('briefing-dday');
    const dDayTitleEl = document.getElementById('briefing-dday-title');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let foundEvent = null, gap = -1;

    for (let i = 0; i <= 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const key = `yoobiMemo_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
        const memos = JSON.parse(localStorage.getItem(key) || '[]');
        if (memos.length > 0) { foundEvent = memos[0]; gap = i; break; }
    }

    if (dDayValueEl) dDayValueEl.textContent = foundEvent ? (gap === 0 ? 'D-0' : `D-${gap}`) : '—';
    if (dDayTitleEl) {
        dDayTitleEl.textContent = foundEvent
            ? (typeof foundEvent === 'string' ? foundEvent : foundEvent.text || '일정 있음')
            : '가까운 일정 없음';
    }

    // ── 3. 연도 달성률 바 ──
    const now   = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end   = new Date(now.getFullYear() + 1, 0, 1);
    const yearPct = Math.round(((now - start) / (end - start)) * 100);
    const yearBar = document.getElementById('bento-year-bar');
    const yearPctEl = document.getElementById('bento-year-pct');
    if (yearBar)   setTimeout(() => { yearBar.style.width = yearPct + '%'; }, 300);
    if (yearPctEl) yearPctEl.textContent = yearPct + '%';

    // ── 4. 커리어 로드맵 도트 시각화 ──
    const savedStatus = JSON.parse(localStorage.getItem('roadmap_status') || '[]');
    const phases = ['phase-1','phase-2','phase-3','phase-4','phase-5','phase-6','phase-7'];
    const phaseLabels = ['Phase 01','Phase 02','Phase 03','Phase 04','Phase 05','Phase 06','Goal'];
    const dotsEl    = document.getElementById('bento-roadmap-dots');
    const roadBar   = document.getElementById('bento-roadmap-bar');
    const roadPctEl = document.getElementById('bento-roadmap-pct');

    if (dotsEl) {
        dotsEl.innerHTML = '';
        // 현재 활성 단계 = 완료된 것 다음 단계
        const doneCount = savedStatus.length;
        phases.forEach((phase, idx) => {
            const dot = document.createElement('div');
            dot.className = 'roadmap-dot';
            if (savedStatus.includes(phase)) {
                dot.classList.add('done');
            } else if (idx === doneCount) {
                dot.classList.add('active-dot');
            }
            dot.title = phaseLabels[idx];
            dotsEl.appendChild(dot);

            // 도트 사이 라벨 (현재 단계만)
            if (idx === doneCount) {
                const lbl = document.createElement('span');
                lbl.className = 'roadmap-dot-label';
                lbl.textContent = phaseLabels[idx];
                dotsEl.appendChild(lbl);
            }
        });
    }
    if (roadBar) {
        const rPct = Math.round((savedStatus.length / phases.length) * 100);
        setTimeout(() => { roadBar.style.width = rPct + '%'; }, 400);
    }
    if (roadPctEl) {
        roadPctEl.textContent = `${savedStatus.length} / ${phases.length} 단계 완료`;
    }
}

// 📦 [추가] 1. 실시간 시계 함수
function updateSystemClock() {
    const now = new Date();
    const clockEl = document.getElementById('system-clock');
    const dateEl = document.getElementById('system-date');
    if (clockEl) clockEl.textContent = now.toTimeString().split(' ')[0]; // HH:MM:SS
    if (dateEl) dateEl.textContent = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
}

// 📦 [추가] 2. Three.js 배경 디자인 변경 함수 (모드 전환용)
window.updateThreeJsDesign = function (mode) {
    if (mode === 'dashboard') {
        // 대시보드: 시스템 느낌의 청록색(#00d082)으로 변경
        if (window.changeThreeJsTheme) window.changeThreeJsTheme('#00d082');
    } else {
        // 포트폴리오: 원래의 시그니처 블루(#3182f6)로 복구
        if (window.changeThreeJsTheme) window.changeThreeJsTheme('#3182f6');
    }
};

// ==========================================
// 🔀 대문 진입점 탭 & 버튼 동기화 엔진 (버그 완전 해결판)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.entry-tab');
    const ctaBtnPort = document.getElementById('hero-cta-btn');
    const ctaBtnDash = document.getElementById('hero-cta-btn-dash');

    // 🕒 시계 시작
    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type'); // 'portfolio' or 'dashboard'

            // 1. 탭 활성화 UI 처리
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. 컨텐츠 화면 교체 (투명도 꼼수 버리고 즉시 전환으로 유리 깨짐 해결!)
            document.querySelectorAll('.hero-mode-content').forEach(content => {
                content.classList.remove('active');
            });

            const targetContent = document.getElementById(`hero-content-${type}`);
            if (targetContent) {
                targetContent.classList.add('active'); 
            }

            // 3. 브리핑 데이터 업데이트 및 ⭐️ 매트릭스 배경 상태 전환
            if (type === 'dashboard') {
                updateSystemBriefing();
                window.yoobiDashMode = 'dashboard'; // 배경이 그리드로 슉! 정렬됨
            } else {
                window.yoobiDashMode = 'portfolio'; // 배경이 다시 신경망으로 흩어짐
            }
        });
    });

    // 각 버튼의 이동 경로 맵핑
    if (ctaBtnPort) ctaBtnPort.onclick = () => { window.location.hash = 'portfolio'; };
    if (ctaBtnDash) ctaBtnDash.onclick = () => { window.location.hash = 'dashboard'; };

    // 화면 로드 시 기본으로 포트폴리오 탭 열기
    tabs[0].click(); 
});

// ==========================================
// ✨ Portfolio Scroll Reveal (Intersection Observer)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // 한 번 나타나면 해제
            }
        });
    }, {
        threshold: 0.12,      // 12% 보이면 트리거
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));

    // portfolio-view가 active될 때마다 재실행 (라우팅 후 재진입 대응)
    const pfView = document.getElementById('portfolio-view');
    if (pfView) {
        const viewObserver = new MutationObserver(() => {
            if (pfView.classList.contains('active')) {
                // active 됐을 때 아직 안 보인 요소들 재관찰
                document.querySelectorAll('.reveal-up:not(.is-visible), .reveal-left:not(.is-visible)')
                    .forEach(el => observer.observe(el));
            }
        });
        viewObserver.observe(pfView, { attributes: true, attributeFilter: ['class'] });
    }
});

// 🍏 포트폴리오 뷰 전용 다이내믹 아일랜드 스크롤 핸들러
const pfScrollArea = document.getElementById('portfolio-view');
const islandNav = document.querySelector('.pf-dynamic-island');

if (pfScrollArea && islandNav) {
    pfScrollArea.addEventListener('scroll', () => {
        // ⭐️ 60px 정도 내려가면 알약이 상단으로 이동하며 작아집니다.
        if (pfScrollArea.scrollTop > 60) {
            islandNav.classList.add('shrunk');
        } else {
            islandNav.classList.remove('shrunk');
        }
    });
}

// 📦 4페이지: 지식 보관소 데이터 (실제 링크 적용 완료) // 지식 보관소 섹션의 데이터를 정의하는 부분입니다.
const archiveData = [ // 아카이브 데이터 객체들을 담을 배열을 선언합니다.
    { // 첫 번째 카드 데이터 객체의 시작을 알립니다.
        title: "React 19 신기능 정리", // 화면에 표시될 카드의 주 제목을 문자열로 설정합니다.
        desc: "Action API와 컴파일러 도입으로 변하는 개발 패러다임", // 제목 아래에 들어갈 상세한 설명을 설정합니다.
        category: "react", // 탭 클릭 시 필터링 기준으로 사용될 카테고리 값을 'react'로 지정합니다.
        icon: "⚛️", // 카드 좌측 상단 태그 옆에 표시될 이모지 아이콘을 설정합니다.
        link: "https://react.dev/blog/2024/04/25/react-19" // 리액트 공식 블로그의 19 버전 발표 게시글 URL을 연결합니다.
    }, // 첫 번째 데이터 객체를 닫습니다.
    { // 두 번째 카드 데이터 객체의 시작을 알립니다.
        title: "정처기 필기 핵심 요약", // 화면에 표시될 카드의 주 제목을 문자열로 설정합니다.
        desc: "데이터베이스와 소프트웨어 설계 파트 집중 공략", // 제목 아래에 들어갈 상세한 설명을 설정합니다.
        category: "cs", // 탭 클릭 시 필터링 기준으로 사용될 카테고리 값을 'cs'로 지정합니다.
        icon: "📖", // 카드 좌측 상단 태그 옆에 표시될 책 모양 이모지 아이콘을 설정합니다.
        link: "https://github.com/Kwonputer/Information-Processing-Engineer" // 정보처리기사 필기 핵심 요약이 잘 정리된 깃허브 레포지토리 URL을 연결합니다.
    }, // 두 번째 데이터 객체를 닫습니다.
    { // 세 번째 카드 데이터 객체의 시작을 알립니다.
        title: "Toss 디자인 시스템 분석", // 화면에 표시될 카드의 주 제목을 문자열로 설정합니다.
        desc: "사용자 중심의 인터랙션을 위한 UX 디테일 학습", // 제목 아래에 들어갈 상세한 설명을 설정합니다.
        category: "design", // 탭 클릭 시 필터링 기준으로 사용될 카테고리 값을 'design'으로 지정합니다.
        icon: "🎨", // 카드 좌측 상단 태그 옆에 표시될 팔레트 모양 이모지 아이콘을 설정합니다.
        link: "https://toss.tech/article/Various-attempts-to-solve-the-problem" // 토스 테크 블로그의 디자인 시스템(TDS) 테이블 구축기 아티클 URL을 연결합니다.
    }, // 세 번째 데이터 객체를 닫습니다.
    { // 네 번째 카드 데이터 객체의 시작을 알립니다.
        title: "QA에서 Dev로 넘어가기", // 화면에 표시될 카드의 주 제목을 문자열로 설정합니다.
        desc: "품질 보증 경험을 프론트엔드 강점으로 승화하는 법", // 제목 아래에 들어갈 상세한 설명을 설정합니다.
        category: "qa", // 탭 클릭 시 필터링 기준으로 사용될 카테고리 값을 'qa'로 지정합니다.
        icon: "🚀", // 카드 좌측 상단 태그 옆에 표시될 로켓 모양 이모지 아이콘을 설정합니다.
        link: "https://velog.io/search?q=QA%EC%97%90%EC%84%9C+%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C" // QA에서 프론트엔드 개발자로 전향한 회고록들을 모아볼 수 있는 벨로그 검색 결과 URL을 연결합니다.
    }, // 네 번째 데이터 객체를 닫습니다.
    { // 다섯 번째 카드 데이터 객체의 시작을 알립니다.
        title: "Cypress E2E 가이드", // 화면에 표시될 카드의 주 제목을 문자열로 설정합니다.
        desc: "웹 애플리케이션의 안정성을 위한 자동화 테스트 기초", // 제목 아래에 들어갈 상세한 설명을 설정합니다.
        category: "qa", // 탭 클릭 시 필터링 기준으로 사용될 카테고리 값을 'qa'로 지정합니다.
        icon: "🧪", // 카드 좌측 상단 태그 옆에 표시될 실험관 모양 이모지 아이콘을 설정합니다.
        link: "https://velog.io/@_woogie/E2E%ED%85%8C%EC%8A%A4%ED%8A%B8-with-Cypress" // Cypress를 활용한 E2E 테스트 환경 구축 가이드가 상세히 적힌 벨로그 URL을 연결합니다.
    } // 다섯 번째 데이터 객체를 닫습니다.
]; // 데이터 배열의 선언을 완전히 마칩니다.

// 지식 보관소 카드를 화면에 그려주는 함수입니다.
function renderArchive(filter = 'all') {
    // 카드가 담길 그리드 컨테이너 요소를 가져옵니다.
    const grid = document.getElementById('archive-grid');
    // 만약 그리드 요소가 존재하지 않는다면 함수 실행을 즉시 중단합니다.
    if (!grid) return;

    // 새로운 카드를 그리기 전에 기존에 있던 카드들을 깨끗이 비웁니다.
    grid.innerHTML = '';
    // 선택된 카테고리에 맞는 데이터만 골라냅니다.
    const filtered = filter === 'all' ? archiveData : archiveData.filter(d => d.category === filter);

    // 필터링된 데이터 배열을 하나씩 돌면서 카드를 만듭니다.
    filtered.forEach(data => {
        // 카드 역할을 할 'a' (링크) 태그를 생성합니다.
        const card = document.createElement('a');
        // 생성한 태그의 이동 주소(href)를 데이터의 링크 값으로 설정합니다.
        card.href = data.link;
        // CSS 스타일링을 위해 'archive-card' 클래스를 부여합니다.
        card.className = 'archive-card';

        // target 속성을 _blank로 설정하여 클릭 시 새 창/탭이 뜨게 합니다.
        card.target = '_blank';
        // 새 창 열기 시 보안 취약점을 방지하기 위해 rel 속성을 추가합니다.
        card.rel = 'noopener noreferrer';

        // ⭐️ 해결된 부분: 배열(Array)을 사용해 JS 주석과 HTML 코드를 완벽히 분리했습니다!
        card.innerHTML = [
            '<div class="arc-top">', // 카드 상단 영역을 생성합니다.
            `    <span class="arc-icon">${data.icon}</span>`, // 데이터에 정의된 이모지 아이콘을 표시합니다.
            `    <span class="arc-tag">${data.category}</span>`, // 해당 카드의 카테고리 태그를 표시합니다.
            '</div>', // 상단 영역을 닫습니다.
            '<div class="arc-body">', // 카드 본문(텍스트) 영역을 생성합니다.
            `    <h3>${data.title}</h3>`, // 데이터에 정의된 게시글 제목을 제목 태그로 표시합니다.
            `    <p>${data.desc}</p>`, // 게시글에 대한 요약 설명을 단락 태그로 표시합니다.
            '</div>' // 본문 영역을 닫습니다.
        ].join(''); // 배열 안의 코드 조각들을 하나의 완전한 HTML 문자열로 싹 합칩니다.

        // 완성된 카드 요소를 그리드 컨테이너 안에 최종적으로 집어넣습니다.
        grid.appendChild(card);
    }); // 반복문 실행을 마칩니다.
} // renderArchive 함수 정의를 마칩니다.

// 필터 버튼 클릭 이벤트
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderArchive(btn.dataset.category);
    });
});

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderArchive();
});

// ==========================================
// 🎯 [신규] 로드맵 D-Day 일정 알리미 위젯
// ==========================================
function renderUpcomingEvent() {
    const widget = document.getElementById('upcoming-widget');
    if (!widget) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let foundEvent = null;
    let dDayCount = null;

    for (let i = 0; i <= 3; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const key = `yoobiMemo_${targetDate.getFullYear()}_${targetDate.getMonth()}_${targetDate.getDate()}`;
        const memoArray = JSON.parse(localStorage.getItem(key) || '[]');

        if (memoArray.length > 0) {
            foundEvent = { date: `${targetDate.getMonth() + 1}/${targetDate.getDate()}`, text: memoArray[0] };
            dDayCount = i;
            break;
        }
    }

    if (foundEvent) {
        const dDayText = dDayCount === 0 ? 'Today' : `D-${dDayCount}`;
        // ⭐️ 가로 구조로 변경
        widget.innerHTML = `
            <span class="upcoming-dday">${dDayText}</span>
            <div class="upcoming-content">
                <p class="upcoming-text">${foundEvent.text}</p>
                <span class="upcoming-date">${foundEvent.date}</span>
            </div>
        `;
        widget.classList.add('show');
    } else {
        widget.classList.remove('show');
    }
}

// 🖱️ 리얼 유리 반사광 1:1 추적 엔진
function updateButtonReflection() {
    const sheenButtons = document.querySelectorAll('.go-dashboard-btn');
    
    sheenButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            
            // 버튼 내부에서의 상대적 마우스 좌표 (px)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 감쇠값 없이 1:1로 좌표 전달 (끝까지 따라오게 함)
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
        });
        
        // 마우스가 버튼을 벗어나면 좌표를 초기화하여 광택을 숨깁니다.
        btn.addEventListener('mouseleave', () => {
            btn.style.setProperty('--x', '-100%');
            btn.style.setProperty('--y', '-100%');
        });
    });
}

document.addEventListener('DOMContentLoaded', updateButtonReflection);