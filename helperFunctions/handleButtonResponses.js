const sendMessage = require('../helperFunctions/sendMessage');
const { handleDonationProcess } = require('../helperFunctions/handleDonationProcess');

// Function to handle button responses
const handleButtonResponses = async (senderId, buttonId, res) => {
    if (buttonId === "donate") {
        await handleDonationProcess(senderId);
        return res.sendStatus(200);
    };

    if (buttonId === "more_info") {
        try {
            await Promise.all([
                sendMessage(senderId, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: senderId,
                    type: "text",
                    text: {
                        body: "ℹ *Food on Wheels* is a nonprofit dedicated to delivering meals to those in need. \n\n✅ We provide nutritious meals to underprivileged communities.\n✅ Our team consists of volunteers committed to reducing hunger.\n✅ Donations help us reach more people and expand our services.\n\nFor more details, visit our website: https://foodonwheels.org"
                    }
                }),
                sendMessage(senderId, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: senderId,
                    type: "document",
                    document: {
                        link: "https://docs.google.com/document/d/18TGyyuiXaJb3-jFXe0lJjXnCvo1GU0sJ/export?format=pdf",
                        filename: "FoodOnWheels.pdf",
                        caption: "Here's our information brochure in PDF format"
                    }
                })
            ]);
        } catch (error) {
            console.error("Error sending document:", error);
        }

        return res.sendStatus(200);
    }
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