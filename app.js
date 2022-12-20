const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');

const { environment, sessionSecret } = require('./config');
const { restoreUser } = require('./auth');
const indexRouter = require('./routes/userHome');
const usersRouter = require('./routes/users');
const screedsRouter = require('./routes/screeds');
const shelvesRouter = require('./routes/shelves');
// const tagsRouter = require('./routes/tags');
// const authorsRouter = require('./routes/authors');


const app = express();

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'goodscreeds.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));


// This parses request data as a JSON object
// app.use(express.json());

// This parses request data as strings or arrays [i.e. for HTML form posts]
app.use(express.urlencoded( { extended: false }));
app.use(restoreUser);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/screeds', screedsRouter);
app.use('/shelves', shelvesRouter);
// app.use('/tags', tagsRouter);
// app.use('/authors', authorsRouter);


app.use((req, res, next) => {
    const err = new Error('The requested page couldn\'t be found.');
    err.status = 404;
    next(err);
  });


  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      // TODO Log the error to the database.
    } else {
      console.error(err);
    }
    next(err);
  });

  app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(404);
      res.render('page-not-found', {
        title: 'Page Not Found',
      });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = process.env.NODE_ENV === 'production';
    res.render('error', {
      title: 'Server Error',
      message: isProduction ? null : err.message,
      stack: isProduction ? null : err.stack,
    });
  });

module.exports = app;
