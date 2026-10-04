const express = require('express');
const router  = express.Router();
const c = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin','teacher','staff'), c.getStaff)
  .post(authorize('admin'), c.createStaff);

router.route('/:id')
  .get(c.getStaffMember)
  .put(authorize('admin'), c.updateStaff)
  .delete(authorize('admin'), c.deleteStaff);

module.exports = router;
