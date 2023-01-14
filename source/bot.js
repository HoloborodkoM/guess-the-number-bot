'use strict';

require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramApi(token, { polling: true });
const { gameAnother, gameOption } = require('./buttons');

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, '1-9 numb');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Go', gameOption);
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
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/9e9/6dc/9e96dc9a-90ed-3994-9c2f-d2a269f548d4/6.webp');
      return bot.sendMessage(chatId, 'Hi');
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'I dont know');
  });
};

bot.on('callback_query', async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const value = chats[chatId];
  if (data === '/again') {
    return startGame(chatId);
  }
  if (data === value) {
    return await bot.sendMessage(chatId,
      `Congrats! The number was ${data}`,
      gameAnother);
  } else {
    return await bot.sendMessage(chatId,
      `Sorry! You lose, number wa ${value}`,
      gameAnother);
  }
});

start();
