const express = require('express');
const router = express.Router();

const {getLocations, getLocation, getLocationsNames, setLocation, changeLocation, deleteLocation} = require('../controllers/locationsController');


router.route('/').get(getLocations).post(setLocation)
router.route('/byName/:title').get(getLocationsNames)
router.route('/:id').get(getLocation).put(changeLocation).delete(deleteLocation)


module.exports = router