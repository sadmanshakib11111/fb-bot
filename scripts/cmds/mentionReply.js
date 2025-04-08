
module.exports = {
	config: {
		name: "goiadmin",
		author: "𝗔𝗺𝗶𝗻𝘂𝗹 𝗦𝗼𝗿𝗱𝗮𝗿",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

onChat: function({ api, event }) {
	if (event.senderID !== "100083520680035") {
		var aid = ["100083520680035"];
		for (const id of aid) {
		if ( Object.keys(event.mentions) == id) {
			var msg = ["If you mention my Owner again, I will punch you! 😾👊🏻","Please do not tag my owner, he is currently unavailable. 🙃","I warned you! Don't tag my owner again! 😾😾","Don't mention my owner, he is busy right now. 🙂😁"];
			return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
		}
		}}
},
onStart: async function({}) {
	}
};