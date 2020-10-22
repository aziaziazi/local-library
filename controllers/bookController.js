var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async')

// Display home page.
exports.index = function(req, res) {
  async.parallel({
    book_count: cb => Book.countDocuments({}, cb),
    book_instance_count: cb => BookInstance.countDocuments({}, cb),
    book_instance_available_count: cb => BookInstance.countDocuments({status: 'Available'}, cb),
    author_count: cb => Author.countDocuments({}, cb),
    genre_count: cb => Genre.countDocuments({}, cb)
  }, (err, results) => {
    res.render('index', {title: 'Local Library Home', error: err, data: results})
  })
}

// Display list of all Books.
exports.book_list = function(req, res, next) {
  Book
    .find({}, ['title', 'author'])
    .populate('author')
    .exec((err, book_list) => err
      ? next(err)
      : res.render('book_list', {title: 'Book List', book_list })
    )
};

// Display detail page for a specific Book.
exports.book_detail = function(req, res, next) {
  const bookID = req.params.id;

  async.parallel({
    book: cb => Book
      .findById(bookID)
      .populate('author')
      .populate('genre')
      .exec(cb),
    book_instances: cb => BookInstance
      .find({'book': bookID})
      .exec(cb),
  }, (err, {book, book_instances}) => {
    if (err) {
      return next(err)
    }
    if (book==null) {
      var err = new Error('Book not found')
      err.status = 404;
      return next(err)
    }

    res.render('book_detail', {title: 'Book Detail', book, book_instances})
  })
};

// Display Book create form on GET.
exports.book_create_get = function(req, res) {
res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle Book create on POST.
exports.book_create_post = function(req, res) {
res.send('NOT IMPLEMENTED: Book create POST');
};

// Display Book delete form on GET.
exports.book_delete_get = function(req, res) {
res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle Book delete on POST.
exports.book_delete_post = function(req, res) {
res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display Book update form on GET.
exports.book_update_get = function(req, res) {
res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle Book update on POST.
exports.book_update_post = function(req, res) {
res.send('NOT IMPLEMENTED: Book update POST');
};