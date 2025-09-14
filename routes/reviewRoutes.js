const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const Router = express.Router({ mergeParams: true });
Router.use(authController.protect); // Protect all routes after this middleware
//for direct review
Router.route('/create-review').post(
  authController.restrictTo('user'),
  reviewController.createReview,
);
//for review via tour route.POST
Router.route('/').post(
  authController.restrictTo('user'),
  reviewController.createReview,
);
//for review via tour route.GET
Router.route('/').get(reviewController.getAllReview);

Router.route('/delete-review/:id').delete(reviewController.deleteReview);
Router.route('/update-review/:id').patch(
  authController.restrictTo('user', 'admin'),
  reviewController.updateReview,
);

Router.route('/get-all-review').get(
  authController.restrictTo('user', 'admin'),
  reviewController.getAllReview,
);

module.exports = Router;
