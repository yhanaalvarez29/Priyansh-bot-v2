module.exports.config = {
    name: "cauca",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Mirai Team",
    description: "Tham gia câu cá ngay trên chính nhóm của bạn",
    commandCategory: "Game",
    usages: "help",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "moment-timezone": "",
        "semver": ""
    }
}

module.exports.onLoad = async function () {
const {mkdirSync, existsSync, readFileSync } = global.nodemodule['fs-extra']
const { join } = global.nodemodule['path']
const semver = global.nodemodule['semver']
const dirmain = join(global.client.mainPath, 'modules', 'commands', 'cache', 'FishingData');
if (semver.lt(global.config.version, '1.2.10')) 
    return console.log('======= KHÔNG HỖ TRỢ CHO SOURCE CODE CŨ =======');
if (!existsSync(dirmain)) mkdirSync(dirmain);
if (typeof global.configModule[this.config.name] == 'undefined') global.configModule[this.config.name] = {};
if (typeof global.configModule[this.config.name].fishData == 'undefined') global.configModule[this.config.name].fishData = [];
if (typeof global.configModule[this.config.name].rodData == 'undefined') global.configModule[this.config.name].rodData = [];
global.configModule[this.config.name].dirData = dirmain || null;
if (global.configModule[this.config.name].fishData.length == 0) {
    const fishData = JSON.parse(readFileSync(await global.utils.assets.data('FISHDATA')));
    for (const singleData of fishData) await global.configModule[this.config.name].fishData.push(singleData);
}
if (global.configModule[this.config.name].rodData.length == 0) {
    const rodData = JSON.parse(readFileSync(await global.utils.assets.data('RODDATA')));
    for (const singleData of rodData) await global.configModule[this.config.name].rodData.push(singleData);
}
return;
}

module.exports.makeEmptySlot = function () {
    var fishingSlot = [];
    for (i = 0; i <9; i++) fishingSlot.push({
        name: "Empty",
        size: 0.0,
        price: 0
    })
    return fishingSlot;
}

module.exports.getRarity = function () {
    return this.getRarityRecursion(Math.floor(Math.random() * Math.floor(100)), -1, 0)
}

module.exports.getFish = function (fishRarity, currentHour) {
    return global.configModule[this.config.name].fishData.filter(fish => fish.time.includes(currentHour) && fish.rarity.includes(fishRarity));
}

module.exports.addToInventory = (dataUser, critter) => {
    try {
        if (dataUser.inventory[dataUser.inventory.length - 1].price != 0 || typeof dataUser.inventory[dataUser.inventory.length - 1].price == "undefined") throw "[ Fishing ] Túi của bạn không còn đủ không gian lưu trữ";
        else {
            for (i = 0; i < dataUser.inventory.length; i++) {
                if (dataUser.inventory[i].price == 0) {
                    dataUser.inventory[i] = critter;
                    i = dataUser.inventory.length;
                }
            }
        }
        return [null, dataUser.inventory];
    }
    catch (error) { return [error, null] }
}

module.exports.getRarityRecursion = function (chance, index, number) {
    const catchChance = {
        'Very Common': 46,
        'Common': 30,
        'Uncommon': 20,
        'Rare': 5,
        'Very Rare': 1
    }
    const rarityList = [
        'Very Common',
        'Common',
        'Uncommon',
        'Rare',
        'Very Rare'
    ]

    if (index === 0 && chance <= catchChance[rarityList[0]]) return rarityList[0]
    else if (index >= rarityList.length - 1 && chance >= catchChance[rarityList[rarityList.length - 1]]) return rarityList[rarityList.length - 1]
    else if (chance > number && chance <= (number + catchChance[rarityList[index + 1]])) return rarityList[index + 1];
    else return this.getRarityRecursion(chance, index + 1, (number + catchChance[rarityList[index + 1]]));
}

module.exports.handleReply = async function ({ event, api, Currencies, handleReply }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { increaseMoney, decreaseMoney } = Currencies;
    const { body, threadID, messageID, senderID } = event;
    const { type, dirUser } = handleReply;

    switch (type) {
        case "menushop": {
            if (isNaN(body)) return api.sendMessage("[ Fishing Shop ] Lựa chọn của bạn không phải là một con số!", threadID, messageID);
            if (body > 3 || body < 1) return api.sendMessage("[ Fishing Shop ] Lựa chọn của bạn không tồn tại!", threadID, messageID);
            switch (body) {
                case "1": {
                    var listItems = [], i = 1;
                    for (const item of global.configModule[this.config.name].rodData) listItems.push(`❯ ${i++}/ ${item.name}: ${item.cost}$ - Độ bền: ${item.durability}, thời gian chờ: ${item.cooldown} giây(s)`);
                    return api.sendMessage(`「 Fishing Buy 」\nHãy reply(Phản hồi) tin nhắn này số bạn chọn\n\n${listItems.join("\n")}`, event.threadID, (error, info) => {
                        client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "buymenu",
                            dirUser
                        });
                    }, event.messageID);
                }

                case "2": {
                    return api.sendMessage("「 Fishing Buy 」\nHãy reply(Phản hồi) tin nhắn này số bạn chọn\n\n❯ 1/ Bán toàn bộ.\n❯ 2/ Bán cá loại 'Rare'.\n❯ 3/ Bán cá loại 'Common'\n❯ 4/ Bán cá loại 'Uncommon'\n❯ 5/ Bán cá loại 'Very common'\n❯ 6/ Bán cá loại 'Very Rare'", threadID, (error, info) => {
                        client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: senderID,
                            type: "sellmenu",
                            dirUser
                        });
                    }, messageID);
                }

                case "3": {
                    return api.sendMessage("「 Fishing Upgrade 」\nHãy reply(Phản hồi) tin nhắn này số bạn chọn\n\n❯ 1/ Upgrade inventory - Nâng cấp túi đồ\n❯ 2/ Fix fishing rod - Sửa chữa cần câu của bạn",threadID, (error, info) => {
                        client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "upgrademenu",
                            dirUser
                        });
                    }, messageID);
                }
            }
        }

        case "buymenu": {
            try {
                if (isNaN(body)) return api.sendMessage("[ Fishing Buy ] Lựa chọn của bạn không phải là một con số!", threadID, messageID);
                const dataItems = global.configModule[this.config.name].rodData
                if (body > dataItems.length || body < 1) return api.sendMessage("[ Fishing Buy ] Lựa chọn của bạn không tồn tại!", threadID, messageID);
                var dataUser = JSON.parse(readFileSync(dirUser, "utf-8"));
                let userMoney = (await Currencies.getData(senderID)).money;
                const itemUserChoose = dataItems[parseInt(body) - 1];
                if (userMoney < itemUserChoose.cost) return api.sendMessage(`[ Fishing Buy ] Bạn không đủ tiền để có thể mua cần câu mà bạn đã chọn, bạn còn thiếu khoảng ${itemUserChoose.cost - userMoney}$`, threadID, messageID);
                dataUser.fishingrod.rodType = itemUserChoose.rodType;
                dataUser.fishingrod.rodName = itemUserChoose.name;
                dataUser.fishingrod.cooldownTime = itemUserChoose.cooldown;
                dataUser.fishingrod.durability = dataUser.fishingrod.durabilityDefault = itemUserChoose.durability;
                dataUser.fishingrod.moneyFix = Math.floor(Math.random() * (itemUserChoose.moneyFix[1] - itemUserChoose.moneyFix[0] + 1) + itemUserChoose.moneyFix[0]);
                dataUser.fishingrod.rateBroken = itemUserChoose.rateBroken;
                await decreaseMoney(senderID, itemUserChoose.cost);
                writeFileSync(dirUser, JSON.stringify(dataUser, null, 4), "utf-8");
                return api.sendMessage(`[ Fishing Buy ] Bạn đã mua thành công "${itemUserChoose.name}" với giá ${itemUserChoose.cost}$`, threadID, messageID);
            } catch (error) { console.log(error); return api.sendMessage("[ Fishing Buy ] Đã xảy ra lỗi không mong muốn khi bạn đang giao dịch!", threadID, messageID) }
        }

        case "sellmenu": {
            if (isNaN(body)) return api.sendMessage("[ Fishing Sell ] Lựa chọn của bạn không phải là một con số!", threadID, messageID);
            if (body > 6 || body < 1) return api.sendMessage("[ Fishing Sell ] Lựa chọn của bạn không tồn tại!", threadID, messageID);
            switch (body) {
                case "1": {
                    try {
                        var dataUser = JSON.parse(readFileSync(dirUser, "utf-8")), index = 0, totalAll = 0;
                        for (item of dataUser.inventory) {
                            totalAll += item.price;
                            dataUser.inventory[index++] = {
                                name: "Empty",
                                size: 0.0,
                                price: 0
                            };
                        }
                        await increaseMoney(senderID, totalAll);
                        writeFileSync(dirUser, JSON.stringify(dataUser, null, 4), "utf-8");
                        return api.sendMessage(`[ Fishing Sell ] Bạn đã bán thành công toàn bộ cá trong túi và thu về được ${totalAll}$`, threadID, messageID);
                    } catch (error) { console.log(error); return api.sendMessage("[ Fishing Sell ] Đã xảy ra lỗi không mong muốn khi bạn đang 
