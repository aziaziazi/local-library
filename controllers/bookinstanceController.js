const { body,validationResult } = require('express-validator');

var Bookinstance = require('../models/bookinstance');
var Book = require('../models/book');

// Display list of all Bookinstances.
exports.bookinstance_list = function(req, res, next) {
  Bookinstance
    .find()
    .populate('book')
    .exec((err, bookinstance_list) => err
      ? next(err)
      : res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list})
    )
};

// Display detail page for a specific Bookinstance.
exports.bookinstance_detail = function(req, res, next) {
  Bookinstance
    .findById(req.params.id)
    .populate('book')
    .exec((err, book_instance) => {
      if (err) {return next(err)}
      if (book_instance == null) {
        var err = new Error('Book copy not found')
        err.code = 404;
        return next(err);
      }
      
      console.log('book_instance =>', book_instance)

      res.render('bookinstance_detail', {title: 'Copy: ' + book_instance.book.title, book_instance})
    })
};

// Display Bookinstance create form on GET.
exports.bookinstance_create_get = function(req, res) {
  Book
    .find({}, 'title')
    .exec((err, books) => {
      if (err) {return next(err)}
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books})
    })
};

// Handle Bookinstance create on POST.
exports.bookinstance_create_post = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
  body('status').escape(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = new Bookinstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    })

    if (!errors.isEmpty()) {
      Book
        .find({}, 'title')
        .exec((err, books) => {
          if (err) {return next(err)}
          res.render('bookinstance_form', {
            title: 'Create BookInstance',
            book_list: books,
            selected_book: bookinstance.book._id,
            errors: errors.array(),
            bookinstance
          });
        })
        return
    } else {
      bookinstance.save((err) => {
        if (err) {return next(err)}

        res.redirect(bookinstance.url)
      })
    }
  }
];

// Display Bookinstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
res.send('NOT IMPLEMENTED: Bookinstance delete GET');
};

// Handle Bookinstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
res.send('NOT IMPLEMENTED: Bookinstance delete POST');
};

// Display Bookinstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
res.send('NOT IMPLEMENTED: Bookinstance update GET');
};

// Handle Bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
res.send('NOT IMPLEMENTED: Bookinstance update POST');
};