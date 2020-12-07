const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const middleResponse = require('./middles/response');
const sl = require('./util/serviceLocator')();

sl.register('jwt', require('jsonwebtoken'));
sl.register('fetch', require('node-fetch'));
sl.register('buildUrl', require('build-url'));
sl.register('mysql', require('mysql'));
sl.register('E400', require('./util/bank400'));
sl.register('RULES', require('./util/verify/inputRules'));

sl.factory('RES', require('./util/RES'));
sl.factory('verify', require('./util/verify/verify'));
sl.factory('CoinGecko', require('./util/CoinGecko'));
sl.factory('db', require('./database/conn'));
sl.factory('dbUsers', require('./database/dbUsers'));
sl.factory('auth', require('./util/verify/auth'));
sl.factory('indexRouter', require('./routes/index'));
sl.factory('usersRouter', require('./routes/users'));
sl.factory('coinsRouter', require('./routes/coins'));
sl.factory('middleToken', require('./middles/token'));

sl.get('db').status()
  .then(() => console.log('Database status: OK!'))
  .catch(e => console.log('Database status: Some Error', e))

sl.get('CoinGecko').status()
  .then(() => console.log('CoinGecko status: OK!'))
  .catch(() => console.log('CoinGecko status: Not Avalible :('))

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = sl.get('indexRouter');
const usersRouter = sl.get('usersRouter');
const coinsRouter = sl.get('coinsRouter');
const middleToken = sl.get('middleToken');

app.get('/',indexRouter.index);
app.use('', middleResponse);
app.post('/index/create', indexRouter.create);
app.post('/index/login', indexRouter.login);
app.use('', middleToken.all);
app.get('/coins', coinsRouter.getAllCoins);
app.put('/users', usersRouter.updateUser);
app.get('/users/coins', usersRouter.getCoins);
app.post('/users/coins', usersRouter.addCoin);
app.delete('/users/coins/:id', usersRouter.deleteCoin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
