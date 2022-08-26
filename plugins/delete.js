/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    Module
} = require('../main');
const {isAdmin} = require("./misc/misc")
Module({
    pattern: 'del',
    fromMe: true,
    desc: 'Deletes message for everyone. Supports admin deletion'
}, (async (m, t) => {
    m.jid = m.quoted.key.remoteJid
    if (!m.reply_message) return;
    if (m.quoted.key.fromMe) return await m.client.sendMessage(m.jid, { delete: m.quoted.key })
    if (!m.quoted.key.fromMe) {
    var admin = await isAdmin(m);
    if (!admin) return await m.sendReply("_I'm not an admin!_")
    return await m.client.sendMessage(m.jid, { delete: m.quoted.key })
    }
}));
Module({
    pattern: 'reboot',
    fromMe: true,
    desc: 'Restarts process. [Not heroku dynos]'
}, (async (m, t) => {
    await m.sendReply("_Rebooting.._")
    process.exit(0); 
}));