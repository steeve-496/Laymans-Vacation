const express = require('express');
const router = express.Router();
const {
    getStates, createState, updateState, deleteState, reorderStates,
    getSectionContent, updateSectionContent
} = require('../controllers/content.controller');
const { protect } = require('../middleware/auth.middleware');

// State Explorer Routes
router.route('/states')
    .get(getStates)
    .post(protect, createState);

router.route('/states/reorder')
    .patch(protect, reorderStates);

router.route('/states/:id')
    .put(protect, updateState)
    .delete(protect, deleteState);

// General Section Content Routes (e.g., /api/content/sections/:key)
router.route('/sections/:key')
    .get(getSectionContent)
    .put(protect, updateSectionContent);

module.exports = router;
