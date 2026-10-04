const express = require('express');
const router  = express.Router();
const c = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(c.getBooks)
  .post(authorize('admin','staff'), c.createBook);

router.route('/:id')
  .get(c.getBook)
  .put(authorize('admin','staff'), c.updateBook)
  .delete(authorize('admin'), c.deleteBook);

router.post('/:id/borrow', authorize('admin','staff'), c.borrowBook);
router.post('/:id/return', authorize('admin','staff'), c.returnBook);

module.exports = router;
