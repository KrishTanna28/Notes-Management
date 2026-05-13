const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

function getUserById(id) {
  const user = users.find(u => u.id === Number(id));
  if(!user){
    return null;
  }
  return user;
}

app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.status(200).json({ total });
});

async function fetchExternalData() {
  return { message: "External data fetched successfully" };
}

app.get("/external-data", async (req, res) => {
  try {
    const data = await fetchExternalData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    return res.status(404).json({ message: "No notes found" });
  }
  res.status(200).json(notes);
});

function generateNoteId() {
  return Math.floor(Math.random() * 100000);
}

app.post("/notes", (req, res) => {
  const newId = generateNoteId();
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const userExists = users.some(u => u.id === Number(userId));

  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  const newNote = {
    id: newId,
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }
  notes.splice(noteIndex, 1);
  res.status(200).json({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  user.name = name;
  res.status(200).json(user);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ name: user.name });
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  if (isNaN(Number(a)) || isNaN(Number(b))) {
    return res.status(400).json({ message: "Invalid numbers" });
  }
  const total = Number(a) + Number(b);
  res.status(200).json({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});