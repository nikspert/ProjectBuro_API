const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload
} = require('../controllers/project');

const Project = require('../models/Project');

const courseRouter = require('./articles');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use('/:projectId/articles', courseRouter);
router.use('/:projectId/reviews', reviewRouter);


router
  .route('/:id/photo')
  .put(protect, authorize('admin'), projectPhotoUpload);

router
  .route('/')
  .get(advancedResults(Project, 'projects'), getProjects)
  .post(protect, authorize('admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, authorize('publisher', 'admin'), updateProject)
  .delete(protect, authorize('publisher', 'admin'), deleteProject);

module.exports = router;
