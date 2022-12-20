const express = require('express');
const { check, validationResult } = require('express-validator');
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');
const db = require('../db/models');
const { Shelf } = db;

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;
        const shelves = await Shelf.findAll({ where: { userId } });
        res.render('index', {
            shelves
        });
    } else {
        res.render('index');
    }
}));



module.exports = router;
