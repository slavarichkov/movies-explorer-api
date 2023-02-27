const express = require('express');
const mongoose = require('mongoose'); // БД
const process = require('process');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных
const { requestLogger, errorLogger } = require('./middlewares/logger'); // логгеры

const usersRouters = require('./routes/users'); // роутеры юзеров
const moviesRouters = require('./routes/movies'); // роутеры фильмов
const auth = require('./middlewares/auth'); // импортируем авторизацию пользователя
const NOT_FOUND_M = require('./utils/mist/NOT_FOUND'); // импорт класса ошибки
const { createUser, login } = require('./controllers/users'); // импортируем контроллеры пользователей
const errorHandling = require('./middlewares/errorHandling'); // импортируем централизованный обработчик ошибок
require('dotenv').config(); // подключить ENV

const { NODE_ENV, PORT, HOST_MONGODB } = process.env;

const app = express();

mongoose.set('strictQuery', true); // в mmongoose v7 параметр авто в false не строгое соотв схеме

// подключаемся к mongo и затем к серверу
mongoose.connect(NODE_ENV === 'production' ? HOST_MONGODB : 'mongodb://127.0.0.1/bitfilmsdb', () => {
  console.log('DB OK');
  app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
    console.log(`App listening on port ${PORT}`);
  });
})
  .catch((err) => console.log(err));

// мидлверы
app.use(cookieParser()); // для работы с куки, хранить токен
app.use(bodyParser.json());
app.use(requestLogger); // подключаем логгер запросов

// роуты, не требуещие авторизации
app.post('/signup', celebrate({ // создать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({ // авторизовать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// защитить роуты ниже авторизацией
app.use(auth);
// При успешной авторизации в объекте запроса появится свойство user, достаь из него req.user._id
// в которое запишется пейлоуд токена

app.use('/', usersRouters); // подключаем роутер юзеров
app.use('/', moviesRouters); // подключаем роутер фильмов
app.use('*', (req, res, next) => next(new NOT_FOUND_M('Cтраница не найдена'))); // несуществующая страница

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use(errorHandling);

// глобальный обработчик ошибок
process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ошибка ${err} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
