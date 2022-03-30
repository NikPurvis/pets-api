// // PET -> has many toys and has owner that is user

const mongoose = require("mongoose")

const { Schema, model } = mongoose

const petSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        adoptable: {
            type: Boolean,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, {
        timestamps: true,
        // We"re going to add virtuals to our model.
        // These lines ensure that the virtual will be included whenever we turn our document to an object or JSON.
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)

// virtuals go here(we"ll build these later)

module.exports = model("Pet", petSchema)
