const sendMessage = require('../helperFunctions/sendMessage');

const conversation = {};

const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);

        // Day Month Year format
        const formattedDate = futureDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            weekday: "long",
        });
        options.push({
            id: `date_${i + 1}`,
            title: formattedDate,
        });
    }
    return options
};

// Function to handle donation process
const handleDonationProcess = async (senderId) => {
    const dateOptions = generateDateOptions();

    const listMessage = {
        messaging_product: "WHATSAPP",
        recipient_type: "individual",
        to: senderId,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "📆 Select a Date"
            },
            body: {
                text: "Please choose a date for food distribution from the list below:"
            },
            action: {
                button: "Choose Date",
                sections: [
                    {
                        title: "Available Dates",
                        rows: dateOptions
                    }
                ]
            }
        }
    }

    await sendMessage(senderId, listMessage);

    conversation[senderId] = "awaiting_date";
};

module.exports = {
    handleDonationProcess,
    generateDateOptions,
    conversation
}