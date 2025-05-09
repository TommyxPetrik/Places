const express = require("express");
const subplaceController = require("./../controllers/subplace.controller");

const router = express.Router();

router.post("/create", subplaceController.createSubplace);
router.get("/name", subplaceController.getByNameController);
router.put("/edit", subplaceController.updateSubplace);
router.post("/join/:subplaceId", subplaceController.joinSubplace);
router.post("/leave/:subplaceId", subplaceController.leaveSubplace);
router.post("/updateModerators", subplaceController.updateModerators);
router.post("/deleteModerator", subplaceController.deleteModerator);
router.delete("/leave", subplaceController.leaveSubplace);
router.delete("/:id", subplaceController.deleteSubplaceById);
router.put("/:id", subplaceController.updateSubplace);

module.exports = router;
