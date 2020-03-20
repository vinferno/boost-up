const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
           username: {type: String, required: true},
           email: {type: String, required: true},
           encryptedPassword: {String, required: true},
           token: {String, required: 1}
    });

module.exports = mongoose.model('User', UserSchema);


