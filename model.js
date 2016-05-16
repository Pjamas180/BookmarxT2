var DB = require('./db2').DB;

var User = DB.Model.extend({
   tableName: 'users',
   idAttribute: 'user_id'
});

module.exports = {
   User: User
};