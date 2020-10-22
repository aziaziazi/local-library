var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

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
res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function(req, res) {
res.send('NOT IMPLEMENTED: Genre create POST');
};

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