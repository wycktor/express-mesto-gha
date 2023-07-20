const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes/router');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64aae3ecef1ed5370abf50e7',
//   };
//   next();
// });

app.use(errors());
app.use(router);
app.use(auth);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT);
