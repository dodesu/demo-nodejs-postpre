const UI = {
    Table: document.querySelector('.responsive-table'),
    BodyTable: document.getElementById('books-table'),
}


/**
 * Renders a list of books into a table format.
 * 
 * Clears any existing rows in the books table and populates it with
 * new rows based on the provided books data. Each row contains 
 * information about the book including its ID, title, published date,
 * creation date, author, genres, and creator. Additionally, updates
 * the result count text with the total number of books found.
 *
 * @param {Array} books - The array of book objects to render.
 */
export const renderBooks = (books) => {
    const { BodyTable, Table } = UI;

    BodyTable.innerHTML = '';
    Table.classList.remove('hidden');
    books?.forEach(book => {
        renderBook(book, BodyTable);
    })
}

export const renderBook = (book, BodyTableEl) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${new Date(book.publishedAt).toLocaleDateString()}</td>
            <td>${new Date(book.createdAt).toLocaleDateString()}</td>
            <td>${book.author.name}</td>
            <td>${book.genres.map(g => g.name).join(', ')}</td>
            <td>${book.creator.name}</td>
            <td><input type="checkbox" ${book.isRead ? 'checked' : ''}></td>
        `;

    BodyTableEl.appendChild(row);
}

export const setEventMarkAsReadTable = (MarkAsReadHandler) => {
    const { Table } = UI;

    Table.addEventListener('change', async (e) => {
        if (e.target.type === 'checkbox') {
            const checkbox = e.target;
            const row = checkbox.closest('tr');
            const idCell = row.querySelector('td');
            const bookId = idCell ? idCell.textContent.trim() : null;

            if (bookId) {
                const result = await MarkAsReadHandler(bookId);
                if (result) {
                    alert('Đánh dấu đã đọc thành công');
                } else {
                    alert('Đánh dấu thất bại');
                    e.target.checked = false;
                }
            }
        }
    });

}
