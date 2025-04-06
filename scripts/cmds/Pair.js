const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");
const fs = require("fs");
const Jimp = require("jimp"); // ইমেজ প্রসেসিং লাইব্রেরি

module.exports = {
  config: {
    name: "pair",
    version: "1.3",
    author: "Rasin",
    description: {
      en: "Calculate love pairing between two names with profile pictures."
    },
    guide: {
      en: "Type: !pair <name1> | <name2>"
    },
    category: "fun",
    usePrefix: true,
  },

  onStart: async function ({ message, args, event, api }) {
    const input = args.join(" ").split("|").map(item => item.trim());

    if (input.length !== 2) {
      return message.reply("⚠️ Please use the correct format: **!pair <name1> | <name2>**");
    }

    const [name1, name2] = input;

    // লাভ পার্সেন্টেজ ক্যালকুলেশন
    const lovePercentage = Math.floor(Math.random() * 101);

    // প্রোফাইল পিকচার সংগ্রহ
    const senderID = event.senderID;
    const mentionedID = Object.keys(event.mentions)[0];

    if (!mentionedID) {
      return message.reply("⚠️ Please mention a person: **!pair <your name> | @partner**");
    }

    try {
      const senderPicUrl = `https://graph.facebook.com/${senderID}/picture?width=200&height=200`;
      const mentionedPicUrl = `https://graph.facebook.com/${mentionedID}/picture?width=200&height=200`;

      // ব্যাকগ্রাউন্ড ইমেজ ডাউনলোড
      const background = await Jimp.read("https://i.postimg.cc/wjJ29HRB/background1.png");
      const senderPic = await Jimp.read(senderPicUrl);
      const mentionedPic = await Jimp.read(mentionedPicUrl);

      // প্রোফাইল পিকচার গোলাকৃতির করা
      senderPic.circle();
      mentionedPic.circle();

      // ছবিগুলোর অবস্থান সেট করা
      background.composite(senderPic.resize(100, 100), 50, 100);
      background.composite(mentionedPic.resize(100, 100), 350, 100);

      // লাভ পার্সেন্টেজ যোগ করা
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      background.print(font, 150, 250, `❤️ Love: ${lovePercentage}%`);

      // ইমেজ সংরক্ষণ করা
      const outputPath = "love_result.png";
      await background.writeAsync(outputPath);

      // ইমেজ পাঠানো
      message.reply({
        body: `💖✨ Love Matched! ✨💖\n🌟 ${name1} ❤️ ${name2}\n💌 Love Percentage: ${lovePercentage}%`,
        attachment: fs.createReadStream(outputPath),
      });

    } catch (error) {
      console.error("❌ Error:", error.message);
      message.reply("🚨 Error processing the image. Please try again later!");
    }
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
