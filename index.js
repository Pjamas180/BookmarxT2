/* index.js file taken from CSE 136 template file */

// var config = require('./config');
var db = require('./db');
var Model = require('./model');

// For Routes
var routes = require('./routers/routes');

db.init();

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var mySession = session({
  secret: 'N0deJS1sAw3some',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

var app = express();
app.use(mySession);

// Passport stuff
passport.use(new LocalStrategy(function(username, password, done) {
   new Model.User({email: username}).fetch().then(function(data) {
      var user = data;
      console.log(username);
      console.log(password);
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         console.log(user);
         if(!bcrypt.compareSync(password, user.password)) {
         	console.log("this error again...");
            return done(null, false, {message: 'Invalid username or password'});
         } else {
         	console.log("Yup..");
            return done(null, user);
         }
         
      }
   });
}));

passport.serializeUser(function(user, done) {
	console.log("SerializeUser called");
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	console.log("DeserializeUser called");
   new Model.User({email: username}).fetch().then(function(user) {
      done(null, user);
   });
});

/*  Not overwriting default views directory of 'views' */
app.set("port", /*process.env.PORT ||*/ 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes - consider putting in routes.js */
app.get('/', routes.signIn);
app.post('/', routes.signInPost);

app.get('/signup', routes.signUp);
app.post('/signup', routes.signUpPost);

app.get('/signout', routes.signOut);

app.get('/home', routes.list);
app.get('/add', routes.add);
app.post('/insert', routes.insert);
app.get('/edit/:bookmark_id(\\d+)', routes.edit);
//app.get('/delete', routes.delete);
app.get('/confirmdelete/:bookmark_id(\\d+)', routes.confirmdelete);
app.get('/delete/:bookmark_id(\\d+)', routes.delete);
app.post('/update/:bookmark_id(\\d+)', routes.update);
app.get('/folder', routes.folder);
app.get('/login', function(req, res) {
	res.render('login')
});

//app.post('/login', users.login);
//app.get('/logout', users.logout);

/*  This must go between the users routes and the books routes */
//app.use(users.auth);

//app.get('/books', books.list);
//app.get('/books/add', books.add);
//app.get('/books/edit/:book_id(\\d+)', books.edit);
//app.get('/books/confirmdelete/:book_id(\\d+)', books.confirmdelete);
//app.get('/books/delete/:book_id(\\d+)', books.delete);
//app.post('/books/update/:book_id(\\d+)', books.update);
//app.post('/books/insert', books.insert);

app.listen(/*process.env.PORT ||*/ app.get("port"), function () {
  console.log('App listening on port ' + /*process.env.PORT ||*/ app.get("port") + '!');
});