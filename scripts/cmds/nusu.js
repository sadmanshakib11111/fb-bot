const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");
const fs = require("fs");
const { join } = require("path");
const gTTS = require("gtts");
const translate = require('@vitalets/google-translate-api'); // Install google-translate-api

const conversationMemory = {};

module.exports = {
  config: {
    name: "nusu",
    aliases: ["nusu",],
    version: "1.6.0",
    author: "Tasbiul Islam Rasin",
    countDown: 2,
    role: 0,
    longDescription: {
      en: "Talk to Nusu in Bangla or English with only voice"
    },
    category: "SimSimi",
    guide: {
      en: "[p]Nusu <message> | [p]Nusu teach <text> => <reply> | [p]Nusu list"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { messageID, threadID, senderID } = event;
    let content = args.join(" ").trim();

    if (!content) {
      return api.sendMessage("Hae bby bolo 😌🎀", threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "nusu",
            type: "reply",
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    }

    try {
      if (content.toLowerCase() === "list") {
        const response = await axios.get("https://developer-rasin420.onrender.com/api/rasin/jeba?teachCount");
        return api.sendMessage(response.data.status === "success" ? response.data.message : "❌ | Could not retrieve teach count.", threadID, messageID);
      }

      if (content.toLowerCase() === "teach") {
        return api.sendMessage("✏ 𝐓𝐞𝐚𝐜𝐡:\n\nNusu teach hey => hi\n\n𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 𝐑𝐚𝐬𝐢𝐧", threadID, messageID);
      }

      if (content.startsWith("teach ")) {
        const [phrase, responseText] = content.substring(6).split("=>").map(i => i.trim());
        if (!phrase || !responseText) return api.sendMessage("Usage: [p]Nusu teach <text> => <reply>", threadID, messageID);

        const apiUrl = `https://developer-rasin420.onrender.com/api/rasin/jeba?teach=${encodeURIComponent(phrase)}&res=${encodeURIComponent(responseText)}`;
        const response = await axios.get(apiUrl);
        return api.sendMessage(response.data.message, threadID, messageID);
      }

      // Convert Roman Bangla to Bangla Script
      content = await romanToBangla(content);

      await sendVoiceOnly(api, threadID, senderID, content, messageID);
    } catch (error) {
      console.error("❌ | Nusu Error:", error);
      api.sendMessage("❌ | Something went wrong.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    try {
      // Convert Roman Bangla to Bangla Script
      const content = await romanToBangla(body);
      await sendVoiceOnly(api, threadID, senderID, content, messageID);
    } catch (err) {
      console.error("❌ | Reply Error:", err);
      api.sendMessage("❌ | Error during reply.", threadID, messageID);
    }
  }
};

// Convert Roman Bangla to Bangla Script using Google Translate
async function romanToBangla(text) {
  try {
    const result = await translate(text, { to: 'bn' });
    return result.text;
  } catch (err) {
    console.error("❌ | Error during translation:", err);
    return text; // Fallback to the original text if error occurs
  }
}

// Handle Nusu Bot Reply + Voice Only
async function sendVoiceOnly(api, threadID, senderID, userMsg, messageID) {
  let apiUrl = `https://developer-rasin420.onrender.com/api/rasin/jeba?msg=${encodeURIComponent(userMsg)}`;
  if (conversationMemory[threadID] && conversationMemory[threadID].user === senderID) {
    apiUrl += `&prev=${encodeURIComponent(conversationMemory[threadID].botResponse)}`;
  }

  const response = await axios.get(apiUrl);
  const botReply = response.data.response || "❌ কোন উত্তর পাওয়া যায়নি।";

  conversationMemory[threadID] = { user: senderID, botResponse: botReply };

  const isBangla = /[\u0980-\u09FF]/.test(botReply); // Check for Bengali characters
  const lang = isBangla ? "bn" : "en";
  const filePath = join(__dirname, "nusu.mp3");

  const gtts = new gTTS(botReply, lang);
  await new Promise((resolve, reject) => {
    gtts.save(filePath, err => {
      if (err) return reject(err);
      resolve();
    });
  });

  api.sendMessage({
    attachment: fs.createReadStream(filePath)
  }, threadID, (err, info) => {
    if (!err) {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "nusu",
        type: "reply",
        messageID: info.messageID,
        author: senderID
      });
    }
    fs.unlink(filePath, () => {}); // Clean up the mp3 file
  }, messageID);
}

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
