const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

const getShelfScreeds = shelf => shelf.dataValues.Screeds.map(data => {
    const screed = data.dataValues;
    const authorName = screed.Author.dataValues.name;
    const userNoteId = screed.UserNotes[0].dataValues.id;
    const review = screed.UserNotes[0].dataValues.review;
    const readStatus = screed.UserNotes[0].dataValues.readStatus;

    const displayScreed = {
        id: screed.id,
        title: screed.title,
        authorId: screed.authorId,
        authorName,
        text: screed.text,
        url: screed.url,
        imgLink: screed.imgLink,
        userNoteId,
        review,
        readStatus
    }

    return displayScreed;
});


module.exports = {
    asyncHandler,
    csrfProtection,
    getShelfScreeds
 };
