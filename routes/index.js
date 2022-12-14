const express = require('express');
const { check, validationResult } = require('express-validator');
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('layout', {
        title: 'Welcome',
        heading: 'Home'
    });
});



module.exports = router;
