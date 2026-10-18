import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentID: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
    },
  ],
  // Denormalised count of Vote documents, kept in step with $inc so feeds
  // can sort by it without a join
  upvotes: {
    type: Number,
    default: 0,
  },
});

// Feed (top-level ideas newest first), "top" sort, and per-author profile tabs
ideaSchema.index({ parentID: 1, createdAt: -1 });
ideaSchema.index({ parentID: 1, upvotes: -1, createdAt: -1 });
ideaSchema.index({ author: 1, createdAt: -1 });

const Idea = mongoose.models.Idea || mongoose.model("Idea", ideaSchema);

export default Idea;
