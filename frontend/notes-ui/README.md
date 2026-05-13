# Notes UI

This is the React + Vite frontend for the Notes Management System. It connects
to the Notes API and offers a clean workflow for writing, searching, and
organizing notes.

## Features

- Notes list with pinned sorting
- Search by title/content
- Filter by tags
- Create, edit, and delete notes
- Loading, empty, and error states

## Run locally

```bash
npm install
npm run dev
```

By default the UI talks to `http://localhost:4000`. If your API lives elsewhere,
add a `.env` file with:

```bash
VITE_API_URL=http://localhost:4000
```

Open `http://localhost:5173` in the browser.

On Windows PowerShell, use `npm.cmd install` and `npm.cmd run dev` if `npm.ps1`
is blocked by execution policy.

## Build and preview

```bash
npm run build
npm run preview
```
