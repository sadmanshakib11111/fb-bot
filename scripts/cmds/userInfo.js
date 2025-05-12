const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "spy",
    aliases: ["userinfo", "uinfo"],
    version: "1.0",
    role: 0,
    author: "Rasin",
    description: "Get user information",
    category: "information",
    countDown: 10,
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) uid = match[1];
      }
    }

    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uid2 || uid1;
    }

    const userInfo = await api.getUserInfo(uid);
    const avatarUrl = await usersData.getAvatarUrl(uid);
    const gender = userInfo[uid].gender;
    const genderText =
      gender === 1 ? "𝙶𝚒𝚛𝚕🙋🏻‍♀️" : gender === 2 ? "Boy🙋🏻‍♂️" : "𝙶𝚊𝚢🤦🏻‍♂️";

    const money = (await usersData.get(uid)).money;
    const allUser = await usersData.getAll();
    const rank =
      allUser.slice().sort((a, b) => b.exp - a.exp).findIndex((u) => u.userID === uid) + 1;
    const moneyRank =
      allUser.slice().sort((a, b) => b.money - a.money).findIndex((u) => u.userID === uid) + 1;

    const position = userInfo[uid].type;

    const userInformation = `
╭────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]
├‣ 𝙽𝚊𝚖𝚎: ${userInfo[uid].name}
├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}
├‣ 𝚄𝙸𝙳: ${uid}
├‣ 𝙲𝚕𝚊𝚜𝚜: ${position ? position.toUpperCase() : "𝙽𝚘𝚛𝚖𝚊𝚕 𝚄𝚜𝚎𝚛🥺"}
├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${userInfo[uid].vanity || "𝙽𝚘𝚗𝚎"}
├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${userInfo[uid].profileUrl}
├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${
      userInfo[uid].isBirthday !== false
        ? userInfo[uid].isBirthday
        : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"
    }
├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}
╰‣ 𝙵𝚛𝚒𝚎𝚗𝚍 𝚠𝚒𝚝𝚑 𝚋𝚘𝚝: ${
      userInfo[uid].isFriend ? "𝚈𝚎𝚜✅" : "𝙽𝚘❎"
    }`;

    message.reply({
      body: userInformation,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
    });
  },
};

function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
