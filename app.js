const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

//const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
const coinsRouter = require('./routes/coins');
const middleToken = require('./middles/token');

/*
const serviceLocator = require('./util/serviceLocator')();

serviceLocator.register('db', require('./database/conn'));
serviceLocator.factory('dbUsers', require('./database/dbUsers'));
//serviceLocator.factory('userService', require('./lib/userService'));
serviceLocator.factory('usersRouter', usersRouter);
*/
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

db.status()
.then(() => console.log('Database status: OK!'))
.catch(e => console.log('Database status: Some Error', e))

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
app.get('/',indexRouter.index);
app.post('/index/create', indexRouter.create);
app.post('/index/login', indexRouter.login);
app.use('', middleToken);
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
