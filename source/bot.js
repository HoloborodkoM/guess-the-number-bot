'use strict';

require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const { gameAnother, gameChance, gameOption } = require('./buttons');
const { MongoClient } = require('mongodb');
const url = process.env.DB_URL;
const player = new MongoClient(url);
player.connect();
const bot = new TelegramApi(token, { polling: true });
const db = player.db('bot');
const collection = db.collection('players');



const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, '1-9 numb');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Go', gameOption);
};

const anotherChance = async (chatId) => {
  await bot.sendMessage(chatId,
    'Sorry! You its not number',
    gameChance);
};

const congrats = async (id, x1, x2, winner) => {
  let number;
  if (x1.length === 1) number = Number(x1);
  if (number === x2) {
    await collection.updateOne({ id: winner }, { $inc: { guess: 1 } });
    return await bot.sendMessage(id,
      `Congrats! The number was ${x2}`,
      gameAnother);
  } else {
    await anotherChance(id);
  }
};

const maybe = async (id, x, player, d1, d2, d3, d4 = -1) => {
  if (x === d1 || x === d2 ||
      x === d3 || x === d4) {
    await collection.updateOne({ id: player },
      { $inc: { almost_guess: 1 } });
    return bot.sendMessage(id, `The correct diapason, numb ${x}`, gameAnother);
  } else {
    await collection.updateOne({ id: player }, { $inc: { not_guess: 1 } });
    return bot.sendMessage(id,
      `Sorry! You lose, number was ${x}`,
      gameAnother);
  }
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Hi' },
    { command: '/info', description: 'Info' },
    { command: '/game', description: 'Game' },
  ]);
  bot.on('message', async msg => {
    console.log(msg);
    const text = msg.text;
    const chatId = msg.chat.id;
    const uniqId = msg.from.id;
    if (text === '/start') {
      const result = await collection.countDocuments({ id: { $eq: uniqId } });
      console.log(result);
      if (result === 0) {
        collection.insertOne({
          id: uniqId,
          guess: 0,
          almost_guess: 0,
          not_guess: 0
        });
      }
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/9e9/6dc/9e96dc9a-90ed-3994-9c2f-d2a269f548d4/6.webp');
      return bot.sendMessage(chatId, 'Hi');
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === '/game') {
      return await startGame(chatId);
    }
    return bot.sendMessage(chatId, 'I dont know');
  });
};

bot.on('callback_query', async msg => {
  console.log(msg);
  const chatId = msg.message.chat.id;
  const hiddenNumber = chats[chatId];
  const pickedVariant = msg.data;
  const idPlayer = msg.from.id;
  switch (pickedVariant) {
  case '0':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '1':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '2':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '3':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '4':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '5':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '6':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '7':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '8':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case '9':
    congrats(chatId, pickedVariant, hiddenNumber, idPlayer);
    break;
  case 'first diapason':
    maybe(chatId, hiddenNumber, idPlayer, 0, 1, 2, 3);
    break;
  case 'second diapason':
    maybe(chatId, hiddenNumber, idPlayer, 4, 5, 6);
    break;
  case 'third diapason':
    maybe(chatId, hiddenNumber, idPlayer, 7, 8, 9);
    break;
  case '/again':
    startGame(chatId);
    break;
  case '/cancel':
    bot.sendMessage(chatId, 'Ok, bye');
    break;
  default:
    return;
  }
});

start();
