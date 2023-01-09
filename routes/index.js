const express = require('express');
const { check, validationResult } = require('express-validator');
const { environment } = require('../config');
const { asyncHandler, csrfProtection, getShelfScreeds } = require('../utils');
const db = require('../db/models');
const { Shelf, Screed } = db;

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;
        const shelves = await Shelf.findAll({
            where: { userId },
            include: [{ model: Screed }]
         });

        console.log('* * * * * shelves: * * * * * ', shelves);

        const allScreeds = await Screed.findAll({ where: { userId }});

        const screeds = getShelfScreeds(allScreeds);


        res.render('index', {
            shelves,
            screeds
        });
    } else {
        res.render('index');
    }
}));


module.exports = router;
