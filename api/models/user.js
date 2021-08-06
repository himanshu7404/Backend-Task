const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    organisation: { type: String, required: true },
    designation: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    userImage: {type: String, required: true}
   

});

module.exports = mongoose.model('users', userSchema);