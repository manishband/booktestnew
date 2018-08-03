'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../model/user.model');

var _user2 = _interopRequireDefault(_user);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {};

controller.getAll = async function (req, res) {
    try {
        return await _user2.default.getAll();
    } catch (err) {
        res.send('Got error in getAll');
    }
};

controller.updateUser = async function (req, res) {
    try {
        var id = req.params.id;
        return await _user2.default.getUser(id);
    } catch (err) {
        // res.send('Got error in getAll');
        res.send(err);
    }
};

controller.deleteUser = async function (req, res) {
    var userName = req.body.name;
    try {
        var removedUser = await _user2.default.removeUser(userName);
        res.send('Users successfully deleted');
    } catch (err) {
        res.send('Delete failed..!');
    }
};

controller.checkUser = async function (req, res) {
    try {
        var _validateLoginUser = validateLoginUser(req.body),
            error = _validateLoginUser.error;

        if (error) throw error.details[0].message;
        var user = await _user2.default.findEmail({ email: req.body.email });
        var pass = await _bcrypt2.default.compare(req.body.password, user.password);
        if (!user || !pass) throw 'Invalid Email or password';
        req.session.user = _lodash2.default.pick(user, ['firstname', 'lastname', 'role', '_id']);
        req.flash('success', 'Users login successfully');
        res.redirect('/book/allbooks');
    } catch (err) {
        req.flash('error', '' + err);
        res.redirect('/user/login');
    }
};
controller.addUser = async function (req, res) {

    try {
        var _validateRegisterUser = validateRegisterUser(req.body),
            error = _validateRegisterUser.error;

        if (error) throw error.details[0].message;
        var data = await _user2.default.findEmail({ email: req.body.email });
        if (data) throw 'Users already exist in database';
        var user = new _user2.default(_lodash2.default.pick(req.body, ['firstname', 'lastname', 'email', 'password']));
        var salt = await _bcrypt2.default.genSalt(10);
        user.password = await _bcrypt2.default.hash(user.password, salt);
        user._id = new _mongoose2.default.Types.ObjectId();
        await user.save();
        req.flash('success', 'User successfully Added in the system');
        res.redirect('/book/allbooks');
    } catch (err) {
        req.flash('error', '' + err);
        res.redirect('/user/register');
    }
};
function validateLoginUser(login) {
    var schema = {
        email: _joi2.default.string().max(255).required().email(),
        password: _joi2.default.string().max(255).required()
    };

    return _joi2.default.validate(login, schema);
}
function validateRegisterUser(register) {
    var schema = {
        firstname: _joi2.default.string().min(2).max(255).required(),
        lastname: _joi2.default.string().min(2).max(255).required(),
        email: _joi2.default.string().min(5).max(255).required().email(),
        password: _joi2.default.string().min(5).max(255).required(),
        repassword: _joi2.default.string().min(5).max(255).required().valid(_joi2.default.ref('password'))
    };
    return _joi2.default.validate(register, schema);
}
exports.default = controller;