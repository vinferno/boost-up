var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, "default": Date.now() },
    age: { type: Number, min: 18, max: 65 },
    mixed: Schema.Types.Mixed,
    _someId: Schema.Types.ObjectId,
    array: [],
    ofString: [String],
    nested: { stuff: { type: String, lowercase: true, trim: true } }
});
module.exports = mongoose.model('User', UserSchema);
