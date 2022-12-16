const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { User, Screed } = db;
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');

const router = express.Router();

router.get('/new', csrfProtection, asyncHandler(async (req, res) => {
    res.render('screed-add');
}));

module.exports = router;
