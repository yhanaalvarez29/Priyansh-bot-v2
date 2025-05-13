const chalk = require('chalk');
module.exports.config = {
    name: "bankbb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Adonis",
    description: "hammer scissors how many players",
    commandCategory: "Game",
    usages: "[create/join/leave/start/end]",
    cooldowns: 0
};
module.exports.onLoad = () => {
console.log(chalk.bold.hex("#FF00FF").bold("--SUCCESFULLY LOADED THE KEOBUABAO COMMAND--"));
  }
module.exports.handleEvent = async function ({
    api,
    event,
    Currencies
}) {
    const fs = require("fs-extra")
    const axios = require("axios")
    const {
        threadID,
        messageID,
        body,
        senderID
    } = event;
    if (!body) return;
    async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await Currencies.getData(senderID)) || {};
        w = i.money || 0
        if (w < parseInt(maxMoney)) return false;
        else return true;
    }
    async function replace(item) {
        var bua = 'https://imgur.com/IiAhDRT.png',
    keo = 'https://imgur.com/9JIRw7Z.png',
    bao = 'https://imgur.com/1M9MlaV.png';
