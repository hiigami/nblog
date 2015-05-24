var expressServer = require('./modules/server'),
	_conf = require('./conf');

var app = new expressServer();

app._server.listen(process.env.port || _conf.port);