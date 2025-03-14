const axios = require('axios');
require('dotenv').config();

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Function to fetch image url from image Id
const fetchImageUrl = async (imageId) => {
    try {
        const response = await axios.get(`https://graph.facebook.com/v18.0/${imageId}`, {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            },
        });
        return response.data.url;
    } catch (error) {
        console.error("❌ Error fetching image URL:", error.response?.data || error.message);
        return null;
    }
};

module.exports = fetchImageUrl;