'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./src/config/config.env');

var _config2 = _interopRequireDefault(_config);

var _db = require('./src/config/db');

var _db2 = _interopRequireDefault(_db);

var _user = require('./src/routes/user.routes');

var _user2 = _interopRequireDefault(_user);

var _books = require('./src/routes/books.routes');

var _books2 = _interopRequireDefault(_books);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = _config2.default.serverPort;

(0, _db2.default)();

var app = (0, _express2.default)();
app.use((0, _cookieParser2.default)());
app.use((0, _connectFlash2.default)());
app.use((0, _expressSession2.default)({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.set('views', _path2.default.join(__dirname, 'src', 'views'));
app.engine('handlebars', (0, _expressHandlebars2.default)({ defaultLayout: 'main', layoutsDir: 'src/views/layouts' }));
app.set('view engine', 'handlebars');
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use('/public', _express2.default.static(__dirname + '/src/public'));

app.use(function (req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});
app.get('/', function (req, res) {
    res.redirect('/user/login');
});

app.use('/user', _user2.default);
app.use('/book', _books2.default);

app.listen(port, function () {
    // console.log('server started - ', port);
});