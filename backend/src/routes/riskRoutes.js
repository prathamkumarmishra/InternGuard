const router = require('express').Router();
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/authMiddleware');
const controller = require('../controllers/riskController');
router.post('/assessment', authenticate, controller.assessmentValidation, validate, controller.assess);
router.get('/history', authenticate, controller.historyValidation, validate, controller.listHistory);
router.get('/:organizationId', controller.idValidation, validate, controller.getByOrganization);
module.exports = router;
