const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user.controller");

router.post('/signUp', userController.createUserController);
router.post("/SignIn", userController.loginUserController);

module.exports = router;