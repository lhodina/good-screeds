const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { User, Screed, UserNote, Author, Shelf, ScreedShelf } = db;
const { environment } = require('../config');
const { asyncHandler, csrfProtection, getShelfScreeds } = require('../utils');
const { requireAuth } = require('../auth');

const router = express.Router();


const shelfValidators = [
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Name')
];


router.get('/new', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    res.render('shelf-add', {
        csrfToken: req.csrfToken()
    });
}));


router.get('/:id', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const shelfId = parseInt(req.params.id, 10);

    const shelf = await Shelf.findByPk(shelfId, {
        include: {
            model: Screed,
            include: [{ model: UserNote }, { model: Author }]
        }
    });

    const shelfScreeds = getShelfScreeds(shelf);

    res.render('shelf', {
        shelf,
        shelfScreeds,
        csrfToken: req.csrfToken()
    });
}));


router.get('/:id/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const shelfId = parseInt(req.params.id, 10);

    const shelf = await Shelf.findByPk(shelfId, {
        include: {
            model: Screed,
            include: [{ model: UserNote }, { model: Author }]
        }
    });

    const shelfScreeds = getShelfScreeds(shelf);

    const allScreeds = await Screed.findAll();

    res.render('shelf-edit', {
        shelf,
        allScreeds,
        shelfScreeds,
        csrfToken: req.csrfToken()
    });
}));


router.post('/:id/edit', requireAuth, csrfProtection, shelfValidators, asyncHandler(async (req, res) => {
    const shelfId = parseInt(req.params.id, 10);
    const shelf = await Shelf.findByPk(shelfId);

    const {
        name,
        title
    } = req.body;

    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('shelf-edit', {
            errors,
            shelf,
            csrfToken: req.csrfToken()
        });
    } else {
        await shelf.update({
            name
        });

        const screed = await Screed.findOne({ where: { title } });

        await ScreedShelf.create({
            screedId: screed.id,
            shelfId: shelf.id
        });

        res.render('shelf-edit', {
            shelf,
            message: "Shelf updated successfully!",
            csrfToken: req.csrfToken()
        });
    }
}));


router.post('/', requireAuth, csrfProtection, shelfValidators, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { name } = req.body;
    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('shelf-add', {
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const shelf = await Shelf.create({
            name,
            userId
        });

        res.redirect(`/shelves/${shelf.id}/edit`);
    }
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
