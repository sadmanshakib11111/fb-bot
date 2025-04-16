module.exports = {
    config: {
      name: "🫣",
      version: "1.0",
      author: "Rasin",
      countDown: 0,
      role: 0,
      shortDescription: {
        en: "No prefix video"
      },
      category: "no prefix",
      guide: {
        en: "No prefix"
      },
      hide: true
    },
  
    onStart: async function ({ event, api }) {
      const { threadID, messageID, body } = event;
  
      if (!body) return;
  
      const triggerEmojis = ["🫣"];
      if (triggerEmojis.includes(body.trim())) {
        const videoUrl = [
          "https://i.imgur.com/1qS4jxx.mp4"
        ];
  
        const randomVid = videoUrl[Math.floor(Math.random() * videoUrl.length)];
  
        return api.sendMessage(
          {
            body: "😌❤️‍🩹",
            attachment: await global.utils.getStreamFromURL(randomVid)
          },
          threadID,
          messageID
        );
      }
    }
  };
