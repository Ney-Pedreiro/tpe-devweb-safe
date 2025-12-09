const API_BASE = 'http://localhost:3000/api';

function showAlert(message, type = 'success') {
    const msgDiv = document.getElementById('loginMsg') || document.getElementById('adminMsg') || document.getElementById('noBooks');
    if (msgDiv) {
        msgDiv.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-info');
        msgDiv.classList.add(`alert-${type}`);
        msgDiv.textContent = message;
        msgDiv.classList.remove('d-none');
        
        setTimeout(() => {
            msgDiv.classList.add('d-none');
        }, 4000);
    }
}

function getStoredUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setStoredUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem('currentUser');
}


document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('loginFormElement')) {
        document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    }
    
    if (document.getElementById('registerFormElement')) {
        document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    }
    
    if (document.getElementById('filterTitle')) {
        loadBooksForUser();
        setupFilterListeners();
        updateUserInfo();
    }
    
    if (document.getElementById('bookFormTitle')) {
        loadBooksForAdmin();
        setupAdminEventListeners();
        updateUserInfo();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.querySelector('#loginFormElement button[type="submit"]');
    const spinner = document.getElementById('loginSpinner');
    const btnText = document.getElementById('loginBtnText');
    const msgDiv = document.getElementById('loginMsg');
    
    try {
        loginBtn.disabled = true;
        spinner.classList.remove('d-none');
        btnText.textContent = 'Carregando...';
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
        }
        
        setStoredUser({
            id: data.user.id,
            username: data.user.username,
            role: data.user.role
        });
        
        if (data.user.role === 'USER') {
            window.location.href = 'Inicio.html';
        } else if (data.user.role === 'ADMIN') {
            window.location.href = 'InicioAdm.html';
        }
    } catch (error) {
        msgDiv.classList.remove('d-none', 'alert-success');
        msgDiv.classList.add('alert-danger');
        msgDiv.textContent = error.message;
        loginBtn.disabled = false;
        spinner.classList.add('d-none');
        btnText.textContent = 'Entrar';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const registerBtn = document.querySelector('#registerFormElement button[type="submit"]');
    const spinner = document.getElementById('registerSpinner');
    const btnText = document.getElementById('registerBtnText');
    const msgDiv = document.getElementById('registerMsg');
    
    try {
        if (username.length < 3) {
            throw new Error('Usuário deve ter pelo menos 3 caracteres');
        }
        
        if (password.length < 4) {
            throw new Error('Senha deve ter pelo menos 4 caracteres');
        }
        
        if (password !== passwordConfirm) {
            throw new Error('As senhas não coincidem');
        }
        
        registerBtn.disabled = true;
        spinner.classList.remove('d-none');
        btnText.textContent = 'Criando...';
        
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                username,
                password,
                role: 'USER'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar conta');
        }
        
        msgDiv.classList.remove('d-none', 'alert-danger');
        msgDiv.classList.add('alert-success');
        msgDiv.textContent = '✅ Conta criada com sucesso! Fazendo login...';
        
        setTimeout(() => {
            handleLoginWithCredentials(username, password);
        }, 1500);
        
    } catch (error) {
        msgDiv.classList.remove('d-none', 'alert-success');
        msgDiv.classList.add('alert-danger');
        msgDiv.textContent = error.message;
        registerBtn.disabled = false;
        spinner.classList.add('d-none');
        btnText.textContent = 'Criar Conta';
    }
}

async function handleLoginWithCredentials(username, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
        }
        
        setStoredUser({
            id: data.user.id,
            username: data.user.username,
            role: data.user.role
        });
        
        if (data.user.role === 'USER') {
            window.location.href = 'Inicio.html';
        } else if (data.user.role === 'ADMIN') {
            window.location.href = 'InicioAdm.html';
        }
    } catch (error) {
        const msgDiv = document.getElementById('registerMsg');
        msgDiv.classList.remove('d-none', 'alert-success');
        msgDiv.classList.add('alert-danger');
        msgDiv.textContent = 'Erro ao fazer login automático: ' + error.message;
    }
}


function updateUserInfo() {
    const user = getStoredUser();
    const userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv && user) {
        userInfoDiv.textContent = `👤 ${user.username}`;
    }
}

async function logoutUser() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
    
    clearStoredUser();
    window.location.href = 'Login.html';
}

async function loadBooksForUser() {
    try {
        const response = await fetch(`${API_BASE}/books`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar livros');
        }
        
        const books = await response.json();
        displayBooksForUser(books);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        showAlert('Erro ao carregar livros', 'danger');
    }
}

function displayBooksForUser(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';
    
    if (books.length === 0) {
        document.getElementById('noBooks').classList.remove('d-none');
        return;
    }
    
    document.getElementById('noBooks').classList.add('d-none');
    
    books.forEach(book => {
        const createdDate = new Date(book.createdAt).toLocaleDateString('pt-BR');
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm hover-card">
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(book.titulo)}</h5>
                    <p class="card-text text-muted">
                        <strong>Autor:</strong> ${escapeHtml(book.autor)}<br>
                        <strong>Ano:</strong> ${book.ano}<br>
                        <strong>Data:</strong> ${createdDate}
                    </p>
                    <p class="card-text">${escapeHtml(book.descricao)}</p>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <button 
                        class="btn btn-sm btn-outline-primary w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#bookModal"
                        onclick="showBookDetails(${book.id})"
                    >
                        Ver Detalhes
                    </button>
                </div>
            </div>
        `;
        booksList.appendChild(card);
    });
}

function setupFilterListeners() {
    const filterTitle = document.getElementById('filterTitle');
    const filterAuthor = document.getElementById('filterAuthor');
    const filterYear = document.getElementById('filterYear');
    
    [filterTitle, filterAuthor, filterYear].forEach(input => {
        input.addEventListener('keyup', applyFilters);
        input.addEventListener('change', applyFilters);
    });
}

async function applyFilters() {
    try {
        const response = await fetch(`${API_BASE}/books`, {
            credentials: 'include'
        });
        
        const books = await response.json();
        
        const titleFilter = document.getElementById('filterTitle').value.toLowerCase();
        const authorFilter = document.getElementById('filterAuthor').value.toLowerCase();
        const yearFilter = document.getElementById('filterYear').value;
        
        const filtered = books.filter(book => {
            const matchTitle = book.titulo.toLowerCase().includes(titleFilter);
            const matchAuthor = book.autor.toLowerCase().includes(authorFilter);
            const matchYear = yearFilter === '' || book.ano.toString() === yearFilter;
            
            return matchTitle && matchAuthor && matchYear;
        });
        
        displayBooksForUser(filtered);
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
}

function resetFilters() {
    document.getElementById('filterTitle').value = '';
    document.getElementById('filterAuthor').value = '';
    document.getElementById('filterYear').value = '';
    loadBooksForUser();
}

async function showBookDetails(bookId) {
    try {
        const response = await fetch(`${API_BASE}/books/${bookId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes do livro');
        }
        
        const book = await response.json();
        const createdDate = new Date(book.createdAt).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('bookModalTitle').textContent = book.titulo;
        document.getElementById('bookModalBody').innerHTML = `
            <p><strong>Autor:</strong> ${escapeHtml(book.autor)}</p>
            <p><strong>Ano de Publicação:</strong> ${book.ano}</p>
            <p><strong>Data de Adição:</strong> ${createdDate}</p>
            <hr>
            <p><strong>Descrição:</strong></p>
            <p>${escapeHtml(book.descricao)}</p>
        `;
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        showAlert('Erro ao carregar detalhes do livro', 'danger');
    }
}


let currentDeleteBookId = null;

async function loadBooksForAdmin() {
    try {
        const response = await fetch(`${API_BASE}/books`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar livros');
        }
        
        const books = await response.json();
        displayBooksInTable(books);
        displayBooksInCatalog(books);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        showAlert('Erro ao carregar livros', 'danger');
    }
}

function displayBooksInTable(books) {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';
    
    if (books.length === 0) {
        document.getElementById('noBooksAdmin').classList.remove('d-none');
        return;
    }
    
    document.getElementById('noBooksAdmin').classList.add('d-none');
    
    books.forEach(book => {
        const createdDate = new Date(book.createdAt).toLocaleDateString('pt-BR');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${escapeHtml(book.titulo)}</td>
            <td>${escapeHtml(book.autor)}</td>
            <td>${book.ano}</td>
            <td>${escapeHtml(book.descricao.substring(0, 50))}...</td>
            <td>${createdDate}</td>
            <td>
                <button 
                    class="btn btn-sm btn-warning me-2"
                    onclick="editBook(${book.id})"
                    data-bs-toggle="modal"
                    data-bs-target="#bookFormModal"
                >
                    ✏️ Editar
                </button>
                <button 
                    class="btn btn-sm btn-danger"
                    onclick="openDeleteConfirm(${book.id})"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteConfirmModal"
                >
                    🗑️ Excluir
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayBooksInCatalog(books) {
    const catalogList = document.getElementById('catalogList');
    catalogList.innerHTML = '';
    
    books.forEach(book => {
        const createdDate = new Date(book.createdAt).toLocaleDateString('pt-BR');
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(book.titulo)}</h5>
                    <p class="card-text text-muted">
                        <strong>Autor:</strong> ${escapeHtml(book.autor)}<br>
                        <strong>Ano:</strong> ${book.ano}<br>
                        <strong>Data:</strong> ${createdDate}
                    </p>
                    <p class="card-text">${escapeHtml(book.descricao)}</p>
                </div>
            </div>
        `;
        catalogList.appendChild(card);
    });
}

function resetBookForm() {
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('bookFormTitle').textContent = 'Novo Livro';
}

async function editBook(bookId) {
    try {
        const response = await fetch(`${API_BASE}/books/${bookId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar livro');
        }
        
        const book = await response.json();
        
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.titulo;
        document.getElementById('bookAuthor').value = book.autor;
        document.getElementById('bookYear').value = book.ano;
        document.getElementById('bookDescription').value = book.descricao;
        document.getElementById('bookFormTitle').textContent = 'Editar Livro';
    } catch (error) {
        console.error('Erro ao carregar livro para edição:', error);
        showAlert('Erro ao carregar livro', 'danger');
    }
}

async function saveBook() {
    const bookId = document.getElementById('bookId').value;
    const titulo = document.getElementById('bookTitle').value.trim();
    const autor = document.getElementById('bookAuthor').value.trim();
    const ano = document.getElementById('bookYear').value;
    const descricao = document.getElementById('bookDescription').value.trim();
    
    if (!titulo || !autor || !ano || !descricao) {
        showAlert('Todos os campos são obrigatórios', 'danger');
        return;
    }
    
    try {
        const url = bookId 
            ? `${API_BASE}/books/${bookId}` 
            : `${API_BASE}/books`;
        
        const method = bookId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                titulo,
                autor,
                ano: parseInt(ano),
                descricao
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao salvar livro');
        }
        
        showAlert(bookId ? 'Livro atualizado com sucesso!' : 'Livro criado com sucesso!', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookFormModal'));
        modal.hide();
        
        loadBooksForAdmin();
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
        showAlert(error.message, 'danger');
    }
}

function openDeleteConfirm(bookId) {
    currentDeleteBookId = bookId;
}

async function confirmDelete() {
    if (!currentDeleteBookId) return;
    
    try {
        const response = await fetch(`${API_BASE}/books/${currentDeleteBookId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir livro');
        }
        
        showAlert('Livro excluído com sucesso!', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
        modal.hide();
        
        currentDeleteBookId = null;
        
        loadBooksForAdmin();
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        showAlert(error.message, 'danger');
    }
}

function setupAdminEventListeners() {
    const bookForm = document.getElementById('bookForm');
    if (bookForm) {
        bookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveBook();
        });
    }
    
    const usersTab = document.getElementById('users-tab');
    if (usersTab) {
        usersTab.addEventListener('click', loadUsersForAdmin);
    }
}


let userIdToDelete = null;

async function loadUsersForAdmin() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar usuários');
        }
        
        const users = await response.json();
        displayUsersForAdmin(users);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showMessageUsers('Erro ao carregar usuários', 'danger');
    }
}

function displayUsersForAdmin(users) {
    const tableBody = document.getElementById('usersTableBody');
    const noUsers = document.getElementById('noUsersAdmin');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        noUsers.classList.remove('d-none');
        return;
    }
    
    noUsers.classList.add('d-none');
    
    users.forEach(user => {
        const createdDate = new Date(user.createdAt).toLocaleDateString('pt-BR');
        const roleLabel = user.role === 'ADMIN' ? '👑 Admin' : '👤 Usuário';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${escapeHtml(user.username)}</td>
            <td><span class="badge bg-${user.role === 'ADMIN' ? 'danger' : 'primary'}">${roleLabel}</span></td>
            <td>${createdDate}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editUser(${user.id})">✏️ Editar</button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteUserConfirm(${user.id}, '${escapeHtml(user.username)}')">🗑️ Remover</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function resetUserForm() {
    document.getElementById('userId').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('userFormTitle').textContent = 'Novo Usuário';
    document.getElementById('userPassword').required = true;
}

async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar usuário');
        }
        
        const user = await response.json();
        
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.username;
        document.getElementById('userPassword').value = '';
        document.getElementById('userRole').value = user.role;
        document.getElementById('userFormTitle').textContent = `Editar Usuário: ${user.username}`;
        document.getElementById('userPassword').required = false;
        
        const modal = new bootstrap.Modal(document.getElementById('userFormModal'));
        modal.show();
    } catch (error) {
        console.error('Erro:', error);
        showMessageUsers('Erro ao carregar dados do usuário', 'danger');
    }
}

async function saveUser() {
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('userName').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    // Validação
    if (!username || !role) {
        showMessageUsers('Preencha todos os campos obrigatórios', 'danger');
        return;
    }
    
    if (username.length < 3) {
        showMessageUsers('Usuário deve ter pelo menos 3 caracteres', 'danger');
        return;
    }
    
    if (!userId && !password) {
        showMessageUsers('Senha é obrigatória para novo usuário', 'danger');
        return;
    }
    
    if (password && password.length < 4) {
        showMessageUsers('Senha deve ter pelo menos 4 caracteres', 'danger');
        return;
    }
    
    try {
        const method = userId ? 'PUT' : 'POST';
        const url = userId ? `${API_BASE}/users/${userId}` : `${API_BASE}/users`;
        
        const body = {
            username,
            role
        };
        
        if (password) {
            body.password = password;
        }
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao salvar usuário');
        }
        
        showMessageUsers(`✅ Usuário ${userId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('userFormModal'));
        modal.hide();
        
        loadUsersForAdmin();
    } catch (error) {
        console.error('Erro:', error);
        showMessageUsers(error.message, 'danger');
    }
}

function openDeleteUserConfirm(userId, username) {
    userIdToDelete = userId;
    document.getElementById('deleteUserName').textContent = username;
    const modal = new bootstrap.Modal(document.getElementById('deleteUserConfirmModal'));
    modal.show();
}

async function confirmDeleteUser() {
    if (!userIdToDelete) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/${userIdToDelete}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Erro ao deletar usuário');
        }
        
        showMessageUsers('✅ Usuário removido com sucesso!', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserConfirmModal'));
        modal.hide();
        
        userIdToDelete = null;
        loadUsersForAdmin();
    } catch (error) {
        console.error('Erro:', error);
        showMessageUsers(error.message, 'danger');
    }
}

function showMessageUsers(message, type = 'success') {
    const msgDiv = document.getElementById('usersMsg');
    if (msgDiv) {
        msgDiv.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-info');
        msgDiv.classList.add(`alert-${type}`);
        msgDiv.textContent = message;
        msgDiv.classList.remove('d-none');
        
        setTimeout(() => {
            msgDiv.classList.add('d-none');
        }, 4000);
    }
}


function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = document.getElementById('loginFormElement') !== null || document.getElementById('registerFormElement') !== null;
    
    if (!isLoginPage) {
        const user = getStoredUser();
        if (!user) {
            window.location.href = 'Login.html';
        }
    }
});