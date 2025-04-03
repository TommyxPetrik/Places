const answerModel = require("./../models/answer.model");

const createAnswer = async (answerData) => {
    try {
        const answer = new answerModel(answerData);
        await answer.save();
        return answer;
    } catch (error) {
        throw new Error('Chyba pri vytváraní odpovede: ' + error.message);
    }
};

const getAnswerById = async (answerId) => {
    try {
        const answer = await answerModel.findById(answerId).populate('userid',"name");
        return answer;
    } catch (error) {
        throw new Error('Chyba pri získavaní odpovede pre otázku: ' + error.message);
    }
};


const getAllAnswers = async () => {
    try {
        const answers = await answerModel.find().populate("userid").populate("question", "title").populate({path: "userid", populate: { path: "subplaces", select: "name" }});
        return answers;
    } catch (error) {
        throw new Error("Chyba pri získavaní odpovede: " + error.message);
    }
};

const updateAnswer = async (id, answerData) => {
    try {
        const answer = await answerModel.findByIdAndUpdate(id, answerData, { new: true });
        return answer;
    } catch (error) {
        throw new Error('Chyba pri aktualizácii odpovede: ' + error.message);
    }
};

const deleteAnswer = async (answerId) => {
    try {
        const deleted = await answerModel.findByIdAndDelete(answerId);
        return true;
    } catch (error) {
        throw new Error('Chyba pri mazaní odpovede: ' + error.message);
    }
};

module.exports = {
    getAnswerById,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    getAllAnswers
};
