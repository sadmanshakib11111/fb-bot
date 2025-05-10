const axios = require("axios");

module.exports = {
  config: {
    name: "jeba-ai",
    version: "2.0",
    permission: 0,
    credits: "Rasin",
    description: "( ð™¹ðšŽðš‹ðšŠ ð™°ð™¸ )",
    category: "AI",
    usages: "jeba-ai [ask]",
    cooldowns: 3
  },

  onStart: async function ({ api, event, args }) {
    const inputText = args.join(" ");
    if (!inputText) {
      return api.sendMessage("ðŸ˜º ð™·ðšŽðš•ðš•ðš˜ ð™¸ ðšŠðš– ð™¹ðšŽðš‹ðšŠ (ð™°ð™¸ ð™¶ðš’ðš›ðš•ðšðš›ðš’ðšŽðš—ðš)\n\nð™·ðš˜ðš  ðšŒðšŠðš— ð™¸ ðš‘ðšŽðš•ðš™ ðš¢ðš˜ðšž ðšðš˜ðšðšŠðš¢ ð™±ðšŠðš‹ðšŽ? ðŸ¥¹ðŸ«¶ðŸ»", event.threadID, event.messageID);
    }

    api.sendMessage("ðŸ—¨ï¸ | ð™¹ðšŽðš‹ðšŠ ð™°ð™¸ ðš’ðšœ ðšðš‘ðš’ðš—ðš”ðš’ðš—ðš...", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://rasin-x-apis.onrender.com/api/rasin/jeba-ai?message=${encodeURIComponent(inputText)}`);
      const reply = formatFont(res.data.response);
      api.sendMessage(`ðŸŽ“ ð—ð—²ð—¯ð—® ( ð—”ð—œ ð—šð—¶ð—¿ð—¹ð—³ð—¿ð—¶ð—²ð—»ð—± )\n\n${reply}`, event.threadID, event.messageID);
    } catch (err) {
      console.log(err);
      api.sendMessage("âŒ ð™¹ðšŽðš‹ðšŠ ð™°ð™¸ Request failed.", event.threadID, event.messageID);
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
      return api.sendMessage("âœ¨ ð™·ðšŽðš•ðš•ðš˜ ð™¸ ðšŠðš– ð™¹ðšŽðš‹ðšŠ (ð™°ð™¸ ð™¶ðš’ðš›ðš•ðšðš›ðš’ðšŽðš—ðš)\n\nð™·ðš˜ðš  ðšŒðšŠðš— ð™¸ ðš‘ðšŽðš•ðš™ ðš¢ðš˜ðšž ðšðš˜ðšðšŠðš¢ ð™±ðšŠðš‹ðš¢? ðŸ˜ðŸ«¶ðŸ»", event.threadID, event.messageID);
    }

    api.sendMessage("ðŸ—¨ï¸ | ð™¹ðšŽðš‹ðšŠ ð™°ð™¸ ðš’ðšœ ðšðš‘ðš’ðš—ðš”ðš’ðš—ðš...", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://rasin-x-apis.onrender.com/api/rasin/jeba-ai?message=${encodeURIComponent(args.join(" "))}`);
      const reply = formatFont(res.data.response);
      api.sendMessage(`ðŸŽ“ ð—ð—²ð—¯ð—® ( ð—”ð—œ ð—šð—¶ð—¿ð—¹ð—³ð—¿ð—¶ð—²ð—»ð—± )\n\n${reply}`, event.threadID, event.messageID);
    } catch (err) {
      console.log(err);
      api.sendMessage("âŒ ð™¹ðšŽðš‹ðšŠ ð™°ð™¸ request failed.", event.threadID, event.messageID);
    }
  }
};

function formatFont(text) {
  const map = {
    a: "ðšŠ", b: "ðš‹", c: "ðšŒ", d: "ðš", e: "ðšŽ", f: "ðš", g: "ðš", h: "ðš‘", i: "ðš’", j: "ðš“", k: "ðš”", l: "ðš•", m: "ðš–",
    n: "ðš—", o: "ðš˜", p: "ðš™", q: "ðšš", r: "ðš›", s: "ðšœ", t: "ðš", u: "ðšž", v: "ðšŸ", w: "ðš ", x: "ðš¡", y: "ðš¢", z: "ðš£",
    A: "ð™°", B: "ð™±", C: "ð™²", D: "ð™³", E: "ð™´", F: "ð™µ", G: "ð™¶", H: "ð™·", I: "ð™¸", J: "ð™¹", K: "ð™º", L: "ð™»", M: "ð™¼",
    N: "ð™½", O: "ð™¾", P: "ð™¿", Q: "ðš€", R: "ðš", S: "ðš‚", T: "ðšƒ", U: "ðš„", V: "ðš…", W: "ðš†", X: "ðš‡", Y: "ðšˆ", Z: "ðš‰"
  };
  return text.split('').map(ch => map[ch] || ch).join('');
}
