'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _books = require('../model/books.model');

var _books2 = _interopRequireDefault(_books);

var _user = require('../model/user.model');

var _user2 = _interopRequireDefault(_user);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {};
controller.getAll = async function (req, res) {
    try {
        var books = await _books2.default.getAll();
        var data = [];
        books.forEach(function (key) {
            var element = {};
            element.name = key.name;
            element.publisher = key.publisher;
            element.author = key.author;
            element.price = key.price;
            element.genere = key.genere;
            element.id = key.id;
            if (req.session.user != undefined) {
                if (req.session.user.role == 'Admin') {
                    element.setEdit = 'show';
                } else {
                    element.setEdit = key.id == req.session.user._id ? 'show' : '';
                }
            } else {
                element.setEdit = '';
            }

            data.push(element);
        });
        res.render('books', { booksResult: data, successAlert: req.flash('success') });
    } catch (err) {
        res.send('' + err);
    }
};
controller.getAuthors = async function (req, res) {
    try {
        var user = await _user2.default.getAll();
        var authors = [];
        user.forEach(function (key) {
            var element = {};
            element.firstname = key.firstname, element.lastname = key.lastname, element.value = key._id;
            authors.push(element);
        });
        res.render('addBooks', { author: authors, errorLogin: req.flash('error') });
    } catch (err) {
        res.send('Got error in getAll');
    }
};

controller.getBook = async function (req, res) {
    try {
        var book_id = req.params.id;
        var books = await _books2.default.getBook(book_id);
        res.send(_lodash2.default.pick(books[0], ['name', 'genere', 'publisher', 'price', 'author', '_id']));
    } catch (err) {
        res.send('Got error in getBook ' + err);
    }
};
controller.addBook = async function (req, res) {

    try {
        var _validateAddBook = validateAddBook(req.body),
            error = _validateAddBook.error;

        if (error) throw error.details[0].message;
        var savedBook = new _books2.default({
            _id: new _mongoose2.default.Types.ObjectId(),
            updatedBy: req.session.user._id,
            author: req.body.author,
            name: req.body.name,
            genere: req.body.genere,
            publisher: req.body.publisher,
            price: req.body.price
        });

        await savedBook.save();
        req.flash('success', 'Book successfully added');
        res.redirect('/book/allbooks');
    } catch (err) {
        req.flash('error', '' + err);
        res.redirect('/book/addBook');
    }
};

controller.deleteBook = async function (req, res) {
    var bookName = req.body.name;
    try {
        var removedBook = await _books2.default.removeBook(bookName);
        res.send('Book successfully deleted');
    } catch (err) {
        res.send('Delete failed..!');
    }
};
controller.editBook = async function (req, res) {
    try {
        var _validateEditBook = validateEditBook(req.body),
            error = _validateEditBook.error;

        if (error) throw error.details[0].message;
        var book = await _books2.default.editBook(req.body.book_id);
        book.updatedBy = req.session.user._id;
        book.name = req.body.name;
        book.genere = req.body.genere;
        book.publisher = req.body.publisher;
        book.price = req.body.price;
        var log = await book.save();

        res.send({ status: 'success', message: 'Book updated successfully ' });
    } catch (err) {
        res.send({ status: 'danger', message: '' + err });
    }
};
function validateAddBook(book) {
    var schema = {
        name: _joi2.default.string().max(255).required(),
        genere: _joi2.default.string().max(255).required(),
        publisher: _joi2.default.string().max(255).required(),
        price: _joi2.default.string().max(255).required(),
        author: _joi2.default.string().max(255).required()
    };
    return _joi2.default.validate(book, schema);
}
function validateEditBook(book) {
    var schema = {
        name: _joi2.default.string().max(255).required(),
        genere: _joi2.default.string().max(255).required(),
        publisher: _joi2.default.string().max(255).required(),
        price: _joi2.default.string().max(255).required(),
        book_id: _joi2.default.string()
    };
    return _joi2.default.validate(book, schema);
}
exports.default = controller;