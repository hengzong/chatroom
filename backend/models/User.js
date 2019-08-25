const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    user_name: {
        type: String, unique: true, required: true
    },
    password: {
        type: String, required: true
    }
});

module.exports = mongoose.model('User', User);
