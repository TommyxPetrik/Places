const {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  getAllAnswers,
} = require("./../repository/answer.repository");
const { getAll } = require("./question.controller");
const answerRepository = require("./../repository/answer.repository");
const questionRepository = require("./../repository/question.repository");
const userRepository = require("../../src/repository/user.repository");

const createAnswerController = async (req, res) => {
  try {
    const newAnswer = {
      ...req.body,
      userid: req.user.userid,
      username: req.user.username,
    };
    const answer = await createAnswer(newAnswer);
    await userRepository.updateUserKarma(req.user.userid);
    await questionRepository.updateQuestionsAnswers(
      req.body.question,
      answer.id
    );
    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllAnswersController = async (req, res) => {
  try {
    const answers = await getAllAnswers();
    if (!answers || answers.length === 0) {
      return res.status(400).json("Neboli nájdené žiadne odpovede");
    }
    res.status(201).json(answers);
  } catch (error) {
    console.error("Chyba pri získavaní odpovedí:", error.message);
    res.status(500).json({ message: "Chyba pri získavaní odpovedí" });
  }
};

const getAnswersController = async (req, res) => {
  try {
    const answer = await getAnswersById(req.params.Qid, req.params.Aid);
    if (!answer) {
      return res
        .status(404)
        .json({ message: "Odpoveď nebola nájdená pre danú otázku" });
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
      return res.status(404).json({ message: "Odpoveď nenájdená" });
    }
    res.status(200).json(updatedAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAnswerController = async (req, res) => {
  try {
    const answer = await answerRepository.getAnswerById(req.params.id);
    if (!answer) {
      return res.status(400).json("Odpoveď nebola nájdená");
    }
    await deleteAnswer(req.params.id);
    await questionRepository.deleteQuestion(answer.question, req.params.id);
    res.status(200).json({ message: "Odpoveď bola úspešne odstránená" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAnswerTreeController = async (req, res) => {
  try {
    const question = await questionRepository.getQuestionById(req.params.id);
    const answers = question.answers;
    const answerTree = await answerRepository.buildAnswerTreeRecursive(answers);
    return res.status(200).json(answerTree);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAnswerController,
  getAnswersController,
  updateAnswerController,
  deleteAnswerController,
  getAllAnswersController,
  getAnswerTreeController,
};
