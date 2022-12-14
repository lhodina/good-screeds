const db = require('./db/models');
const { User } = db;


const loginUser = (req, res, user) => {
    req.session.auth = { userId: user.id };
};


const logoutUser = (req, res) => delete req.session.auth;


const restoreUser = async (req, res, next) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await User.findByPk(userId);
            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                next();
            }
        } catch (err) {
            res.locals.authenticated = false;
            next(err);
        }
    } else {
        res.locals.authenticated = false;
        next();
    }
};


const requireAuth = (req, res, next) => {
    if (res.locals.authenticated === false) {
        return res.redirect('/users/login');
    }
    return next();
};


module.exports = {
    loginUser,
    logoutUser,
    restoreUser,
    requireAuth
};
