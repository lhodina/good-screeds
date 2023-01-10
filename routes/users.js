const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { User, Shelf } = db;
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');
const { loginUser, logoutUser } = require('../auth');

const router = express.Router();


const userValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a username')
        .isLength({ max: 50 })
        .withMessage('Username can\'t be more than 50 characters'),
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .isLength({ max: 255 })
        .withMessage('Email can\'t be more than 255 characters')
        .custom((value) => {
            return User.findOne({ where: { email: value } })
                .then((user) => {
                    if (user) {
                        return Promise.reject('Email already in use')
                    }
                });
        }),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a password')
        .isLength({ max: 50 })
        .withMessage('Password can\'t be more than 50 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    check('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('Please confirm password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match')
            }
            return true;
        })
];


const loginValidators = [
    check('email')
        .exists({ checkFalsy: true }),
    check('password')
        .exists({ checkFalsy: true })
];



router.get('/register', csrfProtection, asyncHandler(async (req, res) => {
    const user = User.build();
    res.render('user-register', {
        title: 'Register',
        user,
        csrfToken: req.csrfToken()
    });
}));


router.post('/register', csrfProtection, userValidators, asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    const user = User.build({
        username,
        email
    });

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();
        loginUser(req, res, user);

        await Shelf.create({
            name: "All",
            userId: user.id
        });

        await Shelf.create({
            name: "Read",
            userId: user.id
        });

        await Shelf.create({
            name: "Unread",
            userId: user.id
        });



        res.redirect('/');
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('user-register', {
            title: 'Register',
            user,
            errors,
            csrfToken: req.csrfToken()
        });
    }
}));


router.get('/login', csrfProtection, (req, res) => {
    res.render('user-login', {
        title: 'Login',
        csrfToken: req.csrfToken()
    });
});


router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let errors = [];

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        const user = await User.findOne({ where: { email }});

        if (user !== null) {
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
            if (passwordMatch) {
                loginUser(req, res, user);
                return res.redirect('/');
            }
        }

        errors.push('Login failed for the provided email and password');
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('user-login', {
        title: 'Login',
        emailAddress,
        errors,
        csrfToken: req.csrfToken()
    });
}));


router.post('/logout', (req, res) => {
    logoutUser(req, res);
    res.redirect('/users/login');
})


module.exports = router;
