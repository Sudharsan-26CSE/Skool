const express = require('express');
const router  = express.Router();
const c = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/',        c.getAttendance);
router.post('/mark',   authorize('admin','teacher','staff'), c.markAttendance);
router.get('/summary', c.getAttendanceSummary);

module.exports = router;
