const express = require('express');
const router = express.Router();
const {getUsers, getUser, setUser, changeUser, deleteUser, login} = require('../controllers/usersController');
const {verifyToken, verifyUser, verifyAdmin} = require("../middleware/verifyToken");


router.route('/users').get(getUsers).post(setUser)
router.route('/users/:id').get(verifyUser, getUser).put(verifyUser, changeUser).delete(verifyUser, deleteUser)
router.route('/login').post(login)
router.route('/checkauthentication').get(verifyToken, (req, res, next) => {
    res.send('You are authenticated')
})
router.route('/checkuser/:id').get(verifyUser, (req, res, next) => {
    res.send('You can delete account')
})
router.route('/checkadmin/:id').get(verifyAdmin, (req, res, next) => {
    res.send('Hello admin, You can delete account')
})


module.exports = router