const axios = require("axios");

module.exports = {
  config: {
    name: "edit",
    aliases: ['editz'],
    version: "2.0.2",
    author: "Rasin",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "empty ()"
    },
    longDescription: {
      en: "empty ()"
    },
    category: "image",
    guide: {
      en: "empty ()"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚙𝚛𝚘𝚖𝚙𝚝");
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0)
      return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎");

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎");

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const imgUrl = attachment.url;
      const rasin = `https://rasin-x-apis-main.onrender.com/edit?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(rasin);
      const imageUrl = res.data.img_url;

      if (!imageUrl) return message.reply("𝙽𝚘 𝚒𝚖𝚊𝚐𝚎 𝚛𝚎𝚝𝚞𝚛𝚗𝚎𝚍 😐");

      message.reply({
        body: "",
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

      api.setMessageReaction("🌸", event.messageID, () => {}, true);

    } catch (err) {
      console.error(err);
      message.reply("𝙵𝚊𝚒𝚕𝚎𝚍 💔");
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
