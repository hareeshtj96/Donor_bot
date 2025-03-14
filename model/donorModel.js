const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    occassion: { type: String, required: true },
    paymentStatus: { type: String, default: "pending" },
    videoSent: { type: Boolean, default: false },
    receiptImage: { type: String },
    donationAmount: { type: Number, required: true }
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;