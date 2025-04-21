const express = require("express");
const router = express.Router();
const answerController = require("./../controllers/answer.controller");

router.post("/create", answerController.createAnswerController);
router.get("/getAnswerTree/:id", answerController.getAnswerTreeController);
router.get("/getAll", answerController.getAllAnswersController);
router.put("/upvote/:id", answerController.upvoteAnswerController);
router.put("/downvote/:id", answerController.downvoteAnswerController);
router.get("/:Qid/:Aid", answerController.getAnswersController);
router.put("/:id", answerController.updateAnswerController);
router.delete("/:id", answerController.deleteAnswerController);

module.exports = router;
