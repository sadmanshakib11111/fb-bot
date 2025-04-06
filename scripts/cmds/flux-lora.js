const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "flux-lora",
    aliases: ["lora"],
    version: "1.0.0",
    author: "Rasin",
    countDown: 15,
    role: 0,
    description: {
      en: "Flux",
    },
    category: "FLUX",
    guide: {
      en: "   {pn}flux [prompt]"
    },
  },

  onStart: async function ({ event, args, message, api }) {
    const rasinAPI = "https://developer-rasin420.onrender.com/api/rasin/flux-lora";

    try {
      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐩𝐫𝐨𝐦𝐩𝐭 🙂");
      }

      const startTime = Date.now();
      const waitMessage = await message.reply("⌛ 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞...");
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const apiurl = `${rasinAPI}?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiurl, { responseType: "arraybuffer" });

      console.log("API Response Headers:", response.headers);
      console.log("API Response Data (Buffer Length):", response.data.length);
      if (!response.data || response.data.length < 100) { 
        throw new Error("Invalid image received from API.");
      }

      const tempPath = path.join(__dirname, `flux_image_${Date.now()}.jpg`);
      fs.writeFileSync(tempPath, response.data);

      const time = ((Date.now() - startTime) / 1000).toFixed(2);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.unsend(waitMessage.messageID);
      message.reply({
        body: `💁🏻‍♂️ 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐦𝐚𝐠𝐞`,
        attachment: fs.createReadStream(tempPath),
      }, () => {
        fs.unlinkSync(tempPath);
      });

    } catch (e) {
      console.error("Error during image generation:", e);
      message.reply(`❌ Error: ${e.message || "Failed to generate image. Please try again later."}`);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
