const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "lora",
    aliases: ["lora", "flux-lora"],
    version: "1.0.1",
    author: "Rasin",
    countDown: 15,
    role: 1,
    description: {
      en: "Flux",
    },
    category: "FLUX",
    guide: {
      en: "   {pn}flux-lora [prompt]"
    },
  },

  onStart: async function ({ event, args, message, api }) {
    const rasinAPI = "https://developer-rasin69.onrender.com/api/rasin/flux-lora";

    try {
      const prompt = args.join(" ").trim();
      if (!prompt) {
        return message.reply("Please provide a prompt!");
      }

      const startTime = Date.now();
      const waitMessage = await message.reply("⏳ Generating image...");
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const apiurl = `${rasinAPI}?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiurl, { responseType: "stream" });

      if (!response || !response.data) {
        throw new Error("Invalid response from API.");
      }

      const time = ((Date.now() - startTime) / 1000).toFixed(2);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      message.unsend(waitMessage.messageID);

      message.reply({
        body: `✅ Here’s your image (Generated in ${time} seconds)`,
        attachment: response.data,
      });
    } catch (e) {
      console.error("Error generating image:", e);
      message.reply(`❌ Error: ${e.message || "Failed to generate image. Please try again later."}`);
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
