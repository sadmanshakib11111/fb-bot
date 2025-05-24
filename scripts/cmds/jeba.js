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
        const response = await axios.get("https://rasin-x-apis-main.onrender.com/api/rasin/jeba?count=true");
        return api.sendMessage(response.data.status === "success" ? response.data.message : "❌", threadID, messageID);
      }

      if (content.toLowerCase() === "teach") {
        return api.sendMessage("✏ 𝐓𝐞𝐚𝐜𝐡:\n\nJeba teach hi => hey, how are u, hello\n\n𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 𝐑𝐚𝐬𝐢𝐧", threadID, messageID);
      }

      if (content.startsWith("teach ")) {
  const [phrase, responseText] = content.substring(6).split("=>").map(i => i.trim());
  if (!phrase || !responseText) 
    return api.sendMessage("Usage: [p]Jeba teach <teach> => <reply1, reply2, reply3>", threadID, messageID);

  const replies = responseText.split(',').map(reply => reply.trim());
  const teachApiUrl = `https://rasin-x-apis-main.onrender.com/api/rasin/jeba?ask=${encodeURIComponent(phrase)}&reply=${encodeURIComponent(replies.join(','))}`;

  try {
    const response = await axios.get(teachApiUrl);

    if (response.data.status === "error") {
      return api.sendMessage(response.data.message || "❌ Failed to teach.", threadID, messageID);
    }

    if (response.data.ask && response.data.reply) {
      return api.sendMessage(`𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚃𝚎𝚊𝚌𝚑\n\n🗨 𝙽𝚎𝚠 𝚃𝚎𝚊𝚌𝚑 [ ${response.data.ask} ]\n💬 𝚁𝚎𝚙𝚕𝚢 [ ${response.data.reply} ]\n\n𝙱𝚢 𝚃𝚊𝚜𝚋𝚒𝚞𝚕 𝙸𝚜𝚕𝚊𝚖 𝚁𝚊𝚜𝚒𝚗 🙆‍♂️`, threadID, messageID);
    } else {
      return api.sendMessage("❌ Failed to teach.", threadID, messageID);
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return api.sendMessage(error.response.data.message, threadID, messageID);
    }
    console.error("Error teaching:", error);
    return api.sendMessage("❌ An error occurred while teaching.", threadID, messageID);
  }
}

      let apiUrl = `https://rasin-x-apis-main.onrender.com/api/rasin/jeba?msg=${encodeURIComponent(content)}`;
      const key = `${threadID}_${senderID}`;

      if (conversationMemory[key]) {
        apiUrl += `&prev=${encodeURIComponent(conversationMemory[key])}`;
      }

      const response = await axios.get(apiUrl);
      const botReply = response.data.response || "❌ No response from API.";

      conversationMemory[key] = botReply;

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

  onReply: async function ({ api, event }) {
    const { threadID, senderID, messageID, body } = event;
    const userMsg = body.trim();
    const key = `${threadID}_${senderID}`;

    try {
      let apiUrl = `https://rasin-x-apis-main.onrender.com/api/rasin/jeba?msg=${encodeURIComponent(userMsg)}`;
      if (conversationMemory[key]) {
        apiUrl += `&prev=${encodeURIComponent(conversationMemory[key])}`;
      }

      const response = await axios.get(apiUrl);
      const botReply = response.data.response || "❌ No response from API.";

      conversationMemory[key] = botReply;

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
      console.error("❌ | Error in onReply:", err);
      api.sendMessage("❌ | Error while replying.", threadID, messageID);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
