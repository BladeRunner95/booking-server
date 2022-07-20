const express = require('express');
const router = express.Router();

const {getLocations, getLocation, getLocationsNames, setLocation, changeLocation, deleteLocation} = require('../controllers/locationsController');
const {verifyAdmin} = require("../middleware/verifyToken");



router.route('/').get(getLocations).post(verifyAdmin, setLocation)
router.route('/byName/:title').get(getLocationsNames)
router.route('/:id').get(getLocation).put(verifyAdmin, changeLocation).delete(verifyAdmin, deleteLocation)


module.exports = router