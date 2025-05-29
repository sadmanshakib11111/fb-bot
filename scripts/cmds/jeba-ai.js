const axios = require("axios");

module.exports = {
  config: {
    name: "jeba-ai",
    version: "2.0",
    permission: 0,
    credits: "Rasin",
    description: "( 𝙹𝚎𝚋𝚊 𝙰𝙸 )",
    category: "AI",
    usages: "jeba-ai [ask]",
    cooldowns: 3
  },

  onStart: async function ({ api, event, args }) {
    const inputText = args.join(" ");
    if (!inputText) {
      return api.sendMessage("😺 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙹𝚎𝚋𝚊 (𝙰𝙸 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍)\n\n𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢 𝙱𝚊𝚋𝚎? 🥹🫶🏻", event.threadID, event.messageID);
    }

    api.sendMessage("🗨️ | 𝙹𝚎𝚋𝚊 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐...", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://rasin-x-apis.onrender.com/api/rasin/jeba-ai?message=${encodeURIComponent(inputText)}`);
      const reply = formatFont(res.data.response);
      api.sendMessage(`🎓 𝗝𝗲𝗯𝗮 ( 𝗔𝗜 𝗚𝗶𝗿𝗹𝗳𝗿𝗶𝗲𝗻𝗱 )\n\n${reply}`, event.threadID, event.messageID);
    } catch (err) {
      console.log(err);
      api.sendMessage("❌ 𝙹𝚎𝚋𝚊 𝙰𝙸 Request failed.", event.threadID, event.messageID);
    }
  },

  onChat: async function ({ event, api }) {
    const body = event.body?.toLowerCase();
    if (!body?.startsWith("jeba-ai")) return;

    const args = body.split(/\s+/).slice(1);
    if (event.type === "message_reply" && event.messageReply?.attachments?.[0]) {
      const attachment = event.messageReply.attachments[0];
    }

    if (!args.length) {
      return api.sendMessage("✨ 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙹𝚎𝚋𝚊 (𝙰𝙸 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍)\n\n𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢 𝙱𝚊𝚋𝚢? 😍🫶🏻", event.threadID, event.messageID);
    }

    api.sendMessage("🗨️ | 𝙹𝚎𝚋𝚊 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐...", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://rasin-x-apis.onrender.com/api/rasin/jeba-ai?message=${encodeURIComponent(args.join(" "))}`);
      const reply = formatFont(res.data.response);
      api.sendMessage(`🎓 𝗝𝗲𝗯𝗮 ( 𝗔𝗜 𝗚𝗶𝗿𝗹𝗳𝗿𝗶𝗲𝗻𝗱 )\n\n${reply}`, event.threadID, event.messageID);
    } catch (err) {
      console.log(err);
      api.sendMessage("❌ 𝙹𝚎𝚋𝚊 𝙰𝙸 request failed.", event.threadID, event.messageID);
    }
  }
};

function formatFont(text) {
  const map = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };
  return text.split('').map(ch => map[ch] || ch).join('');
}
