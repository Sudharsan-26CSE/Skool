const express = require('express');
const router  = express.Router();
const c = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(c.getNotices)
  .post(authorize('admin','staff','teacher'), c.createNotice);

router.route('/:id')
  .get(c.getNotice)
  .put(authorize('admin','staff'), c.updateNotice)
  .delete(authorize('admin'), c.deleteNotice);

module.exports = router;
