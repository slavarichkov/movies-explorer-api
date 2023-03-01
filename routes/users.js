const router = require('express').Router(); // создали роутер

const { validationUpdateUserInfo } = require('../utils/validation/validation'); // Валидация приходящих на сервер данных

const {
  getUserSelf, updateUser, logout,
} = require('../controllers/users'); // импорт контроллеров

router.get('/users/me', getUserSelf); // возвращает информацию о пользователе (email и имя)

router.patch('/users/me', validationUpdateUserInfo, updateUser);

router.post('/signout', logout); // разлогиниться, очистить куки с JWT

module.exports = router; // экспортировали роутер
