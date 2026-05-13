# Notes API

This is a small Node.js + Express + MongoDB API that powers the Notes
Management System. It supports search, tags, and pinned notes, and returns
clean JSON responses for the UI.

## Requirements

- Node.js 18+ and npm
- A MongoDB instance (local or Atlas)

## Run locally

```bash
npm install
npm start
```

Optional for auto-reload:

```bash
npm run dev
```

On Windows PowerShell, use `npm.cmd install` and `npm.cmd start` if `npm.ps1`
is blocked by execution policy.

Create a `.env` file (or rely on defaults):

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/notes-management
```

The API runs at `http://localhost:4000`. If you build the frontend, this server
can also serve the static UI from `../../frontend/notes-ui/dist`.

## Endpoints

- `GET /api/health`
- `GET /api/notes?q=&tag=&pinned=true`
- `GET /api/notes/:id`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

Query options for listing notes:

- `q` searches `title` and `content` (MongoDB text index)
- `tag` filters by a single tag
- `pinned=true` returns only pinned notes

## Data shape

Single note response:

```json
{
  "id": "uuid",
  "title": "Weekly plan",
  "content": "Write notes here.",
  "tags": ["planning"],
  "pinned": false,
  "createdAt": "2026-05-13T00:00:00.000Z",
  "updatedAt": "2026-05-13T00:00:00.000Z"
}
```

List responses return `{ notes, total }`. Each note in the list also includes a
`preview` field (first 150 characters of content) for quick display in the UI.

## Error responses

- Validation errors return HTTP 400 with `{ message, errors }`.
- Unknown IDs return HTTP 404 with `{ message: "Note not found." }`.
