require('dotenv').config();
const Donor = require('../model/donorModel');
const handleNewUser = require('../helperFunctions/handleNewUser');
const handleButtonResponses = require('../helperFunctions/handleButtonResponses');
const { handleListSelection, userStates } = require('../helperFunctions/handleListSelection');
const handleOccasion = require("../helperFunctions/handleOccasion");
const handleDonationAmount = require('../helperFunctions/handleDonationAmount');
const handleReceiptUpload = require('../helperFunctions/handleReceiptUpload');
const fetchImageUrl = require("../helperFunctions/fetchImageUrl");


// Incoming Messages function
const incomingMessage = async (req, res) => {
    try {
        const message = req.body.entry?.[0].changes?.[0].value.messages?.[0];
        if (!message) return res.sendStatus(200);

        const senderId = message.from;
        const messageType = message.type || "";

        const listId = message.interactive?.list_reply?.id || "";
        const occasionId = message.interactive?.list_reply?.id || "";
        const textMessage = message.text?.body?.toLowerCase();

        // Handle generic text messages like "hi"
        if (messageType === "text" && textMessage) {
            console.log("📩 Received text message:", textMessage);

            if (textMessage === "hi" || textMessage === "hello") {
                await handleNewUser(senderId);
                return res.sendStatus(200);
            }
        }

        // Handle list selection
        if (messageType === "interactive" && listId && !userStates[senderId]) {
            console.log("📋 List selection detected:", listId);
            return await handleListSelection(senderId, listId, req, res);
        };

        // Handle occasion selection (New condition added)
        if (messageType === "interactive" && userStates[senderId] === "awaiting_occasion" && occasionId) {
            console.log("📋 List selection detected:", listId);
            return await handleOccasion(senderId, occasionId, res);
        }

        // Handle button clicks 
        const buttonId = message.interactive?.button_reply?.id || "";
        if (messageType === "interactive" && buttonId) {
            console.log("🔘 Button click detected:", buttonId);
            return await handleButtonResponses(senderId, buttonId, res);
        };

        // Extract and parse donation amount
        const rawAmount = message.text?.body

        // Handle donation amount input
        const donationAmount = parseFloat(rawAmount);

        if (!isNaN(donationAmount)) {
            console.log(`💰 Parsed donation amount: ${donationAmount}`);
            if (userStates[senderId] === "awaiting_donation_amount") {
                console.log(`✅ State is correct: awaiting_donation_amount`);
                return await handleDonationAmount(senderId, donationAmount, res);
            } else {
                console.log(`❌ Incorrect state: ${userStates[senderId]}`);
            }
        };

        // Handle receipt upload (if an image is received)
        if (messageType === "image") {
            console.log("✅ Entered image handling block");
            console.log("Full message object:", JSON.stringify(message, null, 2));

            const imageId = message.image?.id;
            if (imageId) {
                console.log("🆔 Image ID:", imageId);

                // Fetch the actual image URL
                const imageUrl = await fetchImageUrl(imageId);

                if (imageUrl) {
                    console.log("🖼 Image URL fetched:", imageUrl);
                    return await handleReceiptUpload(senderId, imageUrl, res);
                } else {
                    console.log("❌ Failed to fetch image URL");
                    return res.sendStatus(500);
                }
            } else {
                console.log("❌ Image ID not found in message");
            }
        }


        return res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error processing incoming message:", error);
        res.sendStatus(500);
    }
};


// Verify webhook function
const verifyWebHook = async (req, res) => {
    try {
        const verifyToken = process.env.VERIFY_TOKEN;
        if (
            req.query["hub.mode"] === "subscribe" &&
            req.query["hub.verify_token"] === verifyToken
        ) {
            return res.status(200).send(req.query["hub.challenge"]);
        }
        console.log("Webhook verified");
        return sendStatus(303);
    } catch (error) {
        console.error("Error verifying webhook:", error);
    }
};

module.exports = {
    incomingMessage,
    verifyWebHook,
}