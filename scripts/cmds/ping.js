module.exports = {
  config: {
    name: "ping",
    aliases: ["testping"],
    author: "Author name jaina ki korbi",
    description: "Ping command",
    category: "test",
  },
  onStart: function ({ api, event }) {
    api.sendMessage("Pong!", event.threadID, event.messageID);
  },
};