'use strict';

module.exports = {
  desc: "Set current playing game.",
  usage: "<playing game>",
  adminOnly: true,
  process: (msg, flags) => {
    let str = msg.join(',');
    for (let i = 0; i < flags.length; i++) {
      str += ` ${config.flagPrefix}${flag.name}`;
    }
    str = str.trim();
    bot.user.setPresence({
      'status': bot.user.presence.status,
      'game': {
        'name': str,
        'type': 0
      }
    });
    Logger.savePresence();
    return `Playing game set to "${str}"`;
  }
};
