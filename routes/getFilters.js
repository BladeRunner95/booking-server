const express = require('express');
const router = express.Router();
const {getFilters, setFilters, changeFilters, deleteFilters} = require('../controllers/filtersController');


router.route('/').get(getFilters).post(setFilters)
router.route('/:id').put(changeFilters).delete(deleteFilters)


module.exports = router