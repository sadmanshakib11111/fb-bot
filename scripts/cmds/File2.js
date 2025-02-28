const fs = require('fs');
const path = require('path');

const commandsPerPage = 30; // Number of commands per page

module.exports = {
    config: {
        name: "listcmd",
        aliases: ["cmdlist", "lc"],
        version: "1.0",
        author: "RUBISH",
        countDown: 0,
        role: 0,
        shortDescription: "Show all available command with file name",
        longDescription: "Show all available command with file name",
        category: "Owner",
        guide: "{pn} <page number>"
    },

    onStart: async ({ api, event, args }) => {
      const fuck = args.join(' ');
      const permission = global.GoatBot.config.adminBot;
      if (!permission.includes(event.senderID)) {
        api.sendMessage(fuck, event.threadID, event.messageID);
        return;
      }
        const commandsPath = path.join(__dirname, '..', 'cmds');

        try {
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            if (commandFiles.length === 0) {
                api.sendMessage("There are no commands available.", event.threadID);
                return;
            }

            const sortedCommandFiles = commandFiles.sort(); // Sort command files alphabetically
            const page = parseInt(args[0]) || 1;
            const startIndex = (page - 1) * commandsPerPage;
            const endIndex = startIndex + commandsPerPage;
            const visibleCommands = sortedCommandFiles.slice(startIndex, endIndex);

            const commandList = visibleCommands.map((file, index) => {
                const commandName = path.basename(file, '.js');
                const filePath = path.join(commandsPath, file);
                const commandModule = require(filePath);
                const commandConfig = commandModule.config;
                const serialNumber = startIndex + index + 1; // Calculate serial number
                return `【${serialNumber}】File :⤑ ${commandName}.js\nCmdName :⤑ ${commandConfig.name}`;
            }).join('\n\n');

            const totalPages = Math.ceil(sortedCommandFiles.length / commandsPerPage);
            const message = `Available commands:⇾\n______________________________ \n${commandList}\n\n______________________________\n\n                  Page ${page}/${totalPages}`;
            api.sendMessage(message, event.threadID);
        } catch (error) {
            console.error('Error listing commands:', error);
            api.sendMessage("An error occurred while listing commands.", event.threadID);
        }
    }
};
