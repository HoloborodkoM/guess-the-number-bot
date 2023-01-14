'use strict';

require('dotenv').config();
const db = require('./db');
const { gameStart, gameSecond, gameAnother } = require('./buttons');

const startGame = async (chatId, botGuessNumber, bot) => {
  await bot.sendMessage(chatId,
    'Сейчас я загадаю число от 0 до 9, попробуй отгадать');
  await bot.sendSticker(chatId, process.env.PICTURE2);
  const randomNumber = Math.floor(Math.random() * 10);
  botGuessNumber[chatId] = randomNumber;
  await bot.sendSticker(chatId, process.env.PICTURE3);
  return await bot.sendMessage(chatId,
    'Всё, загадал, можешь отгадывать', gameStart);
};

const secondTry = async (chatId, bot) => {
  await bot.sendSticker(chatId, process.env.PICTURE4);
  return await bot.sendMessage(chatId,
    'К сожалению ты не угадал(а), но можешь попробовать угадать диапазон',
    gameSecond);
};

const firstTry = async (chatId, selectNumber, hiddenNumber, idUser, bot) => {
  let writeNumber;
  if (selectNumber.length === 1) writeNumber = Number(selectNumber);
  if (writeNumber === hiddenNumber) {
    await db.updateDataCorrectAnswers(idUser);
    await bot.sendSticker(chatId, process.env.PICTURE5);
    return await bot.sendMessage(chatId,
      `Ура!!! Ты угадал(а), это была цыфра ${hiddenNumber}. Хочешь ещё?`,
      gameAnother);
  } else {
    return await secondTry(chatId, bot);
  }
};

const checkArias = async (id, value, idPlayer, bot, n1, n2, n3, n4 = -1,) => {
  if (value === n1 || value === n2 ||
      value === n3 || value === n4) {
    await db.updateDataAlsomostCorrectAnswer(idPlayer);
    await bot.sendSticker(id, process.env.PICTURE6);
    return bot.sendMessage(id,
      `Ты угадал(а) диапазон, была цыфра ${value}. Ещё раз. Ты точно угадаешь`,
      gameAnother);
  } else {
    await db.updateDataWrongAnswer(idPlayer);
    await bot.sendSticker(id, process.env.PICTURE7);
    return await bot.sendMessage(id,
      `Ты не угадал(а), жаль. Была цыфра ${value}. Давай ещё`,
      gameAnother);
  }
};

const showResult = async (idChat, idPlayer, bot) => {
  try {
    const player = await db.showCurrentPlayer(idPlayer);
    const correct = player.guess;
    const almostCorrect = player.almost_guess;
    const wrong = player.not_guess;
    const pointGame = 3 * correct + 2 * almostCorrect - wrong;
    player.points = pointGame;
    await db.updateDataPoints(idPlayer, pointGame);
    await bot.sendMessage(idChat, 'Ты:');
    await bot.sendMessage(idChat, `${correct} - угадал(а)`);
    await bot.sendMessage(idChat, `${almostCorrect} - почти угадал(а)`);
    await bot.sendMessage(idChat, `${wrong} - не угадал(а)`);
    await bot.sendMessage(idChat, `${pointGame} - очки`, gameAnother);
  } catch (error) {
    await bot.sendMessage(idChat, 'Нужно было сначала запустить игру');
  }
};

module.exports = {
  startGame,
  firstTry,
  checkArias,
  showResult
};
