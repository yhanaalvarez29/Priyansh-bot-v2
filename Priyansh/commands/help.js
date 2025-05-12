const moment = require('moment');
const axios = require('axios');

module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Blue",
  description: "Get help about available commands.",
  usePrefix: true,
  commandCategory: "information",
  usages: "[command]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const prefix = global.config.PREFIX;
  const owner = config.DESIGN.Admin;
  const botname = global.config.BOTNAME;
  let msg = `      COMMANDS LIST OF ${botname} THAT YOU CAN USE \n❍──────────❍\nBot Owner: ${owner}\nPrefix: ${prefix}                                                                     ❍──────────❍\n`;

  if (!args[0]) {
    const commandList = Array.from(commands.values());
    const itemsPerPage = 10;
    const totalPages = Math.ceil(commandList.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `◖Invalid page number. Please choose a page between 1 and ${totalPages}◗`,
          threadID,
          messageID
        );
      }
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCommands = commandList.slice(startIdx, endIdx);

    for (let i = 0; i < visibleCommands.length; i++) {
      const cmd = visibleCommands[i].config;
      msg += `「 ${i + 1} 」 ⟩ ${prefix}${cmd.name} ⟩ ${cmd.description}\n`;
    }

    msg += `❍──────────❍\n»Page (${currentPage}/${totalPages})«\nType: "${prefix}help <command name>" for more details about that command💞\n›Currently available ${commandList.length} commands on this bot‹\n📄Use ${prefix}help <Number of pages>`;

    ////////// Fetch random quote////////
    const quoteResponse = await axios.get('https://api.quotable.io/random');
    const quote = quoteResponse.data.content;
    const author = quoteResponse.data.author;
    msg += `\n❍──────────❍\n[QUOTE💕 ]: ${quote} - ${author}`;

    // Fetch random Bible verse//
    const bibleVerseResponse = await axios.get('https://labs.bible.org/api/?passage=random&type=json');
    const bibleVerse = bibleVerseResponse.data[0].text;
    const bibleReference = bibleVerseResponse.data[0].bookname;
    msg += `\n❍──────────❍\n[BibleVerse 📖 ]: ${bibleVerse} - ${bibleReference}`;

    // DYK API
    const dykResponse = await axios.get('https://useless-facts.sameerkumar.website/api');
    const dyk = dykResponse.data.data;
    msg += `\n❍──────────❍\n[Do you know💁]: ${dyk}`;

    const header = `❍──────────❍`;
    const footer = `❍──────────❍`;

    const fullMsg = header + msg + footer;

    api.sendMessage(fullMsg, threadID, messageID);
  } else {
    // Handle specific command details if args[0] is provided //
    const commandName = args[0].toLowerCase();
    if (commands.has(commandName)) {
      const cmd = commands.get(commandName).config;
      msg = `Name: ${prefix}${cmd.name}\nDescription: ${cmd.description}\nUsage: ${prefix}${cmd.name} ${cmd.usages}\nCategory: ${cmd.commandCategory}\nCooldown: ${cmd.cooldowns} seconds(s)\nPermission: ${
        cmd.hasPermission === 0
          ? "User"
          : cmd.hasPermission === 1
          ? "Admin group"
          : "Johnwyll Yasis M."
      }\nCredits: ${cmd.credits}`;
      api.sendMessage(msg, threadID, messageID);
    } else {
      api.sendMessage(`◖Invalid command name. Type "${prefix}help" to see the list of available commands.◗`, threadID, messageID);
    }
  }
};
