const express = require('express');
const router  = express.Router();
const c = require('../controllers/facilitiesController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Classes
router.route('/classes').get(c.getClasses).post(authorize('admin'), c.createClass);
router.route('/classes/:id').put(authorize('admin'), c.updateClass).delete(authorize('admin'), c.deleteClass);

// Subjects
router.route('/subjects').get(c.getSubjects).post(authorize('admin'), c.createSubject);
router.route('/subjects/:id').put(authorize('admin'), c.updateSubject).delete(authorize('admin'), c.deleteSubject);

// Timetable
router.route('/timetable').get(c.getTimetable).post(authorize('admin','teacher'), c.createTimetableSlot);
router.route('/timetable/:id').put(authorize('admin','teacher'), c.updateTimetableSlot).delete(authorize('admin'), c.deleteTimetableSlot);

// Transport
router.route('/transport').get(c.getTransports).post(authorize('admin','staff'), c.createTransport);
router.route('/transport/:id').put(authorize('admin','staff'), c.updateTransport).delete(authorize('admin'), c.deleteTransport);

// Hostel
router.route('/hostel').get(c.getHostels).post(authorize('admin','staff'), c.createHostel);
router.route('/hostel/:id').put(authorize('admin','staff'), c.updateHostel);
router.post('/hostel/:id/allocate', authorize('admin','staff'), c.allocateRoom);

// Leave Requests
router.route('/leave').get(c.getLeaves).post(c.createLeave);
router.put('/leave/:id/status', authorize('admin','staff'), c.updateLeaveStatus);

// Online Classes
router.route('/online-classes').get(c.getOnlineClasses).post(authorize('admin','teacher'), c.createOnlineClass);
router.route('/online-classes/:id').put(authorize('admin','teacher'), c.updateOnlineClass).delete(authorize('admin','teacher'), c.deleteOnlineClass);

module.exports = router;
