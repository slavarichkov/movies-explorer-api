const jwt = require('jsonwebtoken');
const UNAUTHORIZED = require('../utils/mist/UNAUTHORIZED'); // импортируем класс ошибки

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt; // взять токен из куки
  let payload; // объявляем payload

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // Верифицируем токен, Метод принимает на вход два параметра — токен и секретный ключ, которым этот токен был подписан, вернёт пейлоуд токена, если тот прошёл проверку
  } catch (err) { throw new UNAUTHORIZED('Необходима авторизация'); }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
