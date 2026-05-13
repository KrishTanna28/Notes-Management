# Notes Management System

This project is a full-stack Notes Management System, designed for easy note-taking, organization, and search. It consists of a RESTful backend API and a modern, responsive frontend UI.

## Features

- Create, edit, and delete notes
- Tag notes and filter by tag
- Pin important notes
- Full-text search on title and content
- Responsive, user-friendly interface

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite

## Project Structure

- `backend/notes-api` — REST API for notes (Node.js + Express + MongoDB)
- `frontend/notes-ui` — React web app for managing notes
- `core/buggy-code` — (For maintainers) Example Express app for debugging practice

## Getting Started

### 1. Start the Backend API

```
cd backend/notes-api
npm install
npm start
```

Create a `.env` file if you want to override defaults:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/notes-management
```

The API will be available at `http://localhost:4000`.

### 2. Start the Frontend UI

```
cd frontend/notes-ui
npm install
npm run dev
```

By default, the UI connects to the API at `http://localhost:4000`. If your API runs elsewhere, add a `.env` file with:

```
VITE_API_URL=http://localhost:4000
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Debugging Example

For maintainers or learning purposes, the `core/buggy-code` folder contains a small Express app with intentional bugs. You can use it to practice debugging:

```
cd core/buggy-code
npm install
node debugging-assignment.js
```

## API Overview

- `GET /api/notes` — List notes (supports `q`, `tag`, `pinned` query params)
- `GET /api/notes/:id` — Get a single note
- `POST /api/notes` — Create a note
- `PUT /api/notes/:id` — Update a note
- `DELETE /api/notes/:id` — Delete a note

See [backend/notes-api/README.md](backend/notes-api/README.md) for full API details.


