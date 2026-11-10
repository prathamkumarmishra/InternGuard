const router = require('express').Router();
const validate = require('../middleware/validate');
const controller = require('../controllers/analysisController');
router.post('/internship', controller.internshipValidation, validate, controller.analyseInternshipController);
router.post('/complaint', controller.internshipValidation, validate, controller.analyseComplaint);
module.exports = router;
