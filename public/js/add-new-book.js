const UI = {
    AuthorInput: document.getElementById('new-author'),
    GenreInput: document.getElementById('new-genre'),
    NewAuthorBtn: document.getElementById('new-author-button'),
    NewGenreBtn: document.getElementById('new-genre-button'),
    SubmitBtn: document.getElementById('submit-button')
}
let isSetEventInput = {
    'new-author': false,
    'new-genre': false
};

const Init = () => {
    const { NewAuthorBtn, NewGenreBtn } = UI;

    NewAuthorBtn.addEventListener('click', () => toggleInput('new-author'));
    NewGenreBtn.addEventListener('click', () => toggleInput('new-genre'));
}

const toggleInput = async (id) => {
    const input = UI[id === 'new-author' ? 'AuthorInput' : 'GenreInput'];

    if (input.style.display === "none") {
        input.style.display = "block";
        input.focus();
    } else {
        if (input.value.trim()) {
            if (id === 'new-author') {
                addOptionAuthor(12, input.value);
            } else if (id === 'new-genre') {
                addCheckboxGenre(12, input.value);
            }
            input.value = "";
            input.style.display = "none";
        } else {
            input.style.display = "none";
        }
    }

    // ==== Set event input ====
    if (isSetEventInput[id]) return;
    isSetEventInput[id] = true;
    input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const value = input.value.trim();
        if (!value) return;

        const adds = {
            'new-author': () => addOptionAuthor(12, value),
            'new-genre': () => addCheckboxGenre(12, value)
        };

        if (adds[id]) {
            adds[id]();
        }

        input.value = "";
        input.style.display = "none";
    });
    input.addEventListener('keydown', e => e.key === 'Escape' ? input.style.display = "none" : null);
    input.addEventListener('blur', () => input.style.display = "none");
}

const addOptionAuthor = (id, name) => {
    const select = document.getElementById('author');
    const option = document.createElement('option');
    option.text = name;
    option.value = id;
    select.add(option);
    select.value = option.value;
}

const addCheckboxGenre = (id, name) => {
    const group = document.getElementById('genres');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'genreIds';
    checkbox.value = name;
    label.appendChild(checkbox);
    label.append(" " + id);
    group.appendChild(label);
}

const createAuthor = async (name) => {
    const newAuthor = {
        name: name
    };

    try {
        const response = await fetch('/authors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(newAuthor)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi khi tạo sách:', errorData);
            alert(errorData.message);
            return null;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Lỗi mạng hoặc máy chủ:', error);
        alert(error.message);
        return null;
    }
}

const createBook = async () => {
    const newBook = {
        title: "Umamusume: Pretty Derby",
        authorId: 8,
        genreIds: [2, 3, 4, 5, 6],
        publishedAt: "2020-02-12"
    };

    try {
        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}` // nếu có token
            },
            body: JSON.stringify(newBook)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi khi tạo sách:', errorData);
            return;
        }

        const result = await response.json();
        console.log('Tạo sách thành công:', result);
    } catch (error) {
        console.error('Lỗi mạng hoặc máy chủ:', error);
    }
};


Init();