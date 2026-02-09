const express = require('express');
const router = express.Router();
const { createInquiry, testEmailConfig } = require('../controllers/inquiry.controller');

router.post('/', createInquiry);
router.get('/test-email', testEmailConfig);

module.exports = router;
