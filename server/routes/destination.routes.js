const express = require('express');
const router = express.Router();
const {
    getDestinations,
    getDestination,
    createDestination,
    updateDestination,
    deleteDestination,
    reorderDestinations,
    getTrashedDestinations,
    restoreDestination,
    permanentDeleteDestination,
    toggleVisibility,
    getAdminDestinations,
    emptyTrashDestinations
} = require('../controllers/destination.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(getDestinations)
    .post(protect, createDestination);

router.get('/admin/all', protect, getAdminDestinations);
router.get('/trash', protect, getTrashedDestinations);
router.patch('/:id/restore', protect, restoreDestination);
router.patch('/:id/toggle-visibility', protect, toggleVisibility);
router.delete('/:id/permanent', protect, permanentDeleteDestination);
router.delete('/empty-trash', protect, emptyTrashDestinations);

router.route('/reorder')
    .patch(protect, reorderDestinations); // Needs to be before /:id to not be caught as id

router.route('/:id')
    .get(getDestination)
    .put(protect, updateDestination)
    .delete(protect, deleteDestination);

module.exports = router;
