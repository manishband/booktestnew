'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config.env');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var connectToDb = async function connectToDb() {
    var dbHost = _config2.default.dbHost;
    var dbPort = _config2.default.dbPort;
    var dbName = _config2.default.dbName;
    try {
        await _mongoose2.default.connect('mongodb://' + dbHost + ':' + dbPort + '/' + dbName, { useNewUrlParser: true });
    } catch (err) {
        Error('Could not connect to MongoDB');
    }
};

exports.default = connectToDb;