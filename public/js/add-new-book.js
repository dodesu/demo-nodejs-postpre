import { getAccessToken, getUser } from './auth.js';
const { renderBook } = await import('/assets/js/books.js');

const UI = {
    AuthorInput: document.getElementById('new-author'),
    GenreInput: document.getElementById('new-genre'),
    NewAuthorBtn: document.getElementById('new-author-button'),
    NewGenreBtn: document.getElementById('new-genre-button'),
    SubmitBtn: document.getElementById('submit-button'),
    Form: document.querySelector('#book-form'),
    Table: document.querySelector('.responsive-table'),
    BodyTable: document.getElementById('books-table'),
}
const RESOURCE_URLS = {
    'new-author': '/authors',
    'new-genre': '/genres'
}
let isSetEventInput = {
    'new-author': false,
    'new-genre': false
};

const Init = () => {
    const { NewAuthorBtn, NewGenreBtn, SubmitBtn } = UI;
    CheckAuthAndAlert();
    NewAuthorBtn.addEventListener('click', () => toggleInput('new-author'));
    NewGenreBtn.addEventListener('click', () => toggleInput('new-genre'));
    SubmitBtn.addEventListener('click', submit);
}

const toggleInput = async (id) => {
    const input = UI[id === 'new-author' ? 'AuthorInput' : 'GenreInput'];
    const value = input.value.trim();
    const adds = {
        'new-author': async (name) => {
            const newAuthor = await fetchAddItem(RESOURCE_URLS['new-author'], name);
            addOptionAuthor(newAuthor);
        },
        'new-genre': async (name) => {
            const newGenre = await fetchAddItem(RESOURCE_URLS['new-genre'], name);
            addCheckboxGenre(newGenre);
        }
    }

    if (input.style.display === "none") {
        input.style.display = "block";
        input.focus();
    } else {
        try {
            if (value) {
                if (id === 'new-author') {
                    await adds['new-author'](value);
                } else if (id === 'new-genre') {
                    await adds['new-genre'](value);
                }
            }
            input.value = "";
            input.style.display = "none";
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // ==== Set event input ====
    if (isSetEventInput[id]) return;
    isSetEventInput[id] = true;
    input.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        const name = input.value.trim();
        if (!name) return;

        await adds[id](name);

        input.value = "";
        input.style.display = "none";
    });
    input.addEventListener('keydown', e => e.key === 'Escape' ? input.style.display = "none" : null);
}

const addOptionAuthor = (newAuthor) => {
    const { id, name } = newAuthor;
    const select = document.getElementById('author');
    const option = document.createElement('option');
    option.text = name;
    option.value = id;
    select.add(option);
    select.value = option.value;
}

const addCheckboxGenre = (newGenre) => {
    const { id, name } = newGenre;
    const group = document.getElementById('genres');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'genreIds';
    checkbox.value = id;
    label.appendChild(checkbox);
    label.append(" " + name);
    group.appendChild(label);
}

const fetchAddItem = async (endpoint, name) => {
    const payload = { name };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        throw error;
    }
}

const submit = async () => {
    const { Table, BodyTable } = UI;
    const formData = getFormData();
    const book = await fetchAddBook(formData);

    Table.classList.remove('hidden');
    renderBook(book, BodyTable);
}
const getFormData = () => {
    const { Form } = UI;
    const formData = {};

    formData.title = Form.querySelector('#title').value.trim();

    formData.authorId = Number(Form.querySelector('#author').value);

    formData.genreIds = Array.from(Form.querySelectorAll('input[name="genreIds"]:checked'))
        .map(cb => Number(cb.value));

    formData.publishedAt = Form.querySelector('#publishedAt').value;

    formData.isRead = Form.querySelector('#isRead').checked;

    return formData;
};
const fetchAddBook = async (newBook) => {
    const { title, authorId, genreIds, publishedAt } = newBook;

    try {
        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({
                title,
                authorId,
                genreIds,
                publishedAt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi khi tạo sách:', errorData);
            return;
        }

        const result = await response.json();
        alert('Thêm sách thành công');
        return result;
    } catch (error) {
        console.error('Lỗi mạng hoặc máy chủ:', error);
        return null;
    }
};

const fetchAddBookToRead = async (bookId) => {
    try {
        const response = await fetch(`/books/${book.id}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            },
            body: JSON.stringify({ id: bookId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi khi đánh dấu sách:', errorData);
            return;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Lỗi mạng hoặc máy chủ:', error);
        return null;
    }
}

const CheckAuthAndAlert = async () => {
    const user = getUser();
    if (!user) {
        alert('Bạn phải đăng nhập trước!');
    }
}

Init();