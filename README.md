# 🌟 Demo Nodejs-PostpreSQL
> Name: BookTracker
> Version: 0.1
> A simple RESTful API built with **NestJS** and **PostgreSQL** to manage books and track books a user has read.
---

## Structure
```
src/
├── common/                 # Shared utilities
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   └── guards/      
│     
├── config/                 # Global configuration files
│   └── database.config.ts  # Database connection config
│
├── database/               # Database migration & seeding
│   ├── migrations/         # TypeORM migrations
│   └── seeds/              # Seed data
│   └── erd/                # ERD docs, database structure
│
├── modules/                # Main application modules
│   ├── auth/               # Authentication (login/register)
│   ├── author/             # Author-related logic
│   ├── book/               # Book-related logic
│   │   ├── dto/            # Data Transfer Objects for books
│   │   │   ├── book-response.dto.ts
│   │   │   ├── create-book.dto.ts
│   │   │   ├── search-book.dto.ts
│   │   │   ├── update-book.dto.ts
│   │   │   └── user-in-book.dto.ts
│   │   ├── entities/       # Book entity definitions
│   │   ├── book.controller.ts
│   │   ├── book.module.ts
│   │   └── book.service.ts
│   │
│   ├── genre/              # Genre module
│   └── user/               # User module
│
├── app.module.ts           # Root module
└── main.ts                 # Application entry point

```
---

##  Features

-  User authentication using JWT
-  Users can register, login, and manage their own read list
-  Full CRUD for books:
  - Public book list shared across all users
  - Only the owner can update/delete their books
-  Users can:
  - View list of books they have read
  - Mark a book as read / unread (only for themselves)
- Search functionality:
  - Full-text search from a single input (title, author, etc.)
  - Advanced filtering by fields (genre, year, status...)

- Pagination support for all book-related list endpoints
- Authorization on endpoints to protect user-specific data
---

## 🧾 System Requirements

To run this project locally, make sure you have the following installed:

| Tool           | Version          | Notes                         |
|----------------|------------------|-------------------------------|
| **Node.js**    | `>=20.12.2`      | LTS or newer recommended      |
| **npm**        | `>=8.x`          | Comes with Node.js            |
| **NestJS**     | `v11.x`          | Core framework                |
| **TypeORM**    | `v0.3.24`        | Database ORM                  |
| **PostgreSQL** | `>=13`           | Recommended: v13 or v14       |
| **TypeScript** | `v5.7.3`         | Language support              |
## 🛠️ Installation

```bash
git clone https://github.com/dodesu/demo-nodejs-postpre
cd demo-nodejs-postpre
npm install
```

- Create a .env file based on .env.example
```bash
cp .env.example .env
```
- Edit the .env with your PostgreSQL credentials:
- Turn on postgreSQL server and set up the database
```bash
npm run mig:run
npm run seed
```
- Start the development server
```bash
npm run start:dev
```

## 📬 Request Flow Overview
Client (HTTP Request)
    ↓
[Controller]
book.controller.ts
    → Receives request (e.g., POST /books)
    → Validates DTO (create-book.dto.ts)
    ↓
[Service]
book.service.ts
    → Business logic: create book, check user, handle relations
    → Calls repository (via TypeORM)
    ↓
[Entity + DB Layer]
book.entity.ts + typeorm
    → Saves book to database
    ↓
[Service]
    → Returns created book data (or error)
    ↓
[Controller]
    → Transforms to response DTO (book-response.dto.ts)
    ↓
Client (HTTP Response)


## 📡 API Overview

- **`/auth`**:  
  - Register, login, get current profile (JWT)

- **`/users`**:  
  - Create, read, update, delete users  
  _(*Admin role not implemented yet)_

- **`/books`**:  
  - Create, read (with pagination), update, delete books  
  - Support **advanced filtering** via query params

- **`/books/search`**:  
  - Full-text search by title, author, etc.

- **`/read-books`**:  
  - Mark a book as read or unread (per user)  
  - Get user's own read book list

🛡 All user-specific actions require JWT authentication  
📄 All list endpoints support pagination via `?page=1&limit=10`

## 💼 Planned Features
- Reading progress tracking (e.g., 70%, 80%)
- Personal notes for each book
- User profile with reading statistics
- Book rating system
- Reading schedule with notifications/reminders
- Social sharing of reading status and reviews
