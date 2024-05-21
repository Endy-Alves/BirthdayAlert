const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    pass: String,
    email: String,
    birthday: Date
}, {strict: false});

const User = mongoose.model('UserBirthday', userSchema);

module.exports = User;