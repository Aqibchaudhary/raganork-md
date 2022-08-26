/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
let {
    saveMessage
} = require('./misc/saveMessage');
const {
    sticker,
    addExif
} = require('./misc/misc');
let {
    Module
} = require('../main');
let {
    TAKE_KEY,
    STICKER_DATA,
    MODE,
    HEROKU,
    AUDIO_DATA,
    BOT_INFO
} = require('../config');
let {
    addInfo,
    skbuffer,
    stickercrop,
    webp2mp4
} = require('raganork-bot');
let a = MODE == 'public' ? false : true;
let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
const h = require('heroku-client');
const he = new h({
    token: HEROKU.API_KEY
});
let ur = '/apps/' + HEROKU.APP_NAME;
Module({
    pattern: 'take ?(.*)',
    fromMe: a,
    use: 'edit',
    desc: 'Changes sticker/audio pack & author name. Title, artist, thumbnail etc.'
}, (async (m, match) => {
    if (!m.reply_message) return await m.sendMessage('_Reply to an audio or a sticker_')
    var audiomsg = m.reply_message.audio;
    var stickermsg = m.reply_message.sticker;
    var q = await m.reply_message.download();
    if (stickermsg) {
        if (match[1]!=="") {
        var exif = {
            author: match[1].includes(";")?match[1].split(";")[1]:"",
            packname: match[1].includes(";")?match[1].split(";")[0]:match[1],
            categories: STICKER_DATA.split(";")[2] || "😂",
            android: "https://github.com/souravkl11/Raganork-md/",
            ios: "https://github.com/souravkl11/Raganork-md/"
        } }
        else {
            var exif = {
                author: STICKER_DATA.split(";")[1] || "",
                packname: STICKER_DATA.split(";")[0] || "",
                categories: STICKER_DATA.split(";")[2] || "😂",
                android: "https://github.com/souravkl11/Raganork-md/",
                ios: "https://github.com/souravkl11/Raganork-md/"
            }
        }
        return await m.client.sendMessage(m.jid,{sticker: fs.readFileSync(await addExif(q,exif))},{quoted:m.quoted})
    }
    if (!stickermsg && audiomsg) {
                let inf = match[1] !== '' ? match[1] : AUDIO_DATA
                var spl = inf.split(';')
                var image = spl[2] ? await skbuffer(spl[2]): await skbuffer(BOT_INFO.split(";")[3])
                var res = await addInfo(q,spl[0],spl[1]?spl[1]:AUDIO_DATA.split(";")[1], 'Raganork Engine', image)
                await m.client.sendMessage(m.jid, {
                    audio: res,
                    mimetype: 'audio/mp4',
                }, {
                    quoted: m.quoted,
                    ptt: false
                });
    }
    if (!audiomsg && !stickermsg) return await m.client.sendMessage(m.jid, {
        text: '_Reply to an audio or a sticker_'
    }, {
        quoted: m.data
    })
}));
Module({
    pattern: 'mp4 ?(.*)',
    fromMe: a,
    desc: 'Converts animated sticker to video'
}, (async (m, t) => {
    if (m.reply_message.sticker) {
        var q = m.reply_message.download();
        try {
            var result = await webp2mp4(q)
        } catch {
            return await m.sendReply("*Failed*")
        }
        await m.client.sendMessage(
            m.jid,
            {
            video: {
            url: result
            }
        }, {quoted:m.quoted});
    } else return await m.sendReply('_Reply to an animated sticker!_');
}));
