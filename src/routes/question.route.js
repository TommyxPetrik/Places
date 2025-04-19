const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");

router.post("/create", questionController.createQuestionController);
router.get("/:id", questionController.getQuestionController);
router.put("/:id", questionController.updateQuestionController);
router.put("/upvote/:id", questionController.upvoteQuestionController);
router.put("/downvote/:id", questionController.downvoteQuestionController);
router.delete("/:id", questionController.deleteQuestionController);

module.exports = router;
