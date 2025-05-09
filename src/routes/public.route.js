const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user.controller");
const questionController = require("./../controllers/question.controller");
const subplaceController = require("./../controllers/subplace.controller");
const answerController = require("./../controllers/answer.controller");

router.post("/signUp", userController.createUserController);
router.post("/SignIn", userController.loginUserController);
router.get(
  "/getSuplacesQuestions/:id",
  questionController.getSubplacesQuestionsController
);
router.get(
  "/getSubplaceTags/:id",
  subplaceController.getSubplaceTagsController
);
router.get("/feed", questionController.homepageFeedController);
router.get("/getAllSubplaces", subplaceController.getAllSubplaces);
router.get("/subplacefeed", subplaceController.subplacesFeedController);
router.get("/getAllQuestions", questionController.getAll);
router.get("/filterQuestions", questionController.filterByTagsController);
router.get("/sortQuestions", questionController.sortQuestionsController);
router.get("/getSubplacesFeed", subplaceController.subplacesFeedController);
router.get("/subplace/:id", subplaceController.getSubplaceById);
router.get("/getAnswerTree/:id", answerController.getAnswerTreeController);
router.get("/questions/:id", questionController.getQuestionController);
router.post("/upvoteQuestion/:id", questionController.upvoteQuestionController);
router.post(
  "/downvoteQuestion/:id",
  questionController.downvoteQuestionController
);

module.exports = router;
