const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // это строка
    required: true, //  обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(v),
      message: (props) => `${props.value} is not a valid !`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
