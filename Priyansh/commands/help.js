module.exports.config = {
	name: "help",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Beginner's Guide",
	commandCategory: "system",
	usages: "[Name module]",
	cooldowns: 5
};

module.exports.handleEvent = function ({ api, event }) {
	const { commands } = global.client;
	
	if (!event.body) return;

	const { threadID, messageID, body } = event;

	if (body.indexOf("help") != 0) return;

	const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);


	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());

	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	return api.sendMessage(`🔰 ${command.config.name} 🔰\n${command.config.description}\n\n❯ Using: ${prefix}${command.config.name} ${(command. config.usages) ? command.config.usages : ""}\n❯ Group: ${command.config.commandCategory}\n❯ Timeout: ${command.config.cooldowns} seconds(s)\n❯ Permissions: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Administrator" : "Bot operator" )}\n\ n» Module code by ${command.config.credits} «`, threadID, messageID);
}

module.exports.run = function({ api, event, args }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	
	if (!command) {
		const command = commands.values();
		var group = [], msg = "";
		for (const commandConfig of command) {
			if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase())) group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
			else group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
		}
		group.forEach(commandGroup => msg += `🔰 ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} 🔰\n${commandGroup.cmds.join(', ' )}\n\n`);
return api.sendMessage(msg + `[ Use: "${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX}help each command above" for detailed usage! | There are currently ${commands.size} commands available on this bot.
👉 Contact admin NaCl for more information about bot | https://www.facebook.com/icotacteeee ]
📣Help will automatically remove after 60s`, event.threadID , (err, info) => setTimeout ( () => { api.unsendMessage(info.messageID) } , 60000))

	}

	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	return api.sendMessage(`🔰 ${command.config.name} 🔰\n${command.config.description}\n\n❯ Usage: ${prefix}${command.config.name} ${( command.config.usages) ? command.config.usages : ""}\n❯ Group: ${command.config.commandCategory}\n❯ Timeout: ${command.config.cooldowns} seconds(s)\ n❯ Permissions: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin" : "Bot operator" )}\ n\n» Module code by ${command.config.credits} «`, threadID, messageID);
}
