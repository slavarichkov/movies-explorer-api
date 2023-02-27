const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies'); // импорт контроллеров

router.get('/movies', getAllMovies); // получить все фильмы

router.post('/movies', celebrate({ // создаёт фильм
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
    trailerLink: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/movies/_id ', celebrate({ // удаляет сохранённый фильм по id
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

module.exports = router;
