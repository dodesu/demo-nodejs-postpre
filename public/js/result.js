const UI = {
    toggleBtn: document.getElementById('toggle-advanced'),
    advancedSearch: document.getElementById('advanced-search'),
    searchBox: document.getElementById('basic-search'),
}

const init = () => {
    setEventToggleAdvancedSearch();
    setCurrentValueSearchBox();
}

const setEventToggleAdvancedSearch = () => {
    const { toggleBtn, advancedSearch } = UI;

    toggleBtn.addEventListener('click', () => {
        advancedSearch.classList.toggle('hidden');
        toggleBtn.textContent = advancedSearch.classList.contains('hidden')
            ? 'Search Advanced ▾'
            : 'Search Advanced ▴';
    });
}

const setCurrentValueSearchBox = () => {
    const { searchBox } = UI;
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('keyword');

    searchBox.value = keyword;
}

init();