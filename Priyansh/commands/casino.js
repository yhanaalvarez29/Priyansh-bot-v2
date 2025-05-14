module.exports.config = {
	name: "casino",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "tdunguwu",
	description: "Chơi tài xỉu",
	commandCategory: "Game",
	usages: "",
	cooldowns: 0
};	
module.exports.run = async function ({ api, event, args, Currencies, Users }) {
   
   const request = require('request');
   const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream, fs } = require("fs-extra");
  const { threadID, messageID, senderID } = event;
  const dataMoney = await Currencies.getData(senderID);
    const moneyUser = dataMoney.money;
  const choose = args[0];
  const kqua = args[1];
  const tiencuoc = args[2];
  if (!existsSync(__dirname + '/cache/casio.jpg')) {
        request('https://raw.githubusercontent.com/tdunguwu/key/main/roulette.jpg').pipe(createWriteStream(__dirname + '/cache/casio.jpg'));
      }
  if(!choose){
    var msg =  {body: `[ 𝘾𝙊 𝘽𝘼𝘾 ]\n=> 1. 𝙏𝘼𝙄 𝙓𝙄𝙐\n=> 2. 𝘾𝙃𝘼𝙉 𝙇𝙀\n=> 3. 𝙇𝙊 𝘿𝙀\n=> 4. 𝙃𝙄𝙀𝙐 𝙎𝙊\n=> 5. 𝘽𝘼𝙐 𝘾𝙐𝘼\n=> 6. 𝙎𝙇𝙊𝙏\nReply tin nhắn này để xem hướng dẫn cách chơi`, attachment : [
