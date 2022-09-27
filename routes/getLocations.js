const express = require('express');
const router = express.Router();

const {getLocations, getAllLocationsNames, getLocation, getLocationByName, setLocation, changeLocation, deleteLocation} = require('../controllers/locationsController');
const {verifyAdmin} = require("../middleware/verifyToken");



router.route('/').get(verifyAdmin, getLocations).post(verifyAdmin, setLocation)
router.route('/titles').get(getAllLocationsNames)
router.route('/byName/:title').post(getLocationByName)
router.route('/:id').get(getLocation).put(verifyAdmin, changeLocation).delete(verifyAdmin, deleteLocation)


module.exports = router