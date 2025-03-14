const axios = require('axios');
require('dotenv').config();

const sendMessage = async (senderId, messagePayload) => {
    try {
        const url = process.env.WHATSAPP_API_URL;

        await axios.post(url, messagePayload, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("❌ Error sending message:", error.response?.data || error.message);
    }
};

module.exports = sendMessage;