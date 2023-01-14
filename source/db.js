'use strict';

require('dotenv').config();
const { MongoClient } = require('mongodb');
const url = process.env.DB_URL;
const player = new MongoClient(url);
const db = player.db('bot');
const collection = db.collection('players');

try {
  player.connect();
  console.log('Подключение успешно');
} catch (error) {
  console.log('Ошибка подключения к БД');
}

const constructor = idUser => {
  collection.insertOne({
    id: idUser,
    guess: 0,
    almost_guess: 0,
    not_guess: 0,
    points: 0
  });
};

const checkPlayer = idUser => collection
  .countDocuments({ id: { $eq: idUser } });

const updateDataPoints = (idUser, pointsInGame) => {
  collection.updateOne({ id: idUser },
    { $set: { points: pointsInGame } });
};

const updateDataCorrectAnswers = idUser => {
  collection.updateOne({ id: idUser }, { $inc: { guess: 1 } });
};

const updateDataAlsomostCorrectAnswer = idUser => {
  collection.updateOne({ id: idUser }, { $inc: { almost_guess: 1 } });
};

const updateDataWrongAnswer = idUser => {
  collection.updateOne({ id: idUser }, { $inc: { not_guess: 1 } });
};

const showCurrentPlayer = idUser => collection.findOne({ id: idUser });

module.exports = {
  constructor,
  checkPlayer,
  updateDataPoints,
  updateDataCorrectAnswers,
  updateDataAlsomostCorrectAnswer,
  updateDataWrongAnswer,
  showCurrentPlayer
};
