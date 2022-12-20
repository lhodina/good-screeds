const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { User, Screed, UserNote, Author, Shelf, ScreedShelf } = db;
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');
const { requireAuth } = require('../auth');

const router = express.Router();


router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const shelves = Shelf.findAll({ where: userId });
    res.render('shelf-add', {
        shelves,
        csrfToken: req.csrfToken()
    });
}));


router.get('/:id/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const shelfId = parseInt(req.params.id, 10);

    const shelf = await Shelf.findByPk(shelfId, {
        include: {
            model: Screed
        }
    });

    const shelfScreeds = shelf.dataValues.Screeds.map(data => {
        return data.dataValues;
    });

    console.log('shelfScreeds:', shelfScreeds);

    console.log('shelf:', shelf);

    const allScreeds = await Screed.findAll();

    res.render('shelf-edit', {
        shelf,
        allScreeds,
        shelfScreeds,
        csrfToken: req.csrfToken()
    });
}));


router.post('/:id/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    console.log("req.body:", req.body);
    const shelfId = parseInt(req.params.id, 10);
    console.log("shelfId:", shelfId);
    const shelf = await Shelf.findByPk(shelfId);

    const {
        name,
        title
    } = req.body;

    await shelf.update({
        name
    });

    const screed = await Screed.findOne({ where: { title } });
    console.log("screed:", screed);

    await ScreedShelf.create({
        screedId: screed.id,
        shelfId: shelf.id
    });

    res.render('shelf-edit', {
        shelf,
        message: "Shelf updated successfully!",
        csrfToken: req.csrfToken()
    });
}));


router.post('/', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { name } = req.body;
    const shelf = await Shelf.create({
        name,
        userId
    });

    res.redirect(`/shelves/${shelf.id}/edit`);
}));


router.get(`/:id/screeds/new`, csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const shelfId = parseInt(req.params.id, 10);
    const shelf = await Shelf.findByPk(shelfId);
    const authors = await Author.findAll();
    
    res.render('screed-add', {
        authors,
        shelf,
        csrfToken: req.csrfToken()
    });
}));



module.exports = router;
