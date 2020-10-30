var async = require('async')
const { body,validationResult } = require('express-validator');

var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');


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
  async.parallel({
    authors: cb => Author.find(cb),
    genres: cb => Genre.find(cb),
  }, (err, {authors, genres}) => {
    if (err) {return next(err)}
    res.render('book_form', {title: 'Create Book', authors, genres})
  })
};

// Handle Book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre === 'undefined') {
        req.body.genre = []
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body('title', 'Title must not e empty')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('author', 'Author must not e empty')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('summary', 'Summary must not e empty')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('isbn', 'ISBN must not e empty')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('genre.*')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)

    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    })

    if (!errors.isEmpty()) {
      async.parallel({
        authors: cb => Author.find(cb),
        genres: cb => Genre.find(cb),
      }, (err, {authors, genres}) => {
        if (err) {return next(err)}

        for (let i = 0; i < genres.length; i++) {
          if (book.genre.indexOf(genres[i]._id) > -1) {
            genres[i].checked='true';
          }
        }

        res.render('book_form', {
          title: 'Create Book',
          authors,
          genres,
          book,
          errors: errors.array()
        });
      })
      return;
    }
    else {
      book.save((err) => {
        if (err) {return next(err)}

        res.redirect(book.url)
      })
    }
  }
]

// Display Book delete form on GET.
exports.book_delete_get = function(req, res) {
res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle Book delete on POST.
exports.book_delete_post = function(req, res) {
res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display Book update form on GET.
exports.book_update_get = function(req, res, next) {
 async.parallel({
   book: cb => Book
     .findById(req.params.id)
     .populate('author')
     .populate('genre')
     .exec(cb),
   authors: cb => Author.find(cb),
   genres: cb => Genre.find(cb)
 }, (err, {book, authors, genres}) => {
   if (err) {return next(err)}
   if (book ==null) {
     var err = new Error('Book not found');
     err.status = 404
     return next(err);
   }
   for (var all_g_iter = 0; all_g_iter < genres.length; all_g_iter++) {
     for (var book_g_iter = 0; book_g_iter < book.genre.length; book_g_iter++) {
       if (genres[all_g_iter]._id.toString()===book.genre[book_g_iter]._id.toString()) {
         genres[all_g_iter].checked='true';
       }
     }
   }

   res.render('book_form', {
     title: 'Update Book',
     authors,
     genres,
     book
   });
 })
};

// Handle Book update on POST.
exports.book_update_post = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)){
      if(typeof req.body.genre==='undefined')
        req.body.genre=[];
      else
        req.body.genre=new Array(req.body.genre);
    }
    next();
  },

  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var book = new Book(
      { title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
        _id:req.params.id //This is required, or a new ID will be assigned!
      });

    if (!errors.isEmpty()) {
      async.parallel({
        authors: cb => Author.find(cb),
        genres: cb => Genre.find(cb),
      }, function(err, {authors, genres}) {
        if (err) { return next(err); }

        for (let i = 0; i < genres.length; i++) {
          if (book.genre.indexOf(genres[i]._id) > -1) {
            genres[i].checked='true';
          }
        }
        res.render('book_form', { title: 'Update Book',authors, genres, book: book, errors: errors.array() });
      });
      return;
    }
    else {
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
        if (err) { return next(err); }
        res.redirect(thebook.url);
      });
    }
  }
];