const mongoose = require('mongoose');

const districtSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    state: { type: String, required: true },

});

module.exports = mongoose.model('districts', districtSchema);