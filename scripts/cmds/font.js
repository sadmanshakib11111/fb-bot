const fs = require('fs');
const path = require('path');

const styleFilePath = path.resolve(__dirname || process.cwd(), 'font.json');
let styleData = {};
if (fs.existsSync(styleFilePath)) {
    styleData = JSON.parse(fs.readFileSync(styleFilePath, 'utf8'));
}

function convertToStyledFont(text, font = "1") {
    if (!styleData[font]) return text; 
    return text.split('').map(char => styleData[font][char] || char).join('');
}

module.exports = {
    config: {
        name: 'font',
        version: '2.0',
        author: 'chatgpt',
        role: 0,
        shortDescription: { en: 'Convert text to styled font' },
        longDescription: { en: 'Transform normal text into a stylish font using font.json mappings.' },
        category: 'utility',
        guide: {
            en: '{pn} [font number] [text] - Convert text to styled font\n{pn} list - Show available fonts'
        }
    },

    onStart: async function ({ args, message }) {
        if (args.length === 0) {
            return message.reply('⚠️ Please provide text or use "list" to see available fonts.');
        }

        if (args[0] === "list") {
            let availableFonts = Object.keys(styleData)
                .map(font => `${font}: ${convertToStyledFont("ChatGpt", font)}`)
                .join("\n");

            return message.reply(`📝 Available Styles:\n\n${availableFonts}`);
        }

        let font = "1"; // Default font
        if (!isNaN(args[0]) && styleData[args[0]]) {
            font = args.shift();
        }

        let inputText = args.join(' ');
        let styledText = convertToStyledFont(inputText, font);

        return message.reply(styledText);
    }
};
