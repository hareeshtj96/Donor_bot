const sendMessage = require('../helperFunctions/sendMessage');
const { userStates, conversation } = require('../helperFunctions/handleListSelection');
const saveAndShowDonorDetails = require('../helperFunctions/saveAndShowDonorDetails');

const handleReceiptUpload = async (senderId, imageUrl, res) => {
    try {
        console.log(`📷 Receipt uploaded by ${senderId}: ${imageUrl}`);

        // Reset the state if the user is trying to upload again
        if (userStates[senderId] === "receipt_uploaded") {
            console.log("🔄 Resetting user state to awaiting_receipt");
            userStates[senderId] = "awaiting_receipt";
        }

        if (userStates[senderId] === "awaiting_receipt") {

            conversation[senderId].receiptImage = imageUrl;

            console.log("details in conversation:", conversation[senderId]);

            // Validate all required details 
            if (
                !conversation[senderId].selectedDate ||
                !conversation[senderId].selectedOccasion ||
                !conversation[senderId].donationAmount ||
                !conversation[senderId].status ||
                !conversation[senderId].receiptImage
            ) {
                console.log("❌ Missing required donation details.");
                return res.sendStatus(400);
            }

            // Example: Send confirmation to the user
            await sendMessage(senderId, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: senderId,
                type: "text",
                text: {
                    body: "📩 Receipt received! Our team will verify your payment soon. ✅"
                }
            });

            // Update user state after receipt upload
            userStates[senderId] = "receipt_uploaded";

            return await saveAndShowDonorDetails(senderId, res);
        } else {
            console.log(`❌ Incorrect state for receipt upload: ${userStates[senderId]}`);
            return res.sendStatus(400);
        }

    } catch (error) {
        console.error("Error handling receipt upload:", error);
        res.sendStatus(500);
    }
};

module.exports = handleReceiptUpload;