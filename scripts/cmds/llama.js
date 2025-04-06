
const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");

async function llama3(api, event, args, message) {
    try {
        const query = args.join(" ");
        if (!query) {
            return message.reply("Ask me anything... 😌");
        }

        const response = await axios.get(`https://developer-rasin420.onrender.com/api/rasin/llama?chat=${encodeURIComponent(query)}`);
        
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
    name: "llama3",
    aliases: ["llama", "llma"],
    version: "1.0",
    author: "Tasbiul Islam Rasin",
    countDown: 5,
    role: 0,
    longDescription: "Chat with LLaMA 3",
    category: "AI",
    guide: {
        en: "{p}llama3 {prompt}"
    }
};

module.exports = {
    config: commandConfig,
    handleCommand: llama3,
    onStart: function ({ api, message, event, args }) {
        return llama3(api, event, args, message);
    },
    onReply: function ({ api, message, event, args }) {
        return llama3(api, event, args, message);
    }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });