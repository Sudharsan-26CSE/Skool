const express = require('express');
const router  = express.Router();
const c = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin','staff'));

// Fees
router.get('/summary',      c.getFinanceSummary);
router.route('/fees')
  .get(c.getFees)
  .post(c.createFee);
router.route('/fees/:id')
  .get(c.getFee)
  .put(c.updateFee);
router.put('/fees/:id/pay', c.markFeePaid);

// Payroll
router.route('/payroll')
  .get(c.getPayrolls)
  .post(c.createPayroll);
router.put('/payroll/:id/process', c.processPayroll);

module.exports = router;
