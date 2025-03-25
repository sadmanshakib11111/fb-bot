const axios = require("axios");

const API_URL = "https://imgur-rasin69.vercel.app/api/rasin/imgur";

module.exports.config = {
  name: "imgur",
  version: "6.9",
  author: "rasin",
  countDown: 5,
  role: 0,
  category: "media",
  description: "Convert image into Imgur link",
  usages: "reply [image]",
};

module.exports.onStart = async function ({ api, event }) {
  if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
    return api.sendMessage(
      "Please reply to an image to convert it into an Imgur link.",
      event.threadID,
      event.messageID,
    );
  }

  const attachment = event.messageReply.attachments[0];

  if (attachment.type !== "photo") {
    return api.sendMessage(
      "Only images are supported. Please reply to an image.",
      event.threadID,
      event.messageID,
    );
  }

  try {
    const imageUrl = attachment.url;
    const apiResponse = await axios.post(API_URL, { imageUrl });

    const imgurLink = apiResponse.data.link;

    api.sendMessage(
      `${imgurLink}`,
      event.threadID,
      event.messageID,
    );
  } catch (error) {
    console.error(error);
    return api.sendMessage(
      "Failed to convert the image into an Imgur link. Please try again later.",
      event.threadID,
      event.messageID,
    );
  }
};