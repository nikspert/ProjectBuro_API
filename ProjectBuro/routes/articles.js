const express = require('express');
const {
  getArticles,
  getArticle,
  addArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articles');

const Article = require('../models/Article');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Article, {
      path: 'article',
      select: 'name description'
    }),
    getArticles
  )
  .post(protect, authorize('admin'), addArticle);

router
  .route('/:id')
  .get(getArticle)
  .put(protect, authorize('publisher', 'admin'), updateArticle)
  .delete(protect, authorize('publisher', 'admin'), deleteArticle);

module.exports = router;
