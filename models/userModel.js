

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    url: String,
    title: String,
    description: String
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    videos: [videoSchema],
    description: {
        type: String,
        default: ''
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
