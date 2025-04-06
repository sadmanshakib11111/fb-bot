const os = require('os');
const { GoatWrapper } = require("fca-liane-utils");

const { bold } = require("fontstyles"); // If fontstyles is missing, use the fallback function below.
// const bold = (text) => `**${text}**`; // Uncomment if "fontstyles" is not installed.

module.exports = {
  config: {
    name: 'uptime',
    aliases: ['stats', 'status', 'system', 'rtm'],
    version: '1.5',
    usePrefix: false,
    author: 'Mahi--',
    countDown: 15,
    role: 0,
    shortDescription: 'Display bot uptime and system stats with media ban check',
    longDescription: {
      id: 'Display bot uptime and system stats with media ban check',
      en: 'Display bot uptime and system stats with media ban check'
    },
    category: 'system',
    guide: {
      id: '{pn}: Display bot uptime and system stats with media ban check',
      en: '{pn}: Display bot uptime and system stats with media ban check'
    }
  },
  onStart: async function ({ message, event, usersData, threadsData, api }) {
    if (this.config.author !== 'Mahi--') {
      return message.reply("⚠ Unauthorized author change detected. Command execution stopped.");
    }

    const startTime = Date.now();
    const users = await usersData.getAll();
    const groups = await threadsData.getAll();
    const uptime = process.uptime();

    try {
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const memoryUsage = process.memoryUsage();
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2);

      const cpuUsage = os.loadavg();
      const cpuCores = os.cpus().length;
      const cpuModel = os.cpus()[0].model;
      const nodeVersion = process.version;
      const platform = os.platform();
      const networkInterfaces = os.networkInterfaces();
      
      const networkInfo = Object.entries(networkInterfaces).map(([iface, details]) => {
        return `• ${iface}: ${details.map(info => `${info.family}: ${info.address}`).join(', ')}`;
      }).join('\n');

      const endTime = Date.now();
      const botPing = endTime - startTime;
      const totalMessages = users.reduce((sum, user) => sum + (user.messageCount || 0), 0);
      const mediaBan = await threadsData.get(event.threadID, 'mediaBan') || false;
      const mediaBanStatus = mediaBan ? '🚫 Media is currently banned in this chat.' : '✅ Media is not banned in this chat.';
      const uptimeResponse = uptime > 86400 ? "I've been running for quite a while now! 💪" : "Just getting started! 😎";

      const loadingFrames = [
        'LOADING.\n[█▒▒▒▒▒▒▒▒▒]',
        'LOADING..\n[██▒▒▒▒▒▒▒▒]',
        'LOADING...\n[████▒▒▒▒▒▒]',
        'LOADING...\n[███████▒▒]',
        'LOADED...\n[█████████]'
      ];

      const editSegments = [
        `${bold("🖥 System Statistics")}\n• Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s\n• Memory Usage: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        `• Total Memory: ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n• Free Memory: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB\n• Memory Usage: ${memoryUsagePercentage}%\n• CPU Usage (1m): ${cpuUsage[0].toFixed(2)}%`,
        `• CPU Usage (5m): ${cpuUsage[1].toFixed(2)}%\n• CPU Usage (15m): ${cpuUsage[2].toFixed(2)}%\n• CPU Cores: ${cpuCores}\n• CPU Model: ${cpuModel}`,
        `• Node.js Version: ${nodeVersion}\n• Platform: ${platform}\n• Ping: ${botPing}ms\n• Total Users: ${users.length}\n• Total Groups: ${groups.length}`,
        `• Messages Processed: ${totalMessages}\n${mediaBanStatus}\n\n🌐 ${bold("Network Interfaces")}\n${networkInfo}\n\n${uptimeResponse}`
      ];

      let sentMessage = await message.reply("🖥 Initializing system stats...");

      const editMessageContent = (index) => {
        if (index < editSegments.length) {
          const loadingProgress = loadingFrames[index];
          const currentContent = `${loadingProgress}\n\n${editSegments.slice(0, index + 1).join('\n\n')}`;
          api.editMessage(currentContent, sentMessage.messageID, () => {
            setTimeout(() => editMessageContent(index + 1), 600);
          });
        }
      };
      
      editMessageContent(0);
    } catch (err) {
      console.error(err);
      return message.reply("❌ An error occurred while fetching system statistics.");
    }
  }
};


const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });