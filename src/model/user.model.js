'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = Schema({
  _id: Schema.Types.ObjectId,
  role: String,
  active: Boolean,
  firstname: String,
  lastname: String,
  email: String,
  password: String
});

var UserModel = _mongoose2.default.model('users', UserSchema);

UserModel.getAll = function () {
  return UserModel.find({});
};

UserModel.removeUser = function (userName) {
  return UserModel.remove({ name: userName });
};
UserModel.findEmail = function (find) {

  return UserModel.findOne(find);
};
UserModel.getUser = function (id) {
  return UserModel.find({ '_id': id, active: true });
};

exports.default = UserModel;