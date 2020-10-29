var async = require('async')
const {body, validationResult} = require("express-validator");

var Author = require('../models/author');
var Book = require('../models/book');


// Display list of all Authors.
exports.author_list = function(req, res, next) {
  Author
    .find()
    .sort([['family_name', 'ascending']])
    .exec((err, author_list) => {
      return err
        ? next(err)
        : res.render('author_list', {title: 'Author List', author_list});
      }
    )
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
  const author_id = req.params.id;

  async.parallel({
    author: cb => Author
      .findById(author_id)
      .exec(cb),
    author_books: cb => Book
      .find({'author': author_id}, ['title', 'summary'])
      .exec(cb)
  }, (err, {author, author_books}) => {
    if (err) {return next(err)}
    if (author == null) {
      var err = new Error('Author not found');
      err.status = 404;
      return next(err)
    }

    res.render('author_detail', {title: 'Author Detail', author, author_books})
  })
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
  res.render('author_form', {title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [
  body('first_name')
    .trim()
    .escape()
    .isLength({min: 1, max: 100})
    .withMessage('First name must be specified')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters'),
  body('family_name')
    .trim()
    .escape()
    .isLength({min: 1, max: 100})
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({checkFalsy: true})
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({checkFalsy: true})
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      })
      return
    } else {
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save((err) => {
        if (err) {return next(err);}

        res.redirect(author.url)
      })
    }
  }
]

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
res.send('NOT IMPLEMENTED: Author update POST');
};