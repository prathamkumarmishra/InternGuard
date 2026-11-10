const router = require('express').Router();
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/authMiddleware');
const controller = require('../controllers/complaintController');
router.route('/').get(authenticate, controller.listValidation, validate, controller.listComplaints).post(authenticate, controller.complaintValidation, validate, controller.createComplaint);
router.get('/:id', authenticate, controller.idValidation, validate, controller.getComplaint);
module.exports = router;
