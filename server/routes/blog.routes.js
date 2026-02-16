const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/')
    .get(blogController.getBlogs)
    .post(protect, admin, blogController.createBlog);

router.route('/:id')
    .get(blogController.getBlog)
    .put(protect, admin, blogController.updateBlog)
    .delete(protect, admin, blogController.deleteBlog);

module.exports = router;
