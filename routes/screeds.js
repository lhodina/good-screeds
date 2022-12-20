const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { User, Screed, UserNote, Author, Shelf, ScreedShelf } = db;
const { environment } = require('../config');
const { asyncHandler, csrfProtection } = require('../utils');

const router = express.Router();


router.get('/new', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const authors = await Author.findAll();
    const shelves = await Shelf.findAll( { where: userId });
    res.render('screed-add', {
        authors,
        shelves,
        csrfToken: req.csrfToken()
    });
}));


router.post('/', csrfProtection, asyncHandler(async (req, res) => {
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

    res.redirect('/');
}));


router.get('/:id/edit', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const screedId = parseInt(req.params.id, 10);
    const screed = await Screed.findByPk(screedId);
    console.log("screed:", screed);

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

    console.log("readStatus:", readStatus);

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


router.post('/:id/edit', csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const screedId = parseInt(req.params.id, 10);
    const screed = await Screed.findByPk(screedId);

    const userNote = await UserNote.findOne({ where: {
        userId,
        screedId
    } });

    const {
        title,
        authorId,
        text,
        url,
        imgLink,
        review,
        readStatus,
        shelf
    } = req.body;

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

    const authors = await Author.findAll();
    const shelves = await Shelf.findAll( { where: userId });

    res.render('screed-edit', {
        message: "Screed updated!",
        screed,
        userNote,
        authors,
        shelves,
        csrfToken: req.csrfToken()
    });
}));


module.exports = router;
