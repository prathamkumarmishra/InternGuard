const router = require('express').Router();
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/authMiddleware');
const controller = require('../controllers/authController');
router.post('/register', controller.registerValidation, validate, controller.register);
router.post('/login', controller.loginValidation, validate, controller.login);
router.get('/me', authenticate, controller.me);
module.exports = router;
