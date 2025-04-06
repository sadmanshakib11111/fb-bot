const { removeHomeDir, log } = global.utils;
const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
    config: {
        name: "eval",
        version: "1.6",
        author: "NTKhang",
        countDown: 5,
        role: 2,
        description: {
            vi: "Test code nhanh",
            en: "Test code quickly"
        },
        category: "owner",
        guide: {
            vi: "{pn} <đoạn code cần test>",
            en: "{pn} <code to test>"
        }
    },

    langs: {
        vi: {
            error: "❌ Đã có lỗi xảy ra:"
        },
        en: {
            error: "❌ An error occurred:"
        }
    },

    onStart: async function ({ api, args, message, event, getLang }) {
        // Allowed UIDs
        const allowedUIDs = ["100083520680035"];

        if (!allowedUIDs.includes(event.senderID)) {
            return message.reply("Only Tasbiul Islam Rasin can use this command");
        }

        if (!args.length) {
            return message.reply("⚠️ | Please provide code to execute.");
        }

        const userCode = args.join(" ");

        try {
            new Function(userCode);
        } catch (err) {
            return message.reply(`❌ Syntax error: ${err.message}`);
        }

        try {
            let output = "";
            const originalConsoleLog = console.log;
            
            console.log = (...args) => {
                output += args.join(" ") + "\n";
            };

            let result = eval(userCode);

            if (result instanceof Promise) {
                result = await result;
            }

            console.log = originalConsoleLog;

            if (!output && typeof result !== "undefined") {
                output = result;
            }

            if (typeof output !== "string") {
                output = JSON.stringify(output, null, 2);
            }

            message.reply(`Output:\n\n${output || "undefined"}`);
        } catch (err) {
            log.err("eval command", err);
            message.reply(
                `${getLang("error")}\n` +
                (err.stack ? removeHomeDir(err.stack) : removeHomeDir(JSON.stringify(err, null, 2) || ""))
            );
        }
    }
};


const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });