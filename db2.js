var Bookshelf = require('bookshelf');
var mysql      = require('mysql');
var config = require('./config');

var config = {
    host: config.DATABASE_HOST,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    charset: 'UTF8_GENERAL_CI'
};


var DB = Bookshelf.initialize({
   client: 'mysql', 
   connection: config
});

module.exports.DB = DB;