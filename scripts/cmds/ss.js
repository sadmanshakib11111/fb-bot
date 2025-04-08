const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

module.exports.config = {
  name: "ss",
  version: "1.0",
  author: "rasin",
  role: 2,
  description: "Take a screenshot of a website",
  category: "utility",
  guide: { en: "screenshot <url>" },
  coolDowns: 5,
};

exports.onStart = async function ({ api, event, args }) {
  const url = args.join(" ");
  if (!url) {
    return api.sendMessage("Please provide a URL.", event.threadID);
  }

  try {
    const response = await axios.get(
      `https://developer-rasin420.onrender.com/api/rasin/screenshot?url=${encodeURIComponent(url)}`,
      { responseType: "arraybuffer" } // We are still expecting an image
    );

    console.log('Response:', response); // Log the full response for debugging
    console.log('Content-Type:', response.headers['content-type']); // Log the content-type

    if (response.headers['content-type'].startsWith('image/')) {
      const imageBuffer = Buffer.from(response.data, 'binary');
      api.sendMessage(
        {
          body: "Screenshot Saved <😽",
          attachment: imageBuffer,  // Send the image buffer directly
        },
        event.threadID,
        event.messageID
      );
    } else {
      api.sendMessage("Failed to take a screenshot. Response is not an image.", event.threadID);
    }
  } catch (error) {
    console.error("Error taking screenshot:", error);
    api.sendMessage("Failed to take a screenshot.", event.threadID);
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
