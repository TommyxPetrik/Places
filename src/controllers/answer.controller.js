const { createAnswer, getAnswersByQuestionId, updateAnswer, deleteAnswer, acceptAnswer, getAllAnswers } = require("./../repository/answer.repository");
const { getAll } = require("./question.controller");
const questionRepository = require("./../repository/question.repository");
const userRepository = require("../../src/repository/user.repository");

const createAnswerController = async (req, res) => {
    try {
        const answer = await createAnswer(req.body);
        await userRepository.updateUserKarma(req.query.userid)
        await questionRepository.updateQestions(req.body.question, answer.id, req.query.userid);
        res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllAnswersController = async (req, res) => {
    try {
        const answers = await getAllAnswers();
        res.status(201).json(answers)
    } catch (error) {
        console.error('Chyba pri získavaní odpovedí:', error.message);
        res.status(500).json({ message: "Chyba pri získavaní odpovedí" })
    }
};

const getAnswersController = async (req, res) => {
    try {
        const answer = await getAnswersById(req.params.Qid, req.params.Aid);
        if (!answer) {
            return res.status(404).json({ message: "Odpoveď nebola nájdená pre danú otázku" });
        }
        res.status(200).json(answer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateAnswerController = async (req, res) => {
    try {
        const updatedAnswer = await updateAnswer(req.params.id, req.body);
        if (!updatedAnswer) {
            return res.status(404).json({ message: 'Odpoveď nenájdená' });
        }
        res.status(200).json(updatedAnswer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAnswerController = async (req, res) => {
    try {
        await deleteAnswer(req.params.id);
        res.status(200).json({ message: 'Odpoveď bola úspešne odstránená' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const acceptAnswerController = async (req, res) => {
    try {
        const acceptedAnswer = await acceptAnswer(req.params.id);
        res.status(200).json(acceptedAnswer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createAnswerController,
    getAnswersController,
    updateAnswerController,
    deleteAnswerController,
    acceptAnswerController,
    getAllAnswersController
};
