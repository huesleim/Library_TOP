const exportList = document.getElementById("export");
const importList = document.getElementById("importFile");
const addBook = document.getElementById("add-book");
const form = document.getElementById("book-form");
const cancel = document.getElementById("cancel");
const modal = document.querySelector(".modal");
const modalBackdrop = document.querySelector(".modal-backdrop");
const readCounter = document.getElementById("read-counter");
const currentlyReadingCounter = document.getElementById(
    "currently-reading-counter"
);
const wishlistCounter = document.getElementById("wishlist-counter");
let myLibrary = [];

function updateCounters() {
    readCounter.textContent = ` Read: ${
        document.getElementById("read-shelf").children.length
    }`;
    currentlyReadingCounter.textContent = ` Currently Reading: ${
        document.getElementById("currently-reading-shelf").children.length
    }`;
    wishlistCounter.textContent = ` Wishlist: ${
        document.getElementById("wishlist-shelf").children.length
    }`;
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
            updateCounters();
        });
        bookDiv.appendChild(delBtn);

        if (book.cover) {
            bookDiv.style.backgroundImage = `url(${book.cover})`;
        } else {
            bookDiv.style.backgroundImage = "url('no cover.png')";
        }
        switch (book.status) {
            case "read":
                readshelf.appendChild(bookDiv);
                updateCounters();
                break;
            case "currently-reading":
                currentlyReadingshelf.appendChild(bookDiv);
                updateCounters();
                break;
            case "wishlist":
                wishlistshelf.appendChild(bookDiv);
                updateCounters();
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

function exportLibrary() {
    const dataStr = JSON.stringify(myLibrary, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "myLibrary.json";
    link.click();
    URL.revokeObjectURL(fileURL);
}

function importLibrary() {
    const file = importList.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
        try {
            const importedLibrary = JSON.parse(e.target.result);
            myLibrary = importedLibrary;
            renderLibrary();
        } catch (error) {
            console.error("Error importing library:", error);
        }
    };
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

exportList.addEventListener("click", exportLibrary);
importList.addEventListener("change", importLibrary);
