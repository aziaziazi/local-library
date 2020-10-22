var Bookinstance = require('../models/bookinstance');

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
res.send('NOT IMPLEMENTED: Bookinstance create GET');
};

// Handle Bookinstance create on POST.
exports.bookinstance_create_post = function(req, res) {
res.send('NOT IMPLEMENTED: Bookinstance create POST');
};

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