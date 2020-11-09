  const ErrorResponse = require('../utils/errorResponse');
  const asyncHandler = require('../middleware/async');
  const Article = require('../models/Article');
  const Project = require('../models/Project');

  
  exports.getArticles = asyncHandler(async (req, res, next) => {
      res.status(200).json(res.advancedResults);
  });

  
  exports.getArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(
        new ErrorResponse(`No article with the id of ${req.params.id}`),
        404
      );
    }

    res.status(200).json({
      success: true,
      data: article
    });
  });

  
  exports.addArticle = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    
    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a article`,
          401
        )
      );
    }

    const article = await Article.create(req.body);

    res.status(200).json({
      success: true,
      data: article
    });
  });


  exports.updateArticle = asyncHandler(async (req, res, next) => {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return next(
        new ErrorResponse(`No article with the id of ${req.params.id}`),
        404
      );
    }

    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update article ${article._id}`,
          401
        )
      );
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: article
    });
  });

  
  exports.deleteArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(
        new ErrorResponse(`No article with the id of ${req.params.id}`),
        404
      );
    }

    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete article ${article._id}`,
          401
        )
      );
    }

    await article.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  });
