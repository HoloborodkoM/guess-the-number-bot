'use strict';

require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const db = require('./db');
const logicButton = require('./functions');
const token = process.env.BOT_TOKEN;
const bot = new TelegramApi(token, { polling: true });
const trueNumber = {};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Нажми чтобы начать общение с ботом' },
    { command: '/game', description: 'Игра называется Угадай число' },
    { command: '/info', description: 'Правила' },
  ]);
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const uniqId = msg.from.id;
    try {
      if (text === '/start') {
        const result = await db.checkPlayer(uniqId);
        if (result === 0) {
          db.constructor(uniqId);
        }
        await bot.sendSticker(chatId, process.env.PICTURE1);
        return await bot.sendMessage(chatId,
          'Привет, давай поиграем в игру, чтобы начать нажми на кнопку гейм');
      }
      if (text === '/info') {
        await bot.sendSticker(chatId, process.env.PICTURE9);
        return await bot.sendMessage(chatId,
          // eslint-disable-next-line max-len
          'Всё просто!!! Угадал число: +3 балла, диапазон +2, не угадал -1. Удачи');
      }
      if (text === '/game') {
        return await logicButton.startGame(chatId, trueNumber, bot);
      }
      await bot.sendSticker(chatId, process.env.PICTURE10);
      return await bot.sendMessage(chatId,
        'Пользуйся пожалуйста командами бота');
    } catch (error) {
      return await bot.sendMessage(chatId, 'Ошибочка!!!');
    }
  });
};

bot.on('callback_query', async msg => {
  const chatId = msg.message.chat.id;
  const hiddenNumber = trueNumber[chatId];
  const pickedVariant = msg.data;
  const idPlayer = msg.from.id;
  switch (pickedVariant) {
  case '0':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '1':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '2':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '3':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '4':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '5':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '6':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '7':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '8':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case '9':
    logicButton.firstTry(chatId, pickedVariant, hiddenNumber, idPlayer, bot);
    break;
  case 'first diapason':
    logicButton.checkArias(chatId, hiddenNumber, idPlayer, bot, 0, 1, 2, 3);
    break;
  case 'second diapason':
    logicButton.checkArias(chatId, hiddenNumber, idPlayer, bot, 4, 5, 6);
    break;
  case 'third diapason':
    logicButton.checkArias(chatId, hiddenNumber, idPlayer, bot, 7, 8, 9);
    break;
  case '/keep':
    logicButton.startGame(chatId, trueNumber, bot);
    break;
  case '/end':
    await bot.sendSticker(chatId, process.env.PICTURE8);
    bot.sendMessage(chatId, 'Ну хорошо, поиграем ещё как-то');
    break;
  case '/result':
    logicButton.showResult(chatId, idPlayer, bot);
    break;
  default:
    return;
  }
});

start();
