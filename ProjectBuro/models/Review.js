const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

ReviewSchema.index({ project: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function(projectId) {
  const obj = await this.aggregate([
    {
      $match: { project: projectId }
    },
    {
      $group: {
        _id: '$project',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Project').findByIdAndUpdate(projectId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.project);
});


ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.project);
});

module.exports = mongoose.model('Review', ReviewSchema);
