const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerSchema = new Schema(
    {
        body: { type: String, required: true, minlength: 1, maxlength: 150 },
        userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
        parentAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", default: null },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
        upvotes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

answerSchema.post("save", async function (doc) {
    if (doc.parentAnswer) {
        await mongoose.model("Answer").findByIdAndUpdate(
            doc.parentAnswer,
            { $push: { replies: doc._id } },
            { new: true }
        );
    }
});

const AnswerModel = mongoose.model("Answer", answerSchema);
module.exports = AnswerModel;
