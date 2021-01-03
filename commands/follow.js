const { Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;

module.exports.run = (bot, username, args, mcData) => {
  if (args.length < 1) {
    bot.chat('Missing arguments [true/false]');
    return;
  }

  if (args[0].toLowerCase() === 'true') {
    const player = bot.players[username];

    // cant see player
    if (!player) {
      bot.chat("Can't find player!");
      return;
    }

    // out of distance range for bot
    if (!player.entity) {
      bot.chat('Player out of range!');
      return;
    }

    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    const goal = new GoalFollow(player.entity, 1);
    bot.pathfinder.setGoal(goal, true);

    bot.chat('Following');
  }
  else {
    bot.pathfinder.setGoal(null);
    bot.chat('Stopped following');
  }
};
