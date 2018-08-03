'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var BooksSchema = Schema({
    _id: Schema.Types.ObjectId,
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    author: { type: Schema.Types.ObjectId, ref: 'users' },
    name: String,
    genere: String,
    publisher: String,
    price: Number,
    delete: { type: Boolean, default: false },
    lastupdated: { type: Date, default: Date.now() }
});

var BooksModel = _mongoose2.default.model('books', BooksSchema);

BooksModel.getAll = function () {
    return BooksModel.find({ delete: false }).populate('author', ['firstname', 'lastname']).sort('_id');
};

BooksModel.getBook = function (book_id) {
    return BooksModel.find({ '_id': book_id, delete: false }).populate('author', ['firstname', 'lastname']);
};

BooksModel.editBook = function (booksId) {
    return BooksModel.findById(booksId);
};
BooksModel.removeBooks = function (booksName) {
    return BooksModel.remove({ name: booksName });
};

exports.default = BooksModel;