// ============================================================
// CINEMAX STUDIOS - COMPLETE APP WITH ALL FEATURES + CHAT
// ============================================================

const API_URL = 'https://script.google.com/macros/s/AKfycbyf9eZ6bNX0hNDqgAsW4Ovg7BZ8K1I85MkRwRocL_71CwHL2xY15f6G8A7L9TNFOsdzVw/exec';

// ============ STATE ============
let projects = [];
let tasks = [];
let notes = [];
let crew = [];
let schedules = [];
let locations = [];
let budgetItems = [];
let equipment = [];
let announcements = [];
let analyticsData = {};
let chatRooms = [];
let currentMessages = [];
let currentUser = null;
let currentFilter = 'all';
let currentProjectFilter = '';
let currentEquipmentFilter = 'all';
let currentChatTab = 'all';
let currentRoomId = null;
let selectedGroupMembers = [];
let calendarDate = new Date();
let isDarkMode = true;
let chatRefreshInterval = null;

// ============ DOM ELEMENTS ============
const el = {
    splashScreen: document.getElementById('splash-screen'),
    app: document.getElementById('app'),
    loginScreen: document.getElementById('login-screen'),
    menuBtn: document.getElementById('menuBtn'),
    closeMenu: document.getElementById('closeMenu'),
    sideMenu: document.getElementById('sideMenu'),
    menuOverlay: document.getElementById('menuOverlay'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    searchBtn: document.getElementById('searchBtn'),
    searchOverlay: document.getElementById('searchOverlay'),
    searchInput: document.getElementById('searchInput'),
    closeSearch: document.getElementById('closeSearch'),
    searchResults: document.getElementById('searchResults'),
    themeToggle: document.getElementById('themeToggle'),
    currentDate: document.getElementById('currentDate'),
    menuUsername: document.getElementById('menuUsername'),

    // Stats
    totalProjects: document.getElementById('totalProjects'),
    pendingTasks: document.getElementById('pendingTasks'),
    upcomingSchedules: document.getElementById('upcomingSchedules'),
    unreadMessages: document.getElementById('unreadMessages'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    netBalance: document.getElementById('netBalance'),
    totalEquipment: document.getElementById('totalEquipment'),
    packedEquipment: document.getElementById('packedEquipment'),
    availableEquipment: document.getElementById('availableEquipment'),
    totalCrewCount: document.getElementById('totalCrewCount'),
    availableCrewCount: document.getElementById('availableCrewCount'),

    // Dashboard Lists
    announcementsBanner: document.getElementById('announcementsBanner'),
    todayScheduleList: document.getElementById('todayScheduleList'),
    activeProjectsList: document.getElementById('activeProjectsList'),
    recentTasksList: document.getElementById('recentTasksList'),

    // Page Lists
    projectsGrid: document.getElementById('projectsGrid'),
    tasksContainer: document.getElementById('tasksContainer'),
    calendarGrid: document.getElementById('calendarGrid'),
    currentMonth: document.getElementById('currentMonth'),
    scheduleContainer: document.getElementById('scheduleContainer'),
    locationsGrid: document.getElementById('locationsGrid'),
    budgetList: document.getElementById('budgetList'),
    equipmentGrid: document.getElementById('equipmentGrid'),
    crewGrid: document.getElementById('crewGrid'),
    notepadContainer: document.getElementById('notepadContainer'),
    announcementsList: document.getElementById('announcementsList'),
    chatRoomsList: document.getElementById('chatRoomsList'),

    // Filters
    taskProjectFilter: document.getElementById('taskProjectFilter'),
    taskPriorityFilter: document.getElementById('taskPriorityFilter'),
    noteProjectFilter: document.getElementById('noteProjectFilter'),
    budgetProjectFilter: document.getElementById('budgetProjectFilter'),
    budgetTypeFilter: document.getElementById('budgetTypeFilter'),

    // Forms
    projectForm: document.getElementById('projectForm'),
    taskForm: document.getElementById('taskForm'),
    scheduleForm: document.getElementById('scheduleForm'),
    locationForm: document.getElementById('locationForm'),
    budgetForm: document.getElementById('budgetForm'),
    equipmentForm: document.getElementById('equipmentForm'),
    crewForm: document.getElementById('crewForm'),
    noteForm: document.getElementById('noteForm'),
    announcementForm: document.getElementById('announcementForm'),

    // Project inputs
    projectId: document.getElementById('projectId'),
    projectName: document.getElementById('projectName'),
    projectDirector: document.getElementById('projectDirector'),
    projectCategory: document.getElementById('projectCategory'),
    projectStatus: document.getElementById('projectStatus'),
    projectStartDate: document.getElementById('projectStartDate'),
    projectEndDate: document.getElementById('projectEndDate'),
    projectBudget: document.getElementById('projectBudget'),
    projectDescription: document.getElementById('projectDescription'),

    // Task inputs
    taskId: document.getElementById('taskId'),
    taskProject: document.getElementById('taskProject'),
    taskName: document.getElementById('taskName'),
    taskAssignedTo: document.getElementById('taskAssignedTo'),
    taskPriority: document.getElementById('taskPriority'),
    taskDueDate: document.getElementById('taskDueDate'),
    taskDescription: document.getElementById('taskDescription'),

    // Schedule inputs
    scheduleId: document.getElementById('scheduleId'),
    scheduleProject: document.getElementById('scheduleProject'),
    scheduleTitle: document.getElementById('scheduleTitle'),
    scheduleDate: document.getElementById('scheduleDate'),
    scheduleStartTime: document.getElementById('scheduleStartTime'),
    scheduleEndTime: document.getElementById('scheduleEndTime'),
    scheduleLocation: document.getElementById('scheduleLocation'),
    scheduleCrewAssigned: document.getElementById('scheduleCrewAssigned'),
    scheduleNotes: document.getElementById('scheduleNotes'),

    // Location inputs
    locationId: document.getElementById('locationId'),
    locationName: document.getElementById('locationName'),
    locationAddress: document.getElementById('locationAddress'),
    locationGoogleMaps: document.getElementById('locationGoogleMaps'),
    locationContactPerson: document.getElementById('locationContactPerson'),
    locationContactPhone: document.getElementById('locationContactPhone'),
    locationNotes: document.getElementById('locationNotes'),

    // Budget inputs
    budgetId: document.getElementById('budgetId'),
    budgetProject: document.getElementById('budgetProject'),
    budgetType: document.getElementById('budgetType'),
    budgetCategory: document.getElementById('budgetCategory'),
    budgetDescription: document.getElementById('budgetDescription'),
    budgetAmount: document.getElementById('budgetAmount'),
    budgetDate: document.getElementById('budgetDate'),

    // Equipment inputs
    equipmentId: document.getElementById('equipmentId'),
    equipmentName: document.getElementById('equipmentName'),
    equipmentCategory: document.getElementById('equipmentCategory'),
    equipmentCondition: document.getElementById('equipmentCondition'),
    equipmentProject: document.getElementById('equipmentProject'),
    equipmentAssignedTo: document.getElementById('equipmentAssignedTo'),

    // Crew inputs
    crewId: document.getElementById('crewId'),
    crewName: document.getElementById('crewName'),
    crewRole: document.getElementById('crewRole'),
    crewPhone: document.getElementById('crewPhone'),
    crewEmail: document.getElementById('crewEmail'),
    crewSkills: document.getElementById('crewSkills'),
    crewAvailability: document.getElementById('crewAvailability'),
    crewRating: document.getElementById('crewRating'),

    // Note inputs
    noteProject: document.getElementById('noteProject'),
    noteContent: document.getElementById('noteContent'),

    // Announcement inputs
    announcementTitle: document.getElementById('announcementTitle'),
    announcementMessage: document.getElementById('announcementMessage'),
    announcementPriority: document.getElementById('announcementPriority'),

    // Analytics
    projectStatusChart: document.getElementById('projectStatusChart'),
    taskProgressRing: document.getElementById('taskProgressRing'),
    taskProgressPercent: document.getElementById('taskProgressPercent'),
    budgetBreakdown: document.getElementById('budgetBreakdown'),
    analyticsProjects: document.getElementById('analyticsProjects'),
    analyticsCompleted: document.getElementById('analyticsCompleted'),
    analyticsCrew: document.getElementById('analyticsCrew'),
    analyticsSchedules: document.getElementById('analyticsSchedules')
};

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    checkSavedLogin();
    setupAllEventListeners();
});

function checkSavedLogin() {
    const saved = localStorage.getItem('cinemax-user');
    if (saved) {
        currentUser = JSON.parse(saved);
        el.loginScreen.style.display = 'none';
        el.menuUsername.textContent = currentUser.DisplayName || currentUser.Username;
        apiCall('updateUserStatus', { username: currentUser.Username, status: 'Online' });
        startApp();
    }
}

async function startApp() {
    if (el.currentDate) {
        el.currentDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    const savedTheme = localStorage.getItem('cinemax-theme');
    if (savedTheme === 'light') toggleTheme();

    el.splashScreen.classList.remove('hidden');
    setTimeout(() => {
        el.splashScreen.classList.add('fade-out');
        el.app.classList.remove('hidden');
        setTimeout(() => { el.splashScreen.style.display = 'none'; }, 500);
    }, 2000);

    await loadAllData();
    setTimeout(() => { if (currentUser) loadChatRooms(); }, 2000);
    setInterval(() => { if (!currentRoomId && currentUser) loadChatRooms(); }, 15000);
}

// ============ EVENT LISTENERS ============
function setupAllEventListeners() {
    // Login
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('loginUsername').addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Menu
    el.menuBtn.addEventListener('click', openMenu);
    el.closeMenu.addEventListener('click', closeMenu);
    el.menuOverlay.addEventListener('click', closeMenu);

    // Search
    el.searchBtn.addEventListener('click', openSearch);
    el.closeSearch.addEventListener('click', closeSearch);
    let searchTimeout;
    el.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
    });

    // Theme
    el.themeToggle.addEventListener('click', toggleTheme);

    // Navigation
    document.querySelectorAll('.menu-item, .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(item.dataset.page);
            closeMenu();
        });
    });

    // Add buttons
    document.getElementById('addProjectBtn').addEventListener('click', () => { resetForm('project'); openModal('projectModal'); });
    document.getElementById('addTaskBtn').addEventListener('click', () => { resetForm('task'); openModal('taskModal'); });
    document.getElementById('addScheduleBtn').addEventListener('click', () => { resetForm('schedule'); openModal('scheduleModal'); });
    document.getElementById('addLocationBtn').addEventListener('click', () => { resetForm('location'); openModal('locationModal'); });
    document.getElementById('addBudgetBtn').addEventListener('click', () => { resetForm('budget'); openModal('budgetModal'); });
    document.getElementById('addEquipmentBtn').addEventListener('click', () => { resetForm('equipment'); openModal('equipmentModal'); });
    document.getElementById('addCrewBtn').addEventListener('click', () => { resetForm('crew'); openModal('crewModal'); });
    document.getElementById('addNoteBtn').addEventListener('click', () => { resetForm('note'); openModal('noteModal'); });
    document.getElementById('addAnnouncementBtn').addEventListener('click', () => { resetForm('announcement'); openModal('announcementModal'); });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => { btn.addEventListener('click', closeAllModals); });
    document.querySelectorAll('.modal').forEach(modal => { modal.addEventListener('click', (e) => { if (e.target === modal) closeAllModals(); }); });

    // Forms
    el.projectForm.addEventListener('submit', handleProjectSubmit);
    el.taskForm.addEventListener('submit', handleTaskSubmit);
    el.scheduleForm.addEventListener('submit', handleScheduleSubmit);
    el.locationForm.addEventListener('submit', handleLocationSubmit);
    el.budgetForm.addEventListener('submit', handleBudgetSubmit);
    el.equipmentForm.addEventListener('submit', handleEquipmentSubmit);
    el.crewForm.addEventListener('submit', handleCrewSubmit);
    el.noteForm.addEventListener('submit', handleNoteSubmit);
    el.announcementForm.addEventListener('submit', handleAnnouncementSubmit);

    // Project filter tabs
    document.querySelectorAll('.filter-tab[data-filter]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab[data-filter]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderProjects();
        });
    });

    // Equipment filter tabs
    document.querySelectorAll('.filter-tab[data-eqfilter]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab[data-eqfilter]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentEquipmentFilter = tab.dataset.eqfilter;
            renderEquipment();
        });
    });

    // Select filters
    el.taskProjectFilter.addEventListener('change', () => renderTasks());
    if (el.taskPriorityFilter) el.taskPriorityFilter.addEventListener('change', () => renderTasks());
    el.noteProjectFilter.addEventListener('change', (e) => renderNotes(e.target.value));
    el.budgetProjectFilter.addEventListener('change', () => renderBudget());
    el.budgetTypeFilter.addEventListener('change', () => renderBudget());

    // Calendar
    document.getElementById('prevMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('nextMonth').addEventListener('click', () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });

    // Chat events
    document.getElementById('newPrivateChatBtn').addEventListener('click', () => { renderCrewSelectList(); openModal('newChatModal'); });
    document.getElementById('chatBackBtn').addEventListener('click', closeChatRoom);
    document.getElementById('sendMessageBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });
    document.getElementById('chatInfoBtn').addEventListener('click', showChatInfo);

    document.querySelectorAll('.chat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentChatTab = tab.dataset.chattab;
            renderChatRooms();
        });
    });
}

// ============ API ============
async function apiCall(action, params = {}) {
    try {
        const url = new URL(API_URL);
        url.searchParams.append('action', action);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '')
                url.searchParams.append(key, params[key]);
        });
        const response = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { error: error.message };
    }
}

// ============ LOGIN ============
async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    if (!username) { document.getElementById('loginError').textContent = 'Please enter your name'; return; }

    showLoading();
    let result = await apiCall('loginUser', { username });
    if (result.error === 'User not found') {
        result = await apiCall('registerUser', { username, displayName: username });
        if (result.success) result = await apiCall('loginUser', { username });
    }
    hideLoading();

    if (result.success) {
        currentUser = result.data;
        localStorage.setItem('cinemax-user', JSON.stringify(currentUser));
        el.loginScreen.classList.add('fade-out');
        el.menuUsername.textContent = currentUser.DisplayName || currentUser.Username;
        setTimeout(() => { el.loginScreen.style.display = 'none'; }, 500);
        startApp();
    } else {
        document.getElementById('loginError').textContent = result.error || 'Login failed';
    }
}

function handleLogout() {
    if (currentUser) apiCall('updateUserStatus', { username: currentUser.Username, status: 'Offline' });
    localStorage.removeItem('cinemax-user');
    currentUser = null;
    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    location.reload();
}

// ============ LOAD ALL DATA ============
async function loadAllData() {
    showLoading();
    try {
        const results = await Promise.all([
            apiCall('getProjects'),
            apiCall('getTasks'),
            apiCall('getNotes'),
            apiCall('getCrew'),
            apiCall('getSchedules'),
            apiCall('getLocations'),
            apiCall('getBudget'),
            apiCall('getEquipment'),
            apiCall('getAnnouncements')
        ]);
        if (results[0].success) projects = results[0].data || [];
        if (results[1].success) tasks = results[1].data || [];
        if (results[2].success) notes = results[2].data || [];
        if (results[3].success) crew = results[3].data || [];
        if (results[4].success) schedules = results[4].data || [];
        if (results[5].success) locations = results[5].data || [];
        if (results[6].success) budgetItems = results[6].data || [];
        if (results[7].success) equipment = results[7].data || [];
        if (results[8].success) announcements = results[8].data || [];
        updateAllUI();
    } catch (error) {
        showToast('Error loading data', true);
    }
    hideLoading();
}

// ============ UPDATE ALL UI ============
function updateAllUI() {
    updateStats();
    renderDashboard();
    renderProjects();
    renderTasks();
    renderCalendar();
    renderSchedules();
    renderLocations();
    renderBudget();
    renderEquipment();
    renderCrew();
    renderNotes();
    renderAnnouncements();
    updateAllDropdowns();
}

// ============ STATS ============
function updateStats() {
    el.totalProjects.textContent = projects.length;
    el.pendingTasks.textContent = tasks.filter(t => t.Status !== 'Completed').length;
    const today = new Date().toISOString().split('T')[0];
    el.upcomingSchedules.textContent = schedules.filter(s => { try { return new Date(s.Date).toISOString().split('T')[0] >= today; } catch { return false; } }).length;

    const income = budgetItems.filter(b => b.Type === 'Income').reduce((s, b) => s + (parseFloat(b.Amount) || 0), 0);
    const expenses = budgetItems.filter(b => b.Type === 'Expense').reduce((s, b) => s + (parseFloat(b.Amount) || 0), 0);
    el.totalIncome.textContent = formatCurrency(income);
    el.totalExpenses.textContent = formatCurrency(expenses);
    el.netBalance.textContent = formatCurrency(income - expenses);

    el.totalEquipment.textContent = equipment.length;
    el.packedEquipment.textContent = equipment.filter(e => e.Status === 'Packed').length;
    el.availableEquipment.textContent = equipment.filter(e => e.Status === 'Available').length;

    el.totalCrewCount.textContent = crew.length;
    el.availableCrewCount.textContent = crew.filter(c => c.Availability === 'Available').length;
}

// ============ DASHBOARD ============
function renderDashboard() {
    // Announcements banner
    const recent = announcements.slice(0, 2);
    el.announcementsBanner.innerHTML = recent.map(a => {
        const cls = a.Priority === 'Urgent' ? 'urgent' : a.Priority === 'Important' ? 'important' : '';
        const icon = a.Priority === 'Urgent' ? 'fa-exclamation-triangle' : a.Priority === 'Important' ? 'fa-star' : 'fa-bullhorn';
        return '<div class="announcement-banner-item ' + cls + '"><i class="fas ' + icon + '"></i><div class="content"><h4>' + esc(a.Title) + '</h4><p>' + esc(a.Message).substring(0, 60) + '</p></div></div>';
    }).join('');

    // Today's schedule
    const today = new Date().toISOString().split('T')[0];
    const todaySch = schedules.filter(s => { try { return new Date(s.Date).toISOString().split('T')[0] === today; } catch { return false; } });
    el.todayScheduleList.innerHTML = todaySch.length === 0
        ? '<div class="empty-state"><i class="fas fa-calendar-check"></i><h3>No Shoots Today</h3></div>'
        : todaySch.map(s => {
            const proj = projects.find(p => p.ID === s.ProjectID);
            const loc = locations.find(l => l.ID === s.LocationID);
            return '<div class="schedule-card"><div class="schedule-card-header"><div><h4>' + esc(s.Title) + '</h4><span class="project-name">' + esc(proj ? proj.ProjectName : '') + '</span></div></div><div class="schedule-details"><span><i class="fas fa-clock"></i> ' + esc(s.StartTime || '') + ' - ' + esc(s.EndTime || '') + '</span><span><i class="fas fa-map-marker-alt"></i> ' + esc(loc ? loc.Name : 'TBD') + '</span></div></div>';
        }).join('');

    // Active projects
    const active = projects.filter(p => p.Status !== 'Completed').slice(0, 3);
    el.activeProjectsList.innerHTML = active.length === 0
        ? '<div class="empty-state"><i class="fas fa-video"></i><h3>No Active Projects</h3></div>'
        : active.map(p => '<div class="project-list-item" onclick="navigateToPage(\'projects\')"><div class="project-icon"><i class="fas fa-film"></i></div><div class="project-list-info"><h4>' + esc(p.ProjectName) + '</h4><span>' + esc(p.Status) + ' - ' + esc(p.Director) + '</span></div></div>').join('');

    // Recent tasks
    const pending = tasks.filter(t => t.Status !== 'Completed').slice(0, 4);
    el.recentTasksList.innerHTML = pending.length === 0
        ? '<div class="empty-state"><i class="fas fa-tasks"></i><h3>All Tasks Done!</h3></div>'
        : pending.map(t => renderTaskCard(t)).join('');
}

// ============ PROJECTS ============
function renderProjects() {
    let filtered = currentFilter === 'all' ? projects : projects.filter(p => p.Status === currentFilter);
    if (filtered.length === 0) { el.projectsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-video"></i><h3>No Projects</h3><p>Tap + to add</p></div>'; return; }

    el.projectsGrid.innerHTML = filtered.map(p => {
        const sc = p.Status.toLowerCase().replace(/\s+/g, '-');
        return '<div class="project-card ' + sc + '"><div class="project-card-header"><div><h3>' + esc(p.ProjectName) + '</h3><p class="meta"><i class="fas fa-user"></i> ' + esc(p.Director) + '</p></div><span class="project-status ' + sc + '">' + esc(p.Status) + '</span></div><div class="project-info"><span><i class="fas fa-tag"></i> ' + esc(p.Category || 'Short Film') + '</span><span><i class="fas fa-calendar"></i> ' + formatDate(p.StartDate) + '</span><span><i class="fas fa-flag"></i> ' + formatDate(p.EndDate) + '</span>' + (p.Budget ? '<span><i class="fas fa-wallet"></i> ' + formatCurrency(p.Budget) + '</span>' : '') + '</div>' + (p.Description ? '<p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:12px">' + esc(p.Description).substring(0, 80) + '</p>' : '') + '<div class="project-actions"><button class="edit-btn" onclick="editProject(\'' + p.ID + '\')"><i class="fas fa-edit"></i></button><button class="delete-btn" onclick="deleteProject(\'' + p.ID + '\')"><i class="fas fa-trash"></i></button></div></div>';
    }).join('');
}

// ============ TASKS ============
function renderTaskCard(t) {
    const proj = projects.find(p => p.ID === t.ProjectID);
    const priorityCls = (t.Priority || 'Medium').toLowerCase();
    const isComp = t.Status === 'Completed';
    return '<div class="task-card ' + (isComp ? 'completed' : '') + '"><div class="task-checkbox ' + (isComp ? 'completed' : '') + '" onclick="toggleTask(\'' + t.ID + '\')"><i class="fas fa-check"></i></div><div class="task-content"><h4>' + esc(t.TaskName) + '</h4><div class="task-meta"><span class="priority-badge ' + priorityCls + '">' + esc(t.Priority || 'Medium') + '</span><span><i class="fas fa-film"></i> ' + esc(proj ? proj.ProjectName : 'N/A') + '</span><span><i class="fas fa-user"></i> ' + esc(t.AssignedTo || 'Unassigned') + '</span>' + (t.DueDate ? '<span><i class="fas fa-calendar"></i> ' + formatDate(t.DueDate) + '</span>' : '') + '</div></div><button class="task-delete" onclick="deleteTask(\'' + t.ID + '\')"><i class="fas fa-trash"></i></button></div>';
}

function renderTasks() {
    let filtered = tasks.slice();
    const pf = el.taskProjectFilter.value;
    const prf = el.taskPriorityFilter ? el.taskPriorityFilter.value : '';
    if (pf) filtered = filtered.filter(t => t.ProjectID === pf);
    if (prf) filtered = filtered.filter(t => t.Priority === prf);
    filtered.sort((a, b) => (a.Status === 'Completed' ? 1 : 0) - (b.Status === 'Completed' ? 1 : 0));
    el.tasksContainer.innerHTML = filtered.length === 0
        ? '<div class="empty-state"><i class="fas fa-tasks"></i><h3>No Tasks</h3></div>'
        : filtered.map(t => renderTaskCard(t)).join('');
}

// ============ CALENDAR ============
function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    el.currentMonth.textContent = monthNames[month] + ' ' + year;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().split('T')[0];
    const schDates = schedules.map(s => { try { return new Date(s.Date).toISOString().split('T')[0]; } catch { return ''; } });

    let html = '<div class="calendar-header">';
    ['S','M','T','W','T','F','S'].forEach(d => { html += '<span>' + d + '</span>'; });
    html += '</div><div class="calendar-days">';
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) html += '<div class="calendar-day other-month">' + (prevDays - i) + '</div>';
    for (let day = 1; day <= daysInMonth; day++) {
        const ds = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        let cls = 'calendar-day';
        if (ds === todayStr) cls += ' today';
        if (schDates.includes(ds)) cls += ' has-event';
        html += '<div class="' + cls + '">' + day + '</div>';
    }
    const total = firstDay + daysInMonth;
    for (let i = 1; i <= (7 - total % 7) % 7; i++) html += '<div class="calendar-day other-month">' + i + '</div>';
    html += '</div>';
    el.calendarGrid.innerHTML = html;
}

// ============ SCHEDULES ============
function renderSchedules() {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = schedules.filter(s => { try { return new Date(s.Date).toISOString().split('T')[0] >= today; } catch { return false; } }).sort((a, b) => new Date(a.Date) - new Date(b.Date));

    el.scheduleContainer.innerHTML = upcoming.length === 0
        ? '<div class="empty-state"><i class="fas fa-calendar-alt"></i><h3>No Upcoming Shoots</h3></div>'
        : upcoming.map(s => {
            const proj = projects.find(p => p.ID === s.ProjectID);
            const loc = locations.find(l => l.ID === s.LocationID);
            const d = new Date(s.Date);
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            return '<div class="schedule-card"><div class="schedule-card-header"><div><h4>' + esc(s.Title) + '</h4><span class="project-name">' + esc(proj ? proj.ProjectName : '') + '</span></div><div class="schedule-date"><span class="day">' + d.getDate() + '</span><span class="month">' + months[d.getMonth()] + '</span></div></div><div class="schedule-details"><span><i class="fas fa-clock"></i> ' + esc(s.StartTime || 'TBD') + ' - ' + esc(s.EndTime || 'TBD') + '</span><span><i class="fas fa-map-marker-alt"></i> ' + esc(loc ? loc.Name : 'TBD') + '</span>' + (s.CrewAssigned ? '<span><i class="fas fa-users"></i> ' + esc(s.CrewAssigned) + '</span>' : '') + '</div><div class="schedule-actions"><button class="edit-btn" onclick="editSchedule(\'' + s.ID + '\')"><i class="fas fa-edit"></i></button><button class="delete-btn" onclick="deleteSchedule(\'' + s.ID + '\')"><i class="fas fa-trash"></i></button></div></div>';
        }).join('');
}

// ============ LOCATIONS ============
function renderLocations() {
    el.locationsGrid.innerHTML = locations.length === 0
        ? '<div class="empty-state"><i class="fas fa-map-marker-alt"></i><h3>No Locations</h3></div>'
        : locations.map(l => '<div class="location-card"><h4><i class="fas fa-map-marker-alt"></i> ' + esc(l.Name) + '</h4><p class="address">' + esc(l.Address) + '</p><div class="location-info">' + (l.ContactPerson ? '<span><i class="fas fa-user"></i> ' + esc(l.ContactPerson) + '</span>' : '') + (l.ContactPhone ? '<span><i class="fas fa-phone"></i> ' + esc(l.ContactPhone) + '</span>' : '') + '</div><div class="location-actions">' + (l.GoogleMapsLink ? '<button class="maps-btn" onclick="openMaps(\'' + esc(l.GoogleMapsLink) + '\')"><i class="fas fa-map"></i> Maps</button>' : '') + (l.ContactPhone ? '<button class="call-btn" onclick="callPhone(\'' + esc(l.ContactPhone) + '\')"><i class="fas fa-phone"></i> Call</button>' : '') + '<button onclick="editLocation(\'' + l.ID + '\')"><i class="fas fa-edit"></i></button><button onclick="deleteLocation(\'' + l.ID + '\')"><i class="fas fa-trash"></i></button></div></div>').join('');
}

// ============ BUDGET ============
function renderBudget() {
    let filtered = budgetItems.slice();
    const pf = el.budgetProjectFilter.value;
    const tf = el.budgetTypeFilter.value;
    if (pf) filtered = filtered.filter(b => b.ProjectID === pf);
    if (tf) filtered = filtered.filter(b => b.Type === tf);

    const income = filtered.filter(b => b.Type === 'Income').reduce((s, b) => s + (parseFloat(b.Amount) || 0), 0);
    const expenses = filtered.filter(b => b.Type === 'Expense').reduce((s, b) => s + (parseFloat(b.Amount) || 0), 0);
    el.totalIncome.textContent = formatCurrency(income);
    el.totalExpenses.textContent = formatCurrency(expenses);
    el.netBalance.textContent = formatCurrency(income - expenses);
    filtered.sort((a, b) => new Date(b.Date || 0) - new Date(a.Date || 0));

    el.budgetList.innerHTML = filtered.length === 0
        ? '<div class="empty-state"><i class="fas fa-wallet"></i><h3>No Budget Items</h3></div>'
        : filtered.map(b => {
            const proj = projects.find(p => p.ID === b.ProjectID);
            const isInc = b.Type === 'Income';
            return '<div class="budget-item"><div class="budget-item-icon ' + (isInc ? 'income' : 'expense') + '"><i class="fas fa-' + (isInc ? 'arrow-down' : 'arrow-up') + '"></i></div><div class="budget-item-info"><h4>' + esc(b.Description) + '</h4><p>' + esc(b.Category) + ' - ' + esc(proj ? proj.ProjectName : '') + '</p></div><div class="budget-item-amount ' + (isInc ? 'income' : 'expense') + '"><h4>' + (isInc ? '+' : '-') + formatCurrency(b.Amount) + '</h4><p>' + formatDate(b.Date) + '</p></div><button class="budget-item-delete" onclick="deleteBudgetItem(\'' + b.ID + '\')"><i class="fas fa-trash"></i></button></div>';
        }).join('');
}

// ============ EQUIPMENT ============
function renderEquipment() {
    let filtered = currentEquipmentFilter === 'all' ? equipment : equipment.filter(e => e.Category === currentEquipmentFilter);
    el.equipmentGrid.innerHTML = filtered.length === 0
        ? '<div class="empty-state"><i class="fas fa-camera"></i><h3>No Equipment</h3></div>'
        : filtered.map(e => {
            const isPacked = e.Status === 'Packed';
            const condCls = (e.Condition || 'Good').toLowerCase().replace(/\s+/g, '-');
            return '<div class="equipment-card"><div class="equipment-checkbox ' + (isPacked ? 'packed' : '') + '" onclick="toggleEquipment(\'' + e.ID + '\')"><i class="fas fa-check"></i></div><div class="equipment-info"><h4>' + esc(e.Name) + '</h4><div class="equipment-badges"><span class="category">' + esc(e.Category) + '</span><span class="condition ' + condCls + '">' + esc(e.Condition || 'Good') + '</span></div></div><button class="equipment-delete" onclick="deleteEquipment(\'' + e.ID + '\')"><i class="fas fa-trash"></i></button></div>';
        }).join('');
}

// ============ CREW ============
function renderCrew() {
    el.crewGrid.innerHTML = crew.length === 0
        ? '<div class="empty-state"><i class="fas fa-users"></i><h3>No Crew</h3></div>'
        : crew.map(c => {
            const initials = getInitials(c.Name);
            const availCls = (c.Availability || 'Available').toLowerCase().replace(/\s+/g, '-');
            const stars = '⭐'.repeat(parseInt(c.Rating) || 5);
            return '<div class="crew-card"><div class="crew-avatar">' + initials + '</div><div class="crew-info"><h3>' + esc(c.Name) + '</h3><p class="role">' + esc(c.Role) + '</p><p class="contact">' + esc(c.Phone || '') + (c.Email ? ' • ' + esc(c.Email) : '') + '</p>' + (c.Skills ? '<p class="skills"><i class="fas fa-tools"></i> ' + esc(c.Skills) + '</p>' : '') + '<p class="skills">' + stars + '</p></div><div><span class="crew-status ' + availCls + '">' + esc(c.Availability || 'Available') + '</span><div class="crew-actions" style="margin-top:8px">' + (c.Phone ? '<button class="call-btn" onclick="callPhone(\'' + esc(c.Phone) + '\')"><i class="fas fa-phone"></i></button><button class="whatsapp-btn" onclick="openWhatsApp(\'' + esc(c.Phone) + '\')"><i class="fab fa-whatsapp"></i></button>' : '') + '<button class="delete-btn" onclick="deleteCrew(\'' + c.ID + '\')"><i class="fas fa-trash"></i></button></div></div></div>';
        }).join('');
}

// ============ NOTES ============
function renderNotes(projectId) {
    let filtered = projectId ? notes.filter(n => n.ProjectID === projectId) : notes;
    filtered.sort((a, b) => (a.Completed === 'true' ? 1 : 0) - (b.Completed === 'true' ? 1 : 0));
    el.notepadContainer.innerHTML = filtered.length === 0
        ? '<div class="empty-state"><i class="fas fa-sticky-note"></i><h3>No Notes</h3></div>'
        : filtered.map(n => {
            const proj = projects.find(p => p.ID === n.ProjectID);
            const comp = n.Completed === 'true';
            return '<div class="note-card ' + (comp ? 'completed' : '') + '"><div class="note-checkbox ' + (comp ? 'completed' : '') + '" onclick="toggleNote(\'' + n.ID + '\')"><i class="fas fa-check"></i></div><div class="note-content"><p>' + esc(n.Content) + '</p><div class="note-meta"><span><i class="fas fa-film"></i> ' + esc(proj ? proj.ProjectName : 'General') + '</span><span><i class="fas fa-clock"></i> ' + formatDateTime(n.CreatedAt) + '</span></div></div><button class="note-delete" onclick="deleteNote(\'' + n.ID + '\')"><i class="fas fa-trash"></i></button></div>';
        }).join('');
}

// ============ ANNOUNCEMENTS ============
function renderAnnouncements() {
    el.announcementsList.innerHTML = announcements.length === 0
        ? '<div class="empty-state"><i class="fas fa-bullhorn"></i><h3>No Announcements</h3></div>'
        : announcements.map(a => {
            const priCls = (a.Priority || 'Normal').toLowerCase();
            return '<div class="announcement-card ' + priCls + '"><button class="announcement-delete" onclick="deleteAnnouncement(\'' + a.ID + '\')"><i class="fas fa-trash"></i></button><div class="announcement-card-header"><h4>' + esc(a.Title) + '</h4><span class="announcement-priority ' + priCls + '">' + esc(a.Priority || 'Normal') + '</span></div><p>' + esc(a.Message) + '</p><span class="time"><i class="fas fa-clock"></i> ' + formatDateTime(a.CreatedAt) + '</span></div>';
        }).join('');
}

// ============ ANALYTICS ============
async function loadAnalytics() {
    showLoading();
    const result = await apiCall('getAnalytics');
    if (result.success) { analyticsData = result.data; renderAnalytics(); }
    hideLoading();
}

function renderAnalytics() {
    const d = analyticsData;
    if (!d.statusBreakdown) return;
    const total = d.totalProjects || 1;
    let chartHtml = '';
    [{ n: 'Pre-Production', c: 'pre-production' }, { n: 'Production', c: 'production' }, { n: 'Post-Production', c: 'post-production' }, { n: 'Completed', c: 'completed' }].forEach(s => {
        const count = d.statusBreakdown[s.n] || 0;
        const pct = Math.round((count / total) * 100);
        chartHtml += '<div class="status-bar"><div class="status-bar-header"><span>' + s.n + '</span><strong>' + count + ' (' + pct + '%)</strong></div><div class="status-bar-track"><div class="status-bar-fill ' + s.c + '" style="width:' + pct + '%"></div></div></div>';
    });
    el.projectStatusChart.innerHTML = chartHtml;

    const pct = d.taskCompletionRate || 0;
    el.taskProgressRing.style.background = 'conic-gradient(var(--success) ' + pct + '%, var(--surface-light) ' + pct + '%)';
    el.taskProgressPercent.textContent = pct + '%';

    const cats = d.budgetByCategory || {};
    const colors = ['#e50914', '#f5c518', '#46d369', '#3498db', '#6366f1', '#e91e63', '#ff9800', '#9c27b0'];
    let bHtml = '';
    Object.keys(cats).forEach((cat, i) => { bHtml += '<div class="budget-breakdown-item"><div class="budget-breakdown-color" style="background:' + colors[i % colors.length] + '"></div><div class="budget-breakdown-info"><span>' + esc(cat) + '</span></div><span class="budget-breakdown-amount">' + formatCurrency(cats[cat]) + '</span></div>'; });
    el.budgetBreakdown.innerHTML = bHtml || '<p style="color:var(--text-secondary)">No data</p>';

    el.analyticsProjects.textContent = d.totalProjects || 0;
    el.analyticsCompleted.textContent = d.completedProjects || 0;
    el.analyticsCrew.textContent = d.totalCrew || 0;
    el.analyticsSchedules.textContent = d.upcomingSchedules || 0;
}

// ============ DROPDOWNS ============
function updateAllDropdowns() {
    const po = projects.map(p => '<option value="' + p.ID + '">' + esc(p.ProjectName) + '</option>').join('');
    const co = crew.map(c => '<option value="' + esc(c.Name) + '">' + esc(c.Name) + ' - ' + esc(c.Role) + '</option>').join('');
    const lo = locations.map(l => '<option value="' + l.ID + '">' + esc(l.Name) + '</option>').join('');

    el.taskProject.innerHTML = '<option value="">Select Project</option>' + po;
    el.taskProjectFilter.innerHTML = '<option value="">All Projects</option>' + po;
    el.scheduleProject.innerHTML = '<option value="">Select Project</option>' + po;
    el.scheduleLocation.innerHTML = '<option value="">Select Location</option>' + lo;
    el.budgetProject.innerHTML = '<option value="">Select Project</option>' + po;
    el.budgetProjectFilter.innerHTML = '<option value="">All Projects</option>' + po;
    el.equipmentProject.innerHTML = '<option value="">None</option>' + po;
    el.noteProject.innerHTML = '<option value="">General</option>' + po;
    el.noteProjectFilter.innerHTML = '<option value="">All Notes</option>' + po;
    el.taskAssignedTo.innerHTML = '<option value="">Select Crew</option>' + co;
    el.equipmentAssignedTo.innerHTML = '<option value="">None</option>' + co;
}

// ============ FORM HANDLERS ============
async function handleProjectSubmit(e) { e.preventDefault(); const d = { projectName: el.projectName.value.trim(), director: el.projectDirector.value.trim(), category: el.projectCategory.value, status: el.projectStatus.value, startDate: el.projectStartDate.value, endDate: el.projectEndDate.value, budget: el.projectBudget.value, description: el.projectDescription.value.trim() }; const id = el.projectId.value; const r = id ? await apiCall('updateProject', { ...d, id }) : await apiCall('addProject', d); if (r.success) { showToast(id ? 'Updated!' : 'Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleTaskSubmit(e) { e.preventDefault(); const r = await apiCall('addTask', { projectId: el.taskProject.value, taskName: el.taskName.value.trim(), assignedTo: el.taskAssignedTo.value, priority: el.taskPriority.value, dueDate: el.taskDueDate.value, description: el.taskDescription.value.trim() }); if (r.success) { showToast('Task added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleScheduleSubmit(e) { e.preventDefault(); const d = { projectId: el.scheduleProject.value, title: el.scheduleTitle.value.trim(), date: el.scheduleDate.value, startTime: el.scheduleStartTime.value, endTime: el.scheduleEndTime.value, locationId: el.scheduleLocation.value, crewAssigned: el.scheduleCrewAssigned.value.trim(), notes: el.scheduleNotes.value.trim() }; const id = el.scheduleId.value; const r = id ? await apiCall('updateSchedule', { ...d, id }) : await apiCall('addSchedule', d); if (r.success) { showToast(id ? 'Updated!' : 'Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleLocationSubmit(e) { e.preventDefault(); const d = { name: el.locationName.value.trim(), address: el.locationAddress.value.trim(), googleMapsLink: el.locationGoogleMaps.value.trim(), contactPerson: el.locationContactPerson.value.trim(), contactPhone: el.locationContactPhone.value.trim(), notes: el.locationNotes.value.trim() }; const id = el.locationId.value; const r = id ? await apiCall('updateLocation', { ...d, id }) : await apiCall('addLocation', d); if (r.success) { showToast(id ? 'Updated!' : 'Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleBudgetSubmit(e) { e.preventDefault(); const r = await apiCall('addBudgetItem', { projectId: el.budgetProject.value, type: el.budgetType.value, category: el.budgetCategory.value, description: el.budgetDescription.value.trim(), amount: el.budgetAmount.value, date: el.budgetDate.value }); if (r.success) { showToast('Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleEquipmentSubmit(e) { e.preventDefault(); const r = await apiCall('addEquipment', { name: el.equipmentName.value.trim(), category: el.equipmentCategory.value, condition: el.equipmentCondition.value, projectId: el.equipmentProject.value, assignedTo: el.equipmentAssignedTo.value }); if (r.success) { showToast('Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleCrewSubmit(e) { e.preventDefault(); const d = { name: el.crewName.value.trim(), role: el.crewRole.value, phone: el.crewPhone.value.trim(), email: el.crewEmail.value.trim(), skills: el.crewSkills.value.trim(), availability: el.crewAvailability.value, rating: el.crewRating.value }; const id = el.crewId.value; const r = id ? await apiCall('updateCrew', { ...d, id }) : await apiCall('addCrew', d); if (r.success) { showToast(id ? 'Updated!' : 'Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleNoteSubmit(e) { e.preventDefault(); const r = await apiCall('addNote', { content: el.noteContent.value.trim(), projectId: el.noteProject.value }); if (r.success) { showToast('Added!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

async function handleAnnouncementSubmit(e) { e.preventDefault(); const r = await apiCall('addAnnouncement', { title: el.announcementTitle.value.trim(), message: el.announcementMessage.value.trim(), priority: el.announcementPriority.value }); if (r.success) { showToast('Posted!'); closeAllModals(); await loadAllData(); } else showToast(r.error || 'Error', true); }

// ============ EDIT FUNCTIONS ============
function editProject(id) { const p = projects.find(x => x.ID === id); if (!p) return; el.projectId.value = p.ID; el.projectName.value = p.ProjectName; el.projectDirector.value = p.Director; el.projectCategory.value = p.Category || 'Short Film'; el.projectStatus.value = p.Status; el.projectStartDate.value = formatDateInput(p.StartDate); el.projectEndDate.value = formatDateInput(p.EndDate); el.projectBudget.value = p.Budget || ''; el.projectDescription.value = p.Description || ''; document.getElementById('projectModalTitle').textContent = 'Edit Project'; openModal('projectModal'); }

function editSchedule(id) { const s = schedules.find(x => x.ID === id); if (!s) return; el.scheduleId.value = s.ID; el.scheduleProject.value = s.ProjectID; el.scheduleTitle.value = s.Title; el.scheduleDate.value = formatDateInput(s.Date); el.scheduleStartTime.value = s.StartTime || ''; el.scheduleEndTime.value = s.EndTime || ''; el.scheduleLocation.value = s.LocationID || ''; el.scheduleCrewAssigned.value = s.CrewAssigned || ''; el.scheduleNotes.value = s.Notes || ''; document.getElementById('scheduleModalTitle').textContent = 'Edit Schedule'; openModal('scheduleModal'); }

function editLocation(id) { const l = locations.find(x => x.ID === id); if (!l) return; el.locationId.value = l.ID; el.locationName.value = l.Name; el.locationAddress.value = l.Address; el.locationGoogleMaps.value = l.GoogleMapsLink || ''; el.locationContactPerson.value = l.ContactPerson || ''; el.locationContactPhone.value = l.ContactPhone || ''; el.locationNotes.value = l.Notes || ''; document.getElementById('locationModalTitle').textContent = 'Edit Location'; openModal('locationModal'); }

// ============ DELETE FUNCTIONS ============
async function deleteProject(id) { if (confirm('Delete?')) { const r = await apiCall('deleteProject', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteTask(id) { if (confirm('Delete?')) { const r = await apiCall('deleteTask', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteSchedule(id) { if (confirm('Delete?')) { const r = await apiCall('deleteSchedule', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteLocation(id) { if (confirm('Delete?')) { const r = await apiCall('deleteLocation', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteBudgetItem(id) { if (confirm('Delete?')) { const r = await apiCall('deleteBudgetItem', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteEquipment(id) { if (confirm('Delete?')) { const r = await apiCall('deleteEquipment', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteCrew(id) { if (confirm('Remove?')) { const r = await apiCall('deleteCrew', { id }); if (r.success) { showToast('Removed!'); await loadAllData(); } } }
async function deleteNote(id) { if (confirm('Delete?')) { const r = await apiCall('deleteNote', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteAnnouncement(id) { if (confirm('Delete?')) { const r = await apiCall('deleteAnnouncement', { id }); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }

// ============ TOGGLE FUNCTIONS ============
async function toggleTask(id) { const r = await apiCall('toggleTask', { id }); if (r.success) { const t = tasks.find(x => x.ID === id); if (t) t.Status = r.status; updateAllUI(); showToast(r.status === 'Completed' ? 'Done!' : 'Reopened!'); } }
async function toggleNote(id) { const r = await apiCall('toggleNote', { id }); if (r.success) { const n = notes.find(x => x.ID === id); if (n) n.Completed = r.completed; updateAllUI(); showToast(r.completed === 'true' ? 'Done!' : 'Reopened!'); } }
async function toggleEquipment(id) { const r = await apiCall('toggleEquipment', { id }); if (r.success) { const e = equipment.find(x => x.ID === id); if (e) e.Status = r.status; updateAllUI(); showToast(r.status === 'Packed' ? 'Packed!' : 'Unpacked!'); } }

// ============ QUICK ADD ============
function quickAddProject() { resetForm('project'); openModal('projectModal'); }
function quickAddTask() { resetForm('task'); openModal('taskModal'); }
function quickAddSchedule() { resetForm('schedule'); openModal('scheduleModal'); }
function quickAddNote() { resetForm('note'); openModal('noteModal'); }

// ============ FORM RESET ============
function resetForm(type) {
    switch (type) {
        case 'project': el.projectId.value = ''; el.projectName.value = ''; el.projectDirector.value = ''; el.projectCategory.value = 'Short Film'; el.projectStatus.value = 'Pre-Production'; el.projectStartDate.value = ''; el.projectEndDate.value = ''; el.projectBudget.value = ''; el.projectDescription.value = ''; document.getElementById('projectModalTitle').textContent = 'Add Project'; break;
        case 'task': el.taskId.value = ''; el.taskProject.value = ''; el.taskName.value = ''; el.taskAssignedTo.value = ''; el.taskPriority.value = 'Medium'; el.taskDueDate.value = ''; el.taskDescription.value = ''; break;
        case 'schedule': el.scheduleId.value = ''; el.scheduleProject.value = ''; el.scheduleTitle.value = ''; el.scheduleDate.value = ''; el.scheduleStartTime.value = ''; el.scheduleEndTime.value = ''; el.scheduleLocation.value = ''; el.scheduleCrewAssigned.value = ''; el.scheduleNotes.value = ''; document.getElementById('scheduleModalTitle').textContent = 'Add Schedule'; break;
        case 'location': el.locationId.value = ''; el.locationName.value = ''; el.locationAddress.value = ''; el.locationGoogleMaps.value = ''; el.locationContactPerson.value = ''; el.locationContactPhone.value = ''; el.locationNotes.value = ''; document.getElementById('locationModalTitle').textContent = 'Add Location'; break;
        case 'budget': el.budgetId.value = ''; el.budgetProject.value = ''; el.budgetType.value = 'Expense'; el.budgetCategory.value = 'Equipment'; el.budgetDescription.value = ''; el.budgetAmount.value = ''; el.budgetDate.value = new Date().toISOString().split('T')[0]; break;
        case 'equipment': el.equipmentId.value = ''; el.equipmentName.value = ''; el.equipmentCategory.value = 'Camera'; el.equipmentCondition.value = 'Good'; el.equipmentProject.value = ''; el.equipmentAssignedTo.value = ''; break;
        case 'crew': el.crewId.value = ''; el.crewName.value = ''; el.crewRole.value = 'Director'; el.crewPhone.value = ''; el.crewEmail.value = ''; el.crewSkills.value = ''; el.crewAvailability.value = 'Available'; el.crewRating.value = '5'; break;
        case 'note': el.noteProject.value = ''; el.noteContent.value = ''; break;
        case 'announcement': el.announcementTitle.value = ''; el.announcementMessage.value = ''; el.announcementPriority.value = 'Normal'; break;
    }
}

// ============ NAVIGATION ============
function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(page);
    if (pageEl) pageEl.classList.add('active');
    document.querySelectorAll('.nav-item, .menu-item').forEach(i => { i.classList.remove('active'); if (i.dataset.page === page) i.classList.add('active'); });
    window.scrollTo(0, 0);
    if (page === 'analytics') loadAnalytics();
    if (page === 'chat') loadChatRooms();
}

// ============ MENU ============
function openMenu() { el.sideMenu.classList.add('active'); el.menuOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeMenu() { el.sideMenu.classList.remove('active'); el.menuOverlay.classList.remove('active'); document.body.style.overflow = ''; }

// ============ MODALS ============
function openModal(id) { document.getElementById(id).classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeAllModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); document.body.style.overflow = ''; }

// ============ THEME ============
function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) { document.documentElement.removeAttribute('data-theme'); el.themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>'; localStorage.setItem('cinemax-theme', 'dark'); }
    else { document.documentElement.setAttribute('data-theme', 'light'); el.themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>'; localStorage.setItem('cinemax-theme', 'light'); }
}

// ============ SEARCH ============
function openSearch() { el.searchOverlay.classList.add('active'); el.searchInput.focus(); }
function closeSearch() { el.searchOverlay.classList.remove('active'); el.searchInput.value = ''; el.searchResults.innerHTML = ''; }

function performSearch(query) {
    if (!query || query.length < 2) { el.searchResults.innerHTML = ''; return; }
    const q = query.toLowerCase();
    const mp = projects.filter(p => (p.ProjectName || '').toLowerCase().includes(q) || (p.Director || '').toLowerCase().includes(q));
    const mt = tasks.filter(t => (t.TaskName || '').toLowerCase().includes(q) || (t.AssignedTo || '').toLowerCase().includes(q));
    const mc = crew.filter(c => (c.Name || '').toLowerCase().includes(q) || (c.Role || '').toLowerCase().includes(q));
    const ml = locations.filter(l => (l.Name || '').toLowerCase().includes(q) || (l.Address || '').toLowerCase().includes(q));
    const me = equipment.filter(e => (e.Name || '').toLowerCase().includes(q) || (e.Category || '').toLowerCase().includes(q));

    let html = '';
    if (mp.length) { html += '<div class="search-section"><h3>Projects</h3>' + mp.map(p => '<div class="search-item" onclick="navigateToPage(\'projects\');closeSearch()"><div class="search-item-icon project"><i class="fas fa-video"></i></div><div class="search-item-info"><h4>' + esc(p.ProjectName) + '</h4><p>' + esc(p.Director) + '</p></div></div>').join('') + '</div>'; }
    if (mt.length) { html += '<div class="search-section"><h3>Tasks</h3>' + mt.map(t => '<div class="search-item" onclick="navigateToPage(\'tasks\');closeSearch()"><div class="search-item-icon task"><i class="fas fa-tasks"></i></div><div class="search-item-info"><h4>' + esc(t.TaskName) + '</h4><p>' + esc(t.AssignedTo || '') + '</p></div></div>').join('') + '</div>'; }
    if (mc.length) { html += '<div class="search-section"><h3>Crew</h3>' + mc.map(c => '<div class="search-item" onclick="navigateToPage(\'crew\');closeSearch()"><div class="search-item-icon crew"><i class="fas fa-user"></i></div><div class="search-item-info"><h4>' + esc(c.Name) + '</h4><p>' + esc(c.Role) + '</p></div></div>').join('') + '</div>'; }
    if (ml.length) { html += '<div class="search-section"><h3>Locations</h3>' + ml.map(l => '<div class="search-item" onclick="navigateToPage(\'locations\');closeSearch()"><div class="search-item-icon location"><i class="fas fa-map-marker-alt"></i></div><div class="search-item-info"><h4>' + esc(l.Name) + '</h4><p>' + esc(l.Address) + '</p></div></div>').join('') + '</div>'; }
    if (me.length) { html += '<div class="search-section"><h3>Equipment</h3>' + me.map(e => '<div class="search-item" onclick="navigateToPage(\'equipment\');closeSearch()"><div class="search-item-icon equipment"><i class="fas fa-camera"></i></div><div class="search-item-info"><h4>' + esc(e.Name) + '</h4><p>' + esc(e.Category) + '</p></div></div>').join('') + '</div>'; }
    if (!html) html = '<div class="no-results"><i class="fas fa-search"></i><h3>No Results</h3></div>';
    el.searchResults.innerHTML = html;
}

// ============ EXTERNAL ACTIONS ============
function callPhone(phone) { window.location.href = 'tel:' + phone; }
function openWhatsApp(phone) { window.open('https://wa.me/' + phone.replace(/[^0-9]/g, ''), '_blank'); }
function openMaps(link) { window.open(link, '_blank'); }

// ============ CHAT SYSTEM ============
async function loadChatRooms() {
    if (!currentUser) return;
    
    try {
        const result = await apiCall('getChatRooms', { username: currentUser.Username });
        
        if (result.success) {
            chatRooms = result.data || [];
            renderChatRooms();
            updateChatBadges();
        }
    } catch (error) {
        console.log('Error loading chat rooms:', error);
    }
}

function renderChatRooms() {
    let filtered = chatRooms;
    if (currentChatTab === 'private') filtered = chatRooms.filter(r => r.Type === 'private');
    if (currentChatTab === 'group') filtered = chatRooms.filter(r => r.Type === 'group');

    el.chatRoomsList.innerHTML = filtered.length === 0
        ? '<div class="empty-state"><i class="fas fa-comments"></i><h3>No Chats Yet</h3><p>Tap + to start</p></div>'
        : filtered.map(room => {
            const isGroup = room.Type === 'group';
            const displayName = isGroup ? room.Name : getChatPartnerName(room);
            const initials = getInitials(displayName);
            const lastMsg = room.lastMessage;
            const lastText = lastMsg ? (lastMsg.SenderName === currentUser.Username ? 'You: ' : '') + lastMsg.Message : 'No messages';
            const lastTime = lastMsg ? formatChatTime(lastMsg.Timestamp) : '';
            const unread = room.unreadCount || 0;
            return '<div class="chat-room-item" onclick="openChatRoom(\'' + room.ID + '\')"><div class="avatar ' + (isGroup ? 'group' : 'private') + '">' + (isGroup ? '<i class="fas fa-users"></i>' : initials) + '</div><div class="info"><h4>' + esc(displayName) + '</h4><p>' + esc(lastText).substring(0, 40) + '</p></div><div class="meta"><span class="time">' + lastTime + '</span>' + (unread > 0 ? '<span class="unread">' + unread + '</span>' : '') + '</div></div>';
        }).join('');
}

function getChatPartnerName(room) {
    if (!currentUser) return room.Name;
    const members = (room.Members || '').split(',').map(m => m.trim());
    return members.find(m => m !== currentUser.Username) || room.Name;
}

function updateChatBadges() {
    const total = chatRooms.reduce((s, r) => s + (r.unreadCount || 0), 0);
    const chatBadge = document.getElementById('chatBadge');
    const navBadge = document.getElementById('navChatBadge');
    if (chatBadge) chatBadge.textContent = total > 0 ? total : '';
    if (navBadge) navBadge.textContent = total > 0 ? total : '';
    if (el.unreadMessages) el.unreadMessages.textContent = total;
}

async function openChatRoom(roomId) {
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.ID === roomId);
    if (!room) return;

    document.getElementById('chatListView').classList.add('hidden');
    document.getElementById('chatRoomView').classList.remove('hidden');
    document.getElementById('bottomNav').style.display = 'none';
    document.querySelector('.app-header').style.display = 'none';

    const isGroup = room.Type === 'group';
    const displayName = isGroup ? room.Name : getChatPartnerName(room);
    document.getElementById('chatRoomName').textContent = displayName;
    document.getElementById('chatRoomStatus').textContent = isGroup ? (room.Members || '').split(',').length + ' members' : 'Online';
    document.getElementById('chatRoomAvatar').innerHTML = isGroup ? '<i class="fas fa-users"></i>' : getInitials(displayName);

    // Clear old messages first
    currentMessages = [];
    document.getElementById('chatMessages').innerHTML = '<div class="loading-messages"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';
    
    // Load messages immediately
    await loadMessages(roomId);
    
    // Clear any existing interval
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
    }
    
    // Refresh every 1 second for real-time updates
    chatRefreshInterval = setInterval(() => {
        loadMessages(roomId);
    }, 1000);
}

function closeChatRoom() {
    // Stop refreshing messages
    if (chatRefreshInterval) {
        clearInterval(chatRefreshInterval);
        chatRefreshInterval = null;
    }
    
    currentRoomId = null;
    currentMessages = [];
    
    document.getElementById('chatListView').classList.remove('hidden');
    document.getElementById('chatRoomView').classList.add('hidden');
    document.getElementById('bottomNav').style.display = '';
    document.querySelector('.app-header').style.display = '';
    
    // Refresh chat rooms list
    loadChatRooms();
}

async function loadMessages(roomId) {
    if (!currentUser || !roomId) return;
    
    try {
        const result = await apiCall('getMessages', { roomId: roomId, username: currentUser.Username });
        
        if (result.success) {
            const newMsgs = result.data || [];
            
            // Check if messages changed
            const newMsgsStr = JSON.stringify(newMsgs);
            const oldMsgsStr = JSON.stringify(currentMessages);
            
            if (newMsgsStr !== oldMsgsStr) {
                currentMessages = newMsgs;
                renderMessages();
                
                // Auto-scroll to bottom on new messages
                const container = document.getElementById('chatMessages');
                container.scrollTop = container.scrollHeight;
            }
        } else {
            console.log('Error loading messages:', result.error);
        }
    } catch (error) {
        console.log('Message load error:', error);
    }
}

function renderMessages() {
    const container = document.getElementById('chatMessages');
    
    if (!currentMessages || currentMessages.length === 0) {
        container.innerHTML = '<div class="empty-state" style="padding-top:100px"><i class="fas fa-comments"></i><h3>No messages yet</h3><p>Say hello! 👋</p></div>';
        return;
    }
    
    let html = '';
    let lastDate = '';

    currentMessages.forEach(msg => {
        // Date separator
        let msgDate;
        try {
            msgDate = new Date(msg.Timestamp).toLocaleDateString();
        } catch {
            msgDate = 'Unknown';
        }
        
        if (msgDate !== lastDate) {
            lastDate = msgDate;
            const isToday = msgDate === new Date().toLocaleDateString();
            const isYesterday = msgDate === new Date(Date.now() - 86400000).toLocaleDateString();
            let dateLabel = msgDate;
            if (isToday) dateLabel = 'Today';
            if (isYesterday) dateLabel = 'Yesterday';
            html += '<div class="message-date"><span>' + dateLabel + '</span></div>';
        }

        const isSent = msg.SenderName === currentUser.Username;
        let time;
        try {
            time = new Date(msg.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            time = '';
        }

        html += '<div class="message ' + (isSent ? 'sent' : 'received') + '">';
        if (!isSent) {
            html += '<div class="sender">' + esc(msg.SenderName) + '</div>';
        }
        html += '<div class="text">' + esc(msg.Message) + '</div>';
        html += '<div class="time">' + time + '</div>';
        html += '</div>';
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentRoomId || !currentUser) return;
    
    // Clear input immediately for better UX
    input.value = '';
    
    // Disable send button temporarily
    const sendBtn = document.getElementById('sendMessageBtn');
    sendBtn.disabled = true;
    
    try {
        const result = await apiCall('sendMessage', { 
            roomId: currentRoomId, 
            senderName: currentUser.Username, 
            message: message 
        });
        
        if (result.success) {
            // Load messages immediately after sending
            await loadMessages(currentRoomId);
        } else {
            showToast('Failed to send message', true);
            // Put message back if failed
            input.value = message;
        }
    } catch (error) {
        showToast('Error sending message', true);
        input.value = message;
    }
    
    sendBtn.disabled = false;
    input.focus();
}

// New chat functions
function switchChatType(type) {
    document.getElementById('privateChatTypeBtn').classList.toggle('active', type === 'private');
    document.getElementById('groupChatTypeBtn').classList.toggle('active', type === 'group');
    document.getElementById('privateChatForm').classList.toggle('hidden', type !== 'private');
    document.getElementById('groupChatForm').classList.toggle('hidden', type !== 'group');
    selectedGroupMembers = [];
    if (type === 'group') renderGroupMembersList();
}

function renderCrewSelectList() {
    const users = crew.filter(c => c.Name !== (currentUser ? currentUser.Username : ''));
    document.getElementById('crewSelectList').innerHTML = users.length === 0
        ? '<p style="color:var(--text-secondary);text-align:center;padding:20px">No crew. Add crew first.</p>'
        : users.map(c => '<div class="crew-select-item" onclick="startPrivateChat(\'' + esc(c.Name) + '\')"><div class="select-avatar">' + getInitials(c.Name) + '</div><div class="select-info"><h4>' + esc(c.Name) + '</h4><p>' + esc(c.Role) + '</p></div><i class="fas fa-chevron-right" style="color:var(--text-muted)"></i></div>').join('');
}

function renderGroupMembersList() {
    const users = crew.filter(c => c.Name !== (currentUser ? currentUser.Username : ''));
    document.getElementById('groupMembersList').innerHTML = users.map(c => {
        const sel = selectedGroupMembers.includes(c.Name);
        return '<div class="crew-select-item ' + (sel ? 'selected' : '') + '" onclick="toggleGroupMember(\'' + esc(c.Name) + '\')"><div class="select-avatar">' + getInitials(c.Name) + '</div><div class="select-info"><h4>' + esc(c.Name) + '</h4><p>' + esc(c.Role) + '</p></div><div class="select-check"></div></div>';
    }).join('');
}

function toggleGroupMember(name) {
    const idx = selectedGroupMembers.indexOf(name);
    if (idx === -1) selectedGroupMembers.push(name); else selectedGroupMembers.splice(idx, 1);
    renderGroupMembersList();
}

async function startPrivateChat(partnerName) {
    if (!currentUser) return;
    const existing = chatRooms.find(r => { if (r.Type !== 'private') return false; const m = (r.Members || '').split(',').map(x => x.trim()); return m.includes(currentUser.Username) && m.includes(partnerName); });
    if (existing) { closeAllModals(); openChatRoom(existing.ID); return; }
    showLoading();
    const r = await apiCall('createChatRoom', { name: partnerName, type: 'private', members: currentUser.Username + ',' + partnerName, createdBy: currentUser.Username });
    hideLoading();
    if (r.success) { closeAllModals(); await loadChatRooms(); openChatRoom(r.id); }
}

async function createGroupChat() {
    if (!currentUser) return;
    const groupName = document.getElementById('groupName').value.trim();
    if (!groupName) { showToast('Enter group name', true); return; }
    if (selectedGroupMembers.length === 0) { showToast('Select members', true); return; }
    showLoading();
    const r = await apiCall('createChatRoom', { name: groupName, type: 'group', members: [currentUser.Username, ...selectedGroupMembers].join(','), createdBy: currentUser.Username });
    hideLoading();
    if (r.success) { selectedGroupMembers = []; document.getElementById('groupName').value = ''; closeAllModals(); await loadChatRooms(); openChatRoom(r.id); }
}

function showChatInfo() {
    const room = chatRooms.find(r => r.ID === currentRoomId);
    if (!room) return;
    const members = (room.Members || '').split(',').map(m => m.trim()).filter(m => m);
    const isGroup = room.Type === 'group';
    let html = '';
    if (isGroup) html += '<div class="chat-info-section"><h3>' + esc(room.Name) + '</h3><p style="color:var(--text-secondary);margin-bottom:16px">Group - ' + members.length + ' members</p></div>';
    html += '<div class="chat-info-section"><h3>Members</h3>' + members.map(m => { const cm = crew.find(c => c.Name === m); return '<div class="chat-member-item"><div class="chat-member-avatar">' + getInitials(m) + '</div><div class="chat-member-info"><h4>' + esc(m) + (m === currentUser.Username ? ' (You)' : '') + '</h4><p>' + esc(cm ? cm.Role : 'Crew') + '</p></div></div>'; }).join('') + '</div>';
    if (room.CreatedBy === currentUser.Username) html += '<button class="delete-chat-btn" onclick="deleteChatRoomAction(\'' + room.ID + '\')"><i class="fas fa-trash"></i> Delete Chat</button>';
    document.getElementById('chatInfoContent').innerHTML = html;
    openModal('chatInfoModal');
}

async function deleteChatRoomAction(roomId) {
    if (!confirm('Delete chat and all messages?')) return;
    const r = await apiCall('deleteChatRoom', { id: roomId });
    if (r.success) { closeAllModals(); closeChatRoom(); showToast('Deleted!'); await loadChatRooms(); }
}

function formatChatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts); const now = new Date(); const diff = now - d;
    if (diff < 60000) return 'now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ============ UTILITIES ============
function showLoading() { el.loadingOverlay.classList.add('active'); }
function hideLoading() { el.loadingOverlay.classList.remove('active'); }
function showToast(msg, err = false) { el.toastMessage.textContent = msg; el.toast.classList.toggle('error', err); el.toast.classList.add('show'); setTimeout(() => el.toast.classList.remove('show'), 3000); }
function esc(t) { if (!t) return ''; const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function formatDate(d) { if (!d) return 'N/A'; try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return 'N/A'; } }
function formatDateTime(d) { if (!d) return ''; try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } }
function formatDateInput(d) { if (!d) return ''; try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; } }
function formatCurrency(a) { const n = parseFloat(a) || 0; if (n >= 100000) return String.fromCharCode(8377) + (n / 100000).toFixed(1) + 'L'; if (n >= 1000) return String.fromCharCode(8377) + (n / 1000).toFixed(1) + 'K'; return String.fromCharCode(8377) + n.toLocaleString('en-IN'); }
function getInitials(n) { if (!n) return '?'; return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
