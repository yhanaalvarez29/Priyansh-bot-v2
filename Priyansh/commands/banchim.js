const path = require("path");
const { mkdirSync, writeFileSync, existsSync, createReadStream, readdirSync } = require("fs-extra")
const axios = require("axios")

module.exports.config = {
    name: "banchim",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "...nó giống bắn chim",
    commandCategory: "Game",
    usages: "[]",
    cooldowns: 0
};


module.exports.onLoad = async () => {
    const dir = __dirname + `/banchim/datauser/`;
    const _dir = __dirname + `/banchim/datauser/`;
    const __dir = __dirname + `/banchim/cache/`;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(_dir)) mkdirSync(_dir, { recursive: true });
    if (!existsSync(__dir)) mkdirSync(__dir, { recursive: true });
    return;
}

module.exports.checkPath = function (type, senderID) {
    const pathGame = path.join(__dirname, 'banchim', 'datauser', `${senderID}.json`);
    const pathGame_1 = require("./banchim/datauser/" + senderID + '.json');
    if (type == 1) return pathGame
    if (type == 2) return pathGame_1
}

module.exports.image = async function(link) {
    var images = [];
    let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        writeFileSync( __dirname + `/banchim/cache/banchim.png`, Buffer.from(download, "utf-8"));
        images.push(createReadStream(__dirname + `/banchim/cache/banchim.png`));
    return images
}

module.exports.run = async function ({ api, event, args, client,Threads,__GLOBAL, Users, Currencies,getText }) {
   const { senderID, messageID, threadID } = event;
     const axios = require('axios');
    const request = require('request');
    const fs = require('fs-extra');
    const pathData = path.join(__dirname, 'banchim', 'datauser', `${senderID}.json`);
    switch (args[0]) {
        case 'register':
        case '-r': {
            const nDate = new Date().toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            });
            if (!existsSync(pathData)) {
                var obj = {};
                obj.name = (await Users.getData(senderID)).name;
                obj.ID = senderID;
                obj.shield = 3
                obj.coins = 20000
                obj.Island = {};
                obj.Island.level = 1
                obj.Island.coinsLV = 200
                obj.Island.data = {};
                obj.Island.data.tower = 0
                obj.Island.data.tree = 0
                obj.Island.data.pool = 0
                obj.Island.data.pet = 0
                obj.spin = 20
                obj.timeRegister = nDate
                writeFileSync(pathData, JSON.stringify(obj, null, 4));
                return api.sendMessage("⚔️Đăng kí thành công", threadID, messageID);
            } else return api.sendMessage("⚔️Bạn đã có trong cơ sở dữ liệu⚔️", threadID, messageID);

        }
        case 'spin': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: `Bạn chưa đăng kí game!`, attachment: await this.image('https://c.tenor.com/4gs3TAnGH0sAAAAi/covid-covid19.gif')}, threadID, messageID);
            }
            if(this.checkPath(2, senderID).spin == 0) return api.sendMessage('Bạn đã hết lượt quay, vui lòng mua thêm hoặc đợi 5p hệ thống sẽ tặng bạn 5 lượt', threadID, messageID);
            this.checkPath(2, senderID).spin = parseInt(this.checkPath(2, senderID).spin) - 1;
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(this.checkPath(2, senderID), null, 4));
            var items = [`${this.checkPath(2, senderID).Island.level * 1000} coins`, `${this.checkPath(2, senderID).Island.level * 3000} coins`, `${this.checkPath(2, senderID).Island.level * 5000} coins`, 'cái nịt của tiến bịp', 'súng', ' đạn nâng cấp', '1 lượt quay', '2 lượt quay', '5 lượt quay'];
            var getItem = items[Math.floor(Math.random() * items.length)];
            var i = this.getSpin(items, getItem, senderID);
            api.sendMessage({body: `Chúc mừng bạn quay chúng : ${getItem}`, attachment: await this.image('https://c.tenor.com/4gs3TAnGH0sAAAAi/covid-covid19.gif')}, threadID, messageID);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = readdirSync(__dirname + `/banchim/datauser`);
            if(i == 3) {
                if(data.length < 4) return api.sendMessage(`Cần ít nhất có 3 người chơi trên server để trộm chim`, threadID, messageID);
                const dem = [];
                for (let i of data) { 
                    if(i != `${senderID}.json`) {
                        dem.push(require(`./banchim/datauser/${i}`));
                    }
                }
                dem.sort((a, b) => a.coins + b.coins);
                var msg = `Số tiền cao nhất là: ${dem[0].coins / 2}\n`
                const randomIndex = dem.sort(function() { return .5 - Math.random() });
                for(var i = 0; i < 3; i ++) {
                    msg += `${i+1}. ${randomIndex[i].name} - Chuồng chim level ${randomIndex[i].Island.level}\n`
                }
                msg += 'Vui lòng reply với lựa chọn bạn muốn trộm!!'
                return api.sendMessage(`==========\n${msg}`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "steal",
                        dem,
                        randomIndex
                    })
                }, messageID);
            }
            else if(i == 5) {
                if(data.length < 4) return api.sendMessage(`Cần ít nhất có 3 người chơi trên server để tấn công chuồng chim`, threadID, messageID);
                var msgf = `[====ATTACK====]\n`, number = 1, p = [];
                for (let i of data) { 
                    if(i != `${senderID}.json`) {
                        var o = require(`./banchim/datauser/${i}`);
                        p.push(o)
                        msgf += `${number++}. ${o.name} - Đảo level ${o.Island.level}\n`
                    }
                }
                return api.sendMessage(msgf, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "attack",
                        p
                    })
                }, messageID);
            }
            break;
        }
        case 'build': 
        case 'xaydung': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Bạn chưa đăng kí game!", attachment: await this.image('https://photo-cms-plo.zadn.vn/w559/Uploaded/2022/vrwqqxjwp/2015_01_31/12_ytwh.jpg')}, threadID, messageID);
            }
            var a = require(`./banchim/datauser/${senderID}.json`);
            return api.sendMessage(`Bạn muốn xây dựng ở khu vực nơi nào ở chuồng chim!\n1. Thân Chuồng - ${a.Island.coinsLV * (a.Island.data.tower + 1)} coins (${a.Island.data.tower}/50)\n2. Cây xanh quanh chuồng cho chim đậu - ${a.Island.coinsLV * (a.Island.data.tree + 1)} coins(${a.Island.data.tree}/50)\n3.Khu vực chơi cho chim - ${a.Island.coinsLV * (a.Island.data.pool + 1)} coins (${a.Island.data.pool}/50)\n4. Khu vực đồ ăn cho chim - ${a.Island.coinsLV * (a.Island.data.pet + 1)} coins (${a.Island.data.pet}/50)\n==============`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "build"
                })
            }, messageID);
        }
        case 'shop': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Bạn chưa đăng kí game!", attachment: await this.image('https://static.wikia.nocookie.net/gta/images/6/6b/WeaponRack-GTAV.jpg/revision/latest?cb=20180522025306&path-prefix=vi')}, threadID, messageID);
            }
     return api.sendMessage({body: `── [ Banchim Shop ] ──  \n\n🐸Danh sách súng bạn có thể mua\n[🔫1]. A47K\n[🐉2]. M4A\n[🦋3].ASM10\n[🎀4]. LK24\n[🍁5]. Type 25\n[🛡6]. AK117\n[🧨7]. M16\n[🔪8]. BK57\n[🧬9]. ICR-1`, attachment: await this.image('https://static.wikia.nocookie.net/gta/images/6/6b/WeaponRack-GTAV.jpg/revision/latest?cb=20180522025306&path-prefix=vi')}, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "shop"
                })
            }, messageID);
        }
        case 'bắn': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Bạn chưa đăng kí game!", attachment: await this.image('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Y3CRoSY_FkWBbPrXZ1a-siVa_KziUvDMIA&usqp=CAU')}, threadID, messageID);
            }
     return api.sendMessage({body: `── [ Banchim Attack ] ──  \n\n🐸Danh sách khu vực bắn chim\n[🔫1]. Rừng Rậm Amazon\n[🐉2]. Rừng nhiệt đới\n[🦋3].khu đồi núi\n`, attachment: await this.image('https://play-lh.googleusercontent.com/7qDDAqGG2LNkgzougZO5kRSu4CuqGTl0yvWE2jhQldbb_JWfIH9vcfwyHEHp9RG3ug=w412-h220-rw')}, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "bắn"
                })
            }, messageID);
        }
        case 'me':
        case 'info': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Bạn chưa đăng kí game!", attachment: await this.image('https://scontent.fhan6-1.fna.fbcdn.net/v/t39.30808-6/275123529_53398
