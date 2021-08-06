const mongoose = require('mongoose');

const childSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    childImage: {type: String, required: true}

});

module.exports = mongoose.model('Child', childSchema);