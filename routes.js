const express = require('express');
const { check, validationResult } = require('express-validator');

const { asyncHandler, csrfProtection } = require('./utils');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('layout', {
        title: 'Welcome',
        heading: 'Home'
    });
});


router.get('/schedule', (req, res) => {
    res.send('Schedule');
});


router.get('/roster', (req, res) => {
    res.send('Roster');
});

module.exports = router;
