const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Project = require('../models/Project');


exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const reviews = await Review.find({ project: req.params.projectId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});


exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'project',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});


exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.user = req.user.id;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(
        `No project with the id of ${req.params.projectId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});


exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});


exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
