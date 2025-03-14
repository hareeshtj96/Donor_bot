const express = require('express');
const crypto = require('crypto');
const sendMessage = require('../helperFunctions/sendMessage');
require('dotenv').config();
const { userStates, conversation } = require("../helperFunctions/handleListSelection");

const razorpayPayment = async (req, res) => {


    const event = req.body.event;
    console.log("event:", event);

    const payload = req.body.payload;
    console.log("payload:", payload);


    if (event === "payment_link.paid") {
        console.log("✅ Payment Successful:", payload);

        const senderId = payload.payment.entity.notes.booking_id;
        if (senderId) {
            await sendMessage(senderId, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: senderId,
                type: "text",
                text: {
                    body: "✅ Payment received! 🎉\n\nPlease upload the transaction receipt for confirmation."
                }
            });

            conversation[senderId].status = "success";
            userStates[senderId] = "awaiting_receipt";
        }
    }
    else if (event === "payment.failed") {
        console.log("❌ Payment Failed:", payload);

        const senderId = payload.payment.entity.notes.booking_id;
        if (senderId) {
            await sendMessage(senderId, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: senderId,
                type: "text",
                text: {
                    body: "❌ Payment failed. Please try again using the provided payment link."
                }
            });

            userStates[senderId] = "awaiting_payment";
        }
    };
    res.sendStatus(200);

};

module.exports = razorpayPayment;