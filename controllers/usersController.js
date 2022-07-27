const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const JWT_EXPIRATION_NUM = process.env.JWT_EXPIRATION_NUM;

//GET all /api/register
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.status(400);
        throw new Error('Users not found');
    } else {
        res.append('X-Total-Count', users.length);
        res.append('Access-Control-Expose-Headers', 'X-Total-Count');
        res.status(200).json(users.map(resource => ({...resource, id: resource._id })));
    }

})

//GET by id /api/register
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    } else {
        res.status(200).json(user);
    }
})

//SET register /api/auth
const setUser = asyncHandler(async (req, res) => {
    try {
        if (!req.body || !req.body.password) {
            res.status(400)
            throw new Error('Please add required fields')
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hash
            })
            res.status(200).json(user);
        }
    } catch (e) {
        if (e.code === 11000) {
            res.status(500);
            const exists = Object.keys(e.keyValue).toString();
            res.send({
                type: exists,
                message: `${exists} already exist`
            });
            throw new Error(`${exists} already exist`);
        }
    }
})

//PUT /api/auth/users/id
const changeUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updateUser);
})
//DELETE /api/auth/id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    await user.remove();
    res.status(200).json({ id: req.params.id });
})

//POST login /api/login
const login = asyncHandler(async (req, res) => {
    let errorMessage = {
        type: 'credentials',
        message: 'Invalid log in'
    };
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        res.status(400);
        res.send(errorMessage);
        // res.send('User not found');
        // throw new Error('User not found');
    } else {
        if (!req.body.password) {
            res.status(400);
            res.send('missing password');
            // throw new Error('missing password');
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            res.status(400);
            res.send(errorMessage);
            // throw new Error('Wrong password or username')
        }
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });
        console.log(JWT_EXPIRATION_NUM);
        const { password, isAdmin, ...rest } = user._doc;
        res.cookie("access_token", token, {
            // expiresIn: '10s',
            expires: new Date(Date.now() + parseInt(JWT_EXPIRATION_NUM)),
            httpOnly: false,
            //secure: NODE_ENV === 'production' ? true: false
        }).status(200).json({...rest});
    }
})

module.exports = {
    getUsers,
    getUser,
    setUser,
    changeUser,
    deleteUser,
    login
}