const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a order title']
  },
  addition: {
    type: String,
    required: [true, 'Please add a addition'],
    maxlength: [300, 'addition can not be more than 300 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'contacted','performing','done'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Order', OrderSchema);
