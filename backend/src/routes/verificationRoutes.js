const router = require('express').Router();
const validate = require('../middleware/validate');
const controller = require('../controllers/verificationController');
router.post('/company', controller.companyValidation, validate, controller.company);
router.post('/website', controller.websiteValidation, validate, controller.website);
module.exports = router;
