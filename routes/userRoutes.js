const express = require('express');

// eslint-disable-next-line import/no-useless-path-segments
const userController = require('./../controllers/userController');

const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/me')
  .get(authController.protect, userController.getMe, userController.getUser);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser);

router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

module.exports = router;
