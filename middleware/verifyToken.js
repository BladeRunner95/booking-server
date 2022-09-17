const jwt = require('jsonwebtoken');

const {errorHandler} = require('./errorMiddleware');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) {
        res.status(400)
        res.send('You are not authenticated');
        throw new Error('You are not authenticated')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            throw new Error("Token is no valid")
        }
        req.user = user;
        next();
    })
}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, ()=> {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(400);
            throw new Error('You are not authorized');
        }
    })
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(422).send('You are not admin');
            // throw new Error('You are not admin');
        }
    })
}

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdmin
}