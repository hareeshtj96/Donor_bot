const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

const BASE_URL = process.env.BASE_URL;

// Function to fetch image url from image Id
const fetchImageUrl = async (imageId) => {
    try {
        const response = await axios.get(`https://graph.facebook.com/v22.0/${imageId}`, {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            },
        });
        const mediaUrl = response.data.url;

        // Download actual image data
        const imageResponse = await axios.get(mediaUrl, {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`
            },
            responseType: 'arraybuffer'
        });

        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Create a filenmae with jpg extension
        const fileName = `receipt_${imageId}_${Date.now()}.jpg`;
        const filePath = path.join(uploadsDir, fileName);

        // Save image
        fs.writeFileSync(filePath, Buffer.from(imageResponse.data));

        const relativePath = `/uploads/${fileName}`;
        const fullUrl = `${BASE_URL}${relativePath}`;

        return fullUrl;
    } catch (error) {
        console.error("❌ Error fetching image URL:", error.response?.data || error.message);
        return null;
    }
};

module.exports = fetchImageUrl;