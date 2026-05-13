const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxlength: [120, "Title must be 120 characters or less."]
    },
    content: {
      type: String,
      trim: true,
      maxlength: [8000, "Content must be 8000 characters or less."],
      default: ""
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        [...new Set((tags || []).map((tag) => String(tag).trim().toLowerCase()))]
          .filter(Boolean)
          .slice(0, 6)
    },
    pinned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

noteSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Note", noteSchema);
