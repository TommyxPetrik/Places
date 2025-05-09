const {
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTag,
  getAllQuestions,
  feed,
  homepageFeed,
  upvoteQuestion,
  downvoteQuestion,
} = require("../repository/question.repository");
const userRepository = require("../repository/user.repository");
const subplaceRepository = require("../repository/subplace.repository");
const questionRepository = require("../repository/question.repository");

const createQuestionController = async (req, res) => {
  try {
    if (!req.user || !req.user.userid) {
      return res.status(401).json({ message: "Neautorizovaný prístup" });
    }
    const newQuestion = {
      ...req.body,
      userid: req.user.userid,
      username: req.user.username,
    };
    const question = await createQuestion(newQuestion);
    await userRepository.updateUserKarma(req.user.userid);
    await subplaceRepository.updateQuestions(question.id, req.body.subplace);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const questions = await getAllQuestions();
    if (!questions || questions.length === 0) {
      return res.status(400).json("Neboli nájdene žiadne otázky");
    }
    res.status(200).json(questions);
  } catch (error) {
    console.error("Chyba pri získavaní otázok:", error.message);
    return res
      .status(500)
      .json({ message: "Chyba pri získavaní otázok " + error.message });
  }
};

const getQuestionByNameController = async (req, res) => {
  const questionTitle = req.query.title;
  if (!questionTitle) {
    return res.status(400).json("Názov otázky nie je zadaný");
  }
  try {
    const question = await questionRepository.getQuestionByTitle(questionTitle);
    if (!question) {
      return res.status(404).json("Otázka neexistuje");
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sortQuestionsController = async (req, res) => {
  try {
    const questions = await getAllQuestions();
    const order = req.query.order === "asc" ? 1 : -1;
    const sortBy = req.query.sort;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    switch (sortBy) {
      case "upvotes":
        questions.sort((a, b) => (a.upvotes - b.upvotes) * order);
        break;
      case "downvotes":
        questions.sort((a, b) => (a.downvotes - b.downvotes) * order);
        break;
      case "answerCount":
        questions.sort((a, b) => (a.answerCount - b.answerCount) * order);
        break;
      case "views":
        questions.sort((a, b) => (a.views - b.views) * order);
        break;
      case "createdAt":
        questions.sort(
          (a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * order
        );
        break;
      default:
        return res.status(400).json({ message: "Neplatný parameter 'sort'" });
    }
    const limitedQuestions = questions.slice(0, limit);
    return res.status(200).json(limitedQuestions);
  } catch (error) {
    console.error("Chyba pri získavaní otázok:", error.message);
    return res.status(500).json({ message: "Chyba pri získavaní otázok" });
  }
};

const getQuestionController = async (req, res) => {
  try {
    const question = await getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Otázka nenájdená" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateQuestionController = async (req, res) => {
  try {
    const question = await getQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Otázka nenájdená" });
    }
    const updatedQuestion = await updateQuestion(req.params.id, req.body);
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Otázka nenájdená" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteQuestionController = async (req, res) => {
  try {
    const id = req.params.id;
    if (id.length <= 6) {
      return res.status(400).json("ID otázky nebolo zadané");
    }
    await deleteQuestion(req.params.id);
    res.status(200).json({ message: "Otázka bola úspešne odstránená" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filterByTagsController = async (req, res) => {
  try {
    const tags = req.query.tags ? req.query.tags.split(",") : [];
    if (tags.length === 0) {
      return res.status(400).json({ message: "Musíte zadať aspoň jeden tag" });
    }
    const questions = await getAllQuestions();
    const filteredQuestions = questions.filter((question) =>
      tags.some((tag) => question.tags.includes(tag))
    );
    return res.status(200).json(filteredQuestions);
  } catch (error) {
    console.error("Chyba pri filtrovaní otázok podľa tagov:", error.message);
    return res.status(500).json({ message: "Chyba pri filtrovaní otázok" });
  }
};

const homepageFeedController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feed = await homepageFeed(skip, limit);

    res.status(200).json(feed);
  } catch (error) {
    return res.status(500).json({ message: "Chyba pri získavaní otázok" });
  }
};

const upvoteQuestionController = async (req, res) => {
  try {
    const voteChange = await userRepository.toggleQuestionUpvote(
      req.user.userid,
      req.params.id
    );

    const question = await questionRepository.upvoteQuestion(
      req.params.id,
      voteChange
    );

    return res.status(200).json(question);
  } catch (error) {
    return res.status(400).json({ message: "Chyba pri upvote otázky" });
  }
};

const downvoteQuestionController = async (req, res) => {
  try {
    const voteChange = await userRepository.toggleQuestionDownvote(
      req.user.userid,
      req.params.id
    );

    const question = await questionRepository.downvoteQuestion(
      req.params.id,
      voteChange
    );

    return res.status(200).json(question);
  } catch (error) {
    return res.status(400).json({ message: "Chyba pri downvote otázky" });
  }
};

const getSubplacesQuestionsController = async (req, res) => {
  try {
    const subplaceId = req.params.id;
    const questions = await questionRepository.getSubplacesQuestions(
      subplaceId
    );
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestionController,
  getQuestionController,
  updateQuestionController,
  deleteQuestionController,
  getAll,
  sortQuestionsController,
  filterByTagsController,
  homepageFeedController,
  upvoteQuestionController,
  downvoteQuestionController,
  getSubplacesQuestionsController,
  getQuestionByNameController,
};
