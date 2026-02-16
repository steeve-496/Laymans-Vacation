const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/')
    .get(galleryController.getGalleryItems)
    .post(protect, admin, galleryController.createGalleryItem);

router.route('/reorder')
    .patch(protect, admin, galleryController.reorderGalleryItems);

router.route('/:id')
    .delete(protect, admin, galleryController.deleteGalleryItem);

module.exports = router;
