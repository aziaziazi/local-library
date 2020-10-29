var async = require('async');
const {body, validationResult} = require("express-validator");

var Genre = require('../models/genre');
var Book = require('../models/book');

// Display list of all Genres.
exports.genre_list = function(req, res, next) {
  Genre
    .find()
    .sort([['name', 'ascending']])
    .exec((err, genre_list) => {
        return err
          ? next(err)
          : res.render('genre_list', {title: 'Genre List', genre_list});
      }
    )
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
  const genreID = req.params.id;

  async.parallel({
    genre: cb => Genre.findById(genreID).exec(cb),
    genre_books: cb => Book.find({'genre': genreID}).exec(cb),
  }, (err, {genre, genre_books}) => {
    if (err) {
      return next(err)
    }
    if (genre==null) {
      var err = new Error('Genre not found')
      err.status = 404;
      return next(err)
    }
    res.render('genre_detail', {title: 'Genre Detail', genre, genre_books})
  })
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
  res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body('name', 'Genre name required')
    .trim()
    .isLength({min: 1})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var genre = new Genre({name: req.body.name})

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Create Genre',
        genre,
        errors: errors.array()
      });
      return;
    }
    else {
      Genre
        .findOne({'name': req.body.name})
        .exec((err, found_genre) => {
          if (err) {return next(err)}

          if (found_genre) {
            res.redirect(found_genre.url)
          }
          else {
            genre.save((err) => {
              if (err) {return next(err)}

              res.redirect(genre.url)
            })
          }
        })
    }
  }
]

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
res.send('NOT IMPLEMENTED: Genre update POST');
};