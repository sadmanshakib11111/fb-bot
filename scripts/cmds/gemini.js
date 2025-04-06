module.exports.config = {
    name: "gemini",
    aliases: ["gemini", "gem"],
    version: "1.0",
    author: "Tasbiul Islam Rasin",
    cooldown: 5,
    permission: 0,
    description: "Chat with Gemini AI",
    usage: "{p}gemini Hi",
};



const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");

async function gemini(api, event, args, message) {
    try {
        const query = args.join(" ");
        if (!query) {
            return message.reply("Ask me anything... 😌");
        }

        const response = await axios.get(`https://developer-rasin420.onrender.com/api/rasin/gemini?chat=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.Message) {
            message.reply(response.data.Message);
        } else {
            message.reply("❎");
        }
    } catch (error) {
        console.error("❎ | Error:", error.message);
        message.reply("❎ | An error occurred while processing your request!");
    }
}

const commandConfig = {
    name: "gemini",
    aliases: ["gem", "gemini"],
    version: "1.0",
    author: "Tasbiul Islam Rasin",
    countDown: 5,
    role: 0,
    longDescription: "Chat with Gemini",
    category: "AI",
    guide: {
        en: "{p}llama3 {prompt}"
    }
};

module.exports = {
    config: commandConfig,
    handleCommand: gemini,
    onStart: function ({ api, message, event, args }) {
        return gemini(api, event, args, message);
    },
    onReply: function ({ api, message, event, args }) {
        return gemini(api, event, args, message);
    }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });