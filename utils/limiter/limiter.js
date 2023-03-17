const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 1007, // можно совершить максимум 1007 запросов с одного IP
});

module.exports = limiter;
