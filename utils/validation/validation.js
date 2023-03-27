const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

// валидация пользоватля
const validationUserCreate = celebrate({ // создать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUserSignin = celebrate({ // авторизовать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUpdateUserInfo = celebrate({ // обновляет информацию о пользователе (email и имя)
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().pattern(/^[^@]+@[^@.]+\.[^@]+$/).required(),
  }),
});

// валидация фильмов
const validationMovieCreate = celebrate({ // создаёт фильм
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
    trailerLink: Joi.string().pattern(/[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(/[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
    movieId: Joi.number().required(),
  }),
});

const validationMovieDelete = celebrate({ // удаляет сохранённый фильм по id
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
});

module.exports = {
  validationUserCreate,
  validationUserSignin,
  validationUpdateUserInfo,
  validationMovieCreate,
  validationMovieDelete,
};
