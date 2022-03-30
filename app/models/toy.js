// Import dependencies
const mongoose = require("mongoose")

// Toy is a subdocument, ie, NOT a model
// Toy will be part of the toys array for specific pets

// We don't need to get model from Mongoose, so in order to save some real estate, we'll just use the standard syntax for creating a schema like this:

const toySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isSqueaky: {
        type: Boolean,
        default: false,
        required: true
    },
    condition: {
        // The condition is going to be a type: string, but we'll use enum, so that we can get a few specific answers and nothing else.
        // ENUM is a validator on the type: string that says "You can only use the values that live in this array."
        type: String,
        enum: ["new", "used", "disgusting"],
        default: "new"
    }
}, {
    timestamps: true
})

module.exports = toySchema