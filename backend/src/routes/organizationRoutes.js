const router = require('express').Router();
const validate = require('../middleware/validate');
const { authenticate, allowRoles } = require('../middleware/authMiddleware');
const controller = require('../controllers/organizationController');
router.route('/').get(controller.listValidation, validate, controller.listOrganizations).post(authenticate, allowRoles('ORGANIZATION', 'ADMIN', 'VERIFIER'), controller.organizationValidation, validate, controller.createOrganization);
router.route('/:id').get(controller.idValidation, validate, controller.getOrganization).put(authenticate, allowRoles('ORGANIZATION', 'ADMIN', 'VERIFIER'), controller.idValidation, controller.organizationValidation, validate, controller.updateOrganization);
module.exports = router;
