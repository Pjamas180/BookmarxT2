// var Bookshelf = require('bookshelf');
var mysql      = require('mysql');
var config = require('./config');

var MySQL = function() {
    var connection;
    
    return {
        init: function(){
            MySQL.connection = mysql.createConnection({
                //host     : 'l3855uft9zao23e2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
                //user     : 'kak7ysodj7sx4lvn',
                //password : 'kacu3njlcyjufvb9',
                //database : 'ifevrxznxvctquex'
                host     : config.DATABASE_HOST,
                user     : config.DATABASE_USER,
                password : config.DATABASE_PASSWORD,
                database : config.DATABASE_NAME
            });
         
            MySQL.connection.connect(function(err){
            	if(err) {
        			console.log('Error connecting to Db');
        			return;
    			}
    			console.log('Connection established');
            });
        },
        query: function(querystring, callback){
            MySQL.connection.query(querystring, callback);
        },
        escape: mysql.escape
    }
}();

// var config = {
//     host: config.DATABASE_HOST,
//     user: config.DATABASE_USER,
//     password: config.DATABASE_PASSWORD,
//     database: config.DATABASE_NAME,
//     charset: 'UTF8_GENERAL_CI'
// };


// var DB = Bookshelf.initialize({
//    client: 'mysql', 
//    connection: config
// });

// module.exports.DB = DB;
module.exports = MySQL;

// For Local testing
/*
var config = {
	host: 'localhost',
	user: 'root',
	password: 'p',
	database: 'parkudb',
	charset: 'UTF8_GENERAL_CI'
};
*/

// For Heroku database
/*
var config = {
	host: 'l3855uft9zao23e2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
	user: 'kak7ysodj7sx4lvn',
	password: 'kacu3njlcyjufvb9',
	database: 'ifevrxznxvctquex',
	charset: 'UTF8_GENERAL_CI'
};

var DB = Bookshelf.initialize({
   client: 'mysql', 
   connection: config
});
*/
