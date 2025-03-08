const axios = require('axios');

module.exports = {
  config: {
    name: "namaz",
    aliases: ["prayertime", "salat"],
    version: "1.0",
    author: "Tasbiul Islam",
    description: "Fetch and display today's prayer times.",
    category: "utilities",
    guide: {
      en: "{pn}",
    },
  },

  onStart: async function ({ api, event }) {
    const PRAYER_API_URL = 'https://coder-rasin.vercel.app/prayertimes';

    try {
      // Fetch prayer times from your API
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

      const messageBody = `
🕌 Prayer Times

- Fajr: ${timings.Fajr}
- Sunrise: ${timings.Sunrise}
- Dhuhr: ${timings.Dhuhr}
- Asr: ${timings.Asr}
- Maghrib: ${timings.Maghrib}
- Isha: ${timings.Isha}

 __💙💙💙__
      `;
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
