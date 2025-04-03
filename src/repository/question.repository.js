const questionModel = require("../models/question.model");
const userModel = require("../models/user.model");

const getAllQuestions = async() => {
    try {
        const questions = await questionModel.find().populate("answers","body").populate({path: "userid", populate: { path: "subplaces", select: "name" }});
        return questions;
    } catch (error) {
        throw new Error("Chyba pri získavaní otkázky: " + error.message);
    }
};

const getQuestionById = async (id) => {
    try {
        const question = await questionModel.findById(id).populate('userid').populate('answers');
        return question;
    } catch (error) {
        throw new Error('Chyba pri získavaní otázky: ' + error.message);
    }
};

const createQuestion = async (questionData) => {
    try {
        const question = new questionModel(questionData);
        await question.save();
        return question;
    } catch (error) {
        throw new Error('Chyba pri vytváraní otázky: ' + error.message);
    }
};

const updateQuestion = async (id, questionData) => {
    try {
        const question = await questionModel.findByIdAndUpdate(id, questionData, { new: true });
        return question;
    } catch (error) {
        throw new Error('Chyba pri aktualizácii otázky: ' + error.message);
    }
};

const deleteQuestion = async (questionId, answerId) => {
    try {
        await questionModel.findByIdAndUpdate(questionId, {$pull: {answers: answerId}});
    } catch (error) {
        throw new Error('Chyba pri mazaní otázky: ' + error.message);
    }
};

const updateQuestionsAnswers = async (questionId, answerid) => {
    try {
        const question = await questionModel.findByIdAndUpdate(questionId, {$push: {answers: answerid}});
        if (!question) {
            throw new Error('Otázka nenájdená');
        }
    } catch (error) {
        throw new Error('Chyba pri aktualizácii otázky: ' + error.message);
    }
};

const upvoteQuestion = async (questionId) => {
    try {
        const question = await questionModel.findByIdAndUpdate(questionId, { $inc: { upvotes: 1 } }, { new: true });
        if (!question) {
            throw new Error('Otázka neexistuje alebo bola odstránená.');
        }
    } catch (error) {
        throw new Error('Chyba pri upvote otázky: ' + error.message);
        
    }
};

const downvoteQuestion = async (questionId) => {
    try {
        const question = await questionModel.findByIdAndUpdate(questionId, { $inc: { upvotes: -1 } }, { new: true });
    } catch (error) {
        throw new Error('Chyba pri downvote otázky: ' + error.message);
        
    }
};


module.exports = {
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getAllQuestions,
    updateQuestionsAnswers,
    upvoteQuestion,
    downvoteQuestion,

};
