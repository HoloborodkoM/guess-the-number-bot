'use strict';

require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramApi(token, { polling: true });

const chats = {};

const gameOption = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
        { text: '3', callback_data: '3' }
      ],
      [
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
        { text: '6', callback_data: '6' }
      ],
      [
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
        { text: '9', callback_data: '9' }
      ],
      [
        { text: '0', callback_data: '0' }
      ]
    ]
  })
};

const gameAnother = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 'Play again', callback_data: '/again' }
      ]
    ]
  })
};

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
