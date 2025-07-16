import { getUser, updateBooksView } from './auth.js';
const UI = {
    SearchBox: document.getElementById("search-box"),
    SearchInput: document.querySelector('.search-box input'),
    BodyBookTable: document.getElementById("books-table"),
    Table: document.querySelector('.responsive-table')
};

const init = async () => {
    setEventEnterSearchBox();
    if (getUser()) await updateBooksView();
}

const setEventEnterSearchBox = () => {
    const { SearchInput } = UI;

    SearchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const query = event.target.value.trim();
            if (query) {
                window.location.href = `/result?keyword=${encodeURIComponent(query)}`;
            }
        }
    });
}

init();