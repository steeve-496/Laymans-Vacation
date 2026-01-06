const express = require('express');
const router = express.Router();
const {
    getStateExplorers,
    getStateExplorer,
    createStateExplorer,
    updateStateExplorer,
    deleteStateExplorer,
    getTrashedStateExplorers,
    restoreStateExplorer,
    permanentDeleteStateExplorer,
    emptyTrashStateExplorers
} = require('../controllers/stateExplorer.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(getStateExplorers)
    .post(protect, createStateExplorer);

router.get('/trash', protect, getTrashedStateExplorers);
router.patch('/:id/restore', protect, restoreStateExplorer);
router.delete('/:id/permanent', protect, permanentDeleteStateExplorer);
router.delete('/empty-trash', protect, emptyTrashStateExplorers);

router.route('/:id')
    .get(getStateExplorer)
    .put(protect, updateStateExplorer)
    .delete(protect, deleteStateExplorer);

module.exports = router;
