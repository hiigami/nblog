var cookie_secret = "mysecrete";

module.exports = {
	static: require('./static'),
	cookkie: require('cookie-parser')(cookie_secret),
	session: require('express-session')({
    secret: cookie_secret,
    proxy: false,
    resave: true,
    saveUninitialized: true
}),
	csurf:require('csurf')({ cookie: true }),
	busboy: require('connect-busboy')()
}