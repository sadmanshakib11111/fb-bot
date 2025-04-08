const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

const API_URL = "https://imgur-rasin69.vercel.app/api/rasin/imgur";

module.exports.config = {
  name: "imgur",
  version: "6.9",
  author: "rasin",
  countDown: 5,
  role: 0,
  category: "media",
  description: "Convert image or video into Imgur link",
  usages: "reply [image/video]",
};

module.exports.onStart = async function ({ api, event }) {
  if (
    !event.messageReply ||
    !event.messageReply.attachments ||
    event.messageReply.attachments.length === 0
  ) {
    return api.sendMessage(
      "Please reply an image or video",
      event.threadID,
      event.messageID
    );
  }

  const attachment = event.messageReply.attachments[0];

  const allowedTypes = ["photo", "video"];
  if (!allowedTypes.includes(attachment.type)) {
    return api.sendMessage(
      "Muri Khaw",
      event.threadID,
      event.messageID
    );
  }

  try {
    const imageUrl = attachment.url;
    const apiResponse = await axios.post(API_URL, { imageUrl });

    const imgurLink = apiResponse.data.link;

    api.sendMessage(
      `${imgurLink}`,
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.error("❌ Upload error:", error);
    return api.sendMessage(
      "❌ Failed to convert the file into an Imgur link. Try again later.",
      event.threadID,
      event.messageID
    );
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
