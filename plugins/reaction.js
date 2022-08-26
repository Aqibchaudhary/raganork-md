/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
Module({
    pattern: 'react ?(.*)',
    fromMe: true,
    use: 'utility'
}, (async (m, t) => {
    let msg = {
        remoteJid: m.reply_message.jid,
        id: m.reply_message.id
    }
    const reactionMessage = {
        react: {
            text: t[1],
            key: msg
        }
    }

    await m.client.sendMessage(m.jid, reactionMessage);
}));
Module({
    pattern: 'vv ?(.*)',
    fromMe: true,
    desc: "Anti view once",
    use: 'utility'
}, (async (m, t) => {
    if (!m.reply_message || !m.quoted?.message.hasOwnProperty('viewOnceMessage')) return await m.sendReply("_Not a view once msg!_") 
    m.quoted.message = m.quoted.message.viewOnceMessage.message;
    m.quoted.message[Object.keys(m.quoted.message)[0]].viewOnce = false
    await m.forwardMessage(m.jid,m.quoted,{caption: "_Anti view once_"})
    }));