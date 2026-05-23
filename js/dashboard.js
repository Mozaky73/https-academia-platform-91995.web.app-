// لوحة تحكم أكاديميا - JavaScript متكامل مع Local Storage

// ---------- User Authentication & State ----------
const defaultUser = {
    username: 'admin',
    password: '123456',
    email: 'admin@academia.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
};

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([defaultUser]));
}

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const loginPage = document.getElementById('loginPage');
const signupPage = document.getElementById('signupPage');
const dashboardPage = document.getElementById('dashboardPage');
const displayUsername = document.getElementById('displayUsername');

// Show Notification
function showNotification(msg, time=1600) {
    const box = document.getElementById('notification');
    if(!box) return;
    box.textContent = msg;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, time);
}

// --------- Authentication -----------
function showPage(page){
    loginPage.classList.add('hidden');
    signupPage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
    page.classList.remove('hidden');
}

function saveUsers(users){localStorage.setItem('users', JSON.stringify(users));}
function getUsers(){try {return JSON.parse(localStorage.getItem('users')) || [];} catch {return [];}}

function login(username, password) {
    const users = getUsers();
    const user = users.find(u=>u.username===username && u.password === password);
    if(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
        showNotification('تم تسجيل الدخول بنجاح!');
        setTimeout(()=>location.reload(),600);
    } else {
        showNotification('اسم المستخدم أو كلمة السر غير صحيحة', 2100);
    }
}

function signup(newUser){
    let users = getUsers();
    if (users.some(u=>u.username===newUser.username)){
        showNotification('اسم المستخدم مستخدم بالفعل!', 2000); return false;
    }
    users.push(newUser);
    saveUsers(users);
    showNotification('تم إنشاء الحساب! يمكنك تسجيل الدخول الآن.',2000);
    setTimeout(()=>{showPage(loginPage);},1100);
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

if(currentUser) {
    showPage(dashboardPage);
    displayUsername.textContent = currentUser.username;
} else {
    showPage(loginPage);
}

document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    login(username, password);
});

document.getElementById('logoutBtn')?.addEventListener('click', logout);

document.getElementById('signupLink')?.addEventListener('click', e=>{
    e.preventDefault();
    showPage(signupPage);
});
document.getElementById('loginLink')?.addEventListener('click', e=>{
    e.preventDefault();
    showPage(loginPage);
});

document.getElementById('signupForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const email = document.getElementById('email').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(password !== confirmPassword){
        showNotification('كلمتا السر غير متطابقتين!', 2000);
        return;
    }
    signup({username, password, email, role:'user', createdAt:new Date().toISOString()});
});

// ------------- Navigation Between Dashboard Sections -------------
const sectionLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
sectionLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        sectionLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
        sections.forEach(s=>s.classList.remove('active'));
        const id = link.getAttribute('data-section');
        document.getElementById(id+'Section').classList.add('active');
        document.getElementById('pageTitle').textContent = link.textContent.replace(/^[^أ-يA-za-z]+/,'').trim();
    })
});

// ------------- Users Management (CRUD, Local Storage) -------------
const usersTableBody = document.getElementById('usersTableBody');
function renderUsersTable(){
    usersTableBody.innerHTML = '';
    getUsers().forEach((user,i)=>{
        usersTableBody.innerHTML += `<tr>
            <td>${i+1}</td>
            <td>${user.username}</td>
            <td>${user.email||''}</td>
            <td>${user.role||'-'}</td>
            <td>${user.createdAt.split('T')[0]}</td>
            <td>
                <button class='btn-small btn-edit' onclick='editUser(${i})'>✏️</button>
                <button class='btn-small btn-delete' onclick='deleteUser(${i})'>🗑️</button>
            </td>
        </tr>`;
    });
    document.getElementById('totalUsers').textContent = getUsers().length
}
window.editUser = function(i){
    const users = getUsers();
    const user = users[i];
    document.getElementById('addUserForm').classList.remove('hidden');
    document.getElementById('formUsername').value = user.username;
    document.getElementById('formPassword').value = user.password;
    document.getElementById('formEmail').value = user.email;
    document.getElementById('formRole').value = user.role;
    document.getElementById('userForm').onsubmit = function(e){
        e.preventDefault();
        users[i] = {
            username: document.getElementById('formUsername').value.trim(),
            password: document.getElementById('formPassword').value,
            email: document.getElementById('formEmail').value,
            role: document.getElementById('formRole').value,
            createdAt: user.createdAt
        };
        saveUsers(users);
        renderUsersTable();
        showNotification('تم تحديث المستخدم بنجاح');
        document.getElementById('addUserForm').classList.add('hidden');
        document.getElementById('userForm').reset();
    }
}
window.deleteUser = function(i){
    const users = getUsers();
    if(confirm('تأكيد حذف المستخدم؟')){
        users.splice(i,1);
        saveUsers(users);
        renderUsersTable();
    }
}

document.getElementById('addUserBtn')?.addEventListener('click',()=>{
    document.getElementById('addUserForm').classList.remove('hidden');
    document.getElementById('userForm').onsubmit = function(e){
        e.preventDefault();
        const users = getUsers();
        users.push({
            username: document.getElementById('formUsername').value.trim(),
            password: document.getElementById('formPassword').value,
            email: document.getElementById('formEmail').value,
            role: document.getElementById('formRole').value,
            createdAt: new Date().toISOString()
        });
        saveUsers(users);
        renderUsersTable();
        showNotification('تمت إضافة مستخدم جديد');
        document.getElementById('addUserForm').classList.add('hidden');
        document.getElementById('userForm').reset();
    }
});
document.getElementById('cancelUserBtn')?.addEventListener('click',()=>{
    document.getElementById('addUserForm').classList.add('hidden');
    document.getElementById('userForm').reset();
});

renderUsersTable();

// ------------ الإعدادات: تغيير كلمة السر والبريد الإلكتروني -------------
const passwordForm = document.getElementById('passwordForm');
passwordForm?.addEventListener('submit', function(e){
    e.preventDefault();
    const cur = document.getElementById('currentPassword').value;
    const n1 = document.getElementById('newPassword').value;
    const n2 = document.getElementById('confirmNewPassword').value;
    if(currentUser.password!==cur){showNotification('كلمة السر الحالية غير صحيحة', 2200);return;}
    if(n1!==n2){showNotification('كلمة السر الجديدة غير متطابقة', 2000);return;}
    const users = getUsers();
    users.forEach(u=>{if(u.username===currentUser.username)u.password=n1;});
    saveUsers(users);
    showNotification('تم تحديث كلمة السر');
    currentUser.password=n1;
    localStorage.setItem('currentUser',JSON.stringify(currentUser));
    passwordForm.reset();
});

const emailForm = document.getElementById('emailForm');
emailForm?.addEventListener('submit',function(e){
    e.preventDefault();
    const newMail = document.getElementById('newEmail').value;
    const users=getUsers();
    users.forEach(u=>{if(u.username===currentUser.username)u.email=newMail;});
    saveUsers(users);
    showNotification('تم تحديث البريد الإلكتروني');
    currentUser.email=newMail;
    localStorage.setItem('currentUser',JSON.stringify(currentUser));
    emailForm.reset();
});
document.getElementById('currentEmail')&&(document.getElementById('currentEmail').value = currentUser?currentUser.email:'');

// حذف الحساب بالكامل
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
deleteAccountBtn?.addEventListener('click',function(){
    if(confirm('هل أنت متأكد من حذف الحساب نهائياً؟')){
        let users = getUsers();
        users = users.filter(u=>u.username!==currentUser.username);
        saveUsers(users);
        logout();
    }
});

// وقت حالي في اللوحة
document.getElementById('currentTime')&&(setInterval(()=>{
    document.getElementById('currentTime').textContent=new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
},990));

// إخفاء وإظهار القائمة الجانبية على الجوال
const menuToggle = document.getElementById('menuToggle');
menuToggle?.addEventListener('click',()=>{
    document.querySelector('.sidebar').classList.toggle('sidebar-collapsed');
});
