const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");

router.post('/create', questionController.createQuestionController);
router.get('/getAll', questionController.getAll);
router.get('/sort', questionController.sortQuestionsController);
router.get('/filter', questionController.filterByTagsController);
router.get('/:id', questionController.getQuestionController);
router.put('/:id', questionController.updateQuestionController);
router.delete('/:id', questionController.deleteQuestionController);


module.exports = router;
