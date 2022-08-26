/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    isAdmin,
    isFake,
    delAntifake,
    getAntifake,
    setAntifake,
    parseWelcome
} = require('./misc/misc');
const {
    setAutoMute,
    setAutounMute,
    delAutounMute,
    delAutoMute,
    stickCmd,
    getSticks,
    unstickCmd
} = require('./misc/scheduler');
const greeting = require('./sql/greeting');
const {
    Module
} = require('../main')
const {
    ALLOWED,
    HANDLERS
} = require('../config');
var handler = HANDLERS !== 'false'? HANDLERS.split("")[0]:""

function tConvert(time) {
  time = time.toString ().match (/^([01]\d|2[0-3])( )([0-5]\d)(:[0-5]\d)?$/) || [time];
 if (time.length > 1) { 
    time = time.slice (1); 
    time[5] = +time[0] < 12 ? ' AM' : ' PM';
    time[0] = +time[0] % 12 || 12; 
  }
  return time.join(''). replace(" ",":");
}
function _0x382a(){var _0x3db93d=['tri','149849zKwRGV','dat','ly_','66HpTTjC','mes','1875720bhgdyQ','Mes','toS','a25','fil','quo','509620UaZHqS','eSh','920xiRHkg','69578afGJoI','ssa','66260MonLFp','rMe','32418PZXmER','3132910GgAYfA','cke','sti','9dlcSyE'];_0x382a=function(){return _0x3db93d;};return _0x382a();}function _0x2ec8(_0x497237,_0x62844e){var _0x382a47=_0x382a();return _0x2ec8=function(_0x2ec8f4,_0x3281fa){_0x2ec8f4=_0x2ec8f4-0x8d;var _0x2bdceb=_0x382a47[_0x2ec8f4];return _0x2bdceb;},_0x2ec8(_0x497237,_0x62844e);}(function(_0x19eb1a,_0x513bca){var _0x426c4f=_0x2ec8,_0x2e2f43=_0x19eb1a();while(!![]){try{var _0x4d2d07=parseInt(_0x426c4f(0xa4))/0x1+parseInt(_0x426c4f(0x8f))/0x2*(parseInt(_0x426c4f(0x97))/0x3)+-parseInt(_0x426c4f(0x9e))/0x4+parseInt(_0x426c4f(0x91))/0x5+-parseInt(_0x426c4f(0x9c))/0x6*(-parseInt(_0x426c4f(0x99))/0x7)+parseInt(_0x426c4f(0x8e))/0x8*(-parseInt(_0x426c4f(0x93))/0x9)+parseInt(_0x426c4f(0x94))/0xa;if(_0x4d2d07===_0x513bca)break;else _0x2e2f43['push'](_0x2e2f43['shift']());}catch(_0x306a27){_0x2e2f43['push'](_0x2e2f43['shift']());}}}(_0x382a,0x477ef));async function extractData(_0x598d74){var _0x12b695=_0x2ec8;return _0x598d74['quoted'].message[_0x12b695(0x96)+_0x12b695(0x95)+_0x12b695(0x92)+_0x12b695(0x90)+'ge'][_0x12b695(0xa2)+_0x12b695(0x8d)+_0x12b695(0xa1)+'6'][_0x12b695(0xa0)+_0x12b695(0x98)+'ng']();};
Module({
    pattern: "stickcmd ?(.*)",
    fromMe: true,
    desc:"Sticks commands on stickers. And if that sticker is sent, it will work as a command!",
    usage:".stickcmd kick",
    warn: "Only works on stickers",
    use: 'utility'
}, async (message, match) => {
if (!match[1] || !message.reply_message || !message.reply_message.sticker) return await message.sendReply("_Reply to a sticker_\n_Ex: *.stickcmd kick*_")
try { await stickCmd(await extractData(message),match[1]); } catch {return await message.sendReply("_Failed!_")}
await message.client.sendMessage(message.jid,{text:`_Sticked command ${match[1]} to this sticker! Reconnecting..._`},{quoted:message.quoted});
});
Module({
    pattern: "unstick ?(.*)",
    fromMe: true,
    desc:"Deletes sticked commands on stickers",
    usage:".unstick kick",
    use: 'utility'
}, async (message, match) => {
if (message.reply_message && message.reply_message.sticker){
    let deleted = await unstickCmd(await extractData(message),2);
    if (deleted) return await message.client.sendMessage(message.jid,{text:`_Removed sticker from commands!_`},{quoted:message.quoted})
    if (deleted === false && match[1]) {
        var delete_again = await unstickCmd(match[1])
        if (delete_again) return await message.sendReply(`_Removed ${match[1]} from sticked commands!_`)
        if (delete_again === false) return await message.sendReply("_No such sticker/command found!_")
    }
    if (deleted && !match[1]) return await message.send("_No such sticker found!_");
}
else if (match[1] && !message.reply_message) {
let deleted = await unstickCmd(match[1])
if (deleted) return await message.sendReply(`_Successfully removed ${match[1]} from sticked commands!_`)
if (!deleted) return await message.sendReply("_No such command was found!_")
} 
else return await message.sendReply("_Need command or reply to a sticker!_\n_Ex: *.unstick kick*_")
});
Module({
    pattern: "getstick ?(.*)",
    fromMe: true,
    desc:"Shows sticked commands on stickers",
    use: 'utility'
}, async (message, match) => {
    var all = await getSticks();
    var commands = all.map(element=>element.dataValues.file)
    var msg = commands.join("_\n_");
    message.sendReply("_*Stickified commands:*_\n\n_"+msg+"_")
});
    Module({
    pattern: "automute ?(.*)",
    fromMe: true,
    warn: "This works according to IST (Indian standard time)",
    use: 'group'
}, async (message, match) => {
if (!match[1]) return await message.sendReply("*Wrong format!*\n*.automute 22 00 (For 10 PM)*\n*.automute 06 00 (For 6 AM)*\n*.automute off*");
if (match[1]==="off") {
await delAutoMute(message.jid);
return await message.sendReply("*Automute has been disabled in this group ❗*");       
}  
var mregex = /[0-2][0-9] [0-5][0-9]/
if (mregex.test(match[1]) === false) return await message.sendReply("*Wrong format!\n.automute 22 00 (For 10 PM)\n.automute 06 00 (For 6 AM)*");
var admin = await isAdmin(message)
if (!admin) return await message.sendReply("_I'm not admin_");
await setAutoMute(message.jid,match[1]);
await message.sendReply(`*Group will automatically mute at ${tConvert(match[1])}. Reconnecting..*`)
process.exit(0)
});
Module({
    pattern: "autounmute ?(.*)",
    fromMe: true,
    warn: "This works according to IST (Indian standard time)",
    use: 'group'
}, async (message, match) => {
if (!match[1]) return await message.sendReply("*Wrong format!*\n*.autounmute 22 00 (For 10 PM)*\n*.autounmute 06 00 (For 6 AM)*\n*.autounmute off*");
if (match[1]==="off") {
await delAutounMute(message.jid);
return await message.sendReply("*Auto Unmute has been disabled in this group ❗*");       
}
var mregex = /[0-2][0-9] [0-5][0-9]/
if (mregex.test(match[1]) === false) return await message.sendReply("*Wrong format!\n.autounmute 22 00 (For 10 PM)\n.autounmute 06 00 (For 6 AM)*");
var admin = await isAdmin(message)
if (!admin) return await message.sendReply("*I'm not admin*");
await setAutounMute(message.jid,match[1]);
await message.sendReply(`*Group will automatically open at ${tConvert(match[1])}. Reconnecting..*`)
process.exit(0)
});
var {
    getAutoMute,
    getAutounMute
} = require('./misc/scheduler');
Module({
    pattern: "getmute ?(.*)",
    fromMe: true,
    use: 'group'
}, async (message, match) => {
var mute = await getAutoMute(message.jid,match[1]);
var unmute = await getAutounMute(message.jid,match[1]);
var msg = '';
for (e in mute){
  let temp = unmute.find(element=> element.chat === mute[e].chat)
  if(temp.time) {
    mute[e].unmute = temp.time;
  }
  msg += `*${Math.floor(parseInt(e)+1)}. Group:* ${(await message.client.groupMetadata(mute[e].chat)).subject}
*➥ Mute:* ${tConvert(mute[e].time)}
*➥ Unmute:* ${tConvert(mute[e].unmute)}` + "\n\n";
};
if (!msg) return await message.sendReply("_No mutes/unmutes found!_")
message.sendReply("*Scheduled Mutes/Unmutes*\n\n"+msg)
});
Module({
    pattern: "antifake ?(.*)",
    fromMe: true,
    use: 'group'
}, async (message, match) => {
var admin = await isAdmin(message)
if (!admin) return await message.sendReply("_I'm not admin!_");
if (match[1] === "on"){
    await setAntifake(message.jid);
    return await message.sendReply("_Antifake enabled!_")
}
if (match[1] === "off"){
    await delAntifake(message.jid);
    return await message.sendReply("_Antifake disabled!_")
}
var {
    subject,
    owner
} = await message.client.groupMetadata(message.jid)
var myid = message.client.user.id.split(":")[0]
owner = owner || myid + "@s.whatsapp.net"
const templateButtons = [{
        index: 1,
        urlButton: {
            displayText: 'WIKI',
            url: 'https://github.com/souravkl11/raganork-md/wiki/Antifake'
        }
    },
    {
        index: 2,
        quickReplyButton: {
            displayText: 'ON',
            id: handler+'antifake on'
        }
    },
    {
        index: 3,
        quickReplyButton: {
            displayText: 'OFF',
            id: handler+'antifake off'
        }
    },
    {
        index: 4,
        quickReplyButton: {
            displayText: 'ALLOWED PREFIXES',
            id: handler+'getvar ALLOWED'
        }
    },
]

const templateMessage = {
    text: "*Antifake menu of* " + subject,
    footer: '',
    templateButtons: templateButtons
}
await message.client.sendMessage(message.jid, templateMessage)
    })
Module({
    on: "group_update",
    fromMe: false
}, async (message, match) => {
    var db = await getAntifake();
    const jids = []
    db.map(data => {
        jids.push(data.jid)
    });
    if (message.update === 'add' && jids.includes(message.jid)) {
        var allowed = ALLOWED.split(",");
        if (isFake(message.participant[0], allowed)) {
            var admin = await isAdmin(message);
            if (!admin) return;
            /*await message.client.sendMessage(message.jid, {
                text: "*Country code not allowed* @" + message.participant[0].split("@")[0],
                mentions: [message.participant[0]]
            });*/
            return await message.client.groupParticipantsUpdate(message.jid, [message.participant[0]], "remove")
        }
    }
    await parseWelcome(message,greeting)
})
