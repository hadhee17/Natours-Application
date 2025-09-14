const reviewModel = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await reviewModel.create(req.body);

  res.status(201).json({
    status: 'Success',
    result: review.length,
    data: {
      review,
    },
  });
});

// let filter = {};
// if (req.params.tourId) filter = { tour: req.params.tourId };
exports.getAllReview = factory.getAll(reviewModel);

exports.updateReview = factory.updateOne(reviewModel);
exports.deleteReview = factory.deleteOne(reviewModel);
