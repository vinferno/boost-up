const mongoose = require('mongoose');

const UserSchema = new mongoose.schema({
   name: 'string',
});

export const User = mongoose.model('User', UserSchema);


