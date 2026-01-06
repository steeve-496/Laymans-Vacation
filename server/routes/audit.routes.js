const express = require('express');
const router = express.Router();
const { getAuditLogs, clearAuditLogs } = require('../controllers/audit.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getAuditLogs)
    .delete(protect, clearAuditLogs);

module.exports = router;
