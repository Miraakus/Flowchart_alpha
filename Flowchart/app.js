/*секция подключаемых модулей*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser'); 
const crypto = require('crypto');
const session = require('express-session');
const mysql = require("mysql2");
const multer  = require('multer')
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');

const app = express(); //инкапсулируем базовый функционал для работы с веб-сервером
const database = require("./config/database");// Sequelize model
require("./app/Models/association")();
require('./config/passport')(passport);// passport config

/*определяем промежуточные компоненты для конвеера запросов, которые участвуют в обработке всех запросов*/
//static
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

//EJS
//app.use(expressLayouts);
app.set('view engine', 'ejs');

//json
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' })
const time = 60 * 60 * 2 * 1000;

// express session
app.use(session({
  name: "sessionid",
  secret: crypto.randomBytes(10).toString('hex'),
  resave: true,
  saveUninitialized: false,
  cookie: {
      maxAge: time,
      sameSite: false,
      secure: false
    }
  
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash connection
app.use(flash())

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

database.authenticate()
  .then(() => {
    console.log("Database Connected...");
  })
  .catch(err => {
    console.log(err);
  });

app.get('/', function (req, res) { 
   res.redirect('/auth');
});

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

module.exports = app;