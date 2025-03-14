const mongoose = require('mongoose');
require('dotenv').config();

// Connect to DB
const connectToDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Error occured while connecting to DB:", error);
        process.exit(1);
    }
};

module.exports = connectToDB;