/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const simpleGit = require('simple-git');
const git = simpleGit();
const {Module} = require('../main');
const {MessageType} = require('@adiwajshing/baileys');
const Config = require('../config');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU.API_KEY })
const { skbuffer } = require('raganork-bot');
var handler = Config.HANDLERS !== 'false'?Config.HANDLERS.split("")[0]:"";
Module({
    pattern: 'update',
    fromMe: true,
    desc: "Updates bot",
    use: 'owner'
}, (async (message, match) => {
     await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    var mss = '';
    if (commits.total === 0) {
        mss = "*Bot up to date!*"
        return await message.sendReply(mss);
    } else {
        var changelog = "_Pending updates:_\n\n";
        for (var i in commits.all){
        changelog += `${(parseInt(i)+1)}• *${commits.all[i].message}*\n`
    }
        mss = changelog;
        var buttons = [{buttonId: handler+'updt', buttonText: {displayText: 'START UPDATE'}, type: 1}]
    }
          const buttonMessage = {
              text: mss,
              footer: 'Feel free to update!',
              buttons: buttons,
              headerType: 1
          }
    return await message.client.sendMessage(message.jid, buttonMessage)   
}));
Module({pattern: 'updt',use: 'owner', fromMe: true,dontAddCommandList: true, desc: "Updates bot"}, (async (message, match) => {
    await git.fetch();
    var commits = await git.log(['main' + '..origin/' + 'main']);
    if (commits.total === 0) {
        return await message.client.sendMessage(message.jid, { text:"_Bot up to date_"})

    } else {
        await message.client.sendMessage(message.jid, { text:"_Started update.._"})

            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
                await message.client.sendMessage(message.jid, { text:"Heroku information wrong!"})

                await new Promise(r => setTimeout(r, 1000));
            }
            git.fetch('upstream', 'main');
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', 'main');

            await message.client.sendMessage(message.jid, { text:"_Successfully updated_"})
           await message.client.sendMessage(message.jid, { text:"_Restarting_"})
            }
}));
