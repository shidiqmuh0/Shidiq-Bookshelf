// Menunggu hingga halaman HTML selesai dimuat sebelum menjalankan kode JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Mendapatkan elemen-elemen HTML yang diperlukan
    const inputBook = document.getElementById('inputBook');
    const bookSubmit = document.getElementById('bookSubmit');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    // Membuat array untuk menyimpan daftar buku
    let books = [];

    // Memeriksa apakah ada data buku di localStorage
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }

    // Fungsi untuk menyimpan data buku ke localStorage
    function saveBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Menghandle submit form untuk menambahkan buku
    inputBook.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mendapatkan nilai dari input form
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = Number(document.getElementById('inputBookYear').value);
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

        // Memeriksa apakah buku dengan judul yang sama sudah ada
        const isDuplicate = books.some(book => book.title === inputBookTitle);

        if (isDuplicate) {
            alert('Buku dengan judul yang sama sudah ada dalam daftar.');
        } else {
            // Membuat objek buku baru
            const book = {
                id: new Date().getTime(),
                title: inputBookTitle,
                author: inputBookAuthor,
                year: inputBookYear,
                isComplete: inputBookIsComplete,
            };

            // Menambahkan buku ke daftar dan menyimpan ke localStorage
            books.push(book);
            saveBooksToLocalStorage();
            // Memperbarui tampilan rak buku
            updateBookshelf();

            // Mengosongkan input form setelah menambahkan buku
            document.getElementById('inputBookTitle').value = '';
            document.getElementById('inputBookAuthor').value = '';
            document.getElementById('inputBookYear').value = '';
            document.getElementById('inputBookIsComplete').checked = false;
        }
    });

    // Fungsi untuk memperbarui tampilan rak buku
    function updateBookshelf() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        for (const book of books) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    }

    // Fungsi untuk menghapus buku berdasarkan ID
    function removeBook(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    // Fungsi untuk mengganti status selesai atau belum selesai membaca buku
    function toggleIsComplete(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            saveBooksToLocalStorage();
            updateBookshelf();
        }
    }

    // Menghandle submit form untuk pencarian buku
    const searchBook = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');

    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchBookTitle.value.toLowerCase().trim();

        const searchResults = books.filter(book => {
            return (
                book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.year.toString().includes(query)
            );
        });

        updateSearchResults(searchResults);
    });

    // Fungsi untuk memperbarui tampilan hasil pencarian
    function updateSearchResults(results) {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        for (const book of results) {
            const bookItem = createBookItem(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        }
    }

    // Fungsi untuk membuat elemen buku dalam daftar
    function createBookItem(book) {
        const bookItem = document.createElement('article');
        bookItem.className = 'book_item';
        bookItem.style.margin = '10px';

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action';

        const title = document.createElement('h3');
        title.textContent = book.title;
        title.style.color = 'white';
        title.style.marginBottom = '10px';

        const author = document.createElement('p');
        author.textContent = 'Penulis: ' + book.author;
        author.style.color = 'white';
        author.style.marginBottom = '10px';

        const year = document.createElement('p');
        year.textContent = 'Tahun: ' + book.year;
        year.style.color = 'white';
        year.style.marginBottom = '10px';

        const removeButton = createActionButton('Hapus buku', 'red', function () {
            removeBook(book.id);
        });

        let toggleButton;
        if (book.isComplete) {
            toggleButton = createActionButton('Belum selesai di Baca', 'yellow', function () {
                toggleIsComplete(book.id);
            });
        } else {
            toggleButton = createActionButton('Selesai dibaca', 'green', function () {
                toggleIsComplete(book.id);
            });
        }

        // Gaya tombol aksi
        removeButton.style.padding = '10px';
        removeButton.style.margin = '10px';
        removeButton.style.borderRadius = '10px';
        removeButton.style.border = '0';
        removeButton.style.backgroundColor = '#F93737';
        removeButton.style.color = 'white';
        removeButton.style.fontWeight = 'bold';

        toggleButton.style.padding = '10px';
        toggleButton.style.borderRadius = '10px';
        toggleButton.style.border = '0';
        toggleButton.style.backgroundColor = '#8946E8';
        toggleButton.style.color = 'white';
        toggleButton.style.fontWeight = 'bold';

        actionButtons.appendChild(toggleButton);
        actionButtons.appendChild(removeButton);

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(actionButtons);

        return bookItem;
    }

    // Fungsi untuk membuat elemen tombol aksi
    function createActionButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', clickHandler);
        return button;
    }

    // Memperbarui tampilan rak buku saat halaman dimuat
    updateBookshelf();
});
