var express = require('express'),
	_swig  = require('swig'),
	_bodyParser = require('body-parser'),
	_settings = require('./settings'),
	_router = require('./router');
	

var Server = function (params) {
	params = params || {};
	this._server = express();

	this._server.use(_bodyParser.json());
	this._server.use(_bodyParser.urlencoded({ extended: true }));

	for (var s in _settings){
		this._server.use(_settings[s]);
	}

	for (var r in _router){
		for (var f in _router[r].prototype) {
			var _method = _router[r].prototype[f]["method"];
			var _url = _router[r].prototype[f]["url"];
			this.render(_method,_url,f, r);
		}
	}

	this._server.engine('html', _swig.renderFile);
	this._server.set('views', __dirname + '\\templates');
	this._server.set('view cache', false);
	_swig.setDefaults({varControls:["[[","]]"]});
	_swig.setDefaults({ cache: false });
}

Server.prototype.render = function(method, url, render, controller){
	
	this._server[method](url, function (req, res, next) {
		var _controller = new _router[controller]({"render":render, "req":req, "res":res, "next":next});
		_controller.response();
	});
}

module.exports = Server;