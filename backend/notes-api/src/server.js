require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const Note = require("./models/Note");
const notesRouter = require("./routes/notes");

const app = express();
const port = Number(process.env.PORT) || 4000;
const frontendDist = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "frontend",
  "notes-ui",
  "dist"
);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "notes-api" });
});

app.use("/api/notes", notesRouter);

app.use(express.static(frontendDist));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.fromEntries(
      Object.entries(err.errors).map(([field, value]) => [field, value.message])
    );
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  console.error(err);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

connectDB()
  .then(async () => {
    await Note.init();
    app.listen(port, () => {
      console.log(`Notes API running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
