const express = require('express');
const connectToDB = require('./database/db');
const webHookRoutes = require('./routes/routes');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route
app.use('/', webHookRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    connectToDB();
})