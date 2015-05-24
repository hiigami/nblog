var Post = function function_name (params) {
	params = params || {};
}

Post.prototype.home = function(res, data, req){
	var _post = { "data" : data, csrf: req.csrfToken() };

	res.render("index.html", _post);
}

Post.prototype.save = function(res, data){
	res.send(data);
}

Post.prototype.edit = function(res, data){
	res.render("edit", data);
}

Post.prototype.get = function(res, data){
	res.render("get", data);
}

module.exports = Post;