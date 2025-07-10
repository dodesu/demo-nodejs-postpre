const UI = {
    toggleBtn: document.getElementById('toggle-advanced'),
    advancedSearch: document.getElementById('advanced-search'),
    searchBox: document.getElementById('basic-search'),
    submitBtn: document.getElementById('submit-button'),
    table: document.querySelector('.responsive-table'),
    bodyTable: document.getElementById('books-table'),
    resultCount: document.getElementById('result-count'),
}
let isSearchAdvancedOn = false;

const init = () => {
    setEventToggleAdvancedSearch();
    setCurrentValueSearchBox();
    setSubmitEvent();
}

const setEventToggleAdvancedSearch = () => {
    const { toggleBtn, advancedSearch } = UI;

    toggleBtn.addEventListener('click', () => {
        advancedSearch.classList.toggle('hidden');
        toggleBtn.textContent = advancedSearch.classList.contains('hidden')
            ? 'Search Advanced ▾'
            : 'Search Advanced ▴';
        advancedSearch.classList.contains('hidden')
            ? isSearchAdvancedOn = false : isSearchAdvancedOn = true
    });
}

const setCurrentValueSearchBox = () => {
    const { searchBox } = UI;
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');

    searchBox.value = keyword;
}

const setSubmitEvent = () => {
    const { submitBtn, searchBox } = UI;
    submitBtn.addEventListener('click', submit);
    searchBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    });
}

const submit = async () => {
    const { searchBox, advancedSearch } = UI;

    if (!isSearchAdvancedOn || isAllEmpty(advancedSearch)) {
        window.location.href = `/result?keyword=${encodeURIComponent(searchBox.value.trim())}`;
    }

    let title = searchBox.value.trim();
    let authorId = advancedSearch.querySelector('#author-select').value;
    let creatorName = advancedSearch.querySelector('input[name="creatorName"]').value.trim();
    let genreIds = [...advancedSearch.querySelectorAll('input[name="genreIds"]:checked')].map(input => input.value);
    let publishedFrom = advancedSearch.querySelector('input[name="publishedFrom"]').value;
    let publishedTo = advancedSearch.querySelector('input[name="publishedTo"]').value;

    const result = await fetchSearchAdvanced(title, authorId, creatorName, genreIds, publishedFrom, publishedTo);

    renderBooks(result.data, result.meta);
}
const fetchSearchAdvanced = async (title, authorId, creatorName, genreIds, publishedFrom, publishedTo) => {
    try {
        let params = '';
        params += title ? `title=${encodeURIComponent(title)}` : '';
        params += authorId ? `&authorId=${authorId}` : '';
        params += creatorName ? `&creatorName=${creatorName}` : '';
        params += genreIds ? `&${genreIds.map(id => `genreIds=${id}`).join('&')}` : '';
        params += publishedFrom ? `&publishedFrom=${publishedFrom}` : '';
        params += publishedTo ? `&publishedTo=${publishedTo}` : '';

        const response = await fetch(`books/?${params}`);
        const data = await response.json();
        const newUrl = `/result?${params}`;
        window.history.pushState(null, '', newUrl);
        return data;
    } catch (error) {
        console.error(error);
    }
}

const renderBooks = (books, meta) => {
    const { bodyTable, resultCount, table } = UI;

    bodyTable.innerHTML = '';
    table.classList.remove('hidden');
    books?.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${new Date(book.publishedAt).toLocaleDateString()}</td>
            <td>${new Date(book.createdAt).toLocaleDateString()}</td>
            <td>${book.author.name}</td>
            <td>${book.genres.map(g => g.name).join(', ')}</td>
            <td>${book.creator.name}</td>
            <td><input type="checkbox" ></td>
        `;

        bodyTable.appendChild(row);
    })
    resultCount.textContent = `Tìm thấy ${meta.total} sách`;

}

const isAllEmpty = (formEl) => {
    const inputs = formEl.querySelectorAll('input');

    return Array.from(inputs).every(input => {
        if (input.type === 'checkbox') {
            return !input.checked;
        } else {
            return input.value.trim() === '';
        }
    });
};

init();