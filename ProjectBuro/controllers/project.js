const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Project = require('../models/Project');


exports.getProjects = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: project });
});


exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} is not authorized to publish Project`,
        400
      )
    );
  }

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this Project`,
        401
      )
    );
  }

  project = await Project.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: project });
});


exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this Project`,
        401
      )
    );
  }

  project.remove();

  res.status(200).json({ success: true, data: {} });
});


exports.projectPhotoUpload = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this Project`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${Project._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Project.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
