require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter');
const { mongodbConfig } = require('./utils/mongodbConfig');

const { NODE_ENV, PORT = 3000, DB_URL } = process.env;
const app = express();

mongoose.connect(NODE_ENV !== 'production' ? 'mongodb://localhost:27017/filmsdb' : DB_URL, mongodbConfig);

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(require('./middlewares/errors')); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
