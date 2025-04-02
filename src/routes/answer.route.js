const express = require("express");
const router = express.Router();
const answerController = require("./../controllers/answer.controller");

router.post('/create', answerController.createAnswerController);
router.get('/getAll', answerController.getAllAnswersController);
router.get('/:Qid/:Aid', answerController.getAnswersController);
router.put('/:id', answerController.updateAnswerController);
router.delete('/:id', answerController.deleteAnswerController);
router.put('/accept/:id', answerController.acceptAnswerController);

module.exports = router;
