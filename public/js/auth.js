const UI = {
    LoginBtn: document.getElementById('login-button'),
}

const init = () => {
    clickLoginBtn()
};
const clickLoginBtn = () => {
    const { LoginBtn } = UI;
    LoginBtn.addEventListener('click', createLoginModal);
}
function createLoginModal() {
    // Base element modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Close modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
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
    close.onclick = () => modal.remove();

    // Title
    const title = document.createElement('h2');
    title.innerText = 'Đăng nhập';
    title.style.textAlign = 'center';
    title.style.marginTop = '0';
    title.style.marginBottom = '20px';

    // Form
    const form = document.createElement('form');
    form.onsubmit = function (e) {
        e.preventDefault();
        const usernameOrEmail = form.querySelector('#usernameOrEmail').value;
        const pass = form.querySelector('#password').value;
        console.log("Đăng nhập với:", usernameOrEmail, pass);
        alert('Đăng nhập thành công (demo)');
        modal.remove();
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

    const loginBtn = document.createElement('button');
    loginBtn.type = 'submit';
    loginBtn.innerText = 'Đăng nhập';
    loginBtn.style.width = '100%';
    loginBtn.style.padding = '10px';
    loginBtn.style.backgroundColor = '#333';
    loginBtn.style.color = '#fff';
    loginBtn.style.border = 'none';
    loginBtn.style.borderRadius = '5px';
    loginBtn.style.cursor = 'pointer';
    loginBtn.onmouseover = () => loginBtn.style.backgroundColor = '#444';
    loginBtn.onmouseleave = () => loginBtn.style.backgroundColor = '#333';

    // Append child
    form.appendChild(group('Email hoặc Username:', 'text', 'usernameOrEmail'));
    form.appendChild(group('Mật khẩu:', 'password', 'password'));
    form.appendChild(loginBtn);
    content.appendChild(close);
    content.appendChild(title);
    content.appendChild(form);
    modal.appendChild(content);

    // Add to body
    document.body.appendChild(modal);
}

init();