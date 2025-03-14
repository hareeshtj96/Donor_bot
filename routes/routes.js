const express = require('express');
const { incomingMessage, verifyWebHook } = require('../controller/chatbotController');
const razorpayPayment = require("../controller/razorpayPayment");

const router = express.Router();

// Create Routes for webhook
router.get('/webhook', verifyWebHook);

router.post('/webhook', incomingMessage);

// Razorpay route
router.post('/webhook/razorpay', razorpayPayment);

module.exports = router;