const express = require('express');
const router  = express.Router();
const c = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin','teacher','staff'), c.getStudents)
  .post(authorize('admin','staff'), c.createStudent);

router.route('/:id')
  .get(c.getStudent)
  .put(authorize('admin','staff'), c.updateStudent)
  .delete(authorize('admin'), c.deleteStudent);

router.put('/:id/toggle-status', authorize('admin'), c.toggleStatus);

module.exports = router;
