const path = require("path");
const axios = require("axios");
module.exports.config = {
    name: "key",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "D-Jukie", // Data mine by Q.Cường, cũng chỉ là thay xíu th nên k bán
    description: "Minecraft mini cho các bạn xài chơi UwU",
    commandCategory: "Giải trí",
    usages: "[]",
    cooldowns: 0,
    envConfig: {
        APIKEY: ""
    }
};

module.exports.checkPath = function (type, senderID) {
    const pathItem = path.join(__dirname, 'mine', `item.json`);
    const pathUser = path.join(__dirname, 'mine', 'datauser', `${senderID}.json`);
    const pathUser_1 = require("./mine/datauser/" + senderID + '.json');
    const pathItem_1 = require("./mine/item.json");
    if (type == 1) return pathItem
    if (type == 2) return pathItem_1
    if (type == 3) return pathUser
    if (type == 4) return pathUser_1
}

module.exports.onLoad = async () => {
    const fs = require("fs-extra");
    const axios = require("axios");

    const dir = __dirname + `/mine/`;
    const dirCache = __dirname + `/mine/cache/`;
    const dirData = __dirname + `/mine/datauser/`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
        recursive: true
    });
    if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, {
        recursive: true
    });
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, {
        recursive: true
    });

    if (!fs.existsSync(dir + "data.json")) (await axios({
        url: "https://raw.githubusercontent.com/KhangGia1810/mine123/main/data.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dir + "data.json"));

    if (!fs.existsSync(dir + "item.json")) (await axios({
        url: "https://raw.githubusercontent.com/KhangGia1810/mine123/main/item.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dir + "item.json"));
    return;
}

module.exports.run = async function ({
    api,
    event,
    args,
    Users,
    Currencies
}) {
    const {
        threadID,
        messageID,
        senderID
    } = event;
    const {
        readFileSync,
        writeFileSync,
        existsSync,
        createReadStream,
        readdirSync
    } = require("fs-extra")
    const axios = require("axios")
    const pathData = path.join(__dirname, 'mine', 'datauser', `${senderID}.json`);
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
            obj.mainROD = null,
                obj.GPS = {};
            obj.GPS.locate = null,
                obj.GPS.area = null,
                obj.fishBag = [];
            obj.item = [];
            obj.timeRegister = nDate
            obj.fishBag.push({
                ID: 0,
                name: 'Bedrock',
                category: 'Legendary',
                size: 999999,
                sell: 0
            });
            writeFileSync(pathData, JSON.stringify(obj, null, 4));
            var msg = {body: "(¯ Minecraft ¯)\n⚔️Đăng ký Minecraft thành công⚔️\nIt's time to duel!!!", attachment: await this.subnautica()}
            return api.sendMessage(msg, threadID, messageID);
        } else return api.sendMessage({body: "==[Minecraft]==\n⚔️Bạn đã có trong cơ sở dữ liệu⚔️", attachment: await this.subnautica()}, threadID, messageID);
    }
    case 'shop':
    case '-s': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "(¯ Minecraft  ¯)\n⚔️Bạn chưa đăng kí tài khoản Minecraft!", attachment: await this.subnautica()}, threadID, messageID);
        }
        return api.sendMessage({body: "===[Shop Villager🎫]===\n1. ⚒️Mua cúp⛏️\n2. ⚖️Bán vật phẩm đào được\n3. Nâng cấp⚙️Sửa chửa vật phẩm🔩\n\nReply tin nhắn này với lựa chọn của bạn", attachment: await this.subnautica()}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "shop"
            })
        }, messageID);
    }
    case 'bag':
    case '-b': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "(¯ Minecraft ¯)\n⚔️Bạn chưa đăng kí tài khoản Minecraft!", attachment: await this.subnautica()}, threadID, messageID);
        }
        var data = this.checkPath(4, senderID)

        return api.sendMessage({body: `(¯ Minecraft ¯)\n\n1. Vật Phẩm (SL: ${data.fishBag.length})\n2. Cúp (SL: ${data.item.length})\nVui lòng reply vật phẩm cần xem!`, attachment: await this.subnautica()}, threadID, (error, info) => {
