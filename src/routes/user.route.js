const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user.controller");

router.get("/getAll", userController.getAllUsersController);
router.get('/:id', userController.getUserController);
router.get('/username/:username', userController.getUserByUsernameController);
router.put('/:id', userController.updateUserController);
router.delete('/:id', userController.deleteUserController);


module.exports = router;
