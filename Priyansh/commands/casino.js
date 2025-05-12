module.exports.config = {
  name: "luckywin",
  version: "1.0.0",
  hasPermission: 0,
  credits: "tdunguwu",
  description: "just game?",
  commandCategory: "game",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, currencies, users }) {
  const { senderId, messageId, threadId } = event;
  const axios = require('axios');
  const fs = require("fs-extra");
  const dataMoney = await currencies.getData(senderId);
  const moneyUser = dataMoney.money;

  if (args[0] === "txcl") {
    if (!args[1]) return api.sendMessage("You must bet a number or 'tài' or 'xỉu'", threadId, messageId);
    const choose = args[1];
    if (choose.toLowerCase() !== 'tài' && choose.toLowerCase() !== 'xỉu') return api.sendMessage("You must bet 'tài' or 'xỉu'", threadId, messageId);
    const money = args[2];
    if (money < 50 || isNaN(money)) return api.sendMessage("The bet amount is not valid or below 50$", threadId, messageId);
    if (moneyUser < money) return api.sendMessage(`Your balance is not enough to play with ${money}$`, threadId, messageId);
    try {
      const types = ['tài', 'xỉu'];
      const random = types[Math.floor(Math.random() * types.length)];
      
      if (choose === random) {
        await currencies.increaseMoney(senderId, parseInt(money * 2));
        api.sendMessage({
          body: `You win! \nYou earned: ${money * 2}$\nResult: ${random}`,
        }, threadId, messageId);
      } else {
        await currencies.decreaseMoney(senderId, parseInt(money));
        api.sendMessage({
          body: `You lose. \nYou lost: ${money}$\nResult: ${random}`,
        }, threadId, messageId);
      }
    } catch (err) {
      console.log(err);
      return api.sendMessage("An error occurred", event.threadId);
    }
  }

  if (args[0] === "baucua" || args[0] === "bc") {
    const slotItems = ["🍐", "🦀", "🐟", "🦌", "🐓", "🦞"];
    const moneyUser = (await currencies.getData(event.senderId)).money;
    var moneyBet = parseInt(args[2]);
    if (!args[1] || isNaN(args[1])) return api.sendMessage("Please enter a number or a slot name (bầu, cua, cá, nai, gà, tôm) [amount]", event.threadId, event.messageId);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("Invalid bet amount or less than 0", event.threadId, event.messageId);
    if (moneyBet > moneyUser) return api.sendMessage("You do not have enough balance to place this bet", event.threadId, event.messageId);
    if (moneyBet < 1000) return api.sendMessage("Bet amount must be at least 1000$", event.threadId, event.messageId);
    var number = [];
    var win = false;
    for (let i = 0; i < 3; i++) number[i] = slotItems[Math.floor(Math.random() * slotItems.length)];

    var item;
    switch (args[1].toLowerCase()) {
      case "bầu":
      case "b":
        item = "🍐";
        break;
      case "cua":
      case "c":
        item = "🦀";
        break;
      case "cá":
      case "ca":
        item = "🐟";
        break;
      case "nai":
      case "na":
        item = "🦌";
        break;
      case "gà":
      case "ga":
        item = "🐓";
        break;
      case "tôm":
      case "to":
        item = "🦞";
        break;
      default:
        return api.sendMessage("Invalid slot name. Please enter a number or a slot name (bầu, cua, cá, nai, gà, tôm) [amount]", event.threadId, event.messageId);
    }
    api.sendMessage("Waiting for the result...", event.threadId, event.messageId);
    await new Promise(resolve => setTimeout(resolve, 3000));
    var array = [number[0], number[1], number[2]];
    if (array.includes(item)) {
      var i = 0;
      if (array[0] === item) i += 1;
      if (array[1] === item) i += 1;
      if (array[2] === item) i += 1;
      if (i === 1) {
        var mon = parseInt(args[1]) + 300;
        await currencies.increaseMoney(event.senderId, mon);
        return api.sendMessage(`Result: ${array.join("|")}\nYou won ${mon}$.`, event.threadId, event.messageId);
      } else if (i === 2) {
        var mon = parseInt(args[1]) * 2;
        await currencies.increaseMoney(event.senderId, mon);
        return api.sendMessage(`Result: ${array.join("|")}\nYou won ${mon}$.`, event.threadId, event.messageId);
      } else if (i === 3) {
        var mon = parseInt(args[1]) * 3;
        await currencies.increaseMoney(event.senderId, mon);
        return api.sendMessage(`Result: ${array.join("|")}\nYou won ${mon}$.`, event.threadId, event.messageId);
      } else {
        return api.sendMessage("Error! Code: xx1n", event.threadId, event.messageId);
      }
    } else {
      await currencies.decreaseMoney(event.senderId, parseInt(args[1]));
      return api.sendMessage(`Result: ${array.join("|")}\nYou lost ${args[1]}$`, event.threadId, event.messageId);
    }
  }

  if (args[0] === "slot") {
    const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
    const moneyUser = (await currencies.getData(event.senderId)).money;
    var moneyBet = parseInt(args[1]);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("[slot] Invalid bet amount or less than 0", event.threadId, event.messageId);
    if (moneyBet > moneyUser) return api.sendMessage("[slot] You do not have enough balance to place this bet", event.threadId, event.messageId);
    if (moneyBet < 50) return api.sendMessage("[slot] Bet amount must be at least 50$", event.threadId, event.messageId);
    var number = [];
    var win = false;
    for (i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
    if (number[0] === number[1] && number[1] === number[2]) {
      moneyBet *= 9;
      win = true;
    } else if (number[0] === number[1] || number[0] === number[2] || number[1] === number[2]) {
      moneyBet *= 2;
      win = true;
    }
    switch (win) {
      case true:
        api.sendMessage(`🎰 ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]} 🎰\nYou win with ${moneyBet} coin`, event.threadId, event.messageId);
        await currencies.increaseMoney(event.senderId, moneyBet);
        break;
      case false:
        api.sendMessage(`🎰 » ${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]} « 🎰\nYou lost and lost ${moneyBet} coin`, event.threadId, event.messageId);
        await currencies.decreaseMoney(event.senderId, moneyBet);
        break;
    }
  }

  if (args[0] === "rps" || args[0] === "kbb") {
    function outMessage(data) {
      api.sendMessage(data, event.threadId, event.messageId);
    }

    if (!args[1]) {
      outMessage("Please enter 'kéo' or 'búa' or 'bao'");
    } else {
      var botTurn = ["✌️", "👊", "✋"];
      var botResult = botTurn[Math.floor(Math.random() * botTurn.length)];
      const userResult = args[1];

      if (userResult === "kéo" || userResult === "búa" || userResult === "bao") {
        if (userResult === botResult) {
          return outMessage(`Tie\nUser: ${userResult}\nBot: ${botResult}\nTie, balance remains unchanged`);
        } else if (userResult === "kéo") {
          if (botResult === "👊") {
            return outMessage(`You lose\n\nUser: ${userResult}\nBot: ${botResult}\n`);
          } else if (botResult === "✋") {
            return outMessage(`You win\n\nUser: ${userResult}\nBot: ${botResult}\n`);
          }
        } else if (userResult === "búa") {
          if (botResult === "✋") {
            return outMessage(`You lose\n\nUser: ${userResult}\nBot: ${botResult}\n`);
          } else if (botResult === "✌️") {
            return outMessage(`You win\n\nUser: ${userResult}\nBot: ${botResult}\n`);
          }
        } else if (userResult === "bao") {
          if (botResult === "✌️") {
            return outMessage(`You lose\n\nUser: ${userResult}\nBot: ${botResult}\n`);
          } else if (botResult === "👊") {
            return outMessage(`You win\n\nUser: ${userResult}\nBot: ${botResult}\n`);
          }
        }
      }
    }
  }

  if (args.join() === "") {
    return api.sendMessage(`Empty\n ========= game =========\n Bầu Cua\n Slot\n RPS\n TXCL`, event.threadId, event.messageId);
  }
};
```
