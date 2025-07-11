const UI = {
    NewAuthorBtn: document.getElementById('new-author-button'),
    NewGenreBtn: document.getElementById('new-genre-button'),
}

const Init = () => {
    const { NewAuthorBtn, NewGenreBtn } = UI;

    NewAuthorBtn.addEventListener('click', () => toggleInput('new-author'));
    NewGenreBtn.addEventListener('click', () => toggleInput('new-genre'));
}

function toggleInput(id) {
    const input = document.getElementById(id);
    if (input.style.display === "none") {
        input.style.display = "block";
        input.focus();
    } else {
        if (input.value.trim()) {
            if (id === 'new-author') {
                const select = document.getElementById('author');
                const option = document.createElement('option');
                option.text = input.value;
                option.value = "new_" + input.value;
                select.add(option);
                select.value = option.value;
            } else if (id === 'new-genre') {
                const group = document.getElementById('genres');
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'genreIds';
                checkbox.value = "new_" + input.value;
                label.appendChild(checkbox);
                label.append(" " + input.value);
                group.appendChild(label);
            }
            input.value = "";
            input.style.display = "none";
        } else {
            input.style.display = "none";
        }
    }
}

Init();