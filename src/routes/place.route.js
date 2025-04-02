const express = require("express");
const router = express.Router();
const placeController = require("./../controllers/place.controller");

router.post('/create', placeController.createplace);
router.get('/getAll', placeController.getAllPlaces);
router.get('/name', placeController.getByNameController);
router.get('/:id', placeController.getplaceById);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deleteplace);


module.exports = router;
