const router = require('express').Router(); // создали роутер

const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const {
  getUserSelf, updateUser, logout,
} = require('../controllers/users'); // импорт контроллеров

router.get('/users/me', getUserSelf); // возвращает информацию о пользователе (email и имя)

router.patch('/users/me', celebrate({ // обновляет информацию о пользователе (email и имя)
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().pattern(/^[^@]+@[^@.]+\.[^@]+$/).required(),
  }),
}), updateUser);

router.post('/signout', logout); // разлогиниться, очистить куки с JWT

module.exports = router; // экспортировали роутер
