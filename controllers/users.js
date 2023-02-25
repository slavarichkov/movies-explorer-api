const bcrypt = require('bcryptjs'); // импортируем bcrypt для хэширования пароля;
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken;
const escape = require('escape-html'); // модуль, подставляющий мнемоники
const user = require('../models/user'); // импортируем модель(схему) юзера

const { NODE_ENV, JWT_SECRET } = process.env; // NODE_ENV

// Импорт классов ошибок
const BAD_REQUEST_M = require('../utils/mist/BAD_REQUEST');
const UNAUTHORIZED_M = require('../utils/mist/UNAUTHORIZED');
const CONFLICT_M = require('../utils/mist/CONFLICT');
const { OK } = require('../utils/constant');

const createUser = (req, res, next) => { // создать пользователя
  const { // получим из объекта запроса имя и описание пользователя
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10) // хешируем пароль
    .then((hash) => {
      user.create({
        name,
        email,
        password: hash,
      }).then((newUser) => {
        const { _id } = newUser;
        res.status(OK).send(
          {
            _id,
            name,
            email,
          },
        );
        console.log(escape(name));
      })
        .catch((err) => {
          if (err.code === 11000) { // проверить существует ли пользователь
            next(new CONFLICT_M('Пользователь с таким Email уже существует'));
          } else if (err.name === 'ValidationError') { // проверить валидацию отправленных данных
            next(new BAD_REQUEST_M('Переданы некорректные данные'));
          } else { next(err); } // завершить выполнение кода
        });
    }).catch(next);
};

const getUserSelf = (req, res, next) => { // получить информацию о текущем пользователе
  const { _id } = req.user;
  user.findById(_id).then((userData) => {
    res.status(OK).send({ userData });
  })
    .catch(next);
};

const updateUser = (req, res, next) => { // обновить информацию о пользователе
  const { name, email } = req.body; // получим из объекта запроса имя и описание пользователя
  user.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },

    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },

  ).then((updateData) => res.status(OK).send({ data: updateData }))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        next(new BAD_REQUEST_M('Переданы некорректные данные'));
      } else { next(err); }
    });
};

const login = (req, res, next) => { // получает из запроса почту и пароль и проверяет их
  const { password, email } = req.body; // получим из объекта запроса
  user.findOne({ email }).select('+password') // проверить есть ли пользователь с такой почтой, select('+password') - добавляет пароль, заблокирован в схеме
    .then((dataUser) => {
      if (!dataUser) { // если не найден по почте
        throw new UNAUTHORIZED_M('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, dataUser.password) // проверить пароль, если польз найден
        .then((matched) => {
          if (!matched) { // хеши (пароль) не совпали
            throw new UNAUTHORIZED_M('Неправильная почта или пароль');
          }
          // если совпали, то создадим токен
          const token = jwt.sign(
            { _id: dataUser._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, { // сохранить в куки браузера, Первый аргумент — это ключ, второй — значение.
            // token - наш JWT токен, который мы отправляем
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true, // браузер посылает куки, только если запрос сделан с того же домена
          })
            .send({ message: 'Логин произведен' }); // если у ответа нет тела
        });
    })
    .catch((err) => {
      next(err);
    });
};

const logout = function (req, res, next) {
  const { _id } = req.user;
  user.findById(_id).then(() => {
    res.status(OK).clearCookie('auth-token').send({ message: 'cookie cleared' });
  })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser, getUserSelf, updateUser, login, logout,
};
