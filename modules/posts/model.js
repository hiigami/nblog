var _mongoose = require('mongoose'),
	model = require('./schema'),
	mongo_url = 'mongodb://MongoLab-u:HFJk25WHdFSAUyqHlZpeFaDwffSycJT6kzqeOFhXFGQ-@ds034208.mongolab.com:34208/MongoLab-u';

_mongoose.connect(mongo_url);

var Post = function function_name (params) {
	params = params || {};
	this._model = model;
}

Post.prototype.save = function(data, callback) {
	this._model.findOneAndUpdate({title: data.title, slug: data.slug}, data, {upsert:true}, function (err, doc) {
        if(err==null){
        	callback({"data":{"success" : {"Success":"Save completed"}, "return":data}});
        }else{
        	callback({"data":{"error":{"Error":"Conection problem"}}});
        }
    }); 
};

Post.prototype.vote = function(data, callback) {
	this._model.update({ 
		title: data.title,
		slug: data.slug }, { votes: data.vote }, function (err, doc) {
  		if (err) return callback({"data":{"error":{"Error":"Conection problem"}}});
  			callback({"data":{"success" : {"Success":"Save completed"}, "error":null}});
		});
};

Post.prototype.get = function(query, callback) {
	this._model.find(query).exec(function(err, doc){
		if (err) return res.render(err);
		callback(doc);
	});
}

Post.prototype.getall = function(query, callback) {
	this._model.find({active:true}).where("title").ne(null).exec(function(err, doc){
		if (err) return console.error(err);
		callback(doc);
	});
}

module.exports = Post;