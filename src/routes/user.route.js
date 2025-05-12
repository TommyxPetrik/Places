const express = require("express");
const router = express.Router();
const userController = require("./../controllers/user.controller");

router.get("/getAll", userController.getAllUsersController);
router.get("/username/:username", userController.getUserByUsernameController);
router.get("/getUserVotes", userController.getUserVotesController);
router.get("/getJoinedSubplaces", userController.getJoinedSubplacesController);
router.get(
  "/getJoinedSublacesId",
  userController.getJoinedSubplacesIdController
);
router.post(
  "/uploadProfilePicture",
  userController.uploadProfilePictureController
);
router.delete(
  "/deleteProfilePicture",
  userController.deleteProfilePictureController
);
router.put("/changePasword", userController.changePassword);
router.put("/changeUsername/:id", userController.changeUsernameController);
router.get("/:id", userController.getUserController);
router.put("/update/:id", userController.updateUserController);
router.delete("/:id", userController.deleteUserController);

module.exports = router;
