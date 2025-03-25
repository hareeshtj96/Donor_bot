const sendMessage = require('../helperFunctions/sendMessage');
const Donor = require('../model/donorModel');

// Function to handle new users
const handleNewUser = async (senderId) => {
    console.log("Message send to:", senderId);

    try {
        let donor = await Donor.findOne({ phone: senderId });

        if (!donor) {
            // create a new donor if not exists
            donor = new Donor({
                phone: senderId,
                chatStatus: "interested",
            });
        } else {
            donor.chatStatus = "interested"
        }


        // save donor details
        await donor.save();

        // Message payload
        const messagePayload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            type: "interactive",
            interactive: {
                type: "button",
                body: {
                    text: "👋 Welcome to *Food on Wheels* – a nonprofit initiative delivering meals to the underprivileged! \n💖Would you like to donate and bring a smile to someone today?"
                },
                action: {
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "donate",
                                title: "🎁 I want to donate"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "more_info",
                                title: "❓ Tell me more"
                            }
                        }
                    ]
                }
            }
        };

        await sendMessage(senderId, messagePayload);
    } catch (error) {
        console.error("Error handling new user:", error);
    }


};

module.exports = handleNewUser;