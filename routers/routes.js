// Routes
var passport = require('passport');
var db = require('../db');
var bcrypt   = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;

var Model = require('../model');

/*
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
         // var string = "hello";
         // var hash = bcrypt.hashSync(string);
         // var result2 = bcrypt.compareSync(string, hash);
         // console.log(user.password);
         // console.log(result2);
         // var result3 = bcrypt.compareSync(user.password, password);
         // console.log("result = " + result3);
         var result = (user.password == password); // bcrypt.compareSync(password, user.password);
         if(!result) {
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
});*/

exports.list = function(req, res) {
	var sort = req.param('sort');
  var order = req.param('order');
  var search = req.param('search');
  var orderBy = "";
  if(sort)
  {
    orderBy = "ORDER BY " + sort + " " + order;
  }
  if(search)
  {
    orderBy = "WHERE title LIKE '%" + search + "%'";
  }
	db.query('SELECT * from bookmarks ' + orderBy, function(err, books) {
    if (err) throw err;
    console.log(books);
    res.render('assignment2', {books: books} );
  });
	
};
exports.add = function(req, res) {
	res.render('add');
};
exports.insert = function(req, res) {
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var tags = db.escape(req.body.keywords);
  var description = db.escape(req.body.description);
  var star = req.body.star;
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
  console.log(title + url + tags + description + star);
  date = "'"+ date.toString() + "'";
  var queryString = 'INSERT INTO bookmarks (title, url, tags, updated_at, created_at, description, star) VALUES (' + title + ', ' + url + ', ' + tags + ', ' + date + ', ' + date + ', ' + description + ', ' + star +  ')';
  console.log(queryString);
  db.query(queryString, function(err){
    res.redirect('/home');
  });
};
exports.edit = function(req, res) {
	var id = req.params.bookmark_id;
	id = parseInt(id);
  db.query('SELECT * from bookmarks WHERE bookmark_id =  ' + id, function(err, book) {
    if (err) throw err;
    var check = "";
    if(book[0].star == 1) check = "checked";
    res.render('edit', {book: book[0], checked: check });
  });
};
exports.update = function(req, res) {
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var tags = db.escape(req.body.keywords);
  var description = db.escape(req.body.description);
  var star = req.body.star;
  var id = req.params.bookmark_id;
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
  console.log(title + url + tags + description + star);
  date = "'"+ date.toString() + "'";
  var queryString = 'UPDATE bookmarks SET title =' + title + ', url =' + url + ', tags =' + tags + ', updated_at =' + date + ', description=' + description + ', star=' + star +  ' WHERE bookmark_id = ' + id;
  console.log(queryString);
  db.query(queryString, function(err){
    res.redirect('/home');
  });
};
exports.confirmdelete = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('SELECT * from bookmarks WHERE bookmark_id =  ' + id, function(err, book) {
    if (err) throw err;
    res.render('delete', {book: book[0]});
  });
};
exports.delete = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('DELETE from bookmarks WHERE bookmark_id = ' + id, function(err){
    if (err) throw err;
    res.redirect('/home');
  });
};
exports.folder = function(req, res) {
	res.render('folder');
};

exports.login = function(req, res) {
  res.render('assignment2');
};

exports.signIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/home');
  }
  res.render('login');
};

var signInPost = function(req, res, next) {
  console.log("Entering signInPost");
  passport.authenticate('local', /*{ successRedirect: '/home',
    failureRedirect: '/'}, */function(err, user, info) {
      if(err) {
        console.log(err);
        // console.log(user);
        return res.render('login');
      } 

      if(!user) {
        console.log("User does not exist");
        return res.render('login');
      }
      console.log("about to call req.logIn");
      //  res.redirect('/home');
      console.log(req.logIn);
      req.logIn(user, function(err) {
        //return res.redirect('/home');
        console.log("Didn't get into req.logIn");
        if(err) {
          console.log(err);
          return res.render('login');
        } else {
          console.log("Success!");
          return res.redirect('/home');
        }
      });
    })(req, res, next);
};

var signUp = function(req, res, next) {
  passport.authenticate('local', { successRedirect: '/home',
    failureRedirect: '/'}, function(err, user, info) {
      if(err) {
        return res.render('login');
      } 

      if(!user) {
        return res.render('signup');
      }
      //  res.redirect('/home');
      console.log("About to logIn user from sign up");
      req.logIn(user, function(err) {
        //return res.redirect('/home');
        if(err) {
          console.log(err);
          return res.render('login');
        } else {
          console.log("Successful signup!");
          var user = req.body;
          res.render('assignment2'/*, {username: user.username, signup: 'Insert your Vehicle Name and License Plate Number.'}*/);
        }
      });
    })(req, res, next);
};

exports.signUpPost = function(req, res, next) {
  var user = req.body;
  console.log(user);
  var usernamePromise = null;
  usernamePromise = new Model.User({email: user.username}).fetch();
  console.log("entering signUpPost");
  return usernamePromise.then(function(model) {
    if(model) {
      res.render('login'/*, {title: 'signup', errorMessage: 'username already exists'}*/);
    } else {
         //****************************************************//
         // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
         //****************************************************//
         var password = user.password;
         var hash = password; //bcrypt.hashSync(password);
         console.log("Hashed password");
         var signUpUser = new Model.User({email: user.username, password: hash});
         console.log(signUpUser);
         //console.log(Model);

          date = new Date();
          date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' + 
            ('00' + date.getUTCHours()).slice(-2) + ':' + 
            ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
            ('00' + date.getUTCSeconds()).slice(-2);
          //console.log(title + url + tags + description + star);
          date = "'"+ date.toString() + "'";
          var queryString = 'INSERT INTO users (email, password, created_at) VALUES ("' + user.username + '", "' + hash + '", ' + date + ')';
          console.log(queryString);
          db.query(queryString, function(err){
            console.log(err);
            signUp(req, res, next);
          });

         /*signUpUser.save().then(function(model) {
            console.log("Redirecting...");
            // sign in the newly registered user
            signUp(req, res, next);
        }); */
     }
 });
};

exports.signOut = function(req, res, next) {
  if(!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    req.logout();
    res.redirect('/');
  }
};

module.exports.signInPost = signInPost;
module.exports.signUp = signUp;