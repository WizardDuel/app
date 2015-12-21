var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');

//Setup Socket Server
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./server/sockets')(io);

//App Setup
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
app.set('env', process.env.NODE_ENV);
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

//Setup Authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(require('express-session')({
  secret: 'hail mortal',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
var Account = require('./server/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//Setup Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passport_test');

var auth = function(req, res, next){
  if(!req.isAuthenticated()){
    res.send(401);
  } else  next();
};

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// App Routing
app.get('/', function(req, res) {
  console.log('did we get here?');
  res.sendFile(path.resolve(__dirname, './client/www/landing.html'));
});

app.use(express.static(__dirname + '/client/www'));

//Use Angular routing through static

app.get('/play', function(req, res) {
  res.sendFile(path.resolve(__dirname, './client/www/index.html'));
});

var userRoutes = require('./server/routes/userRoutes.js');
app.use('/user', auth, userRoutes);

var spellRoutes = require('./server/routes/spellRoutes.js');
app.use('/spells', spellRoutes);

http.listen(port, function() {
  console.log('listening on: ', port);
});
