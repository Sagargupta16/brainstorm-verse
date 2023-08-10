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
});

const Idea = mongoose.models.Idea || mongoose.model("Idea", ideaSchema);

export default Idea;
