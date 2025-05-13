module.exports.config = {
    name: 'game2',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'ZiaRein',
    description: 'play someone',
    commandCategory: 'Game-mp',
    usages: `Please tag 1 person you want to play with\n\n Please Read:\nThis game is under beta test some of bugs and error will remain visible if you having a trouble while playing please contact the developer`,
    cooldowns: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": "",
      "jimp": "",
      "node-superfetch": ""
    }
};

module.exports.handleReply = async ({ handleReply, event, api ,Users}) => {

  function delay(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
  };
  var {x, y, d, d1, sizeboard, sectionSize, boardbuffer} = handleReply;
    var { threadID, senderID, messageID, body } = event;
    const chalk = global.nodemodule["chalk"];
    var args   = body.split(' ');
    if(!args[1]) return api.sendMessage("You have not entered the Y coordinates", threadID, messageID);
    var toadoX = parseInt(args[0]),
        toadoY = parseInt(args[1]);
