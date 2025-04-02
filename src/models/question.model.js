const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, length: { min: 1, max: 150 }, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    answerCount: { type: Number, default: 0 }, 
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    subplace: { type: mongoose.Schema.Types.ObjectId, ref: "Subplace", required: true },
    tags: [{ type: String }], 
}, { timestamps: true });

questionSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const answersCount = doc.answers.length;
        await doc.updateOne({ answerCount: answersCount });
    }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
