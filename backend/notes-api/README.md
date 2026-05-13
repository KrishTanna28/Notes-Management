# Notes API

Node.js + Express + MongoDB API for the Notes Management System.

## Run

```bash
npm install
npm start
```

On this Windows PowerShell setup, use `npm.cmd install` and `npm.cmd start` if
script execution policy blocks `npm`.

Create a `.env` file or use the default local MongoDB URI:

```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/notes-management
```

The API runs at `http://localhost:4000`. In production it can serve the React
build from `../../frontend/notes-ui/dist`.

## Endpoints

- `GET /api/health`
- `GET /api/notes?q=&tag=&pinned=true`
- `GET /api/notes/:id`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

## Note Shape

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

Notes are stored in MongoDB through Mongoose. The model also creates a text
index on `title` and `content` for search.
