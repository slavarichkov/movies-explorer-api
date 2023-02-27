const movie = require('../models/movie'); // импортируем модель(схему) юзера;

// Импорт классов ошибок
const BAD_REQUEST_M = require('../utils/mist/BAD_REQUEST');
const INTERNAL_SERVER_ERROR_M = require('../utils/mist/INTERNAL_SERVER_ERROR');
const NOT_FOUND_M = require('../utils/mist/NOT_FOUND');
const FORBIDDEN_M = require('../utils/mist/FORBIDDEN');
const CONFLICT_M = require('../utils/mist/CONFLICT');
const { OK } = require('../utils/constant');

const getAllMovies = (req, res) => { // возвращает все сохранённые текущим  пользователем фильмы
  movie.find({ owner: req.user._id }) // поиск всех фильмов в бд по айди юзера
    .then((movies) => res.status(OK).json(movies))
    .catch(() => new INTERNAL_SERVER_ERROR_M('Произошла ошибка'));
};

const createMovie = (req, res, next) => { // создать фильм
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    trailerLink,
  } = req.body; // получим из объекта запроса данные для фильма
  const owner = req.user._id; // получить айди юзера
  console.log(owner);
  movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
    trailer,
  }) // создать карточку в бд
    .then((newMovie) => res.status(OK).send(newMovie))
    .catch((err) => {
      if (err.code === 11000) { // проверить существует ли уже фильм
        next(new CONFLICT_M('Фильм с таким названием уже добавлен'));
      } else if (err.name === 'ValidationError') { // проверить валидацию отправленных данных
        next(new BAD_REQUEST_M('Переданы некорректные данные'));
      } else { next(err); } // завершить выполнение кода
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => { // удалить фильм
  const { movieId } = req.params; // получим из объекта запроса уникальный id фильма
  movie.findById(movieId)
    .then((movieFound) => {
      if (!movieFound) {
        throw new NOT_FOUND_M('неверный id фильма');
      } else if (!movieFound.owner.equals(req.user._id)) {
        throw new FORBIDDEN_M('нельзя удалить чужой фильм');
      } else { movieFound.remove(movieId).then(() => res.send({ message: 'Фильм удален' })).catch(next); }
    })
    .catch(next);
};

module.exports = {
  getAllMovies, createMovie, deleteMovie,
};
