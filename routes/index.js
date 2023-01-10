const express = require('express');
const { check, validationResult } = require('express-validator');
const { environment } = require('../config');
const { asyncHandler, csrfProtection, getShelfScreeds } = require('../utils');
const db = require('../db/models');
const { Shelf, Screed, Author, UserNote } = db;

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;
        const shelves = await Shelf.findAll({
            where: { userId },
            include: {
                model: Screed,
                include: [{ model: UserNote }, { model: Author }]
            }
        });

        const allShelf = shelves[0];

        const allShelfScreeds = getShelfScreeds(allShelf);

        res.render('index', {
            shelves,
            allShelfScreeds
        });
    } else {
        res.render('index');
    }
}));


module.exports = router;
