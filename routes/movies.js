const router = require('express').Router(); // создали роутер
const { validationMovieCreate, validationMovieDelete } = require('../utils/validation/validation'); // Валидация приходящих на сервер данных

const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies'); // импорт контроллеров

router.get('/movies', getAllMovies); // получить все фильмы

router.post('/movies', validationMovieCreate, createMovie);

router.delete('/movies/:movieId', validationMovieDelete, deleteMovie);

module.exports = router;
