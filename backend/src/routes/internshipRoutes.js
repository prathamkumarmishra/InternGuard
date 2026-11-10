const router = require('express').Router();
const validate = require('../middleware/validate');
const { authenticate, allowRoles } = require('../middleware/authMiddleware');
const controller = require('../controllers/internshipController');
router.route('/').get(controller.listValidation, validate, controller.listInternships).post(authenticate, allowRoles('ORGANIZATION', 'ADMIN', 'VERIFIER'), controller.internshipValidation, validate, controller.createInternship);
router.get('/:id', controller.idValidation, validate, controller.getInternship);
module.exports = router;
