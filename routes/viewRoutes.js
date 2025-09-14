const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
// const bookingController = require('../controllers/bookingController');

const route = express.Router();

route.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);

route.get(
  '/tour/:slug',
  authController.isLoggedIn,
  authController.protect,
  viewController.getTour,
);
route.get('/login', authController.isLoggedIn, viewController.getLoginForm);
route.get('/me', authController.protect, viewController.getAccount);
route.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);

module.exports = route;
