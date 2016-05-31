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
var crypto = require('crypto');
var compression = require('compression');
var mySession = session({
  secret: 'N0deJS1sAw3some',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

var app = express();
app.use(mySession);
/*  Not overwriting default views directory of 'views' */
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'DPSSNBookmarxT2';

/*function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}*/
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

// Passport stuff
passport.use(new LocalStrategy(function(username, password, done) {
    new Model.User({email: username}).fetch().then(function(data) {
        var user = data;
        if(user === null) {
        	return done(null, false, {message: 'Invalid username or password'});
      	} else {
        	user = data.toJSON();
        	// Need to incorporate bcrypt!!
          var decrypted = decrypt(user.password);
          var result = decrypted == password;
        	if(!result) {
            	return done(null, false, {message: 'Invalid username or password'});
        	} else {
            	return done(null, user);
        	}
         
      }
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(username, done) {
    new Model.User({email: username.email}).fetch().then(function(user) {
        done(null, user);
   });
});

/* Routes - consider putting in routes.js */
app.get('/', routes.signIn);
app.post('/', routes.signInPost);

app.get('/signup', routes.signUp);
app.post('/signup', routes.signUpPost);

app.get('/signout', routes.signOut);

app.get('/api/bookmarks', routes.list);
app.post('/api/bookmarks', routes.insert);
//app.get('/delete', routes.delete);
app.delete('/api/bookmarks/:bookmark_id(\\d+)', routes.delete);
app.put('/api/bookmarks/:bookmark_id(\\d+)', routes.update);
app.get('/folder', routes.folder);
app.get('/settings', routes.settings);
app.post('/passChange', routes.passChange);
app.get('/retrievePassword', routes.retrievePassword);
app.post('/forgotPassword', routes.send);


app.use(function(req,res){
    res.status(404).render('404.ejs');
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

app.listen(app.get("port"), function () {
  console.log('App listening on port ' + /*process.env.PORT ||*/ app.get("port") + '!');
});