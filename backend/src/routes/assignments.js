const express = require('express');
const router  = express.Router();
const c = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(c.getAssignments)
  .post(authorize('admin','teacher','staff'), c.upload.single('file'), c.createAssignment);

router.route('/:id')
  .get(c.getAssignment)
  .put(authorize('admin','teacher'), c.updateAssignment)
  .delete(authorize('admin','teacher'), c.deleteAssignment);

router.post('/:id/submit',  authorize('student'), c.upload.single('file'), c.submitAssignment);
router.put('/:id/grade',    authorize('admin','teacher'), c.gradeSubmission);

module.exports = router;
