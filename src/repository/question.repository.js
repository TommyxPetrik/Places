const questionModel = require("../models/question.model");
const userModel = require("../models/user.model");

const getAllQuestions = async () => {
  try {
    const questions = await questionModel
      .find()
      .populate("answers", "body")
      .populate({
        path: "userid",
        populate: { path: "subplaces", select: "name" },
      })
      .populate("subplace", "name")
      .populate("answers", "body")
      .sort({ createdAt: -1 });
    return questions;
  } catch (error) {
    throw new Error("Chyba pri získavaní otkázky: " + error.message);
  }
};

const getQuestionById = async (id) => {
  try {
    const question = await questionModel
      .findById(id)
      .populate("userid")
      .populate({
        path: "subplace",
        populate: { path: "name", select: "name" },
      })
      .populate({
        path: "answers",
        model: "Answer",
      })
      .lean();
    return question;
  } catch (error) {
    throw new Error("Chyba pri získavaní otázky: " + error.message);
  }
};

const createQuestion = async (questionData) => {
  try {
    const question = new questionModel(questionData);
    await question.save();
    return question;
  } catch (error) {
    throw new Error("Chyba pri vytváraní otázky: " + error.message);
  }
};

const updateQuestion = async (id, questionData) => {
  try {
    console.log("ID:", id);
    console.log("QuestionData:", questionData);

    const question = await questionModel.findByIdAndUpdate(id, questionData, {
      new: true,
    });
    return question;
  } catch (error) {
    throw new Error("Chyba pri aktualizácii otázky: " + error.message);
  }
};

const deleteQuestion = async (questionId, answerId) => {
  try {
    await questionModel.findByIdAndUpdate(questionId, {
      $pull: { answers: answerId },
    });
  } catch (error) {
    throw new Error("Chyba pri mazaní otázky: " + error.message);
  }
};

const updateQuestionsAnswers = async (questionId, answerid) => {
  try {
    const question = await questionModel.findByIdAndUpdate(questionId, {
      $push: { answers: answerid },
    });
    if (!question) {
      throw new Error("Otázka nenájdená");
    }
  } catch (error) {
    throw new Error("Chyba pri aktualizácii otázky: " + error.message);
  }
};

const upvoteQuestion = async (questionId, value) => {
  try {
    const question = await questionModel
      .findByIdAndUpdate(
        questionId,
        { $inc: { upvotes: value } },
        { new: true }
      )
      .populate("subplace", "name")
      .populate({
        path: "userid",
        populate: { path: "subplaces", select: "name" },
      });
    if (!question) {
      throw new Error("Otázka neexistuje alebo bola odstránená.");
    }
    return question;
  } catch (error) {
    throw new Error("Chyba pri upvote otázky: " + error.message);
  }
};

const downvoteQuestion = async (questionId, value) => {
  try {
    const question = await questionModel
      .findByIdAndUpdate(
        questionId,
        { $inc: { upvotes: value } },
        { new: true }
      )
      .populate("subplace", "name")
      .populate({
        path: "userid",
        populate: { path: "subplaces", select: "name" },
      });
    return question;
  } catch (error) {
    throw new Error("Chyba pri downvote otázky: " + error.message);
  }
};

const homepageFeed = async () => {
  try {
    const questions = await questionModel
      .find()
      .populate("answers", "body")
      .populate({
        path: "userid",
        populate: { path: "subplaces", select: "name" },
      })
      .populate("subplace", "name")
      .populate("answers", "body");
    const questionsFeed = questions.sort(() => Math.random() - 0.5);

    return questionsFeed;
  } catch (error) {
    throw new Error("Chyba pri získavaní otázok: " + error.message);
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
  homepageFeed,
};
