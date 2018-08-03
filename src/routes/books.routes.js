"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _books = require("../controller/books.controller");

var _books2 = _interopRequireDefault(_books);

var _user = require("../controller/user.controller");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/allbooks', function (req, res) {
    _books2.default.getAll(req, res);
});

router.get('/view/:id', function (req, res) {
    _books2.default.getBook(req, res);
});

router.get('/addBook', function (req, res) {
    _books2.default.getAuthors(req, res);
});

router.post('/addBook', function (req, res) {
    _books2.default.addBook(req, res);
});
router.post('/editBook', function (req, res) {
    _books2.default.editBook(req, res);
});

router.delete('/deletebook/:id', function (req, res) {
    _books2.default.deleteCar(req, res);
});

exports.default = router;