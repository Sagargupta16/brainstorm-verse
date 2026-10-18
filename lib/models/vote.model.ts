import mongoose from "mongoose";

// One document per (idea, user) upvote. The unique index is what makes a
// double vote impossible, even when two clicks race each other: the second
// insert fails with a duplicate-key error instead of counting twice.
const voteSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Idea",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

voteSchema.index({ idea: 1, user: 1 }, { unique: true });
voteSchema.index({ user: 1, createdAt: -1 });

const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

export default Vote;
