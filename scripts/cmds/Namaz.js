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
      const messageBody = `ㅤㅤ🕌 Prayer Times\n✿──────────────✿\n\n❏ Fajr: ${timings.Fajr}\n❏ Sunrise: ${timings.Sunrise}\n❏ Dhuhr: ${timings.Dhuhr}\n❏ Asr: ${timings.Asr}\n❏ Maghrib: ${timings.Maghrib}\n❏ Isha: ${timings.Isha}`;

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