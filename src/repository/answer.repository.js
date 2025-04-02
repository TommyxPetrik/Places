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

const getAnswerById = async (Qid, Aid) => {
    try {
        const answer = await answerModel.findOne({ _id: Aid, question: Qid }).populate('userid');
        return answer;
    } catch (error) {
        throw new Error('Chyba pri získavaní odpovede pre otázku: ' + error.message);
    }
};


const getAllAnswers = async () => {
    try {
        const answers = await answerModel.find().populate("userid").populate("question");
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

const deleteAnswer = async (id) => {
    try {
        await answerModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error('Chyba pri mazaní odpovede: ' + error.message);
    }
};

const acceptAnswer = async (answerId) => {
    try {
        const answer = await answerModel.findByIdAndUpdate(answerId, { accepted: true }, { new: true });
        return answer;
    } catch (error) {
        throw new Error('Chyba pri označovaní odpovede ako prijatú: ' + error.message);
    }
};

module.exports = {
    getAnswerById,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    acceptAnswer,
    getAllAnswers
};
