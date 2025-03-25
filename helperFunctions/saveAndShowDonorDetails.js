const sendMessage = require('../helperFunctions/sendMessage');
const Donor = require('../model/donorModel');
const { conversation } = require('../helperFunctions/handleListSelection');

const saveAndShowDonorDetails = async (senderId, res) => {
    try {
        if (!conversation[senderId]) {
            console.log("❌ No conversation data found for:", senderId);
            return res.status(400).send("No donation data available.");
        }

        console.log("details in conversation in save and show:", conversation[senderId]);

        const { receiptImage, donationAmount, selectedOccasion, selectedDate, username, status } = conversation[senderId];

        const formattedOccasion = selectedOccasion.charAt(0).toUpperCase() + selectedOccasion.slice(1);

        // Convert selectedDate string to a proper Date object
        const parsedDate = new Date(selectedDate.replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), /, ''));

        if (isNaN(parsedDate.getTime())) {
            console.log("❌ Invalid date format:", selectedDate);
            return res.status(400).send("Invalid date format.");
        }

        const amount = donationAmount / 100; // Convert paise to Rs

        // Check if donor already exists
        let donor = await Donor.findOne({ phone: senderId });

        if (donor) {
            // Update existing donor record
            donor.date = parsedDate;
            donor.name = username || "Unknown Donor",
                donor.occassion = formattedOccasion;
            donor.paymentStatus = "success";
            donor.videoSent = false;
            donor.receiptImage = receiptImage;
            donor.donationAmount = amount;
            donor.chatStatus = "donation_completed"
            await donor.save();
        } else {
            // Create a new donor entry
            donor = new Donor({
                phone: senderId,
                name: username || "Unknown Donor",
                date: parsedDate,
                occassion: formattedOccasion,
                paymentStatus: status,
                videoSent: false,
                donationAmount: amount,
                receiptImage: receiptImage,
                chatStatus: "donation_completed"
            });
            await donor.save();
        }

        console.log("✅ Donor details saved successfully:", donor);

        // Send confirmation message
        await sendMessage(senderId, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            type: "text",
            text: {
                body: `🙏 Thank you, ${username || "Donor"}! Your generous contribution has been recorded. ✅\n\n📜 *Donation Details:*\n📅 *Date:* ${selectedDate}\n💰 *Amount:* ₹${amount}\n🎉 *Occasion:* ${formattedOccasion}\n\nWe truly appreciate your support! ❤️\n\n🎥 After the food distribution, we will send you a special thank-you video featuring the impact of your donation.`
            }
        });

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error saving donor details:", error);
        res.status(500).send("Server error while saving donor details.");
    }
};

module.exports = saveAndShowDonorDetails;
