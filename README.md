# Trainee Developer Assignment

## Overview

This assignment has 3 parts:

1. Core Task (Mandatory)
2. Notes Backend (Optional)
3. Notes Frontend (Optional)

You must complete the Core Task.
You can choose Backend, Frontend, or both.

---

## 1. Core Task (Mandatory)

Fix bugs in the provided code and make sure the project runs correctly.

---

## 2. Backend Task (Optional)

Build a Notes API with following endpoints:

- POST /notes
- GET /notes
- GET /notes/:id
- PUT /notes/:id
- DELETE /notes/:id

---

## 3. Frontend Task (Optional)

Build a Notes UI:

- Show list of notes
- Create note
- Edit note
- Delete note

---

## Rules

- You can use Google / ChatGPT
- Do not copy full project from internet
- Keep code simple and readable

---

## Submission

- Push code to GitHub
- Share repository link

---

## Notes Management System

The optional full-stack notes app is implemented in:

- `backend/notes-api` - Node.js + Express API with MongoDB/Mongoose
- `frontend/notes-ui` - React + Vite responsive notes UI

Run the backend from `backend/notes-api`:

```bash
npm install
npm start
```

Use `MONGODB_URI` in `.env` for MongoDB Atlas or a local MongoDB instance.

Run the frontend from `frontend/notes-ui`:

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd install` and `npm.cmd start` if `npm.ps1` is
blocked by execution policy.

Open `http://localhost:5173`.

---

## Evaluation Criteria

We evaluate:
- Problem solving
- Code quality
- Understanding of basics
- Effort and learning ability

