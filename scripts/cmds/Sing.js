const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "sing",
    version: "1.1.5",
    aliases: ["song", "music", "play"],
    author: "Tasbiul Islam Rasin",
    countDown: 5,
    role: 0,
    description: {
      en: "Download audio from YouTube"
    },
    category: "media",
    guide: {
      en: "{pn} [<song name>]:"+ "\n   Example:"+"\n{pn} chipi chipi chapa chapa"
    }
  },
  onStart: async ({api,args, event }) =>{
    if (!args.length) {
      return api.sendMessage("❌ Please provide a song name.", event.threadID, event.messageID);
    }
    
    let keyWord = args.join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    
    try {
      const { data } = await axios.get(`https://developer-rasin69.onrender.com/api/rasin/sing?query=${encodeURIComponent(keyWord)}`);
      
      if (!data || !data.link) {
        return api.sendMessage("⭕ No official song found.", event.threadID, event.messageID);
      }
      
      return api.sendMessage({
        body: `🎵 Title: ${data.title}`,
        attachment: await rasin(data.link, 'audio.mp3')
      }, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage("❌ An error occurred: " + err.message, event.threadID, event.messageID);
    }
  }
};

async function rasin(url, pathName) {
  try {
    const response = await axios.get(url,{
      responseType: "stream"
    });
    response.data.path = pathName;
    return response.data;
  }
  catch (err) {
    throw err;
  }
}


const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
