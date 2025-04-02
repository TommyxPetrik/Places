const mongoose = require("mongoose");
const {Schema} = mongoose;


const answerSchema = new Schema({
    body: {type: String, min: 1, max: 150, required: true},
    userid: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    username: {type: String, required: true},
    question: {type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
 }, {timestamps: true});

const answer = mongoose.model("Answer", answerSchema);

module.exports = answer