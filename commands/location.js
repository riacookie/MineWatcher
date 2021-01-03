module.exports.run = (bot, username, args, mcData) => {
  const position = bot.entity.position;
  bot.chat(`${position.x} ${position.y} ${position.z}`);
};
