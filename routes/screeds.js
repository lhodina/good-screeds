const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { Screed, UserNote, Author, Shelf, ScreedShelf } = db;
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');

const router = express.Router();


const screedValidators = [
    check('title')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Title'),
    check('author')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Author'),
];


router.get('/new', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const authors = await Author.findAll();
    const shelves = await Shelf.findAll({ where: { userId } });

    res.render('screed-add', {
        authors,
        shelves,
        csrfToken: req.csrfToken()
    });
}));


router.post('/', csrfProtection, screedValidators, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;

    const {
        title,
        author,
        text,
        url,
        imgLink,
        review,
        readStatus,
        shelf
    } = req.body;

    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('screed-add', {
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        let authorId;
        const existingAuthor = await Author.findOne({ where: { name: author } });
        if (existingAuthor) {
            authorId = existingAuthor.id;
        } else {
            const newAuthor = await Author.create({
                name: author
            });
            authorId = newAuthor.id;
        }

        const screed = await Screed.create({
            userId,
            title,
            authorId,
            text,
            url,
            imgLink
        });

        if (review || readStatus) {
            await UserNote.create({
                userId,
                screedId: screed.id,
                review,
                readStatus
            });
        }

        let shelfId;
        const existingShelf = await Shelf.findOne( { where: { name: shelf, userId } });
        if (existingShelf) {
            shelfId = existingShelf.id;
        } else if (shelf) {
            const newShelf = await Shelf.create({
                name: shelf,
                userId
            });

            shelfId = newShelf.id;

            await ScreedShelf.create({
                screedId: screed.id,
                shelfId
            });
        }

        const allShelf = await Shelf.findOne({ where: { name: "All", userId }});

        await ScreedShelf.create({
            screedId: screed.id,
            shelfId: allShelf.id
        });

        res.redirect('/');
    }
}));


router.get('/:id/edit', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const screedId = parseInt(req.params.id, 10);
    const screed = await Screed.findByPk(screedId);

    const userNote = await UserNote.findOne({ where: {
        userId,
        screedId
    } });

    const author = await Author.findByPk(screed.authorId);
    const authors = await Author.findAll();
    const shelves = await Shelf.findAll( { where: userId });
    let review;
    let readStatus;
    if (userNote && userNote.review) {
        review = userNote.review;
    }

    if (userNote && userNote.readStatus !== null) {
        readStatus = userNote.readStatus;
    }

    res.render('screed-edit', {
        screed,
        userNote,
        title: screed.title,
        author,
        text: screed.text,
        url: screed.url,
        imgLink: screed.imgLink,
        authors,
        shelves,
        review,
        readStatus,
        csrfToken: req.csrfToken()
    });
}));


router.post('/:id/edit', csrfProtection, screedValidators, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const screedId = parseInt(req.params.id, 10);
    const screed = await Screed.findByPk(screedId);

    let {
        title,
        authorId,
        text,
        url,
        imgLink,
        review,
        readStatus,
        shelf
    } = req.body;

    const userNote = await UserNote.findOne({ where: {
        userId,
        screedId
    } });

    const author = await Author.findByPk(screed.authorId);
    const authors = await Author.findAll();
    const shelves = await Shelf.findAll( { where: userId });

    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        console.log("typeof readStatus:", typeof readStatus);
        if (readStatus === "0") readStatus = false;
        if (readStatus === "1") readStatus = true;

        res.render('screed-edit', {
            errors,
            screed,
            userNote,
            authors,
            shelves,
            title: screed.title,
            author,
            text: screed.text,
            url: screed.url,
            imgLink: screed.imgLink,
            review,
            readStatus,
            csrfToken: req.csrfToken()
        });
    } else {
        await screed.update({
            title,
            authorId,
            text,
            url,
            imgLink
        });

        if (review || readStatus) {
            await userNote.update({
                review,
                readStatus
            });
        }

        let shelfId;
        const existingShelf = await Shelf.findOne( { where: { name: shelf } });

        if (existingShelf) {
            shelfId = existingShelf.id;
        } else {
            const newShelf = await Shelf.create({
                name: shelf,
                userId
            });

            shelfId = newShelf.id;
        }

        await ScreedShelf.create({
            screedId: screed.id,
            shelfId
        });

        res.render('screed-edit', {
            message: "Screed updated!",
            screed,
            userNote,
            authors,
            shelves,
            csrfToken: req.csrfToken()
        });
    }
}));


module.exports = router;
