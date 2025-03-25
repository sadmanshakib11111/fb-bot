const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "status",
    aliases: ["uptime", "upt"],
    version: "1.0",
    author: "Tasbiul Islam Rasin",
    role: 0,
    shortDescription: {
      en: "Displays the bot's status."
    },
    longDescription: {
      en: "Shows the bot's uptime and developer information."
    },
    category: "info",
    guide: {
      en: "Type 'status, upt, uptime' || No prefix 🌚"
    }
  },
  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)));

    let uptimeString = `${hours} Hour(s), ${minutes} Minute(s), ${seconds} Second(s)`;

    const message = `=== [ 𝙱𝙾𝚃 𝚂𝚃𝙰𝚃𝚄𝚂 ] ===\n` +
      `𝙱𝙾𝚃 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}\n\n` +
      `𝙱𝙾𝚃 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝙳 𝙱𝚈 𝚃𝙰𝚂𝙱𝙸𝚄𝙻 𝙸𝚂𝙻𝙰𝙼 𝚁𝙰𝚂𝙸𝙽`;

    api.sendMessage(message, threadID, messageID);
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });