const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    phone: { type: String },
    name: { type: String },
    date: { type: Date },
    occassion: { type: String },
    paymentStatus: { type: String, default: "pending" },
    chatStatus: { type: String },
    videoSent: { type: Boolean, default: false },
    receiptImage: { type: String },
    donationAmount: { type: Number }
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;