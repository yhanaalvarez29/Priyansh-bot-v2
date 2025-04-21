const PastebinAPI = require('pastebin-js');
const path = require('path');
const fs = require('fs');

module.exports.config = {
  name: "menu",
  version: "1.0",
  credits: "Blake Cyphrus󱢏",//go change mo lang ok lang sakin WHAAHHAHA labyoy☺️
  description: "Install a module or command from a Pastebin link.",
  commandCategory: "Utility",
  cooldowns: 5,
  usages: " (filename) (pastebin link)."
};

module.exports.run = async function ({ api, event, args, content }) {
  let pogionly = ["", ""]; // lagay mo dyan uid mo

  try {
    if (!pogionly.includes(event.senderID)) {
      return api.sendMessage("Sorry, you don't have permission to use this command.", event.threadID);
    }

    if (args.length !== 2) {
      return api.sendMessage('Invalid usage. Please check: !help install', event.threadID);
    }

    let filename = args[0];
    let pastebinLink = args[1];

    const axios = require('axios');
    try {
      const response = await axios.get(pastebinLink);
      if (response.status === 200) {
        // Write the retrieved code to the specified filename in your project directory
        let moduleDirectory = './commands/'; // Adjust mo nalang tong directory kung d ganto sayo kasi ganto akin eh
        let filePath = path.join(__dirname, '..', moduleDirectory, filename);
        fs.writeFileSync(filePath, response.data);
        api.sendMessage(`Installed ${filename} successfully in your commands.`, event.threadID);
      } else {
        api.sendMessage(`Error: Unable to install the module or command. HTTP Status: ${response.status}`, event.threadID);
      }
    } catch (error) {
      api.sendMessage(`Error: Unable to install the module or command. Details: ${error.message}`, event.threadID);
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
