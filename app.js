require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/filmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);
app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use(require('./middlewares/errors'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
