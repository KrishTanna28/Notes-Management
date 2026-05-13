const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");

const router = express.Router();

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function serializeNote(note) {
  const item = note.toJSON();
  return {
    ...item,
    preview:
      item.content.length > 150
        ? `${item.content.slice(0, 147).trim()}...`
        : item.content
  };
}

function buildFilter(query) {
  const filter = {};
  const search = String(query.q || "").trim();
  const tag = String(query.tag || "").trim().toLowerCase();

  if (search) {
    filter.$text = { $search: search };
  }

  if (tag) {
    filter.tags = tag;
  }

  if (query.pinned === "true") {
    filter.pinned = true;
  }

  return filter;
}

function normalizeBody(body) {
  return {
    title: typeof body.title === "string" ? body.title.trim() : body.title,
    content: typeof body.content === "string" ? body.content.trim() : body.content,
    tags: Array.isArray(body.tags) ? body.tags : [],
    pinned: Boolean(body.pinned)
  };
}

router.get(
  "/",
  asyncRoute(async (req, res) => {
    const notes = await Note.find(buildFilter(req.query)).sort({
      pinned: -1,
      updatedAt: -1
    });

    res.json({
      notes: notes.map(serializeNote),
      total: notes.length
    });
  })
);

router.get(
  "/:id",
  asyncRoute(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Note not found." });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json({ note: note.toJSON() });
  })
);

router.post(
  "/",
  asyncRoute(async (req, res) => {
    const note = await Note.create(normalizeBody(req.body));
    res.status(201).json({ note: note.toJSON() });
  })
);

router.put(
  "/:id",
  asyncRoute(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Note not found." });
    }

    const note = await Note.findByIdAndUpdate(req.params.id, normalizeBody(req.body), {
      new: true,
      runValidators: true
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json({ note: note.toJSON() });
  })
);

router.delete(
  "/:id",
  asyncRoute(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Note not found." });
    }

    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(204).send();
  })
);

module.exports = router;
