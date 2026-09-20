const express = require('express');
const router  = express.Router();
const c = require('../controllers/examResultController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(c.getResults)
  .post(authorize('admin','teacher'), c.createResult);

router.post('/bulk',          authorize('admin','teacher'), c.bulkCreate);
router.get('/report/:studentId/:examType', c.getReportCard);

router.route('/:id')
  .get(c.getResult)
  .put(authorize('admin','teacher'), c.updateResult)
  .delete(authorize('admin'), c.deleteResult);

module.exports = router;
