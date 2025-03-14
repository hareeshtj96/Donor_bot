const sendMessage = require('../helperFunctions/sendMessage');
const { userStates, conversation } = require('./handleListSelection');


// Function to handle occasion selection and payment process
const handleOccasion = async (senderId, occasionId, res) => {
    console.log(`handleOccasion triggered for senderId: ${senderId}, occasionId: ${occasionId}`);

    if (!conversation[senderId]) {
        return res.status(400).send("❌ Invalid state. Please start over.");
    };

    conversation[senderId].selectedOccasion = occasionId;
    userStates[senderId] = "awaiting_donation_amount";

    console.log(`✅ Occasion selected: ${occasionId}, State updated: awaiting_donation_amount`);

    // Ask user for donation amount
    const askAmountMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: senderId,
        type: "text",
        text: {
            body: `🙏 Thank you for your generosity!\n\n💰 How much would you like to donate?\n\nPlease reply with the amount in *INR* (e.g., 100, 500, 1000).`
        }
    };
    await sendMessage(senderId, askAmountMessage);
    res.sendStatus(200);
};

module.exports =
    handleOccasion;

