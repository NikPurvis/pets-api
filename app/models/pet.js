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

// virtuals go here(we'll build these later)
// A virtual is a virtual property, that uses the data that'ss saved in the database.
// To add a property whenver we retrieve that document and convert to an object.
petSchema.virtual("fullTitle").get(function() {
    // We can do whatever javascripty things we want in here, we just need to make sure that we return some value.
    // It has to be in this structure so we can use "this.".
    // fullTitle is going to combine the name and type to build a title.
    // We could use this for anything. ex: If you had birthdate, could show if person was of legal drinking age. It reads the data and performs the function.
    return `${this.name} the ${this.type}`
})

petSchema.virtual("isABaby").get(function() {
    if (this.age < 5) {
        return "Yeah, they're just a baby."
    } else if (this.age >= 5 && this.age < 10) {
        return "Not really a baby, but still a baby."
    } else {
        return "A good old pet (definitely still a baby)"
    }
})

module.exports = model("Pet", petSchema)
