// Routes
var db = require('../db');
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
    res.redirect('/');
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
    res.redirect('/');
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
    res.redirect('/');
  });
};
exports.folder = function(req, res) {
	res.render('folder');
};