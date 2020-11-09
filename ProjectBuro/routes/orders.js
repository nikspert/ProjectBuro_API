const express = require('express');
const {
  getOrder,
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/Orders');

const Order = require('../models/Order');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Order, {
      path: 'order',
      select: 'name description'
    }),
    getOrders
  )
  .post(protect, authorize('admin','user'), addOrder);

router
  .route('/:id')
  .get(getOrder)
  .put(protect, authorize('publisher', 'admin'), updateOrder)
  .delete(protect, authorize('publisher', 'admin'), deleteOrder);

module.exports = router;
