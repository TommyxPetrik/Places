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
    subplace: { type: mongoose.Schema.Types.ObjectId, ref: "Subplace", required: true },
    tags: [{ type: String }], 
}, { timestamps: true });

questionSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        const updatedQuestion = await mongoose.model("Question").findById(doc._id).populate("answers")
        const answersCount = updatedQuestion.answers.length;
        await updatedQuestion.updateOne({ answerCount: answersCount });
    }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
