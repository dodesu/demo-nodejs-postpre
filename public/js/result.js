const { renderBooks } = await import('/assets/js/books.js');

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

    renderBooks(result.data);
    updateMeta(result.meta);
}

const updateMeta = (meta) => {
    const { resultCount } = UI;
    resultCount.textContent = `Tìm thấy ${meta.total} sách`;
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

const isAllEmpty = (formEl) => {
    const inputs = formEl.querySelectorAll('input, select');

    return Array.from(inputs).every(input => {
        if (input.type === 'checkbox') {
            return !input.checked;
        } if (input.type === 'select-one') {
            return input.selectedIndex === 0;
        }
        else {
            return input.value.trim() === '';
        }
    });
};

init();