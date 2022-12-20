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

    console.log('userId:', userId);

    console.log('req.body:', req.body)

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

    const screedShelf = await ScreedShelf.create({
        screedId: screed.id,
        shelfId
    });

    res.redirect('/');
}));


module.exports = router;
