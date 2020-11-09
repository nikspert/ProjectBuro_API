const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const Project = require('../models/Project');


exports.getOrders = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
 });


exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});


exports.addOrder = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a order`,
        401
      )
    );
  }

  const order = await Order.create(req.body);

  res.status(200).json({
    success: true,
    data: order
  });
});


exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with the id of ${req.params.id}`),
      404
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update order ${order._id}`,
        401
      )
    );
  }

  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: order
  });
});


exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with the id of ${req.params.id}`),
      404
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete order ${order._id}`,
        401
      )
    );
  }

  await order.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
