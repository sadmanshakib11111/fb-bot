module.exports = {
  config: {
    name: "edit",
    version: "1.0",
    author: "Nyx",
    role: 0,
    shortDescription: "Edit a bot's message",
    longDescription: "Edit a bot's message by replying to it with 'edit <message>'.",
    category: "user",
    guide: {
      en: "{p}{n} <message>",
    },
  },

  onStart: async function ({ api, event, args }) {
    if (!event.messageReply) {
      api.sendMessage("Please reply to a bot message to edit it.", event.threadID, event.messageID);
      return;
    }

    const replyMessage = event.messageReply.body;

    if (!replyMessage || !args || args.length === 0) {
      api.sendMessage("Invalid input. Please reply to a bot message and provide the new text.", event.threadID, event.messageID);
      return;
    }

    const editedMessage = `${args.join(" ")}`;

    console.log(`Attempting to edit message with ID: ${event.messageReply.messageID}`);
    console.log(`New content: ${editedMessage}`);

    try {
      const result = await api.editMessage(editedMessage, event.messageReply.messageID);
      console.log(`API Response: ${JSON.stringify(result)}`);
      if (result.success) {
        api.sendMessage("Message edited successfully!", event.threadID, event.messageID);
      } else {
        api.sendMessage("Failed to edit message. Please try again later.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error editing message:", error);
      api.sendMessage("An error occurred while editing the message. Please try again later.", event.threadID, event.messageID);
    }
  },
};