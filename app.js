const API_URL = 'https://script.google.com/macros/s/AKfycbyf9eZ6bNX0hNDqgAsW4Ovg7BZ8K1I85MkRwRocL_71CwHL2xY15f6G8A7L9TNFOsdzVw/exec';

let projects = [];
let tasks = [];
let notes = [];
let crew = [];
let currentFilter = 'all';
let currentProjectFilter = '';

const elements = {
    splashScreen: document.getElementById('splash-screen'),
    app: document.getElementById('app'),
    menuBtn: document.getElementById('menuBtn'),
    closeMenu: document.getElementById('closeMenu'),
    sideMenu: document.getElementById('sideMenu'),
    menuOverlay: document.getElementById('menuOverlay'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    totalProjects: document.getElementById('totalProjects'),
    pendingTasks: document.getElementById('pendingTasks'),
    totalCrew: document.getElementById('totalCrew'),
    totalNotes: document.getElementById('totalNotes'),
    activeProjectsList: document.getElementById('activeProjectsList'),
    recentTasksList: document.getElementById('recentTasksList'),
    projectsGrid: document.getElementById('projectsGrid'),
    tasksContainer: document.getElementById('tasksContainer'),
    notepadContainer: document.getElementById('notepadContainer'),
    crewGrid: document.getElementById('crewGrid'),
    taskProjectFilter: document.getElementById('taskProjectFilter'),
    noteProjectFilter: document.getElementById('noteProjectFilter'),
    projectModal: document.getElementById('projectModal'),
    taskModal: document.getElementById('taskModal'),
    noteModal: document.getElementById('noteModal'),
    crewModal: document.getElementById('crewModal'),
    projectForm: document.getElementById('projectForm'),
    taskForm: document.getElementById('taskForm'),
    noteForm: document.getElementById('noteForm'),
    crewForm: document.getElementById('crewForm'),
    projectId: document.getElementById('projectId'),
    projectName: document.getElementById('projectName'),
    projectDirector: document.getElementById('projectDirector'),
    projectStatus: document.getElementById('projectStatus'),
    projectStartDate: document.getElementById('projectStartDate'),
    projectEndDate: document.getElementById('projectEndDate'),
    taskId: document.getElementById('taskId'),
    taskProject: document.getElementById('taskProject'),
    taskName: document.getElementById('taskName'),
    taskAssignedTo: document.getElementById('taskAssignedTo'),
    taskDueDate: document.getElementById('taskDueDate'),
    noteProject: document.getElementById('noteProject'),
    noteContent: document.getElementById('noteContent'),
    crewName: document.getElementById('crewName'),
    crewRole: document.getElementById('crewRole'),
    crewPhone: document.getElementById('crewPhone')
};

document.addEventListener('DOMContentLoaded', () => { initializeApp(); });

async function initializeApp() {
    setTimeout(() => {
        elements.splashScreen.classList.add('fade-out');
        elements.app.classList.remove('hidden');
        setTimeout(() => { elements.splashScreen.style.display = 'none'; }, 500);
    }, 2000);
    setupEventListeners();
    await loadAllData();
}

function setupEventListeners() {
    elements.menuBtn.addEventListener('click', openMenu);
    elements.closeMenu.addEventListener('click', closeMenu);
    elements.menuOverlay.addEventListener('click', closeMenu);
    
    document.querySelectorAll('.menu-item, .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(item.dataset.page);
            closeMenu();
        });
    });
    
    document.getElementById('addProjectBtn').addEventListener('click', () => { resetProjectForm(); openModal('projectModal'); });
    document.getElementById('addTaskBtn').addEventListener('click', () => { resetTaskForm(); openModal('taskModal'); });
    document.getElementById('addNoteBtn').addEventListener('click', () => { resetNoteForm(); openModal('noteModal'); });
    document.getElementById('addCrewBtn').addEventListener('click', () => { resetCrewForm(); openModal('crewModal'); });
    
    document.querySelectorAll('.close-modal').forEach(btn => { btn.addEventListener('click', closeAllModals); });
    document.querySelectorAll('.modal').forEach(modal => { modal.addEventListener('click', (e) => { if (e.target === modal) closeAllModals(); }); });
    
    elements.projectForm.addEventListener('submit', handleProjectSubmit);
    elements.taskForm.addEventListener('submit', handleTaskSubmit);
    elements.noteForm.addEventListener('submit', handleNoteSubmit);
    elements.crewForm.addEventListener('submit', handleCrewSubmit);
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderProjects();
        });
    });
    
    elements.taskProjectFilter.addEventListener('change', (e) => { currentProjectFilter = e.target.value; renderTasks(); });
    elements.noteProjectFilter.addEventListener('change', (e) => { renderNotes(e.target.value); });
}

async function apiCall(action, params = {}) {
    showLoading();
    try {
        const url = new URL(API_URL);
        url.searchParams.append('action', action);
        Object.keys(params).forEach(key => { if (params[key] !== undefined && params[key] !== null) url.searchParams.append(key, params[key]); });
        const response = await fetch(url.toString(), { method: 'GET', redirect: 'follow' });
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        showToast('Connection error', true);
        return { error: error.message };
    }
}

async function loadAllData() {
    showLoading();
    try {
        const [projectsRes, tasksRes, notesRes, crewRes] = await Promise.all([
            apiCall('getProjects'), apiCall('getTasks'), apiCall('getNotes'), apiCall('getCrew')
        ]);
        if (projectsRes.success) projects = projectsRes.data || [];
        if (tasksRes.success) tasks = tasksRes.data || [];
        if (notesRes.success) notes = notesRes.data || [];
        if (crewRes.success) crew = crewRes.data || [];
        updateUI();
    } catch (error) { showToast('Error loading data', true); }
    hideLoading();
}

function updateUI() { updateStats(); renderDashboard(); renderProjects(); renderTasks(); renderNotes(); renderCrew(); updateProjectDropdowns(); updateCrewDropdown(); }

function updateStats() {
    elements.totalProjects.textContent = projects.length;
    elements.pendingTasks.textContent = tasks.filter(t => t.Status !== 'Completed').length;
    elements.totalCrew.textContent = crew.length;
    elements.totalNotes.textContent = notes.length;
}

function renderDashboard() {
    const activeProjects = projects.filter(p => p.Status !== 'Completed').slice(0, 3);
    elements.activeProjectsList.innerHTML = activeProjects.length === 0 ? '<div class="empty-state"><i class="fas fa-video"></i><h3>No Active Projects</h3></div>' : activeProjects.map(p => '<div class="project-list-item" onclick="navigateToPage(\'projects\')"><div class="project-icon"><i class="fas fa-film"></i></div><div class="project-list-info"><h4>' + escapeHtml(p.ProjectName) + '</h4><span>' + p.Status + '</span></div></div>').join('');
    
    const recentTasks = tasks.filter(t => t.Status !== 'Completed').slice(0, 3);
    elements.recentTasksList.innerHTML = recentTasks.length === 0 ? '<div class="empty-state"><i class="fas fa-tasks"></i><h3>No Pending Tasks</h3></div>' : recentTasks.map(t => '<div class="task-card"><div class="task-checkbox" onclick="toggleTask(\'' + t.ID + '\')"><i class="fas fa-check"></i></div><div class="task-content"><h4>' + escapeHtml(t.TaskName) + '</h4><div class="task-meta"><span><i class="fas fa-user"></i> ' + (escapeHtml(t.AssignedTo) || 'Unassigned') + '</span></div></div></div>').join('');
}

function renderProjects() {
    let filtered = currentFilter === 'all' ? projects : projects.filter(p => p.Status === currentFilter);
    elements.projectsGrid.innerHTML = filtered.length === 0 ? '<div class="empty-state"><i class="fas fa-video"></i><h3>No Projects Found</h3></div>' : filtered.map(p => {
        const sc = p.Status.toLowerCase().replace(/\s+/g, '-');
        return '<div class="project-card ' + sc + '"><div class="project-card-header"><div><h3>' + escapeHtml(p.ProjectName) + '</h3><p class="director"><i class="fas fa-user"></i> ' + escapeHtml(p.Director) + '</p></div><span class="project-status ' + sc + '">' + p.Status + '</span></div><div class="project-dates"><span><i class="fas fa-calendar-alt"></i> ' + formatDate(p.StartDate) + '</span><span><i class="fas fa-flag-checkered"></i> ' + formatDate(p.EndDate) + '</span></div><div class="project-actions"><button class="edit-btn" onclick="editProject(\'' + p.ID + '\')"><i class="fas fa-edit"></i></button><button class="delete-btn" onclick="deleteProject(\'' + p.ID + '\')"><i class="fas fa-trash"></i></button></div></div>';
    }).join('');
}

function renderTasks() {
    let filtered = currentProjectFilter ? tasks.filter(t => t.ProjectID === currentProjectFilter) : tasks;
    filtered.sort((a, b) => (a.Status === 'Completed' ? 1 : 0) - (b.Status === 'Completed' ? 1 : 0));
    elements.tasksContainer.innerHTML = filtered.length === 0 ? '<div class="empty-state"><i class="fas fa-tasks"></i><h3>No Tasks Found</h3></div>' : filtered.map(t => {
        const proj = projects.find(p => p.ID === t.ProjectID);
        return '<div class="task-card ' + (t.Status === 'Completed' ? 'completed' : '') + '"><div class="task-checkbox ' + (t.Status === 'Completed' ? 'completed' : '') + '" onclick="toggleTask(\'' + t.ID + '\')"><i class="fas fa-check"></i></div><div class="task-content"><h4>' + escapeHtml(t.TaskName) + '</h4><div class="task-meta"><span><i class="fas fa-film"></i> ' + escapeHtml(proj ? proj.ProjectName : 'No Project') + '</span><span><i class="fas fa-user"></i> ' + (escapeHtml(t.AssignedTo) || 'Unassigned') + '</span></div></div><button class="task-delete" onclick="deleteTask(\'' + t.ID + '\')"><i class="fas fa-trash"></i></button></div>';
    }).join('');
}

function renderNotes(projectId = '') {
    let filtered = projectId ? notes.filter(n => n.ProjectID === projectId) : notes;
    filtered.sort((a, b) => (a.Completed === 'true' ? 1 : 0) - (b.Completed === 'true' ? 1 : 0));
    elements.notepadContainer.innerHTML = filtered.length === 0 ? '<div class="empty-state"><i class="fas fa-sticky-note"></i><h3>No Notes Found</h3></div>' : filtered.map(n => {
        const proj = projects.find(p => p.ID === n.ProjectID);
        const comp = n.Completed === 'true';
        return '<div class="note-card ' + (comp ? 'completed' : '') + '"><div class="note-checkbox ' + (comp ? 'completed' : '') + '" onclick="toggleNote(\'' + n.ID + '\')"><i class="fas fa-check"></i></div><div class="note-content"><p>' + escapeHtml(n.Content) + '</p><div class="note-meta"><span><i class="fas fa-film"></i> ' + escapeHtml(proj ? proj.ProjectName : 'General') + '</span></div></div><button class="note-delete" onclick="deleteNote(\'' + n.ID + '\')"><i class="fas fa-trash"></i></button></div>';
    }).join('');
}

function renderCrew() {
    elements.crewGrid.innerHTML = crew.length === 0 ? '<div class="empty-state"><i class="fas fa-users"></i><h3>No Crew Members</h3></div>' : crew.map(c => '<div class="crew-card"><div class="crew-avatar">' + getInitials(c.Name) + '</div><div class="crew-info"><h3>' + escapeHtml(c.Name) + '</h3><p class="role">' + escapeHtml(c.Role) + '</p><p class="phone">' + (escapeHtml(c.Phone) || 'No phone') + '</p></div><div class="crew-actions">' + (c.Phone ? '<button class="call-btn" onclick="callCrew(\'' + c.Phone + '\')"><i class="fas fa-phone"></i></button>' : '') + '<button class="delete-btn" onclick="deleteCrew(\'' + c.ID + '\')"><i class="fas fa-trash"></i></button></div></div>').join('');
}

function updateProjectDropdowns() {
    const opts = projects.map(p => '<option value="' + p.ID + '">' + escapeHtml(p.ProjectName) + '</option>').join('');
    elements.taskProject.innerHTML = '<option value="">Select Project</option>' + opts;
    elements.taskProjectFilter.innerHTML = '<option value="">All Projects</option>' + opts;
    elements.noteProject.innerHTML = '<option value="">General Note</option>' + opts;
    elements.noteProjectFilter.innerHTML = '<option value="">All Notes</option>' + opts;
}

function updateCrewDropdown() {
    elements.taskAssignedTo.innerHTML = '<option value="">Select Crew Member</option>' + crew.map(c => '<option value="' + escapeHtml(c.Name) + '">' + escapeHtml(c.Name) + ' - ' + escapeHtml(c.Role) + '</option>').join('');
}

async function handleProjectSubmit(e) {
    e.preventDefault();
    const data = { projectName: elements.projectName.value.trim(), director: elements.projectDirector.value.trim(), status: elements.projectStatus.value, startDate: elements.projectStartDate.value, endDate: elements.projectEndDate.value };
    const id = elements.projectId.value;
    const result = id ? await apiCall('updateProject', {...data, id}) : await apiCall('addProject', data);
    if (result.success) { showToast(id ? 'Project updated!' : 'Project added!'); closeAllModals(); await loadAllData(); }
    else showToast(result.error || 'Error', true);
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    const result = await apiCall('addTask', { projectId: elements.taskProject.value, taskName: elements.taskName.value.trim(), assignedTo: elements.taskAssignedTo.value, dueDate: elements.taskDueDate.value });
    if (result.success) { showToast('Task added!'); closeAllModals(); await loadAllData(); }
    else showToast(result.error || 'Error', true);
}

async function handleNoteSubmit(e) {
    e.preventDefault();
    const result = await apiCall('addNote', { content: elements.noteContent.value.trim(), projectId: elements.noteProject.value });
    if (result.success) { showToast('Note added!'); closeAllModals(); await loadAllData(); }
    else showToast(result.error || 'Error', true);
}

async function handleCrewSubmit(e) {
    e.preventDefault();
    const result = await apiCall('addCrew', { name: elements.crewName.value.trim(), role: elements.crewRole.value, phone: elements.crewPhone.value.trim() });
    if (result.success) { showToast('Crew added!'); closeAllModals(); await loadAllData(); }
    else showToast(result.error || 'Error', true);
}

function editProject(id) {
    const p = projects.find(x => x.ID === id);
    if (!p) return;
    elements.projectId.value = p.ID;
    elements.projectName.value = p.ProjectName;
    elements.projectDirector.value = p.Director;
    elements.projectStatus.value = p.Status;
    elements.projectStartDate.value = formatDateForInput(p.StartDate);
    elements.projectEndDate.value = formatDateForInput(p.EndDate);
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    openModal('projectModal');
}

async function deleteProject(id) { if (confirm('Delete this project?')) { const r = await apiCall('deleteProject', {id}); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function toggleTask(id) { const r = await apiCall('toggleTask', {id}); if (r.success) { const t = tasks.find(x => x.ID === id); if (t) t.Status = r.status; updateUI(); showToast(r.status === 'Completed' ? 'Completed!' : 'Reopened!'); } }
async function deleteTask(id) { if (confirm('Delete this task?')) { const r = await apiCall('deleteTask', {id}); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function toggleNote(id) { const r = await apiCall('toggleNote', {id}); if (r.success) { const n = notes.find(x => x.ID === id); if (n) n.Completed = r.completed; updateUI(); showToast(r.completed === 'true' ? 'Done!' : 'Reopened!'); } }
async function deleteNote(id) { if (confirm('Delete this note?')) { const r = await apiCall('deleteNote', {id}); if (r.success) { showToast('Deleted!'); await loadAllData(); } } }
async function deleteCrew(id) { if (confirm('Remove this member?')) { const r = await apiCall('deleteCrew', {id}); if (r.success) { showToast('Removed!'); await loadAllData(); } } }
function callCrew(phone) { window.location.href = 'tel:' + phone; }

function resetProjectForm() { elements.projectId.value = ''; elements.projectName.value = ''; elements.projectDirector.value = ''; elements.projectStatus.value = 'Pre-Production'; elements.projectStartDate.value = ''; elements.projectEndDate.value = ''; document.getElementById('projectModalTitle').textContent = 'Add Project'; }
function resetTaskForm() { elements.taskId.value = ''; elements.taskProject.value = ''; elements.taskName.value = ''; elements.taskAssignedTo.value = ''; elements.taskDueDate.value = ''; }
function resetNoteForm() { elements.noteProject.value = ''; elements.noteContent.value = ''; }
function resetCrewForm() { elements.crewName.value = ''; elements.crewRole.value = 'Director'; elements.crewPhone.value = ''; }

function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    document.querySelectorAll('.nav-item, .menu-item').forEach(i => { i.classList.remove('active'); if (i.dataset.page === page) i.classList.add('active'); });
    window.scrollTo(0, 0);
}

function openMenu() { elements.sideMenu.classList.add('active'); elements.menuOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeMenu() { elements.sideMenu.classList.remove('active'); elements.menuOverlay.classList.remove('active'); document.body.style.overflow = ''; }
function openModal(id) { document.getElementById(id).classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeAllModals() { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); document.body.style.overflow = ''; }
function showLoading() { elements.loadingOverlay.classList.add('active'); }
function hideLoading() { elements.loadingOverlay.classList.remove('active'); }
function showToast(msg, err = false) { elements.toastMessage.textContent = msg; elements.toast.classList.toggle('error', err); elements.toast.classList.add('show'); setTimeout(() => elements.toast.classList.remove('show'), 3000); }
function escapeHtml(t) { if (!t) return ''; const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function formatDate(d) { if (!d) return 'N/A'; try { return new Date(d).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}); } catch { return 'N/A'; } }
function formatDateForInput(d) { if (!d) return ''; try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; } }
function getInitials(n) { if (!n) return '?'; return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
