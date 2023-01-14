'use strict';

module.exports = {
  gameOption: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Это число 1', callback_data: '1' },
          { text: 'Это число 2', callback_data: '2' },
          { text: 'Это число 3', callback_data: '3' }
        ],
        [
          { text: 'Это число 4', callback_data: '4' },
          { text: 'Это число 5', callback_data: '5' },
          { text: 'Это число 6', callback_data: '6' }
        ],
        [
          { text: 'Это число 7', callback_data: '7' },
          { text: 'Это число 8', callback_data: '8' },
          { text: 'Это число 9', callback_data: '9' }
        ],
        [
          { text: 'Это число 0', callback_data: '0' }
        ]
      ]
    })
  },
  gameChance: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Диапазон 0-3', callback_data: 'first diapason' },
          { text: 'Диапазон 4-6', callback_data: 'second diapason' },
          { text: 'Диапазон 7-9', callback_data: 'third diapason' }
        ]
      ]
    })
  },
  gameAnother: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Играть ещё раз', callback_data: '/again' },
          { text: 'Я наигрался', callback_data: '/cancel' }
        ],
        [
          { text: 'Посмотреть результати', callback_data: '/result' },
        ]
      ]
    })
  }
};
