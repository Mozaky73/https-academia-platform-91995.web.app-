// Dashboard CMS System
class DashboardCMS {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.courses = [];
        this.siteContent = {
            mainTitle: 'اتحاد الجامعات الإسلامية',
            mainTagline: 'لغةٌ راسخة، وقرآنٌ هادٍ، وتقنيةٌ تخدم القيم.',
            logoUrl: 'https://i.pinimg.com/originals/4f/e5/b9/4fe5b91f46e8e5b2c6b0f7e9d8c0b1a2.png',
            vision: 'تعليم إسلامي متقدم يخدم المجتمع',
            mission: 'نشر العلم والقيم الإسلامية بطرق حديثة',
            quickLinks: [
                { title: '🔐 لوحة التحكم', url: 'dashboard.html' },
                { title: '📋 قائمة المهام', url: 'todo.html' },
                { title: '🎓 منصة أكاديميا', url: 'index2.html' }
            ]
        };
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.setupLoginForm();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    // Local Storage Management
    loadFromLocalStorage() {
        const savedUsers = localStorage.getItem('users');
        const savedCourses = localStorage.getItem('courses');
        const savedContent = localStorage.getItem('siteContent');

        if (savedUsers) this.users = JSON.parse(savedUsers);
        else this.users = [{ id: 1, username: 'admin', password: '123456', email: 'admin@example.com', role: 'admin', createdAt: new Date().toLocaleDateString('ar-EG') }];

        if (savedCourses) this.courses = JSON.parse(savedCourses);
        else this.courses = [];

        if (savedContent) this.siteContent = JSON.parse(savedContent);

        this.saveAllData();
    }

    saveAllData() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('courses', JSON.stringify(this.courses));
        localStorage.setItem('siteContent', JSON.stringify(this.siteContent));
    }

    // Login System
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.showDashboard();
            this.showNotification('✅ تم تسجيل الدخول بنجاح!', 'success');
        } else {
            this.showNotification('❌ بيانات دخول غير صحيحة!', 'error');
        }
    }

    showDashboard() {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('dashboardPage').classList.remove('hidden');
        document.getElementById('displayUsername').textContent = this.currentUser.username;
        this.loadDashboardData();
        this.setupDashboardListeners();
    }

    loadDashboardData() {
        document.getElementById('totalUsers').textContent = this.users.length;
        document.getElementById('totalCourses').textContent = this.courses.length;
        this.renderCourses();
        this.renderUsers();
        this.loadCMSForms();
    }

    setupDashboardListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.switchSection(e));
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // CMS Forms
        document.getElementById('mainTitleForm').addEventListener('submit', (e) => this.saveMainContent(e));
        document.getElementById('logoForm').addEventListener('submit', (e) => this.saveLogo(e));
        document.getElementById('visionMissionForm').addEventListener('submit', (e) => this.saveVisionMission(e));
        document.getElementById('quickLinksForm').addEventListener('submit', (e) => this.saveQuickLinks(e));
        document.getElementById('addCourseForm').addEventListener('submit', (e) => this.addCourse(e));

        // Users
        document.getElementById('addUserBtn').addEventListener('click', () => this.toggleAddUserForm());
        document.getElementById('userForm').addEventListener('submit', (e) => this.addUser(e));
        document.getElementById('cancelUserBtn').addEventListener('click', () => this.toggleAddUserForm());
    }

    // CMS - Main Content
    loadCMSForms() {
        document.getElementById('mainTitle').value = this.siteContent.mainTitle;
        document.getElementById('mainTagline').value = this.siteContent.mainTagline;
        document.getElementById('logoUrl').value = this.siteContent.logoUrl;
        document.getElementById('visionText').value = this.siteContent.vision;
        document.getElementById('missionText').value = this.siteContent.mission;

        if (this.siteContent.quickLinks.length >= 3) {
            document.getElementById('link1Title').value = this.siteContent.quickLinks[0].title;
            document.getElementById('link1Url').value = this.siteContent.quickLinks[0].url;
            document.getElementById('link2Title').value = this.siteContent.quickLinks[1].title;
            document.getElementById('link2Url').value = this.siteContent.quickLinks[1].url;
            document.getElementById('link3Title').value = this.siteContent.quickLinks[2].title;
            document.getElementById('link3Url').value = this.siteContent.quickLinks[2].url;
        }

        this.updateLogoPreview();
    }

    saveMainContent(e) {
        e.preventDefault();
        this.siteContent.mainTitle = document.getElementById('mainTitle').value;
        this.siteContent.mainTagline = document.getElementById('mainTagline').value;
        this.saveAllData();
        this.updateMainPage();
        this.showNotification('✅ تم حفظ العنوان والشعار بنجاح!');
    }

    saveLogo(e) {
        e.preventDefault();
        this.siteContent.logoUrl = document.getElementById('logoUrl').value;
        this.updateLogoPreview();
        this.saveAllData();
        this.updateMainPage();
        this.showNotification('✅ تم حفظ الشعار بنجاح!');
    }

    updateLogoPreview() {
        const logoUrl = document.getElementById('logoUrl').value;
        const preview = document.getElementById('logoPreview');
        if (logoUrl) {
            preview.innerHTML = `<img src="${logoUrl}" alt="الشعار" onerror="this.style.display='none'">`;
        }
    }

    saveVisionMission(e) {
        e.preventDefault();
        this.siteContent.vision = document.getElementById('visionText').value;
        this.siteContent.mission = document.getElementById('missionText').value;
        this.saveAllData();
        this.updateMainPage();
        this.showNotification('✅ تم حفظ الرؤية والرسالة بنجاح!');
    }

    saveQuickLinks(e) {
        e.preventDefault();
        this.siteContent.quickLinks = [
            { 
                title: document.getElementById('link1Title').value, 
                url: document.getElementById('link1Url').value 
            },
            { 
                title: document.getElementById('link2Title').value, 
                url: document.getElementById('link2Url').value 
            },
            { 
                title: document.getElementById('link3Title').value, 
                url: document.getElementById('link3Url').value 
            }
        ];
        this.saveAllData();
        this.updateMainPage();
        this.showNotification('✅ تم حفظ الروابط السريعة بنجاح!');
    }

    // Update Main Page
    updateMainPage() {
        // Store data to localStorage so index.html can read it
        localStorage.setItem('homePageContent', JSON.stringify(this.siteContent));
        this.showNotification('✅ تم تحديث الموقع الرئيسي!');
    }

    // Courses Management
    addCourse(e) {
        e.preventDefault();
        const course = {
            id: Date.now(),
            name: document.getElementById('courseName').value,
            icon: document.getElementById('courseIcon').value,
            description: document.getElementById('courseDesc').value,
            students: parseInt(document.getElementById('courseStudents').value),
            rating: parseFloat(document.getElementById('courseRating').value)
        };

        this.courses.push(course);
        this.saveAllData();
        this.renderCourses();
        document.getElementById('addCourseForm').reset();
        document.getElementById('totalCourses').textContent = this.courses.length;
        this.showNotification('✅ تم إضافة الدورة بنجاح!');
        this.updateMainPage();
    }

    renderCourses() {
        const coursesList = document.getElementById('coursesList');
        if (this.courses.length === 0) {
            coursesList.innerHTML = '<p style="text-align: center; color: #999;">لا توجد دورات حتى الآن</p>';
            return;
        }

        coursesList.innerHTML = this.courses.map(course => `
            <div class="course-item-cms">
                <h4>${course.icon} ${course.name}</h4>
                <p>${course.description}</p>
                <p><strong>👥 ${course.students} طالب | ⭐ ${course.rating}</strong></p>
                <div class="course-item-actions">
                    <button class="btn-edit" onclick="dashboard.editCourse(${course.id})">✏️ تعديل</button>
                    <button class="btn-delete" onclick="dashboard.deleteCourse(${course.id})">🗑️ حذف</button>
                </div>
            </div>
        `).join('');
    }

    deleteCourse(id) {
        if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
            this.courses = this.courses.filter(c => c.id !== id);
            this.saveAllData();
            this.renderCourses();
            document.getElementById('totalCourses').textContent = this.courses.length;
            this.showNotification('✅ تم حذف الدورة بنجاح!');
            this.updateMainPage();
        }
    }

    editCourse(id) {
        const course = this.courses.find(c => c.id === id);
        if (course) {
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseIcon').value = course.icon;
            document.getElementById('courseDesc').value = course.description;
            document.getElementById('courseStudents').value = course.students;
            document.getElementById('courseRating').value = course.rating;
            document.getElementById('coursesCmsSection').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Users Management
    toggleAddUserForm() {
        document.getElementById('addUserForm').classList.toggle('hidden');
    }

    addUser(e) {
        e.preventDefault();
        const newUser = {
            id: Date.now(),
            username: document.getElementById('formUsername').value,
            password: document.getElementById('formPassword').value,
            email: document.getElementById('formEmail').value,
            role: document.getElementById('formRole').value,
            createdAt: new Date().toLocaleDateString('ar-EG')
        };

        this.users.push(newUser);
        this.saveAllData();
        this.renderUsers();
        document.getElementById('addUserForm').classList.add('hidden');
        document.getElementById('userForm').reset();
        document.getElementById('totalUsers').textContent = this.users.length;
        this.showNotification('✅ تم إضافة مستخدم جديد بنجاح!');
    }

    renderUsers() {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = this.users.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${this.getRoleLabel(user.role)}</td>
                <td>${user.createdAt}</td>
                <td>
                    <button class="btn-edit" onclick="dashboard.editUser(${user.id})" style="padding: 0.4rem 0.8rem;">✏️</button>
                    <button class="btn-delete" onclick="dashboard.deleteUser(${user.id})" style="padding: 0.4rem 0.8rem;">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    deleteUser(id) {
        if (this.users.length <= 1) {
            this.showNotification('❌ لا يمكن حذف آخر مستخدم!', 'error');
            return;
        }
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            this.users = this.users.filter(u => u.id !== id);
            this.saveAllData();
            this.renderUsers();
            document.getElementById('totalUsers').textContent = this.users.length;
            this.showNotification('✅ تم حذف المستخدم بنجاح!');
        }
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            document.getElementById('formUsername').value = user.username;
            document.getElementById('formPassword').value = user.password;
            document.getElementById('formEmail').value = user.email;
            document.getElementById('formRole').value = user.role;
            document.getElementById('addUserForm').classList.remove('hidden');
            document.getElementById('usersSection').scrollIntoView({ behavior: 'smooth' });
        }
    }

    getRoleLabel(role) {
        const roles = {
            'admin': '👨‍💼 مسؤول',
            'instructor': '👨‍🏫 معلم',
            'user': '👤 مستخدم عادي'
        };
        return roles[role] || role;
    }

    // Navigation
    switchSection(e) {
        e.preventDefault();
        const sectionId = e.target.dataset.section;
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const sectionMap = {
            'dashboard': 'dashboardSection',
            'content': 'contentSection',
            'courses-cms': 'coursesCmsSection',
            'users': 'usersSection',
            'settings': 'settingsSection'
        };

        const targetSection = document.getElementById(sectionMap[sectionId]);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        e.target.classList.add('active');
        document.getElementById('pageTitle').textContent = e.target.textContent;
    }

    // Logout
    logout() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            this.currentUser = null;
            document.getElementById('dashboardPage').classList.add('hidden');
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('loginForm').reset();
            this.showNotification('✅ تم تسجيل الخروج!');
        }
    }

    // Utilities
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-EG');
        const dateString = now.toLocaleDateString('ar-EG');
        document.getElementById('currentTime').textContent = `📅 ${dateString} ⏰ ${timeString}`;
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Initialize Dashboard
const dashboard = new DashboardCMS();

// CSS for hidden elements
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .hidden { display: none !important; }
        .content-section { display: none; }
        .content-section.active { display: block; }
        .nav-link { cursor: pointer; }
        .login-container.hidden { display: none; }
        .dashboard-container.hidden { display: none; }
    `;
    document.head.appendChild(style);
});
