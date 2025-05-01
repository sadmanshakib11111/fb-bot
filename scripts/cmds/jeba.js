const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");

const conversationMemory = {};

module.exports = {
  config: {
    name: "jeba", // Don't change this name.
    aliases: ["jeba", "bby", "nusu"],
    version: "1.4.0",
    author: "Tasbiul Islam Rasin",
    countDown: 2,
    role: 0,
    longDescription: {
      en: "Engage in conversation with Jeba!"
    },
    category: "SimSimi",
    guide: {
      en: "[p]Jeba <message> | [p]Jeba teach <teach> => <response> | [p]Jeba list"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { messageID, threadID, senderID } = event;
    const content = args.join(" ").trim();

    if (!content) {
      return api.sendMessage("Hae bby bolo 🥹🫶🏻", threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeba",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    }

    try {
      if (content.toLowerCase() === "list") {
        const response = await axios.get("https://rasin-x-apis-main.onrender.com/api/rasin/jeba?teachCount");
        return api.sendMessage(response.data.status === "success" ? response.data.message : "❌", threadID, messageID);
      }

      if (content.toLowerCase() === "teach") {
        return api.sendMessage("✏ 𝐓𝐞𝐚𝐜𝐡:\n\nJeba teach hey => hi\n\n𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 𝐑𝐚𝐬𝐢𝐧", threadID, messageID);
      }

      if (content.startsWith("teach ")) {
        const [phrase, responseText] = content.substring(6).split("=>").map(i => i.trim());
        if (!phrase || !responseText) return api.sendMessage("Usage: [p]Jeba teach <teach> => <response>", threadID, messageID);

        const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/sim?teach=${encodeURIComponent(phrase)}&res=${encodeURIComponent(responseText)}`;
        const response = await axios.get(apiUrl);

        return api.sendMessage(response.data.message, threadID, messageID);
      }

      let apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/jeba?msg=${encodeURIComponent(content)}`;
      if (conversationMemory[threadID] && conversationMemory[threadID].user === senderID) {
        apiUrl += `&prev=${encodeURIComponent(conversationMemory[threadID].botResponse)}`;
      }

      const response = await axios.get(apiUrl);
      const botReply = response.data.response || "❌ No response from API.";

      conversationMemory[threadID] = { user: senderID, botResponse: botReply };

      await api.sendMessage(botReply, threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeba",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);

    } catch (error) {
      console.error("❌ | Error processing Jeba", error);
      api.sendMessage("❌ | An error occurred while processing the request.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;

    if (!body) return;

    try {
      let apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/jeba?msg=${encodeURIComponent(body)}`;
      if (conversationMemory[threadID] && conversationMemory[threadID].user === senderID) {
        apiUrl += `&prev=${encodeURIComponent(conversationMemory[threadID].botResponse)}`;
      }

      const response = await axios.get(apiUrl);
      const botReply = response.data.response || "❌ No response from API.";

      conversationMemory[threadID] = { user: senderID, botResponse: botReply };

      await api.sendMessage(botReply, threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeba",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    } catch (err) {
      console.error("❌ | Error processing Jeba reply:", err);
      api.sendMessage("❌ | An error occurred while replying.", threadID, messageID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
