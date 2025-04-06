
const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");

async function deepseek(api, event, args, message) {
    try {
        const query = args.join(" ");
        if (!query) {
            return message.reply("Ask me anything... 😌");
        }

        const response = await axios.get(`https://developer-rasin69.onrender.com/api/rasin/deepseek?chat=${encodeURIComponent(query)}`);
        
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
    name: "deepseek",
    aliases: ["deepseek", "deep"],
    version: "1.0",
    author: "Tasbiul Islam Rasin",
    countDown: 5,
    role: 0,
    longDescription: "Chat with Deepseek AI",
    category: "AI",
    guide: {
        en: "{p}deepseek Hi"
    }
};

module.exports = {
    config: commandConfig,
    handleCommand: deepseek,
    onStart: function ({ api, message, event, args }) {
        return deepseek(api, event, args, message);
    },
    onReply: function ({ api, message, event, args }) {
        return deepseek(api, event, args, message);
    }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });