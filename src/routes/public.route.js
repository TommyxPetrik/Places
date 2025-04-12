const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user.controller");
const questionController = require("./../controllers/question.controller");
const subplaceController = require("./../controllers/subplace.controller");

router.post("/signUp", userController.createUserController);
router.post("/SignIn", userController.loginUserController);
router.get("/feed", questionController.homepageFeedController);
router.get("/getAllQuestions", questionController.getAll);
router.get("/filterQuestions", questionController.filterByTagsController);
router.get("/sortQuestions", questionController.sortQuestionsController);
router.get("/getSubplacesFeed", subplaceController.subplacesFeedController);
router.get("/questions/:id", questionController.getQuestionController);

module.exports = router;
