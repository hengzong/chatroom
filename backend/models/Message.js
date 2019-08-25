const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Message = new Schema({
    user_name: {
        type: String
    },
    date: {
        type: Date, default: Date.now
    },
    message: {
        type: String
    }
});

module.exports = mongoose.model('Message', Message);
