const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');

const userRoute = Router();

userRoute.get('/', (req, res) => {
    res.send('Welcome to user page');
});

userRoute.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const userPresent = await UserModel.findOne({ email });

    if (userPresent?.email) {
        res.send({ 'msg': 'User is already present' });
    }
    else {
        try {
            bcrypt.hash(password, 8, async function (err, hash) {
                await UserModel.create({ email, password: hash });
                res.send({ 'msg': 'User has signed up' });
            })
        }
        catch (err) {
            console.log(err);
            res.send({ 'msg': 'something went wrong' });
        }
    }

})

userRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user?.email) {
            const hashed_password = user.password;

            bcrypt.compare(password, hashed_password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ userID: user._id }, 'hush');
                    res.send({ 'msg': 'user logged in', 'token': token });
                }
                else {
                    res.send({ 'msg': 'incorrect password' });
                }
            })
        }
        else {
            res.send({ 'msg': 'user not found' });
        }

    }
    catch (err) {
        console.log(err);
        res.send({ 'err': 'something went wrong' })
    }

})

module.exports = userRoute;