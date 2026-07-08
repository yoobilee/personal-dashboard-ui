// ==========================================
// 전역 변수
// ==========================================
let routeTimeout = null;
let cardToDeleteId = null;

const homeView        = document.getElementById('home-view');
const dashboardView   = document.getElementById('dashboard-view');
const goDashboardBtn  = document.getElementById('go-to-dashboard-btn');
const profileImage    = document.querySelector('.profile-image');
const goToPortfolioBtn = document.getElementById('go-to-portfolio-btn');
const deleteModal     = document.getElementById('delete-modal');
const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
const deleteCancelBtn  = document.getElementById('delete-cancel-btn');

const taskModal      = document.getElementById('task-modal');
const modalAddBtn    = document.getElementById('modal-add-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const detailModal    = document.getElementById('card-detail-modal');
const detailSaveBtn  = document.getElementById('detail-save-btn');
const detailCancelBtn = document.getElementById('detail-cancel-btn');
const columns        = document.querySelectorAll('.column');

let kanbanData = [];

const body = document.body;

// 다크모드 초기 적용 (깜빡임 방지)
(function() {
    if (localStorage.getItem('yoobiTheme') === 'dark') body.classList.add('dark-mode');
})();

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCIPKUTDyNC0R0SAVbAAWgkCYpdogmw3w8",
    authDomain: "yoobi-dashboard.firebaseapp.com",
    projectId: "yoobi-dashboard",
    storageBucket: "yoobi-dashboard.firebasestorage.app",
    messagingSenderId: "92295175260",
    appId: "1:92295175260:web:7a011ae9813573e3abda99"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 새 방문자용 샘플 데이터
const DUMMY_KANBAN = [
    { id: 'd1', title: '포트폴리오 웹사이트 고도화', desc: 'Firebase 연동 및 다크모드 버그 수정', priority: 'high',   status: 'in-progress', date: '2026-04-30' },
    { id: 'd2', title: 'Three.js 배경 최적화',       desc: '모바일 환경에서 프레임 드랍 해결하기',      priority: 'medium', status: 'todo',        date: '2026-05-10' },
    { id: 'd3', title: 'QA 경력 기술서 정리',         desc: '현대자동차 프로젝트 성과 위주로 업데이트',  priority: 'low',    status: 'done',        date: '2026-04-15' }
];

const DUMMY_EVENTS = [
    { id: 'e1', title: '프론트엔드 면접 스터디', start: '2026-04-22', color: '#3182f6' },
    { id: 'e2', title: 'Three.js 강의 수강',    start: '2026-04-25', color: '#ff4d4f' }
];

// 캘린더 상태
const todayDate = new Date();
let currentCalYear  = todayDate.getFullYear();
let currentCalMonth = todayDate.getMonth();

// ==========================================
// SPA 라우팅
// ==========================================
function handleRouting() {
    const hash     = window.location.hash || '#home';
    const views    = document.querySelectorAll('.app-view');
    const targetId = hash.replace('#', '') + '-view';
    let targetView = document.getElementById(targetId);

    if (!targetView) targetView = document.getElementById('home-view');

    if (routeTimeout) clearTimeout(routeTimeout);

    // 새로 나타날 뷰를 최상단으로 끌어올려 덮을 준비
    targetView.style.zIndex = '20';

    routeTimeout = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        views.forEach(view => {
            if (view !== targetView) {
                view.classList.remove('active');
                view.style.zIndex = '1';
            }
        });

        targetView.classList.add('active');
        routeTimeout = null;
    }, 50);
}

window.addEventListener('hashchange', handleRouting);
document.addEventListener('DOMContentLoaded', handleRouting);

// 네비게이션 버튼
if (goDashboardBtn) goDashboardBtn.addEventListener('click', () => { window.location.hash = 'dashboard'; });
if (goToPortfolioBtn) goToPortfolioBtn.addEventListener('click', () => {
    sessionStorage.setItem('activeHomeTab', 'portfolio');
    window.location.hash = 'portfolio';
});
if (profileImage) {
    profileImage.style.cursor = 'pointer';
    profileImage.addEventListener('click', () => { goHome(); });
}

function goHome() {
    window.location.hash = 'home';
}

// ==========================================
// 사이드바 접기/펼치기
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar   = document.querySelector('.sidebar');
    const dashView  = document.getElementById('dashboard-view');

    if (!toggleBtn || !sidebar || !dashView) return;

    toggleBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        dashView.classList.toggle('sidebar-collapsed', isCollapsed);
        localStorage.setItem('sidebarCollapsed', isCollapsed ? '1' : '0');
    });

    if (localStorage.getItem('sidebarCollapsed') === '1') {
        sidebar.classList.add('collapsed');
        dashView.classList.add('sidebar-collapsed');
    }
});

// ==========================================
// 다크모드 토글
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn   = document.getElementById('theme-toggle-btn');
    const themeLabel = document.getElementById('theme-toggle-label');

    function syncThemeLabel() {
        if (themeLabel) themeLabel.textContent = body.classList.contains('dark-mode') ? 'Light' : 'Dark';
    }
    syncThemeLabel();

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-mode');
            localStorage.setItem('yoobiTheme', isDark ? 'dark' : 'light');
            syncThemeLabel();
        });
    }
});

// ==========================================
// 사이드바 하단 실용 정보 업데이트
// ==========================================
function updateSidebarStats() {
    const now  = new Date();
    const days = ['일','월','화','수','목','금','토'];

    const todayEl = document.getElementById('sb-today');
    if (todayEl) todayEl.textContent = `${now.getMonth()+1}/${now.getDate()} (${days[now.getDay()]})`;

    const start  = new Date(now.getFullYear(), 0, 1);
    const end    = new Date(now.getFullYear() + 1, 0, 1);
    const pct    = Math.round((now - start) / (end - start) * 100);
    const yearPctEl = document.getElementById('sb-year-pct');
    const yearBarEl = document.getElementById('sb-year-bar');
    if (yearPctEl) yearPctEl.textContent = pct + '%';
    if (yearBarEl) yearBarEl.style.width = pct + '%';

    const todayEventsEl = document.getElementById('sb-today-events');
    if (todayEventsEl) {
        const todayKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const timeline = JSON.parse(localStorage.getItem(`yoobiTimeline_${todayKey}`) || '[]');
        if (timeline.length === 0) {
            todayEventsEl.innerHTML = '<span class="sb-no-event">일정 없음</span>';
        } else {
            todayEventsEl.innerHTML = timeline.slice(0, 3).map(ev => {
                const timeMatch = ev.text.match(/^(\d{1,2}:\d{2})/);
                const time  = timeMatch ? `<span class="sb-event-time">${timeMatch[1]}</span>` : '';
                const title = timeMatch ? ev.text.replace(timeMatch[1], '').trim() : ev.text;
                return `<div class="sb-event-item">${time}<span style="overflow:hidden;text-overflow:ellipsis;">${title}</span></div>`;
            }).join('');
        }
    }
}

// ==========================================
// GitHub 잔디밭 툴팁 — 사이드바 overflow 탈출
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('github-wrapper');
    const tooltip = wrapper ? wrapper.querySelector('.github-tooltip') : null;
    if (!wrapper || !tooltip) return;

    function positionTooltip() {
        const rect = wrapper.getBoundingClientRect();
        tooltip.style.position  = 'fixed';
        tooltip.style.top       = (rect.top + rect.height / 2) + 'px';
        tooltip.style.left      = (rect.right + 22) + 'px';
        tooltip.style.transform = 'translateY(-50%)';
    }
    wrapper.addEventListener('mouseenter', positionTooltip);
});

// ==========================================
// 대문 진입점 탭 & 버튼 동기화
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs       = document.querySelectorAll('.entry-tab');
    const ctaBtnPort = document.getElementById('hero-cta-btn');
    const ctaBtnDash = document.getElementById('hero-cta-btn-dash');
    const homeViewEl = document.getElementById('home-view');

    // 시계 시작
    updateSystemClock();
    setInterval(updateSystemClock, 1000);

    if (tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type');

            sessionStorage.setItem('activeHomeTab', type);

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.hero-mode-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`hero-content-${type}`);
            if (target) target.classList.add('active');

            if (type === 'dashboard') {
                updateSystemBriefing();
                window.yoobiDashMode = 'dashboard';
                if (homeViewEl) homeViewEl.classList.add('dash-mode');
                const threeCanvas = homeViewEl ? homeViewEl.querySelector('canvas') : null;
                if (threeCanvas) threeCanvas.style.opacity = '0';
            } else {
                window.yoobiDashMode = 'portfolio';
                if (homeViewEl) homeViewEl.classList.remove('dash-mode');
                const threeCanvas = homeViewEl ? homeViewEl.querySelector('canvas') : null;
                if (threeCanvas) threeCanvas.style.opacity = '1';
            }
        });
    });

    if (ctaBtnPort) ctaBtnPort.onclick = () => { window.location.hash = 'portfolio'; };
    if (ctaBtnDash) ctaBtnDash.onclick = () => {
        sessionStorage.setItem('activeHomeTab', 'dashboard');
        window.location.hash = 'dashboard';
    };

    // 포트폴리오 페이지 YB 로고 → 홈으로 복귀
    const islandLogo = document.querySelector('.island-logo');
    if (islandLogo) {
        islandLogo.addEventListener('click', (e) => {
            e.preventDefault();
            goHome();
        });
    }

    // 포트폴리오 페이지 대시보드 알약 버튼
    const islandDashBtn = document.querySelector('.island-btn');
    if (islandDashBtn) {
        islandDashBtn.addEventListener('click', () => {
            sessionStorage.setItem('activeHomeTab', 'dashboard');
        });
    }

    // 마지막으로 선택했던 탭 복원
    const savedTab  = sessionStorage.getItem('activeHomeTab') || 'portfolio';
    const targetTab = Array.from(tabs).find(t => t.getAttribute('data-type') === savedTab);
    if (targetTab) targetTab.click();
    else tabs[0].click();
});

// ==========================================
// 로드맵 달성도
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    function updateVoyageProgress() {
        const total     = roadmapItems.length;
        const completed = document.querySelectorAll('.roadmap-item.completed').length;
        const pct       = total > 0 ? (completed / total * 100).toFixed(1) : '0.0';

        if (progressFill && progressText) {
            progressText.innerText  = pct + '%';
            progressFill.style.width = pct + '%';
        }

        const completedPhases = Array.from(document.querySelectorAll('.roadmap-item.completed'))
            .map(item => item.getAttribute('data-phase'));
        localStorage.setItem('roadmap_status', JSON.stringify(completedPhases));
    }

    if (roadmapItems.length > 0) {
        const savedStatus = JSON.parse(localStorage.getItem('roadmap_status') || '[]');

        roadmapItems.forEach((item, index) => {
            const phaseId = item.getAttribute('data-phase') || `phase-${index}`;
            item.setAttribute('data-phase', phaseId);

            if (savedStatus.includes(phaseId)) {
                item.classList.add('completed');
            }

            item.addEventListener('click', () => {
                const isCompleting = !item.classList.contains('completed');
                const phaseName    = item.querySelector('h4').innerText;

                item.classList.toggle('completed');
                updateVoyageProgress();
                showToast(isCompleting
                    ? `${phaseName} 단계를 완료했습니다.`
                    : `${phaseName} 단계가 취소되었습니다.`
                );
            });
        });
    }

    updateVoyageProgress();
});

// 로드맵 딥 다이내믹 섀도
const mapItems = document.querySelectorAll('.roadmap-item');
mapItems.forEach(item => {
    const content = item.querySelector('.roadmap-content');
    if (!content) return;
    item.addEventListener('mousemove', (e) => {
        const rect    = content.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top  + rect.height / 2;
        const moveX   = (e.clientX - centerX) / (rect.width  / 2);
        const moveY   = (e.clientY - centerY) / (rect.height / 2);
        content.style.setProperty('--sh-x', `${moveX * -5}px`);
        content.style.setProperty('--sh-y', `${(moveY * -5) + 10}px`);
    });
    item.addEventListener('mouseleave', () => {
        if (!content) return;
        content.style.setProperty('--sh-x', '0px');
        content.style.setProperty('--sh-y', '20px');
    });
});

// ==========================================
// 칸반 보드
// ==========================================

// 칸반 보드 화면 렌더 (State → UI)
function renderBoard() {
    columns.forEach(col => {
        col.querySelector('.task-list').querySelectorAll('.task-card').forEach(card => card.remove());
    });

    kanbanData.forEach(cardObj => {
        const cardEl = createCardElement(cardObj);
        const colIdx = cardObj.status === 'todo' ? 0 : cardObj.status === 'doing' ? 1 : 2;
        columns[colIdx].querySelector('.task-list').appendChild(cardEl);
    });

    localStorage.setItem('yoobiTasks_v2', JSON.stringify(kanbanData));
}

// 카드 DOM 요소 생성
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
        ${cardObj.dueDate ? `<span class="task-date"> ${cardObj.dueDate}</span>` : ''}
    `;

    // 드래그: 원본 카드를 점선 플레이스홀더로 전환
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
        setTimeout(() => {
            card.classList.add('placeholder');
            card.style.opacity = '1';
        }, 0);
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('placeholder', 'dragging');
    });

    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        openDetailModal(cardObj);
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
        cardToDeleteId = cardObj.id;
        if (deleteModal) deleteModal.style.display = 'flex';
    });

    return card;
}

// 카드 상세 모달 열기
function openDetailModal(cardObj) {
    document.getElementById('edit-card-id').value       = cardObj.id;
    document.getElementById('edit-card-title').value    = cardObj.title;
    document.getElementById('edit-card-desc').value     = cardObj.desc || '';
    document.getElementById('edit-card-priority').value = cardObj.priority;

    const pText = cardObj.priority === 'high'   ? '긴급 (High)'
                : cardObj.priority === 'medium' ? '보통 (Medium)'
                :                                 '낮음 (Low)';
    document.getElementById('detail-priority-selected').innerText = pText;
    document.getElementById('edit-card-date').value     = cardObj.dueDate || '';
    detailModal.style.display = 'flex';
}

// 드래그 삽입 위치 계산 헬퍼
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box    = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 칸반 드래그 & 드롭 이벤트
columns.forEach((column, index) => {
    const list = column.querySelector('.task-list');

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard   = document.querySelector('.dragging');
        const afterElement   = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggingCard);
        } else {
            list.insertBefore(draggingCard, afterElement);
        }
    });

    list.addEventListener('drop', () => {
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            const cardId    = parseInt(draggingCard.dataset.id);
            const cardObj   = kanbanData.find(c => c.id === cardId);
            const newStatus = index === 0 ? 'todo' : index === 1 ? 'doing' : 'done';
            if (cardObj.status !== newStatus) {
                cardObj.status = newStatus;
                renderBoard();
                showToast(`상태 변경: ${newStatus.toUpperCase()}`);
            }
        }
    });
});

// 칸반 모달 — 빠른 할 일 추가 (사이드바)
if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
        const input         = document.getElementById('modal-task-input');
        const priorityInput = document.getElementById('modal-task-priority');

        if (!input.value.trim()) return showToast('할 일을 입력해 주세요.');

        kanbanData.push({
            id:       Date.now(),
            title:    input.value,
            desc:     '',
            priority: priorityInput ? priorityInput.value : 'low',
            dueDate:  '',
            status:   'todo'
        });

        renderBoard();
        input.value = '';
        if (priorityInput) priorityInput.value = 'low';
        taskModal.style.display = 'none';
        showToast('할 일이 추가되었습니다.');
    });
}

// 칸반 모달 — 상세 저장 (새 카드 추가 / 기존 카드 수정)
if (detailSaveBtn) {
    detailSaveBtn.addEventListener('click', () => {
        const idValue      = document.getElementById('edit-card-id').value;
        const titleInput   = document.getElementById('edit-card-title').value;
        const descInput    = document.getElementById('edit-card-desc').value;
        const priorityInput = document.getElementById('edit-card-priority').value;
        const dateInput    = document.getElementById('edit-card-date').value;

        if (!titleInput.trim()) return showToast('제목을 입력해 주세요.');

        if (idValue === '') {
            // 새 카드 추가
            kanbanData.push({
                id:       Date.now(),
                title:    titleInput,
                desc:     descInput,
                priority: priorityInput,
                dueDate:  dateInput,
                status:   'todo'
            });
            showToast('할 일이 추가되었습니다.');
        } else {
            // 기존 카드 수정
            const id      = parseInt(idValue);
            const cardObj = kanbanData.find(c => c.id === id);
            if (cardObj) {
                cardObj.title    = titleInput;
                cardObj.desc     = descInput;
                cardObj.priority = priorityInput;
                cardObj.dueDate  = dateInput;
                showToast('변경 사항이 저장되었습니다.');
            }
        }

        renderBoard();
        detailModal.style.display = 'none';
    });
}

if (modalCancelBtn)  modalCancelBtn.addEventListener('click',  () => { taskModal.style.display   = 'none'; });
if (detailCancelBtn) detailCancelBtn.addEventListener('click', () => { detailModal.style.display  = 'none'; });

// 삭제 확인 모달
if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener('click', () => {
        if (cardToDeleteId !== null) {
            kanbanData = kanbanData.filter(c => c.id !== cardToDeleteId);
            renderBoard();
            deleteModal.style.display = 'none';
            showToast('삭제되었습니다.');
            cardToDeleteId = null;
        }
    });
}
if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        cardToDeleteId = null;
    });
}

// 칸반 데이터 초기 로드
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('yoobiTasks_v2');
    if (saved && JSON.parse(saved).length > 0) {
        kanbanData = JSON.parse(saved);
    } else {
        // 새 방문자: 샘플 데이터 로드
        kanbanData = DUMMY_KANBAN.map(task => ({
            ...task,
            id:      Date.now() + Math.random(),
            dueDate: task.date,
            status:  task.status || 'todo'
        }));
        localStorage.setItem('yoobiTasks_v2', JSON.stringify(kanbanData));
    }
    renderBoard();
});

// 칸반 보드 — "다운로 스크롤" 버튼
const scrollDownBtn = document.querySelector('.scroll-down-indicator');
const kanbanPage    = document.querySelectorAll('#dashboard-view .page')[1];
if (scrollDownBtn && kanbanPage) {
    scrollDownBtn.addEventListener('click', () => {
        kanbanPage.scrollIntoView({ behavior: 'smooth' });
    });
}

// 사이드바 "새로운 할 일" 버튼
const btnQuickTask = document.getElementById('btn-quick-task');
if (btnQuickTask) {
    btnQuickTask.addEventListener('click', () => {
        if (taskModal) {
            taskModal.style.display = 'flex';
            const modalInput = document.getElementById('modal-task-input');
            if (modalInput) modalInput.focus();
        }
    });
}

// 칸반 보드 "＋ 새로운 할 일" 버튼
const addBtn = document.querySelector('.add-btn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        document.getElementById('edit-card-id').value       = '';
        document.getElementById('edit-card-title').value    = '';
        document.getElementById('edit-card-desc').value     = '';
        document.getElementById('edit-card-priority').value = 'low';
        document.getElementById('edit-card-date').value     = '';
        if (detailModal) {
            detailModal.style.display = 'flex';
            document.getElementById('edit-card-title')?.focus();
        }
    });
}

// ==========================================
// Status 드롭다운 (사이드바)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const statusToggle = document.getElementById('status-toggle');
    const statusMenu   = document.getElementById('status-menu');
    const statusIcon   = document.getElementById('status-icon');
    const statusText   = document.getElementById('status-text');

    if (statusToggle && statusMenu) {
        statusToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            statusMenu.classList.toggle('show');
        });
        statusMenu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const color = item.getAttribute('data-color') || '#22c55e';
                const text  = item.getAttribute('data-text');
                if (statusIcon) statusIcon.innerHTML = `<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="${color}"/></svg>`;
                if (statusText) statusText.innerText = text;
                statusMenu.classList.remove('show');
                showToast(`${text} 상태로 변경되었습니다.`);
            });
        });
        document.addEventListener('click', () => { statusMenu.classList.remove('show'); });
    }
});

// ==========================================
// 커스텀 드롭다운
// ==========================================
function setupCustomDropdown(selectedId, listId, inputId) {
    const selected = document.getElementById(selectedId);
    const list     = document.getElementById(listId);
    const input    = document.getElementById(inputId);

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
            selected.innerText = item.innerText;
            input.value = item.getAttribute('data-value');
            list.classList.remove('show');
        });
    });
}

// 두 모달의 우선순위 드롭다운 초기화
setupCustomDropdown('quick-priority-selected',  'quick-priority-list',  'modal-task-priority');
setupCustomDropdown('detail-priority-selected', 'detail-priority-list', 'edit-card-priority');

// 화면 아무 곳 클릭 시 드롭다운 닫기
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-list').forEach(el => el.classList.remove('show'));
});

// ==========================================
// 캘린더 & 메모
// ==========================================

// 새 방문자용 샘플 이벤트를 날짜별 localStorage에 시드
function seedCalendarDummy() {
    if (localStorage.getItem('yoobi_calendar_seeded')) return;

    DUMMY_EVENTS.forEach(event => {
        const dateParts = event.start.split('-');
        const year  = dateParts[0];
        const month = parseInt(dateParts[1]) - 1;
        const day   = parseInt(dateParts[2]);
        const key   = `yoobiMemo_${year}_${month}_${day}`;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([event.title]));
        }
    });
    localStorage.setItem('yoobi_calendar_seeded', 'true');
}

function renderCalendar() {
    const titleElement = document.getElementById('calendar-title');
    const datesElement = document.getElementById('calendar-dates');
    if (!titleElement || !datesElement) return;

    const firstDayOfMonth = new Date(currentCalYear, currentCalMonth, 1);
    const lastDayOfMonth  = new Date(currentCalYear, currentCalMonth + 1, 0);
    const startDayOfWeek  = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    titleElement.innerText = `${currentCalYear}년 ${currentCalMonth + 1}월`;
    datesElement.innerHTML = '';

    const realToday   = new Date();
    const isThisMonth = (currentCalYear === realToday.getFullYear() && currentCalMonth === realToday.getMonth());

    // 앞쪽 빈칸 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('empty');
        datesElement.appendChild(emptySlot);
    }

    // 2026년 한국 공휴일
    const holidays = {
        '1-1':  '신정',   '2-17': '설날 연휴', '2-18': '설날',    '2-19': '설날 연휴',
        '3-1':  '삼일절', '5-5':  '어린이날',  '5-25': '부처님오신날',
        '6-6':  '현충일', '8-15': '광복절',    '9-24': '추석 연휴',
        '9-25': '추석',   '9-26': '추석 연휴', '10-3': '개천절',
        '10-9': '한글날', '12-25':'성탄절',
    };

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dateSlot   = document.createElement('div');
        dateSlot.innerText = day;
        dateSlot.setAttribute('data-date', day);

        const dayOfWeek = new Date(currentCalYear, currentCalMonth, day).getDay();
        if (dayOfWeek === 0) dateSlot.classList.add('sunday');
        if (dayOfWeek === 6) dateSlot.classList.add('saturday');

        const monthDayKey = `${currentCalMonth + 1}-${day}`;
        if (holidays[monthDayKey]) {
            dateSlot.classList.add('holiday');
            dateSlot.title = holidays[monthDayKey];
        }

        if (isThisMonth && day === realToday.getDate()) {
            dateSlot.classList.add('today');
        }

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

    if (window.updateCalendarBadges) window.updateCalendarBadges();
}

// 이전/다음 달 이동
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

// 메모 목록 렌더
function renderMemoList(memoArray, memoKey) {
    const listContainer = document.getElementById('memo-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (memoArray.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#8b95a1; font-size:13px; margin-top: 20px;">등록된 메모가 없습니다.</p>';
        return;
    }

    memoArray.forEach((text, index) => {
        const item     = document.createElement('div');
        item.className = 'memo-item';

        const textSpan     = document.createElement('span');
        textSpan.className = 'memo-text';
        textSpan.innerText = text;
        textSpan.addEventListener('click', () => { textSpan.classList.toggle('expanded'); });

        const delBtn     = document.createElement('button');
        delBtn.className = 'delete-memo-btn';
        delBtn.innerText = '×';
        delBtn.addEventListener('click', () => {
            let currentArr = JSON.parse(localStorage.getItem(memoKey) || '[]');
            currentArr.splice(index, 1);
            localStorage.setItem(memoKey, JSON.stringify(currentArr));
            renderMemoList(currentArr, memoKey);
            showToast('메모가 삭제되었습니다.');
            if (window.updateCalendarBadges) window.updateCalendarBadges();
        });

        item.appendChild(textSpan);
        item.appendChild(delBtn);
        listContainer.appendChild(item);
    });
}

// 타임라인 렌더
function renderTimeline(timeArray, timeKey) {
    if (!plannerTimelineArea) return;
    plannerTimelineArea.innerHTML = '';

    const timelineData = timeArray
        .map((text, index) => {
            const timeMatch = text.match(/(\d{1,2}:\d{2})/);
            return {
                originalIndex: index,
                time:    timeMatch ? timeMatch[0] : '00:00',
                content: text.replace(/(\d{1,2}:\d{2})/, '').trim()
            };
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    if (timelineData.length === 0) {
        plannerTimelineArea.innerHTML = '<p style="text-align:center; color:#8b95a1; font-size:13px; margin-top: 20px;">등록된 일정이 없습니다.</p>';
        return;
    }

    timelineData.forEach(item => {
        const div      = document.createElement('div');
        div.className  = 'timeline-item';
        div.innerHTML  = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                <div>
                    <span class="timeline-time">${item.time}</span>
                    <span class="timeline-text">${item.content}</span>
                </div>
                <button class="delete-memo-btn" style="padding-top:0;">×</button>
            </div>
        `;

        div.querySelector('.delete-memo-btn').addEventListener('click', () => {
            let currentArr = JSON.parse(localStorage.getItem(timeKey) || '[]');
            currentArr.splice(item.originalIndex, 1);
            localStorage.setItem(timeKey, JSON.stringify(currentArr));
            renderTimeline(currentArr, timeKey);
            showToast('일정이 삭제되었습니다.');
            if (window.updateCalendarBadges) window.updateCalendarBadges();
        });

        plannerTimelineArea.appendChild(div);
    });
}

// 메모 / 타임라인 탭 전환
const saveMemoBtn         = document.getElementById('save-memo-btn');
const memoInput           = document.getElementById('memo-input');
const btnViewMemo         = document.getElementById('btn-view-memo');
const btnViewTimeline     = document.getElementById('btn-view-timeline');
const memoListArea        = document.getElementById('memo-list');
const plannerTimelineArea = document.getElementById('planner-timeline');

if (btnViewMemo && btnViewTimeline) {
    btnViewMemo.addEventListener('click', () => {
        memoListArea.style.display        = 'flex';
        plannerTimelineArea.style.display = 'none';
        btnViewMemo.classList.add('active');
        btnViewTimeline.classList.remove('active');

        if (memoInput)  memoInput.placeholder = '새로운 메모를 추가해보세요...';
        if (saveMemoBtn) saveMemoBtn.innerText = '메모 추가하기';

        const baseKey = saveMemoBtn.getAttribute('data-base-key');
        if (baseKey) {
            const memoArray = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
            renderMemoList(memoArray, `yoobiMemo_${baseKey}`);
        }
    });

    btnViewTimeline.addEventListener('click', () => {
        memoListArea.style.display        = 'none';
        plannerTimelineArea.style.display = 'flex';
        btnViewTimeline.classList.add('active');
        btnViewMemo.classList.remove('active');

        if (memoInput)  memoInput.placeholder = '일정을 입력하세요 (예: 14:00 미팅)';
        if (saveMemoBtn) saveMemoBtn.innerText = '일정 추가하기';

        const baseKey = saveMemoBtn.getAttribute('data-base-key');
        if (baseKey) {
            const timeArray = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');
            renderTimeline(timeArray, `yoobiTimeline_${baseKey}`);
        }
    });
}

// 메모 / 타임라인 저장
if (saveMemoBtn) {
    saveMemoBtn.addEventListener('click', () => {
        const baseKey = saveMemoBtn.getAttribute('data-base-key');
        if (!baseKey) return showToast('날짜를 먼저 선택해주세요.');

        const text = memoInput.value.trim();
        if (!text) return showToast('내용을 입력해 주세요.');

        const isTimelineMode = btnViewTimeline.classList.contains('active');

        if (isTimelineMode) {
            if (!(/(\d{1,2}:\d{2})/).test(text)) {
                return showToast('시간을 포함해주세요. (예: 14:00 미팅)');
            }
            const timeKey   = `yoobiTimeline_${baseKey}`;
            const timeArray = JSON.parse(localStorage.getItem(timeKey) || '[]');
            timeArray.push(text);
            localStorage.setItem(timeKey, JSON.stringify(timeArray));
            renderTimeline(timeArray, timeKey);
            showToast('타임라인 일정이 추가되었습니다.');
        } else {
            const memoKey   = `yoobiMemo_${baseKey}`;
            const memoArray = JSON.parse(localStorage.getItem(memoKey) || '[]');
            memoArray.push(text);
            localStorage.setItem(memoKey, JSON.stringify(memoArray));
            renderMemoList(memoArray, memoKey);
            showToast('메모가 추가되었습니다.');
        }

        memoInput.value = '';
        if (window.updateCalendarBadges) window.updateCalendarBadges();
    });
}

// 달력 날짜에 메모/타임라인 배지 표시
window.updateCalendarBadges = function () {
    const dateSlots = document.querySelectorAll('.calendar-dates div:not(.empty)');

    dateSlots.forEach(slot => {
        const day = slot.getAttribute('data-date');
        if (!day) return;

        const baseKey = `${currentCalYear}_${currentCalMonth}_${day}`;
        const memoArr = JSON.parse(localStorage.getItem(`yoobiMemo_${baseKey}`) || '[]');
        const timeArr = JSON.parse(localStorage.getItem(`yoobiTimeline_${baseKey}`) || '[]');

        slot.querySelector('.event-badge')?.remove();
        slot.querySelector('.timeline-dot')?.remove();

        if (memoArr.length > 0) {
            const badge     = document.createElement('span');
            badge.className = 'event-badge';
            badge.innerText = memoArr.length;
            slot.appendChild(badge);
        }

        if (timeArr.length > 0) {
            const dot     = document.createElement('span');
            dot.className = 'timeline-dot';
            slot.appendChild(dot);
        }
    });
    renderUpcomingEvent();
};

// 데일리 메모 팝업 (사이드바 "빠른 메모" 버튼)
const dailyMemoModal    = document.getElementById('daily-memo-modal');
const dailyMemoInput    = document.getElementById('daily-memo-input');
const dailyMemoCancelBtn = document.getElementById('daily-memo-cancel-btn');
const dailyMemoSaveBtn  = document.getElementById('daily-memo-save-btn');
const memoModalDate     = document.getElementById('memo-modal-date');
const btnQuickNote      = document.getElementById('btn-quick-note');

function getTodayInfo() {
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth();
    const day   = now.getDate();
    return {
        label: `${year}년 ${month + 1}월 ${day}일`,
        key:   `yoobiMemo_${year}_${month}_${day}`
    };
}

if (btnQuickNote) {
    btnQuickNote.addEventListener('click', () => {
        const { label } = getTodayInfo();
        if (memoModalDate)  memoModalDate.innerText  = label;
        if (dailyMemoInput) dailyMemoInput.value     = '';
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

        if (!text) { showToast('내용을 입력해 주세요.'); return; }

        let memoArray = [];
        try {
            memoArray = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            memoArray = localStorage.getItem(key) ? [localStorage.getItem(key)] : [];
        }

        memoArray.push(text);
        localStorage.setItem(key, JSON.stringify(memoArray));

        // 현재 달력에서 선택된 날짜와 일치하면 즉시 화면에 반영
        const saveBtn = document.getElementById('save-memo-btn');
        const currentSelectedBaseKey = saveBtn?.getAttribute('data-base-key');
        const todayBaseKey           = key.replace('yoobiMemo_', '');

        if (currentSelectedBaseKey === todayBaseKey) {
            const btnViewMemoEl = document.getElementById('btn-view-memo');
            if (btnViewMemoEl && btnViewMemoEl.classList.contains('active')) {
                renderMemoList(memoArray, key);
            } else if (btnViewMemoEl) {
                btnViewMemoEl.click();
            }
        }

        if (dailyMemoModal) dailyMemoModal.style.display = 'none';
        showToast(`${label} 메모가 추가되었습니다.`);
        if (window.updateCalendarBadges) window.updateCalendarBadges();
    });
}

if (dailyMemoModal) {
    dailyMemoModal.addEventListener('click', (e) => {
        if (e.target === dailyMemoModal) dailyMemoModal.style.display = 'none';
    });
}

// ==========================================
// 대시보드 우측 페이지 네비게이션 (스크롤 스파이)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const pages           = document.querySelectorAll('#dashboard-view .page');
    const pageLines       = document.querySelectorAll('.page-line');
    const scrollContainer = document.querySelector('.scroll-container');

    if (pages.length === 0 || pageLines.length === 0 || !scrollContainer) return;

    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageIndex = Array.from(pages).indexOf(entry.target);
                pageLines.forEach(line => line.classList.remove('active'));
                if (pageLines[pageIndex]) pageLines[pageIndex].classList.add('active');
            }
        });
    }, { root: scrollContainer, rootMargin: '0px', threshold: 0.5 });

    pages.forEach(page => pageObserver.observe(page));

    // 페이지 라인 클릭 시 해당 페이지로 이동
    pageLines.forEach((line, index) => {
        line.addEventListener('click', () => {
            if (pages[index]) pages[index].scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// 맨 위로 버튼
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn    = document.getElementById('back-to-top');
    const scrollContainer = document.querySelector('.scroll-container');

    if (backToTopBtn && scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            const viewportHeight = window.innerHeight;
            // 1.5 페이지 이상 스크롤 시 버튼 표시
            if (scrollContainer.scrollTop > viewportHeight * 0.5) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// ==========================================
// GitHub 잔디밭 (Events API)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const githubGrid  = document.getElementById('github-grid');
    const githubMonth = document.getElementById('github-month');
    if (!githubGrid) return;

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    async function loadGithubContributions() {
        try {
            const res = await fetch('https://api.github.com/users/yoobilee/events?per_page=100');
            if (!res.ok) throw new Error('API 실패');
            const events = await res.json();

            // 날짜별 커밋 횟수 집계
            const commitMap = {};
            events.forEach(ev => {
                if (ev.type === 'PushEvent') {
                    const date = ev.created_at.slice(0, 10);
                    commitMap[date] = (commitMap[date] || 0) + (ev.payload.commits?.length || 1);
                }
            });

            const now      = new Date();
            const year     = now.getFullYear();
            const month    = now.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();

            if (githubMonth) githubMonth.innerText = monthNames[month];
            githubGrid.innerHTML = '';

            // 앞쪽 빈칸
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.classList.add('git-cube');
                githubGrid.appendChild(empty);
            }

            // 날짜별 커밋 레벨
            for (let d = 1; d <= lastDate; d++) {
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                const count   = commitMap[dateStr] || 0;
                const level   = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;

                const cube = document.createElement('div');
                cube.classList.add('git-cube');
                if (level > 0) cube.classList.add(`git-lv-${level}`);
                cube.title = `${dateStr}: ${count}개 커밋`;
                githubGrid.appendChild(cube);
            }
        } catch (e) {
            // API 실패 시 빈 그리드로 폴백
            console.warn('GitHub API 연동 실패:', e);
            const now = new Date();
            if (githubMonth) githubMonth.innerText = monthNames[now.getMonth()];
            for (let i = 0; i < 35; i++) {
                const cube = document.createElement('div');
                cube.classList.add('git-cube');
                githubGrid.appendChild(cube);
            }
        }
    }

    loadGithubContributions();
});

// ==========================================
// 포트폴리오 스크롤 Reveal
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // portfolio-view가 active 될 때마다 미노출 요소 재관찰
    const pfView = document.getElementById('portfolio-view');
    if (pfView) {
        const viewObserver = new MutationObserver(() => {
            if (pfView.classList.contains('active')) {
                document.querySelectorAll('.reveal-up:not(.is-visible), .reveal-left:not(.is-visible)')
                    .forEach(el => observer.observe(el));
            }
        });
        viewObserver.observe(pfView, { attributes: true, attributeFilter: ['class'] });
    }
});

// 포트폴리오 다이내믹 아일랜드 스크롤 핸들러
const pfScrollArea = document.getElementById('portfolio-view');
const islandNav    = document.querySelector('.pf-dynamic-island');
if (pfScrollArea && islandNav) {
    pfScrollArea.addEventListener('scroll', () => {
        if (pfScrollArea.scrollTop > 60) {
            islandNav.classList.add('shrunk');
        } else {
            islandNav.classList.remove('shrunk');
        }
    });
}

// ==========================================
// Knowledge Archive
// ==========================================
const archiveData = [
    { title: "React 19 신기능 정리",      desc: "Action API와 컴파일러 도입으로 변하는 개발 패러다임",      category: "react",  icon: "⚛️", link: "https://react.dev/blog/2024/04/25/react-19" },
    { title: "정처기 필기 핵심 요약",       desc: "데이터베이스와 소프트웨어 설계 파트 집중 공략",              category: "cs",     icon: "📖", link: "https://github.com/Kwonputer/Information-Processing-Engineer" },
    { title: "Toss 디자인 시스템 분석",     desc: "사용자 중심의 인터랙션을 위한 UX 디테일 학습",             category: "design", icon: "🎨", link: "https://toss.tech/article/Various-attempts-to-solve-the-problem" },
    { title: "QA에서 Dev로 넘어가기",       desc: "품질 보증 경험을 프론트엔드 강점으로 승화하는 법",           category: "qa",     icon: "🚀", link: "https://velog.io/search?q=QA%EC%97%90%EC%84%9C+%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C" },
    { title: "Cypress E2E 가이드",         desc: "웹 애플리케이션의 안정성을 위한 자동화 테스트 기초",          category: "qa",     icon: "🧪", link: "https://velog.io/@_woogie/E2E%ED%85%8C%EC%8A%A4%ED%8A%B8-with-Cypress" }
];

function renderArchive(filter = 'all') {
    const grid = document.getElementById('archive-grid');
    if (!grid) return;

    const existingHead = grid.querySelector('.arc-table-head');
    grid.innerHTML = '';
    if (existingHead) grid.appendChild(existingHead);

    const filtered = filter === 'all' ? archiveData : archiveData.filter(d => d.category === filter);

    filtered.forEach((data, idx) => {
        const row     = document.createElement('a');
        row.href      = data.link;
        row.className = 'archive-card';
        row.target    = '_blank';
        row.rel       = 'noopener noreferrer';
        row.innerHTML = `
            <span class="arc-index">${String(idx + 1).padStart(2, '0')}</span>
            <span class="arc-title">${data.title}</span>
            <span class="arc-tag">${data.category}</span>
            <span class="arc-desc">${data.desc}</span>
            <span class="arc-arrow">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
        `;
        grid.appendChild(row);
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderArchive(btn.dataset.category);
    });
});

// ==========================================
// 시스템 브리핑 (홈 대시보드 탭)
// ==========================================
function updateSystemBriefing() {
    // 할 일 카드 통계
    const cards        = JSON.parse(localStorage.getItem('yoobiTasks_v2') || '[]');
    const totalCount   = cards.length;
    const pendingCount = cards.filter(c => c.status === 'doing' || c.status === 'in-progress').length;

    const taskEl      = document.getElementById('briefing-task-count');
    const taskBar     = document.getElementById('bento-task-bar');
    const taskTotalEl = document.getElementById('bento-task-total');

    if (taskEl)      taskEl.textContent      = pendingCount;
    if (taskTotalEl) taskTotalEl.textContent = `/ ${totalCount} total`;
    if (taskBar) {
        const pct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0;
        setTimeout(() => { taskBar.style.width = pct + '%'; }, 200);
    }

    // D-Day 일정 (앞으로 30일 이내 메모 중 가장 가까운 것)
    const dDayValueEl = document.getElementById('briefing-dday');
    const dDayTitleEl = document.getElementById('briefing-dday-title');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let foundEvent = null, gap = -1;

    for (let i = 0; i <= 30; i++) {
        const d   = new Date(today);
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

    // 연도 달성률
    const now     = new Date();
    const start   = new Date(now.getFullYear(), 0, 1);
    const end     = new Date(now.getFullYear() + 1, 0, 1);
    const yearPct = Math.round(((now - start) / (end - start)) * 100);
    const yearBar   = document.getElementById('bento-year-bar');
    const yearPctEl = document.getElementById('bento-year-pct');
    if (yearBar)   setTimeout(() => { yearBar.style.width = yearPct + '%'; }, 300);
    if (yearPctEl) yearPctEl.textContent = yearPct + '%';

    // 커리어 로드맵 도트 시각화
    const savedStatus = JSON.parse(localStorage.getItem('roadmap_status') || '[]');
    const phases      = ['phase-1','phase-2','phase-3','phase-4','phase-5'];
    const phaseLabels = ['Phase 01','Phase 02','Phase 03','Phase 04','Phase 05 (Goal)'];
    const dotsEl      = document.getElementById('bento-roadmap-dots');
    const roadBar     = document.getElementById('bento-roadmap-bar');
    const roadPctEl   = document.getElementById('bento-roadmap-pct');

    if (dotsEl) {
        dotsEl.innerHTML = '';
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

            // 현재 활성 단계 라벨
            if (idx === doneCount) {
                const lbl       = document.createElement('span');
                lbl.className   = 'roadmap-dot-label';
                lbl.textContent = phaseLabels[idx];
                dotsEl.appendChild(lbl);
            }
        });
    }
    if (roadBar)   setTimeout(() => { roadBar.style.width = Math.round((savedStatus.length / phases.length) * 100) + '%'; }, 400);
    if (roadPctEl) roadPctEl.textContent = `${savedStatus.length} / ${phases.length} 단계 완료`;
}

// 실시간 시계
function updateSystemClock() {
    const now     = new Date();
    const clockEl = document.getElementById('system-clock');
    const dateEl  = document.getElementById('system-date');
    if (clockEl) clockEl.textContent = now.toTimeString().split(' ')[0];
    if (dateEl)  dateEl.textContent  = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
}

// Three.js 테마 변경 (모드 전환용)
window.updateThreeJsDesign = function (mode) {
    if (mode === 'dashboard') {
        if (window.changeThreeJsTheme) window.changeThreeJsTheme('#00d082');
    } else {
        if (window.changeThreeJsTheme) window.changeThreeJsTheme('#3182f6');
    }
};

window.yoobiDashMode = 'portfolio';

// ==========================================
// D-Day 일정 알리미 위젯 (로드맵 페이지)
// ==========================================
function renderUpcomingEvent() {
    const widget = document.getElementById('upcoming-widget');
    if (!widget) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let foundEvent = null;
    let dDayCount  = null;

    for (let i = 0; i <= 3; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const key = `yoobiMemo_${targetDate.getFullYear()}_${targetDate.getMonth()}_${targetDate.getDate()}`;
        const memoArray = JSON.parse(localStorage.getItem(key) || '[]');
        if (memoArray.length > 0) {
            foundEvent = { date: `${targetDate.getMonth() + 1}/${targetDate.getDate()}`, text: memoArray[0] };
            dDayCount  = i;
            break;
        }
    }

    if (foundEvent) {
        const dDayText = dDayCount === 0 ? 'Today' : `D-${dDayCount}`;
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

// ==========================================
// 토스트 알림
// ==========================================
function showToast(message) {
    const container = document.getElementById('toast-center-container');
    if (!container) return;

    const toast     = document.createElement('div');
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
// GitHub 이달 커밋 수
// ==========================================
async function fetchMonthlyCommits(username) {
    const now              = new Date();
    const firstDayOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    try {
        const response = await fetch(`https://api.github.com/search/commits?q=author:${username}+committer-date:>=${firstDayOfMonth}`);
        const data     = await response.json();
        const countEl  = document.getElementById('github-commits');
        if (countEl && data.total_count !== undefined) {
            countEl.innerText = data.total_count + '+';
        }
    } catch (error) {
        console.error('GitHub 데이터를 가져오는데 실패했습니다:', error);
    }
}

// ==========================================
// Firebase 자동 동기화
// ==========================================
const originalSetItem = localStorage.setItem;
let autoSaveTimeout   = null;

// 업로드: 날짜별 메모/타임라인을 수집해 Firestore에 저장
async function uploadMasterData(secretKey) {
    const tasks    = JSON.parse(localStorage.getItem('yoobiTasks_v2')) || [];
    const memos    = {};
    const timeline = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('yoobiMemo_')) {
            memos[key] = JSON.parse(localStorage.getItem(key));
        } else if (key.startsWith('yoobiTimeline_')) {
            timeline[key] = JSON.parse(localStorage.getItem(key));
        }
    }

    try {
        await db.collection("dashboards").doc(secretKey).set({
            tasks,
            memos,
            timeline,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("업로드 완료");
    } catch (e) {
        console.error("업로드 실패:", e);
    }
}

// 다운로드: originalSetItem 직접 호출 → 자동 업로드 재발동 방지
async function downloadDataFromServer(secretKey) {
    try {
        const docSnap = await db.collection('dashboards').doc(secretKey).get();
        if (!docSnap.exists) {
            console.error("데이터가 없습니다. 시크릿 코드를 확인하세요.");
            return;
        }

        const data = docSnap.data();

        // 기존 날짜별 데이터 삭제
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('yoobiMemo_') || key.startsWith('yoobiTimeline_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        originalSetItem.call(localStorage, 'yoobiTasks_v2', JSON.stringify(data.tasks || []));
        originalSetItem.call(localStorage, 'yoobiLastSync', String(data.updatedAt?.toMillis?.() || Date.now()));

        if (data.memos) {
            for (const [key, value] of Object.entries(data.memos)) {
                originalSetItem.call(localStorage, key, JSON.stringify(value));
            }
        }
        if (data.timeline) {
            for (const [key, value] of Object.entries(data.timeline)) {
                originalSetItem.call(localStorage, key, JSON.stringify(value));
            }
        }

        console.log("동기화 완료. 화면을 새로고침합니다.");
        location.reload();
    } catch (error) {
        console.error("다운로드 중 에러:", error);
    }
}

// 자동 저장 트리거 (데이터 변경 후 2초 디바운스)
function triggerAutoSave() {
    if (typeof SYNC_KEY === 'undefined' || !SYNC_KEY) return;
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        uploadMasterData(SYNC_KEY).then(() => {
            originalSetItem.call(localStorage, 'yoobiLastSync', String(Date.now()));
        });
    }, 2000);
}

// localStorage.setItem 오버라이드 — 주요 키 변경 시 자동 저장 발동
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'yoobiTasks_v2' || key.startsWith('yoobiMemo_') || key.startsWith('yoobiTimeline_')) {
        triggerAutoSave();
    }
};

// 페이지 로드 시 서버와 타임스탬프 비교 후 자동 다운로드
// ── 콘솔에서 동기화 활성화 (config.js 없는 환경용)
function enableSync(key) {
    window.SYNC_KEY = key;
    console.log('%c✅ 동기화 활성화됨! 자동저장 및 자동 다운로드가 시작됩니다.', 'color:#22c55e; font-weight:bold;');
    autoSyncOnLoad();
}

// config.js 없는 환경에서 안내 메시지 출력
window.addEventListener('load', () => {
    if (typeof SYNC_KEY === 'undefined' || !SYNC_KEY) {
        console.log('%c💡 동기화 비활성화 상태', 'color:#f97316; font-weight:bold;');
        console.log('%c  활성화하려면 콘솔에서 아래 명령어를 입력하세요:', 'color:#8b95a1;');
        console.log('%c  enableSync("YOUR-SYNC-KEY")', 'color:#3182f6; font-weight:bold;');
    }
});

async function autoSyncOnLoad() {
    if (typeof SYNC_KEY === 'undefined' || !SYNC_KEY || typeof db === 'undefined') return;
    try {
        const docSnap = await db.collection('dashboards').doc(SYNC_KEY).get();
        if (!docSnap.exists) return;

        const serverTime = docSnap.data().updatedAt?.toMillis?.() || 0;
        const localTime  = parseInt(localStorage.getItem('yoobiLastSync') || '0');

        if (serverTime > localTime) {
            await downloadDataFromServer(SYNC_KEY);
        }
    } catch (e) {
        console.warn("동기화 확인 중 오류:", e);
    }
}

// ==========================================
// 초기화 (DOMContentLoaded 통합)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    seedCalendarDummy();
    renderCalendar();
    renderArchive();
    updateSidebarStats();
    fetchMonthlyCommits('yoobilee');
});

window.addEventListener('load', () => {
    setTimeout(autoSyncOnLoad, 1500);
});

// ── 콘솔 전용 개발자 도구 ──
// analyzeStack() — 기술 스택 분석
// detectBugs()   — 버그/이슈 감지

function analyzeStack() {
    const html = document.documentElement.innerHTML;
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    const links = Array.from(document.querySelectorAll('link[href]')).map(l => l.href);
    const allSrc = [...scripts, ...links].join(' ');

    const stack = { 'Core': [], 'UI / Style': [], 'Libraries': [], 'Hosting': [] };

    if (!allSrc.includes('react') && !allSrc.includes('vue') && !allSrc.includes('angular'))
        stack['Core'].push('Vanilla JS (No Framework)');
    if (allSrc.includes('react')) stack['Core'].push('React');
    if (allSrc.includes('vue')) stack['Core'].push('Vue.js');
    stack['Core'].push('HTML5 / CSS3');

    if (html.includes('backdrop-filter') || html.includes('glassmorphism'))
        stack['UI / Style'].push('Glassmorphism');
    if (html.includes('var(--') || document.styleSheets.length > 0)
        stack['UI / Style'].push('CSS Custom Properties');
    if (allSrc.includes('Pretendard') || html.includes('Pretendard'))
        stack['UI / Style'].push('Pretendard Font');
    if (html.includes('tailwind') || allSrc.includes('tailwind'))
        stack['UI / Style'].push('Tailwind CSS');

    if (allSrc.includes('three') || typeof THREE !== 'undefined')
        stack['Libraries'].push('Three.js');
    if (allSrc.includes('firebase') || typeof firebase !== 'undefined')
        stack['Libraries'].push('Firebase Firestore');

    if (location.hostname.includes('github.io'))
        stack['Hosting'].push('GitHub Pages');
    else if (location.hostname.includes('netlify'))
        stack['Hosting'].push('Netlify');
    else if (location.protocol === 'file:')
        stack['Hosting'].push('Local (file://)');
    else
        stack['Hosting'].push(location.hostname);

    const line = '━'.repeat(44);
    console.log(`%c\n🔍 YooBi Portfolio & Dashboard — 기술 스택 분석\n${line}`, 'color:#3182f6; font-weight:bold;');
    let total = 0;
    for (const [category, items] of Object.entries(stack)) {
        if (items.length === 0) continue;
        console.log(`%c\n⚙️  ${category}`, 'color:#8b95a1; font-weight:bold;');
        items.forEach(item => { console.log(`%c  • ${item}`, 'color:#f0f6ff;'); total++; });
    }
    console.log(`%c\n${line}\n총 ${total}개 기술 감지됨\n`, 'color:#3182f6; font-weight:bold;');
}

async function detectBugs() {
    const line = '━'.repeat(44);
    console.log(`%c\n🐛 YooBi Portfolio & Dashboard — 버그 감지 시작\n${line}`, 'color:#f97316; font-weight:bold;');

    const issues = [], warnings = [], passed = [];

    // 1. 깨진 이미지 감지
    Array.from(document.querySelectorAll('img')).forEach(img => {
        if (!img.complete || img.naturalWidth === 0)
            issues.push(`깨진 이미지: ${img.src || img.getAttribute('src')}`);
        else
            passed.push(`이미지 정상: ${img.alt || img.src.split('/').pop()}`);
    });

    // 2. 깨진 링크 감지 (same-origin, file:// 환경 제외)
    if (location.protocol !== 'file:') {
        const links = Array.from(document.querySelectorAll('a[href]'))
            .filter(a => a.href.startsWith(location.origin) && !a.href.includes('#'));
        for (const a of links) {
            try {
                const res = await fetch(a.href, { method: 'HEAD' });
                if (!res.ok) issues.push(`깨진 링크 (${res.status}): ${a.href}`);
                else passed.push(`링크 정상: ${a.textContent.trim() || a.href}`);
            } catch { warnings.push(`링크 확인 불가 (CORS): ${a.href}`); }
        }
    } else {
        warnings.push('링크 체크 스킵: 로컬(file://) 환경');
    }

    // 3. console.error 감지
    const origErr = console.error;
    const caughtErrors = [];
    console.error = (...args) => { caughtErrors.push(args.join(' ')); origErr.apply(console, args); };
    await new Promise(r => setTimeout(r, 500));
    console.error = origErr;
    caughtErrors.forEach(e => warnings.push(`콘솔 에러: ${e}`));

    // 4. localStorage 용량 체크
    let lsSize = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) lsSize += (localStorage[key].length + key.length) * 2;
    }
    const lsKB = (lsSize / 1024).toFixed(1);
    if (lsSize > 4 * 1024 * 1024) issues.push(`localStorage 용량 초과 위험: ${lsKB}KB / 5120KB`);
    else passed.push(`localStorage 용량 정상: ${lsKB}KB / 5120KB`);

    // 5. 필수 DOM 요소 확인
    ['dashboard-view', 'sidebar-toggle-btn', 'github-grid', 'progress-fill', 'progress-text'].forEach(id => {
        if (!document.getElementById(id)) issues.push(`필수 요소 없음: #${id}`);
        else passed.push(`필수 요소 확인: #${id}`);
    });

    if (issues.length > 0) {
        console.log(`%c\n🔴 이슈 (${issues.length}건)`, 'color:#ef4444; font-weight:bold;');
        issues.forEach(i => console.log(`%c  ✕ ${i}`, 'color:#ef4444;'));
    }
    if (warnings.length > 0) {
        console.log(`%c\n🟡 경고 (${warnings.length}건)`, 'color:#f59e0b; font-weight:bold;');
        warnings.forEach(w => console.log(`%c  ⚠ ${w}`, 'color:#f59e0b;'));
    }
    if (passed.length > 0) {
        console.log(`%c\n🟢 정상 (${passed.length}건)`, 'color:#22c55e; font-weight:bold;');
        passed.forEach(p => console.log(`%c  ✓ ${p}`, 'color:#22c55e;'));
    }

    const status = issues.length === 0 ? '✅ 이슈 없음' : `❌ ${issues.length}개 이슈 발견`;
    console.log(`%c\n${line}\n${status} | 경고 ${warnings.length}건 | 정상 ${passed.length}건\n`,
        `color:${issues.length === 0 ? '#3182f6' : '#ef4444'}; font-weight:bold;`);
}