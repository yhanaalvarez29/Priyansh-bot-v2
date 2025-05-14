module.exports.config = {
  name: "nagad",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kingi Charles",
  description: "View Nagad account information",
  usages: "[number]",
  commandCategory: "Info",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const axios = global.nodemodule["axios"];
  let input = args.join(" ");

  try {
    const res = await axios.get(`https://sms-bomb.vercel.app/api/nagad.php?number=${input}`);
    var user = res.data.Info.userType;
    var name = res.data.Info.name;
    var userid = res.data.Info.userId;
    var operator = res.data.Info.operator;

    return api.sendMessage(`Name: ${name || 'Not found'}
Number: ${input || '❌'}
Operator: ${operator|| '❌'}
User Type: ${user || '❌'}
User ID: ${userid || '❌'}
`, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while fetching data.", event.threadID, event.messageID);
  }
};
