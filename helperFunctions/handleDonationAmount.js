const razorpay = require('../razorpay/razorpay');
const sendMessage = require("../helperFunctions/sendMessage");
const { userStates, conversation } = require("../helperFunctions/handleListSelection");
const Donor = require('../model/donorModel');


const handleDonationAmount = async (senderId, amount, res) => {
    console.log(`🚀 handleDonationAmount triggered for senderId: ${senderId}, amount: ${amount}`);

    if (isNaN(amount) || amount <= 0) {
        return sendMessage(senderId, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            type: "text",
            text: {
                body: "❌ Invalid amount. Please enter a valid number (e.g., 100, 500, 1000)."
            }
        });
    }

    try {
        // Convert amount to paise (1 INR = 100 paise)
        const donationAmount = amount * 100;

        // check if donor exists
        let donor = await Donor.findOne({ phone: senderId });

        if (!donor) {
            // if donor does not exist, create a new record
            donor = new Donor({
                phone: senderId,
                donationAmount: amount,
                chatStatus: "payment_initiated",
            });
        } else {
            // if donor exists, update fields
            donor.chatStatus = "payment_initiated";
            donor.donationAmount = amount;

        }
        // Save the donor details to the database
        await donor.save();

        // Create Razorpay payment link
        const paymentLink = await razorpay.paymentLink.create({
            amount: donationAmount,
            currency: "INR",
            description: `Donation by ${senderId}`,
            customer: {
                name: userStates[senderId].name,
                contact: senderId,
            },
            notify: {
                sms: false,
                email: false,
            },
            reminder_enable: true,
            expire_by: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
            notes: { booking_id: senderId },
        });

        console.log("✅ Payment link generated:", paymentLink.short_url);

        // Send the payment link to the user
        const paymentMessage = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            type: "text",
            text: {
                body: `💰 Please choose a Method to Pay!\n\n📌 *Payment Options:*\n✅ *UPI:* foodonwheels@upi\n✅ *Bank Transfer:* A/C: 1234567890 | IFSC: ABCD12345\n✅ *Payment Link:* [Click here to pay](${paymentLink.short_url})\n\n📤 After payment, kindly upload the transaction receipt.`
            }
        };

        conversation[senderId].donationAmount = donationAmount;
        await sendMessage(senderId, paymentMessage);
        userStates[senderId] = "awaiting_payment";

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error generating Razorpay payment link:", error);
        res.status(500).send("❌ Unable to generate payment link. Please try again.");
    }
};

module.exports = handleDonationAmount;