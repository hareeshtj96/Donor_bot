const sendMessage = require('../helperFunctions/sendMessage');
const { generateDateOptions } = require('../helperFunctions/handleDonationProcess');


const conversation = {};
const userStates = {};

const handleListSelection = async (senderId, listId, req, res) => {
    const contact = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];
    const username = contact?.profile?.name || "Valued Donor";
    console.log("user name in handle list:", username);

    // ✅ Ensure senderId exists in conversation
    if (!conversation[senderId]) {
        conversation[senderId] = {};
    }

    const dateOptions = generateDateOptions();
    const selectedDateObj = dateOptions.find(option => option.id === listId);

    if (!selectedDateObj) {
        return sendMessage(senderId, {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: senderId,
            type: "text",
            text: { body: "❌ Invalid selection. Please try again." }
        });
    }

    // Store selected date in conversation state
    conversation[senderId] = {
        selectedDate: selectedDateObj.title,
        username: username
    };

    await sendMessage(senderId, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: senderId,
        type: "text",
        text: { body: `✅ Thank you for your donation commitment! 🙌` }
    });

    // Send next step: occasion selection using list
    const listMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: senderId,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "🎊 Select an Occasion"
            },
            body: {
                text: "Please choose an occasion for your donation:"
            },
            action: {
                button: "Choose Occasion",
                sections: [
                    {
                        title: "Occasion Options",
                        rows: [
                            { id: "birthday", title: "🎂 Birthday" },
                            { id: "anniversary", title: "💑 Anniversary" },
                            { id: "memory", title: "🕊 Memory of Loved One" },
                            { id: "general", title: "🙌 General" }
                        ]
                    }
                ]
            }
        }
    };

    await sendMessage(senderId, listMessage);


    userStates[senderId] = "awaiting_occasion";

    res.sendStatus(200);

};

module.exports = {
    handleListSelection,
    userStates,
    conversation
};