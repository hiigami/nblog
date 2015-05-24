var _mongoose = require('mongoose'),
	_schema = _mongoose.Schema;


var postSchema = new _schema({
	title: {type: String, require:true},
	author: {type: String, require:true},
	slug: {type: String, require:true},
	content: {type: String},
	votes: {type: Number,default:0},
	active: {type: Boolean,default:true},
	file: {type: String},
	createdAt: { type: Date, default: Date.now }
});

var Post = _mongoose.model('Post', postSchema);

module.exports = Post;