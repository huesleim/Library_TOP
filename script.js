const exportList = document.getElementById("export-list");
const addBook = document.getElementById("add-book");
const form = document.getElementById("book-form");
const cancel = document.getElementById("cancel");
const modal = document.querySelector(".modal");
const modalBackdrop = document.querySelector(".modal-backdrop");
const readCounter = document.getElementById("read-counter");
const currentlyReadingCounter = document.getElementById("currently-reading-counter");
const wishlistCounter = document.getElementById("wishlist-counter");
const myLibrary = [];

function updaceCounters() {
    readCounter.textContent = ` Read: ${document.getElementById("read-shelf").children.length}`;
    currentlyReadingCounter.textContent = ` Currently Reading: ${document.getElementById("currently-reading-shelf").children.length}`;
    wishlistCounter.textContent = ` Wishlist: ${document.getElementById("wishlist-shelf").children.length}`;
}

function Book(title, author, status, cover = null) {
    this.title = title;
    this.author = author;
    this.status = status;
    this.cover = cover;
}

function addBookToLibrary(title, author, status) {
    const book = new Book(title, author, status);
    myLibrary.push(book);
    renderLibrary();
    fetchCoverByTitle(book).then(() => renderLibrary());
}

function renderLibrary() {
    const shelves = document.querySelectorAll(".shelf");
    const readshelf = document.getElementById("read-shelf");
    const currentlyReadingshelf = document.getElementById(
        "currently-reading-shelf"
    );
    const wishlistshelf = document.getElementById("wishlist-shelf");

    shelves.forEach((shelf) => (shelf.innerHTML = ""));

    myLibrary.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("book-info");
        infoDiv.innerHTML = `<strong>${book.title.toUpperCase()}</strong><br>by ${book.author.toUpperCase()}`;
        bookDiv.appendChild(infoDiv);

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn");
        delBtn.textContent = "X";
        delBtn.addEventListener("click", (e) => {
            myLibrary.splice(myLibrary.indexOf(book), 1);
            renderLibrary();
            updaceCounters();
        })
        bookDiv.appendChild(delBtn);

        if (book.cover) {
            bookDiv.style.backgroundImage = `url(${book.cover})`;
        } else {
            bookDiv.style.backgroundImage = "url('no cover.png')";
        }
        switch (book.status) {
            case "read":
                readshelf.appendChild(bookDiv);
                updaceCounters();
                break;
            case "currently-reading":
                currentlyReadingshelf.appendChild(bookDiv);
                updaceCounters();
                break;
            case "wishlist":
                wishlistshelf.appendChild(bookDiv);
                updaceCounters();
                break;
        }
    });
}

async function fetchCoverByTitle(book) {
    const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
            book.title
        )}`
    );
    const data = await response.json();

    if (data.docs && data.docs.length > 0) {
        const bookInfo = data.docs[0];
        if (bookInfo.cover_i) {
            book.cover = `https://covers.openlibrary.org/b/id/${bookInfo.cover_i}-M.jpg`;
        }
    }
    return null;
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.elements.title.value.trim().toLowerCase();
    const author = form.elements.author.value.trim().toLowerCase();
    const status = form.elements.status.value.trim().toLowerCase();
    const duplicate = myLibrary.find(
        (book) => book.title === title && book.author === author
    );
    if (duplicate) {
        alert("This book is already in your library.");
        return;
    }
    addBookToLibrary(title, author, status);
    modal.classList.remove("active");
    form.reset();
});

addBook.addEventListener("click", () => {
    modal.classList.add("active");
});

cancel.addEventListener("click", () => {
    modal.classList.remove("active");
});
