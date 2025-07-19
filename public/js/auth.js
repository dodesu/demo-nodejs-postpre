const { renderBooks, setEventMarkAsReadTable } = await import('/assets/js/books.js');

const UI = {
    LoginBtn: document.getElementById('login-button'),
    RegisterBtn: document.getElementById('register-button'),
    AuthBtns: document.querySelector('.auth-buttons')
}

const init = () => {
    initUser();
    clickLoginBtn();
    setEventMarkAsReadTable(MarkAsReadHandler);
};
const clickLoginBtn = () => {
    const { LoginBtn, RegisterBtn } = UI;
    LoginBtn.addEventListener('click', () => createModel('LOGIN'));
    RegisterBtn.addEventListener('click', () => createModel('REGISTER'));
}
async function createModel(type) {
    // Base element model
    const model = document.createElement('div');
    model.style.position = 'fixed';
    model.style.top = '0';
    model.style.left = '0';
    model.style.width = '100%';
    model.style.height = '100%';
    model.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    model.style.display = 'flex';
    model.style.justifyContent = 'center';
    model.style.alignItems = 'center';
    model.style.zIndex = '1000';

    // Close model
    model.addEventListener('click', (e) => {
        if (e.target === model) {
            model.remove();
        }
    });

    // Content
    const content = document.createElement('div');
    content.style.backgroundColor = '#1e1e1e';
    content.style.padding = '30px';
    content.style.borderRadius = '10px';
    content.style.width = '300px';
    content.style.position = 'relative';
    content.style.boxShadow = '0 0 15px rgba(255,255,255,0.1)';
    content.addEventListener('click', e => e.stopPropagation());

    // Close button
    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.style.position = 'absolute';
    close.style.top = '10px';
    close.style.right = '15px';
    close.style.cursor = 'pointer';
    close.style.fontSize = '20px';
    close.style.color = '#ccc';
    close.onmouseover = () => close.style.color = '#fff';
    close.onmouseleave = () => close.style.color = '#ccc';
    close.onclick = () => model.remove();

    // Title
    const title = document.createElement('h2');
    title.innerText = type === 'LOGIN' ? 'Đăng nhập' : 'Đăng ký';
    title.style.textAlign = 'center';
    title.style.marginTop = '0';
    title.style.marginBottom = '20px';

    // Form
    const form = document.createElement('form');
    form.onsubmit = async function (e) {
        e.preventDefault();
        let username, email, confirmPass, usernameOrEmail;
        if (type === 'REGISTER') {
            username = form.querySelector('#username').value;
            email = form.querySelector('#email').value;
            confirmPass = form.querySelector('#confirmPassword').value;
        } else {
            usernameOrEmail = form.querySelector('#usernameOrEmail').value;
        }
        const pass = form.querySelector('#password').value;
        let isSuccess = false;

        // #Branching
        if (type === 'REGISTER') {
            try {
                await register(username, email, pass, confirmPass);
                isSuccess = true;
                alert('Đăng ký thành công.');
            } catch (error) {
                alert('Đăng ký thất bại: ' + error.message);
            }

            if (isSuccess) {
                await login(username, pass);
            }
            // #Case Login
        } else {
            const res = await login(usernameOrEmail, pass);
            const msg = res ? 'Đăng nhập thành công' : 'Đăng nhập thất bại';
            alert(msg);
            if (res) isSuccess = true;
        }

        if (isSuccess) {
            initUser();
            window.location.reload();
        }
        model.remove();
    };

    const group = (labelText, inputType, inputId) => {
        const div = document.createElement('div');
        div.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.innerText = labelText;
        label.style.display = 'block';
        label.style.fontSize = '14px';
        label.style.marginBottom = '5px';

        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.required = true;
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.backgroundColor = '#2c2c2c';
        input.style.border = '1px solid #444';
        input.style.borderRadius = '5px';
        input.style.color = '#fff';

        div.appendChild(label);
        div.appendChild(input);
        return div;
    };

    const SubmitBtn = document.createElement('button');
    SubmitBtn.type = 'submit';
    SubmitBtn.innerText = type === 'LOGIN' ? 'Đăng nhập' : 'Đăng ký';
    SubmitBtn.style.width = '100%';
    SubmitBtn.style.padding = '10px';
    SubmitBtn.style.backgroundColor = '#333';
    SubmitBtn.style.color = '#fff';
    SubmitBtn.style.border = 'none';
    SubmitBtn.style.borderRadius = '5px';
    SubmitBtn.style.cursor = 'pointer';
    SubmitBtn.onmouseover = () => SubmitBtn.style.backgroundColor = '#444';
    SubmitBtn.onmouseleave = () => SubmitBtn.style.backgroundColor = '#333';

    // Append child
    if (type === 'REGISTER') {
        form.appendChild(group('Username:', 'text', 'username'));
        form.appendChild(group('Email:', 'email', 'email'));
        form.appendChild(group('Mật khẩu:', 'password', 'password'));
        form.appendChild(group('Xác nhân mật khẩu:', 'password', 'confirmPassword'));
    } else {
        form.appendChild(group('Username hoặc Email:', 'text', 'usernameOrEmail'));
        form.appendChild(group('Mật khẩu:', 'password', 'password'));
    }
    form.appendChild(SubmitBtn);
    content.appendChild(close);
    content.appendChild(title);
    content.appendChild(form);
    model.appendChild(content);

    // Add to body
    document.body.appendChild(model);
}

const register = async (username, email, password, confirmPassword) => {
    const register = {
        username: username,
        password: password,
        confirmPassword: confirmPassword
    }
    if (email.length > 5) {
        register.email = email;
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(register)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Lỗi khi đăng ký:', err.message);
        throw err;
    }
}

async function login(usernameOrEmail, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usernameOrEmail: usernameOrEmail,
                password: password
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }

        const data = await response.json();
        const token = data.access_token;

        setAccessToken(token);

        return true;
    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err.message);
        return false;
    }
}

const initUser = async () => {
    const user = await getCurrentUser();
    setUser(user);

    if (user) {
        createProfile(user.username);
    }
    document.body.classList.remove('hidden');
}

const getCurrentUser = async () => {
    try {
        const response = await fetch('/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        });

        if (!response.ok) {
            return null;
        }


        const user = await response.json();
        return user;
    } catch { return null; }
}
const createProfile = (username) => {
    const { AuthBtns } = UI;
    AuthBtns.innerHTML = '';

    const span = document.createElement('span');
    span.innerText = username;

    const logout = document.createElement('button');
    logout.innerText = 'Đăng xuất';
    logout.style.backgroundColor = '#333';
    logout.style.color = '#fff';
    logout.style.border = 'none';
    logout.style.borderRadius = '5px';
    logout.style.cursor = 'pointer';
    logout.onmouseover = () => logout.style.backgroundColor = '#444';
    logout.onmouseleave = () => logout.style.backgroundColor = '#333';
    logout.onclick = () => {
        resetAccessToken();
        location.reload();
    };

    AuthBtns.appendChild(span);
    AuthBtns.appendChild(logout);
}

export const updateBooksView = async () => {
    try {
        const response = await fetch('/books', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        });

        if (!response.ok) {
            return null;
        }

        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error(error);
    }
}

const MarkAsReadHandler = async (bookId, method) => {
    const user = getUser();
    if (!user) {
        alert("Bạn phải đăng nhập trước!");
        return false;
    }
    const urlDelete = method === 'DELETE' ? `/${bookId}` : '';
    const config = {
        method: method,
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    };
    if (method === 'POST') {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify({ bookId: Number(bookId) })
    }

    try {
        const response = await fetch(`/users/${user.id}/read-books${urlDelete}`, config);


        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi khi đánh dấu sách:', errorData);
            return;
        }

        return true;
    } catch (error) {
        console.error('Lỗi mạng hoặc máy chủ:', error);
        return false;
    }
}

const setAccessToken = (token) => localStorage.setItem('access_token', token);
const setUser = (user) => sessionStorage.setItem('user', JSON.stringify(user));
export const getAccessToken = () => localStorage.getItem('access_token');
export const resetAccessToken = () => localStorage.removeItem('access_token');
export const getUser = () => JSON.parse(sessionStorage.getItem('user'));

init();