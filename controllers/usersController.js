const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const User = require('../models/userModel');
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const JWT_EXPIRATION_NUM = process.env.JWT_EXPIRATION_NUM;
const EXPIRATION_REMEMBER = process.env.JWT_EXPIRATION_REM;
const {responseHandler} = require('../middleware/responseMiddleware');
const AccessHash = require('../models/accessHashModel');
const {sendResetPasswordEmail, sendConfirmationEmail}= require('../mailer');

//GET all /api/register
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) {
        res.status(400);
        throw new Error('Users not found');
    } else {
        responseHandler(res, users, true);
    }

})

//GET by id /api/register
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    } else {
        responseHandler(res, user);
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
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400);
            throw new Error('User not found');
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        responseHandler(res, updateUser);
    } catch (e) {
        // res.send(e);
        console.log('user updating error')
    }
})
//DELETE /api/auth/id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    await user.remove();
    res.status(200).json({id: req.params.id});
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
    } else {
        if (!req.body.password) {
            res.status(400);
            res.send('missing password');
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            res.status(400);
            res.send(errorMessage);
        }
        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {
            expiresIn: req.body.remember ? EXPIRATION_REMEMBER : JWT_EXPIRATION_NUM,
        });
        const {password, isAdmin, ...rest} = user._doc;
        res.cookie("access_token", token, {
            // expiresIn: '10s',
            expires: new Date(Date.now() + parseInt(req.body.remember ? EXPIRATION_REMEMBER : JWT_EXPIRATION_NUM)),
            httpOnly: false,
            //secure: NODE_ENV === 'production' ? true: false
        }).status(200).json({...rest});
    }
})


const forgotPas = asyncHandler(async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user || user.length < 1) {
            return res.status(422).send('User not found');
        }
        const hasHash = await AccessHash.find({userId: user._id});
        if (hasHash && hasHash.length> 0) {
            return res.status(422).send("Email to reset password already sent");
        }
        const hash = await AccessHash.create({userId: user._id});
        // await AccessHash.createIndexes({"createdAt": 1}, { expireAfterSeconds: 10 });
        await sendResetPasswordEmail({toUser: user, hash: hash._id});
        return res.status(200).json({message: 'Please check your email to reset the password!'});
    } catch (e) {
        return res.status(422).send('Something went wrong');
    }
})

const resetPas = asyncHandler(async (req, res) => {
    try {
        const {password} = req.body;
        const {hash} = req.params;
        const aHash = await AccessHash.findOne({_id: hash});
        if (!aHash || !aHash.userId) {
            return res.status(422).send("Can't reset a password");
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPas = bcrypt.hashSync(password, salt);
        // const user = await User.findById(aHash.userId);
        // if (!user || user.length <0) {
        //     return res.status(422).send("Can't reset a password.");
        // }
        // if (user.password === hashPas) {
        //     return res.status(422).send("New password cannot be the same");
        // }
        const updatePassword = await User.findByIdAndUpdate(aHash.userId, { password: hashPas }, {
            new: true,
        });
        await aHash.remove();

        try {
            const token = jwt.sign({id: updatePassword._id, isAdmin: updatePassword.isAdmin},
                process.env.JWT_SECRET, {
                    expiresIn: JWT_EXPIRATION_NUM
                });
            const {password, isAdmin, ...rest} = updatePassword._doc;
            res.cookie("access_token", token, {
                expires: new Date(Date.now() + parseInt(JWT_EXPIRATION_NUM)),
                httpOnly: false,
                //secure: NODE_ENV === 'production' ? true: false
            }).status(200).json({...rest});
            // responseHandler(res, {...rest});
        } catch (e) {
            res.status(422).send('something went wrong in the log in process');
        }
    } catch (e) {
        res.send('User updating error');
    }
});

const getReset = asyncHandler(async (req, res) => {
    try {
        const hasHash = await AccessHash.findOne({_id: req.params.hash});
        if (!hasHash) {
            return res.status(400).send('Not found');
        }
        responseHandler(res, hasHash);
    } catch (e) {
        return res.status(400).send('Not found');
    }
});

module.exports = {
    getUsers,
    getUser,
    setUser,
    changeUser,
    deleteUser,
    login,
    forgotPas,
    resetPas,
    getReset
}