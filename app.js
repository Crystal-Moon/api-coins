const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

//const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
const middleResponse = require('./middles/response');
const coinsRouter = require('./routes/coins');
//const middleToken = require('./middles/token');

/*
const serviceLocator = require('./util/serviceLocator')();

serviceLocator.register('db', require('./database/conn'));
serviceLocator.factory('dbUsers', require('./database/dbUsers'));
//serviceLocator.factory('userService', require('./lib/userService'));
serviceLocator.factory('usersRouter', usersRouter);
*//*
const jwt= require('jsonwebtoken');
const fetch = require('node-fetch');
const buildUrl = require('build-url');
const mysql = require('mysql');
const RES = require('./util/RES')
const CoinGecko = require('./util/CoinGecko')(fetch, buildUrl);
const verify = require('./util/verify/verify');
const db = require('./database/conn')(mysql);
const dbUsers = require('./database/dbUsers')(RES,db.db);
const auth = require('./util/verify/auth')(jwt,dbUsers);
const indexRouter = require('./routes/index')(dbUsers,auth,verify,RES)
const usersRouter = require('./routes/users')(dbUsers,CoinGecko,RES);
*/




const sl = require('./util/serviceLocator')();

sl.register('jwt', require('jsonwebtoken'));
sl.register('fetch', require('node-fetch'));
sl.register('buildUrl', require('build-url'));
sl.register('mysql', require('mysql'));
sl.register('E400', require('./util/bank400'));
sl.register('RULES', require('./util/verify/inputRules'));
//sl.register('RES', require('./util/RES'));
//sl.register('verify', require('./util/verify/verify'));

sl.factory('RES', require('./util/RES'));
sl.factory('verify', require('./util/verify/verify'));
sl.factory('CoinGecko', require('./util/CoinGecko'));
sl.factory('db', require('./database/conn'));
sl.factory('dbUsers', require('./database/dbUsers'));
sl.factory('auth', require('./util/verify/auth'));
sl.factory('indexRouter', require('./routes/index'));
sl.factory('usersRouter', require('./routes/users'));
sl.factory('middleToken', require('./middles/token'));

let db = sl.get('db')
//console.log('el db con get',db)

db.status()
.then(() => console.log('Database status: OK!'))
.catch(e => console.log('Database status: Some Error', e))

let CoinGecko = sl.get('CoinGecko')
CoinGecko.status()
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

/*
app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('', middleToken);
app.use('/coins', coinsRouter);
app.use('/users', usersRouter);
*/

const indexRouter = sl.get('indexRouter');
const usersRouter = sl.get('usersRouter');
const middleToken = sl.get('middleToken');

app.use('', middleResponse);
app.get('/',indexRouter.index);
app.post('/index/create', indexRouter.create);
app.post('/index/login', indexRouter.login);
app.use('', middleToken.all);
app.put('/users', usersRouter.updateUser);
app.get('/users/coins', usersRouter.getCoins)
app.post('/users/coins', usersRouter.addCoin)
app.delete('/users/coins/:id', usersRouter.deleteCoin)

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
