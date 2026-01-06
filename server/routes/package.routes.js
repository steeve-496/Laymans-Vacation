const express = require('express');
const router = express.Router();
const {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage,
    reorderPackages,
    getTrashedPackages,
    restorePackage,
    permanentDeletePackage,
    emptyTrashPackages
} = require('../controllers/package.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(getPackages)
    .post(protect, createPackage);

router.route('/trash')
    .get(protect, getTrashedPackages);

router.route('/reorder')
    .patch(protect, reorderPackages);

router.route('/:id/restore')
    .patch(protect, restorePackage);

router.route('/:id/permanent')
    .delete(protect, permanentDeletePackage);

router.delete('/empty-trash', protect, emptyTrashPackages);

router.route('/:id')
    .get(getPackage)
    .put(protect, updatePackage)
    .delete(protect, deletePackage);

module.exports = router;
