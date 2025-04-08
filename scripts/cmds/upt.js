const os = require('os');
const { bold } = require("fontstyles"); 
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: 'uptime',
    aliases: ['upt', 'up'],
    version: '1.1.1',
    usePrefix: false,
    author: 'Rasin',
    countDown: 4,
    role: 2,
    shortDescription: 'bot upt stats',
    longDescription: {
      id: 'Display bot uptime and system stats with media ban check',
      en: 'bot stats'
    },
    category: 'system',
    guide: {
      id: '{pn}: Display bot uptime and system stats with media ban check',
      en: 'ntg'
    }
  },

  onStart: async function ({ message, event, usersData, threadsData, api }) {
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
      const mediaBanStatus = mediaBan ? '🚫 Media is currently banned in this chat.' : '☺️ 𝗠𝗲𝗱𝗶𝗮 𝗶𝘀 𝗻𝗼𝘁 𝗯𝗮𝗻𝗻𝗲𝗱 𝗶𝗻 𝘁𝗵𝗶𝘀 𝗰𝗵𝗮𝘁!';
      const uptimeResponse = uptime > 86400 ?  "" : "𝗜𝘁'𝘀 𝗮𝗹𝗹 𝗿𝗶𝗴𝗵𝘁 🤗";

      const loadingFrames = [
        '[▱▱▱▱▱▱▱▱▱▱]',
        '[▰▱▱▱▱▱▱▱▱▱]',
        '[▰▰▰▱▱▱▱▱▱▱]',
        '[▰▰▰▰▰▰▰▱▱▱]',
        '[▰▰▰▰▰▰▰▰▰▰]'
      ];

      const editSegments = [
        `${bold("🙆🏻‍♂️ 𝐘𝐨𝐮𝐫 𝐒𝐲𝐬𝐭𝐞𝐦 𝐈𝐧𝐟𝐨 𝐈𝐬 𝐑𝐞𝐚𝐝𝐲")}\n❏ 𝗨𝗽𝘁𝗶𝗺𝗲: 【 ${days} 】𝗗𝗮𝘆𝘀, 【 ${hours} 】𝗛𝗼𝘂𝗿𝘀, 【 ${minutes} 】𝗠𝗶𝗻𝘂𝘁𝗲𝘀, 【 ${seconds} 】𝗦𝗲𝗰𝗼𝗻𝗱𝘀\n❏ 𝗠𝗲𝗺𝗼𝗿𝘆 𝗨𝘀𝗮𝗴𝗲: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} 𝗠𝗕`,
        `❏ 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝗺𝗼𝗿𝘆: ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} 𝗚𝗕\n❏ 𝗙𝗿𝗲𝗲 𝗠𝗲𝗺𝗼𝗿𝘆: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} 𝗚𝗕\n❏ 𝗠𝗲𝗺𝗼𝗿𝘆 𝗨𝘀𝗮𝗴𝗲: ${memoryUsagePercentage}%\n❏ 𝗖𝗣𝗨 𝗨𝘀𝗮𝗴𝗲 (1m): ${cpuUsage[0].toFixed(2)}%`,
        `❏ 𝗖𝗣𝗨 𝗨𝘀𝗮𝗴𝗲 (5m): ${cpuUsage[1].toFixed(2)}%\n❏ 𝗖𝗣𝗨 𝗨𝘀𝗮𝗴𝗲 (15m): ${cpuUsage[2].toFixed(2)}%\n❏ 𝗖𝗣𝗨 𝗖𝗼𝗿𝗲𝘀: ${cpuCores}\n❏ 𝗖𝗣𝗨 𝗠𝗼𝗱𝗲𝗹: ${cpuModel}`,
        `❏ 𝗡𝗼𝗱𝗲.𝗷𝘀 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${nodeVersion}\n❏ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${platform}\n❏ 𝗽𝗶𝗻𝗴: ${botPing}𝗺𝘀\n❏ 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${users.length}\n❏  𝗧𝗼𝘁𝗮𝗹 𝗚𝗿𝗼𝘂𝗽𝘀 : ${groups.length}`,
        `❏ ${bold("𝗡𝗲𝘁𝘄𝗼𝗿𝗸 𝗜𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲𝘀")}\n${networkInfo}\n\n${uptimeResponse}`
      ];

      let sentMessage = await message.reply("sᴛᴀʀᴛɪɴɢ sʏsᴛᴇᴍ ᴀɴᴀʟʏsɪs");

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