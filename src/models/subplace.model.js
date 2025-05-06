const mongoose = require("mongoose");

const subplaceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, maxlength: 300 },
  members: { type: Number, default: 0 },
  membersids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  questionsCount: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdAt: { type: Date, default: Date.now },
  rules: [{ type: String, required: true }],
  tags: [{ type: String, required: true }],
});

subplaceSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    const updatedSubplace = await mongoose
      .model("Subplace")
      .findById(doc._id)
      .populate("questions");
    const membersCount = updatedSubplace.membersids.length;
    const questionsCount = updatedSubplace.questions.length;
    await updatedSubplace.updateOne({
      members: membersCount,
      questionsCount: questionsCount,
    });
  }
});

const SubplaceModel = mongoose.model("Subplace", subplaceSchema);
module.exports = SubplaceModel;
