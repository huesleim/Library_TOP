# Library App

A browser-based library management application built with vanilla JavaScript, focused on **data modeling**, **state persistence**, and **API integration** without frameworks.

The application allows users to organize books by reading status, fetch metadata dynamically, and import/export their collection as JSON.

---

## Features

- Create books using constructor functions
- Organize books into multiple shelves:
  - Read
  - Currently Reading
  - Wishlist
- Fetch book covers from the Open Library API
- Import and export the library as a JSON file
- Persistent, inspectable client-side state
- No frameworks or external dependencies

---

## Tech Stack

- JavaScript (ES6+)
- DOM APIs
- Fetch API
- Open Library Search API
- JSON for persistence

---

## Data Model

Books are modeled using a constructor function:

```js
function Book(title, author, status, cover = null) {
  this.title = title;
  this.author = author;
  this.status = status;
  this.cover = cover;
}
