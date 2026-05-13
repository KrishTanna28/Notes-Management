import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const emptyForm = { title: "", content: "", tags: "", pinned: false };

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.details = data.errors || {};
    throw error;
  }

  return data;
}

function parseTags(tags) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function App() {
  const [allNotes, setAllNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [activeNote, setActiveNote] = useState(null);
  const [dialogMode, setDialogMode] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const tagCounts = useMemo(
    () =>
      allNotes.reduce((counts, note) => {
        note.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
        return counts;
      }, {}),
    [allNotes]
  );

  const sortedTags = useMemo(
    () => Object.entries(tagCounts).sort((left, right) => right[1] - left[1]),
    [tagCounts]
  );

  async function loadNotes() {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (filter === "pinned") params.set("pinned", "true");
    if (selectedTag) params.set("tag", selectedTag);

    try {
      const [visibleData, allData] = await Promise.all([
        api(`/api/notes${params.toString() ? `?${params}` : ""}`),
        api("/api/notes")
      ]);
      setNotes(visibleData.notes);
      setAllNotes(allData.notes);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadNotes, 220);
    return () => window.clearTimeout(timer);
  }, [query, filter, selectedTag]);

  function openCreate() {
    setActiveNote(null);
    setForm(emptyForm);
    setFormError({});
    setDialogMode("create");
  }

  async function openNote(id, mode) {
    setError("");
    setFormError({});

    try {
      const data = await api(`/api/notes/${id}`);
      const note = data.note;
      setActiveNote(note);
      setForm({
        title: note.title,
        content: note.content,
        tags: note.tags.join(", "),
        pinned: note.pinned
      });
      setDialogMode(mode);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function closeDialog() {
    setDialogMode("");
    setActiveNote(null);
    setForm(emptyForm);
    setFormError({});
    setSaving(false);
  }

  async function saveNote(event) {
    event.preventDefault();
    setSaving(true);
    setFormError({});

    const payload = {
      title: form.title,
      content: form.content,
      tags: parseTags(form.tags),
      pinned: form.pinned
    };

    try {
      if (activeNote) {
        await api(`/api/notes/${activeNote.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await api("/api/notes", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      closeDialog();
      await loadNotes();
    } catch (requestError) {
      setFormError(requestError.details || {});
      setError(requestError.details?.title ? "" : requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote() {
    if (!deleteTarget) return;

    try {
      await api(`/api/notes/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      await loadNotes();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const visibleCount = notes.length;
  const pinnedCount = allNotes.filter((note) => note.pinned).length;
  const viewTitle = selectedTag
    ? `#${selectedTag}`
    : filter === "pinned"
      ? "Pinned notes"
      : "All notes";

  return (
    <>
      <div className="app-shell">
        <aside className="sidebar" aria-label="Notes filters">
          <div className="brand-block">
            <span className="brand-mark" aria-hidden="true">
              F
            </span>
            <div>
              <p className="eyebrow">Workspace</p>
              <h1>Field Notes</h1>
            </div>
          </div>

          <nav className="filter-stack" aria-label="Primary filters">
            <button
              className={`filter-button ${filter === "all" ? "is-active" : ""}`}
              type="button"
              onClick={() => setFilter("all")}
            >
              <span>All notes</span>
              <strong>{allNotes.length}</strong>
            </button>
            <button
              className={`filter-button ${filter === "pinned" ? "is-active" : ""}`}
              type="button"
              onClick={() => setFilter("pinned")}
            >
              <span>Pinned</span>
              <strong>{pinnedCount}</strong>
            </button>
          </nav>

          <section className="tag-panel" aria-labelledby="tagHeading">
            <div className="section-heading">
              <p id="tagHeading">Tags</p>
              <button className="small-button" type="button" onClick={() => setSelectedTag("")}>
                Clear
              </button>
            </div>
            <div className="tag-list">
              {sortedTags.length ? (
                sortedTags.map(([tag, count]) => (
                  <button
                    className={`tag-filter ${selectedTag === tag ? "is-active" : ""}`}
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                  >
                    <span>{tag}</span>
                    <strong>{count}</strong>
                  </button>
                ))
              ) : (
                <p className="muted-note">No tags yet</p>
              )}
            </div>
          </section>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div className="search-wrap">
              <input
                type="search"
                placeholder="Search title or content"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </header>

          <section className="content-header">
            <div>
              <p className="eyebrow">{query ? "Search results" : "Library"}</p>
              <h2>{viewTitle}</h2>
            </div>
          </section>

          {error ? <section className="error-banner">{error}</section> : null}

          <section className="notes-grid" aria-live="polite">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <article className="note-card skeleton" key={index} />
                ))
              : null}

            {!loading && !notes.length ? (
              <article className="empty-state">
                <div className="empty-art" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3>No notes found</h3>
                <p>Capture something new or adjust the current search.</p>
              </article>
            ) : null}

            {!loading
              ? notes.map((note) => (
                  <article className={`note-card ${note.pinned ? "is-pinned" : ""}`} key={note.id}>
                    <div className="card-head">
                      <span className="pin-indicator">{note.pinned ? "Pinned" : "Note"}</span>
                      <time dateTime={note.updatedAt}>{formatDate(note.updatedAt)}</time>
                    </div>
                    <button className="note-open" type="button" onClick={() => openNote(note.id, "view")}>
                      <h3>{note.title}</h3>
                      <p>{note.preview || note.content}</p>
                    </button>
                    <div className="note-tags">
                      {note.tags.map((tag) => (
                        <span className="note-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="card-actions">
                      <button type="button" onClick={() => openNote(note.id, "edit")}>
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(note)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              : null}
          </section>
        </main>
      </div>

      <button className="fab" type="button" aria-label="Create note" onClick={openCreate}>
        <span aria-hidden="true">+</span>
      </button>

      {dialogMode ? (
        <div className="dialog-backdrop" role="presentation">
          <form className="note-form" onSubmit={saveNote}>
            <div className="dialog-head">
              <div>
                <p className="eyebrow">
                  {dialogMode === "create" ? "New note" : dialogMode === "view" ? "Note details" : "Edit note"}
                </p>
                <h2>{dialogMode === "create" ? "Capture a thought" : "Read and refine"}</h2>
              </div>
              <button className="icon-button" type="button" onClick={closeDialog} aria-label="Close">
                x
              </button>
            </div>

            <label>
              <span>Title</span>
              <input
                maxLength="120"
                autoComplete="off"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
              <small className="field-error">{formError.title || ""}</small>
            </label>

            <label>
              <span>Content</span>
              <textarea
                rows="9"
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              />
            </label>

            <label>
              <span>Tags</span>
              <input
                placeholder="planning, ideas"
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              />
            </label>

            <label className="pin-row">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(event) => setForm((current) => ({ ...current, pinned: event.target.checked }))}
              />
              <span>Pin this note</span>
            </label>

            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={closeDialog}>
                Cancel
              </button>
              <button className="primary-button" type="submit" disabled={saving}>
                {activeNote ? "Update note" : "Save note"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="dialog-backdrop" role="presentation">
          <div className="confirm-card">
            <p className="eyebrow">Delete note</p>
            <h2>Remove this note?</h2>
            <p>This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="danger-button" type="button" onClick={deleteNote}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
