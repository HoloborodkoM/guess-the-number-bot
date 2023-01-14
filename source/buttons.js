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
  gameAnother: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Play again', callback_data: '/again' }
        ]
      ]
    })
  }
};
