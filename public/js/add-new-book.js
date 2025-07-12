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
    const value = input.value.trim();
    const adds = {
        'new-author': async (name) => {
            const newAuthor = await fetchAddAuthor(name);
            addOptionAuthor(newAuthor);
        },
        'new-genre': ''
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
                    addCheckboxGenre(12, input.value);
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

const fetchAddAuthor = async (name) => {
    const newAuthor = {
        name: name
    };
    console.log(name);
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
            throw new Error(errorData.message);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        throw error;
    }
}

const createBook = async (title, authorId, genreIds, publishedAt) => {
    const newBook = {
        title: title,
        authorId: authorId,
        genreIds: genreIds,
        publishedAt: publishedAt
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