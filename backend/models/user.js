const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure for convenience

const schema = new Schema({
    name: { type: String },  // Fixed object syntax
    email: { 
        type: String, 
        unique: true 
    },
    username: { 
        type: String, 
        unique: true 
    },
    password: { type: String } // Fixed object syntax
});

// Create the model
const MyModel = mongoose.model('signin', schema);

module.exports = MyModel;
