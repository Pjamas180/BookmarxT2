// Routes

exports.add = function(req, res) {
	res.render('add');
};

exports.edit = function(req, res) {
	res.render('edit');
};

exports.delete = function(req, res) {
	res.render('delete');
};

exports.folder = function(req, res) {
	res.render('folder');
};