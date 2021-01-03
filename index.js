const { error } = require('console');
const fs = require('fs');
const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const config = require('./config');

const bot = mineflayer.createBot(config.BotOptions);

// currently used for mcData
const Data = {};
const commands = {};
let commandsLoaded = false;

// load plugins
bot.loadPlugin(pathfinder);

// load commands
fs.readdir(config.CommandsPath, (err, files) => {
  if (err) console.error(err);

  for (const file of files) {
    const filename = file.split('.js')[0];

    commands[filename] = require(`${config.CommandsPath}/${file}`);
    console.log(file, 'loaded!');
  }

  commandsLoaded = true;
});

// load mcData
bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version);
  Data.mcData = mcData;
  console.log('mcData loaded!');
});

bot.on('error', (err) => {
  console.error(err);
});

bot.on('kicked', (reason, loggedIn) => {
  console.log('Bot kicked:', loggedIn);
  console.log('Reason:', reason);
});

bot.on('spawn', () => {
  const position = bot.entity.position;
  bot.chat(`Spawned at ${position.x} ${position.y} ${position.z}`);
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  if (!commandsLoaded) return;
  // if message not start with prefix
  if (!message.startsWith(config.Prefix)) return;

  // get command and arguments
  const messageArr = message.trim().split(' ');
  // remove the prefix from command
  const command = messageArr[0].split(config.Prefix)[1];
  const args = messageArr.slice(1);

  commands[command].run(bot, username, args, Data.mcData);
});
