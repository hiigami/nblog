var fs = require('fs'),
	Postview = require("./view"),
	Postmodel = require("./model"),
	_view = new Postview(),
	_model = new Postmodel();

var Post = function function_name (params) {
	params = params || {};

	this.response = function(){
		this[params["render"]]["render"](params["req"], params["res"], params["next"]);
	}
}

Post.prototype.home = {
	"url" : "/",
	"method" : "get",
	"render" : function(req, res, next){
		_model.getall({},function(doc){
			_view.home(res, doc, req);
		});
	}
}

Post.prototype.get = {
	"url" : "/get/:id",
	"method" : "get",
	"render" : function(req, res, next){
		_model.get({slug:req.params.data},function(doc){
			res.send(doc);
		});
	}
}

Post.prototype.vote = {
	"url" : "/vote/",
	"method" : "post",
	"render" : function(req, res, next){
		_model.vote(req.body, function(doc){
			if(doc.data.error == null)
				res.send({"data":{"success":{"Success":"Vote submited"}, "vote":1}});
			else
				res.send({"data":{"error":{"Error":"Error on save"}, "vote":0}});
		});
	}
}

Post.prototype.save = {
	"url" : "/save/",
	"method" : "post",
	"render" : function(req, res, next){
		var _data = {};
		if(req.busboy) {
			req.pipe(req.busboy);

       		req.busboy.on('file', function (fieldname, file, filename) {
		            //console.log("Uploading: " + filename);
		            
		            //Path where image will be uploaded
		            var filePath = __dirname + '/img/' + filename;
		            var fstream = fs.createWriteStream(filePath);
		            file.pipe(fstream);
		            fstream.on('close', function () {    
			            fs.readFile(filePath, function(err, data) {
					   		_data["file"] = new Buffer(data).toString('base64');
					   		fs.unlinkSync(filePath);
					   		saveModel(_data, res);
						});        
			        });
        	});


            req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
      			_data[key]=value;
      			saveModel(_data, res);
    		});
		}
	}
}

function saveModel(_data, res){
	if(Object.keys(_data).length==8){
		_model.save(_data, function(doc){
			_view.save(res, doc);
		});
	}
}

module.exports = Post;