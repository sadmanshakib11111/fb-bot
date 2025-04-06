const { GoatWrapper } = require("fca-liane-utils");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "namaz",
    aliases: ["prayertime", "salat"],
    version: "1.0",
    author: "Tasbiul Islam",
    description: "Fetch and display today's prayer times.",
    category: "utilities",
    guide: { en: "{pn}" },
  },

  onStart: async function ({ api, event }) {
    const PRAYER_API_URL = "https://developer-rasin420.onrender.com/api/rasin/prayertimes";

    try {
      // Fetch prayer times from API
      const response = await axios.get(PRAYER_API_URL);
      const data = response.data;

      if (!data || !data.timings) {
        return api.sendMessage(
          "❌ | Unable to fetch prayer times. Please try again later.",
          event.threadID,
          event.messageID
        );
      }

      const timings = data.timings;
      const messageBody = `ㅤㅤㅤ🕌 Prayer Times\n✿──────────────✿\n\nFajr: ${timings.Fajr}\nSunrise: ${timings.Sunrise}\nDhuhr: ${timings.Dhuhr}\nAsr: ${timings.Asr}\nMaghrib: ${timings.Maghrib}\nIsha: ${timings.Isha}\n\n\n✿──────────────✿
      
    __Tasbiul Islam Rasin__`;

      api.sendMessage(messageBody, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(
        "❌ | An error occurred while fetching prayer times. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });