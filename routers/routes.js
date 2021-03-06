// Routes
var passport = require('passport');
var db = require('../db');
var bcrypt   = require('bcrypt-nodejs');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Defining the Mail Transport System
var transport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: 'bookmarxt2@gmail.com', // my mail
        pass: 'DPSSNBookmarxt2'
    }
}));

var Model = require('../model');

var list = exports.list = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  }
	var sort = req.param('sort');
  var order = req.param('order');
  var search = req.param('search');
  var tag = req.param('tag');

  var userID = req.user.get("user_id");

  var orderBy = "";
  if(sort)
  {
    orderBy = "ORDER BY " + sort + " " + order;
  }
  if(search)
  {
    orderBy = "AND title LIKE '%" + search + "%'";
  }
  if(tag)
  {
    tag = tag.trim();
    orderBy = "AND tags LIKE '" + tag + ",%' OR tags LIKE '%," + tag + ",%' OR tags LIKE '%," + tag + "' OR tags = '"+ tag + "'" ;
  }

  db.query('SELECT * from bookmarks WHERE user_id=' + userID + " " + orderBy, function(err, books) {
    if (err) throw err;
    res.json(books);
  });
	
};
exports.add = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
	  res.render('add');
  }
};
exports.insert = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  }
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var tags = db.escape(req.body.keywords);
  var description = db.escape(req.body.description);
  var star = db.escape(req.body.star);
  console.log("TITLE:" + star);
  var userID = db.escape(req.user.get("user_id"));

  if(star == "0")
  {
  	star = 0;
  }
  if(star == "1")
  {
  	star = 1;
  }
  var date;
  date = new Date();
  date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);
  
  date = "'"+ date.toString() + "'";
  console.log(title + url + tags + description + star + date);
  
  var queryString = 'INSERT INTO bookmarks (user_id, title, url, tags, updated_at, created_at, description, star) VALUES (' + userID  + ', ' + title + ', ' + url + ', ' + tags + ', ' + date + ', ' + date + ', ' + description + ', ' + star +  ')';
  
  db.query(queryString, function(err){
    list(req, res);
  });
};
exports.edit = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  }
	var id = req.params.bookmark_id;
	id = parseInt(id);
  var userID = req.user.get("user_id");
  
  db.query('SELECT * from bookmarks WHERE bookmark_id = ' + id + ' AND user_id = '+ userID, function(err, book){
    if (err) throw err;
    var check = "";
    if(book[0].star == 1) check = "checked";
    res.render('edit', {book: book[0], checked: check });
  });
};
exports.update = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  }
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var tags = db.escape(req.body.keywords);
  var description = db.escape(req.body.description);
  var star = db.escape(req.body.star);
  var id = db.escape(req.params.bookmark_id);

  var userID = db.escape(req.user.get("user_id"));

  if(star == null)
  {
  	star = 0;
  }
  if(star == "on")
  {
  	star = 1;
  }
  var date;
  date = new Date();
  date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);
  date = "'"+ date.toString() + "'";

  var queryString = 'UPDATE bookmarks SET title =' + title + ', url =' + url + ', tags =' + tags + ', updated_at =' + date + ', description=' + description + ', star=' + star +  ' WHERE bookmark_id = ' + id + ' AND user_id = ' + userID;
  db.query(queryString, function(err){
    list(req, res);
  });
};
exports.confirmdelete = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  }
  var id = req.params.bookmark_id;
  var userID = req.user.get("user_id");

  db.query('SELECT * from bookmarks WHERE bookmark_id = ' + id + ' AND user_id = '+ userID, function(err, book){
    if (err) throw err;
    res.render('delete', {book: book[0]});
  });
};
exports.delete = function(req, res, next) {
  var id = db.escape(req.params.bookmark_id);
  var userID = req.user.get("user_id");

  db.query('DELETE from bookmarks WHERE bookmark_id = ' + id + ' AND user_id = '+ userID, function(err){
    if (err) throw err;
    list(req, res);
  });
};
exports.folder = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    res.render('folder');
  }
};

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'DPSSNBookmarxT2';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.signIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/bookmarks');
  }
  res.render('login', {message: ''});
};

var signInPost = function(req, res, next) {
  /* Make sure username is in valid email format */
  var user = req.body;
  var validatedEmail = validateEmail(user.username);
  if(!validatedEmail) {
    return res.render('login', {message: 'Please provide a valid email address! (ex. example@example.com'});
  }
  /* Use passport to authenticate user */
  passport.authenticate('local', { successRedirect: '/bookmarks',
    failureRedirect: '/'}, function(err, user, info) {
      if(err) {
        console.log(err);
        return res.render('login', {message: err});
      } 

      /* User does not exist in database */
      if(!user) {
        return res.render('login', {message: 'Invalid username or password'});
      }

      req.logIn(user, function(err) {
        if(err) {
          console.log(err);
          return res.render('login', {message: err});
        } else {
          return res.redirect('/bookmarks');
        }
      });
    })(req, res, next);
};

var signUp = function(req, res, next) {
  passport.authenticate('local', { successRedirect: '/home',
    failureRedirect: '/'}, function(err, user, info) {
      if(err) {
        return res.render('login', {message: err});
      }

      if(!user) {
        return res.render('signup', {message: ''});
      }
      req.logIn(user, function(err) {
        if(err) {
          console.log(err);
          return res.render('login', {message: err});
        } else {
          var user = req.body;
          res.redirect('/bookmarks');
        }
      });
    })(req, res, next);
};

exports.signUpPost = function(req, res, next) {
  var user = req.body;
  /* Make sure username is in valid email format */
  var validatedEmail = validateEmail(user.username);
  if(!validatedEmail) {
    return res.render('signup', {message: 'Please provide a valid email address! (ex. example@example.com'});
  }

  var usernamePromise = null;
  usernamePromise = new Model.User({email: user.username}).fetch();
  return usernamePromise.then(function(model) {
    if(model) {
      res.render('signup', {message: 'Username already exists'});
    } else {
         //****************************************************//
         // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
         //****************************************************//
         var password = user.password;
         var hash = encrypt(password);

          date = new Date();
          date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' + 
            ('00' + date.getUTCHours()).slice(-2) + ':' + 
            ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
            ('00' + date.getUTCSeconds()).slice(-2);
          date = "'"+ date.toString() + "'";

          var signUpUser = new Model.User({email: user.username, password: hash, created_at: date});

          /*var queryString = 'INSERT INTO users (email, password, created_at) VALUES ("' + user.username + '", "' + hash + '", ' + date + ')';
          console.log(queryString);
          db.query(queryString, function(err){
            console.log(err);
            console.log("WTWAFAFASF");
            signUp(req, res, next);
          });*/

        signUpUser.save().then(function(model) {
            // sign in the newly registered user
            signUp(req, res, next);
        });
     }
 });
};

// 404 not found
var notFound404 = function(req, res, next) {
  res.status(404);
  res.render('404', {title: '404 Not Found'});
};

exports.signOut = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    req.logout();
    res.redirect('/');
  }
};

exports.passChange = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    // Decrypt the user's password and ensure there is a match, if there is, then change the password
    console.log(req.user.attributes.password);
    var userPass = decrypt(req.user.attributes.password);
    console.log(userPass);
    if(userPass == req.body.oldpass) {
      // Change the password to new password after encryption
      var encryptedPass = encrypt(req.body.newpass);
      console.log(encryptedPass);
      var queryString = 'UPDATE users SET password =' + "'" + encryptedPass + "'" + ' WHERE email = ' + "'" + req.user.attributes.email + "'";
      db.query(queryString, function(err){
        if(err){
          console.log(err);
          res.render('settings', {message: 'Error occurred, please try a different password!', color: 'red'})
        } else {
          res.render('settings', {message: 'Password successfully changed, press CANCEL to go back', color: '#0E8443'});
        }
      });
    } else {
      res.render('settings', {message: 'Old password does not match!', color: 'red'});
    }
  }
}

exports.settings = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    // req.logout();
    res.render('settings', {color: 'red', message: '', button: 'CANCEL'});
  }
}

exports.retrievePassword = function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/bookmarks');
  }
  res.render('retrievePassword', {message: ''});
}

exports.send = function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/bookmarks');
  }
  var email = req.body.email;

  var queryString = 'SELECT password from users where email=' + "'" + email + "'";

  // Retrieve email account and password from Database
  db.query(queryString, function(err, result) {
    if (err) {
      res.render('retrievePassword', {message: 'Please enter a valid Bookmarx account name!'});
    }
    if(result.length == 0) {
      res.render('retrievePassword', {message: 'Please enter a valid Bookmarx account name!'});
    }
    else {
      if(result[0].password.length != 0) {
        var decryptedPassword = decrypt(result[0].password);
        var mailOptions={
            to : email,
            subject : 'Password Retrieval from Bookmarx!',
            text : 'Hi! Your password for your Bookmarx account with this email is: ' + decryptedPassword
        }
        transport.sendMail(mailOptions, function(error, response) {
          if (error) {
            console.log(error);
            throw err;
          }
          else {
            res.render('login', {message: 'Email has been sent!'});
          }
        });
      } else {
        res.render('retrievePassword', {message: 'Account does not have a password.'});
      }
    }
  });
}

/* Checks with regular expressions if the email is valid */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports.notFound404 = notFound404;
module.exports.signInPost = signInPost;
module.exports.signUp = signUp;