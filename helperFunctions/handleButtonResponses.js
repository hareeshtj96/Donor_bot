const sendMessage = require('../helperFunctions/sendMessage');
const { handleDonationProcess } = require('../helperFunctions/handleDonationProcess');

// Function to handle button responses
const handleButtonResponses = async (senderId, buttonId, res) => {
    if (buttonId === "donate") {
        await handleDonationProcess(senderId);
        return res.sendStatus(200);
    };

    if (buttonId === "more_info") {
        await sendMessage(senderId, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            type: "text",
            text: { body: "ℹ Food on Wheels is a nonprofit delivering meals to those in need..." }
        });
        return res.sendStatus(200);
    };

    // Default response for unknown button ID
    await sendMessage(senderId, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: senderId,
        type: "text",
        text: { body: "🤷‍♂️ Unknown button selection. Please try again." }
    });
    res.sendStatus(200);

};

module.exports = handleButtonResponses;