// seedPets.js will be a script we can run from the terminal to create a bunch of pets at once.
// We'll need to be careful with our seed when we run it, because it'll will remove all the pets first, then add the new ones.

// 1. Require Mongoose to make a database connection in the file
const mongoose = require("mongoose")
// 2. Bring in the pet model
const Pet = require("./pet")
// 3. Get db config string from the file
const db = require("../../config/db")

const startPets = [
    { name: 'Sparky', type: 'dog', age: 2, adoptable: true},
    { name: 'Leroy', type: 'dog', age: 10, adoptable: true},
    { name: 'Biscuits', type: 'cat', age: 3, adoptable: true},
    { name: 'Hulk Hogan', type: 'hamster', age: 1, adoptable: true}
]

// 1. Connect to the database via Mongoose. (reference server.js)
mongoose.connect(db, {
	useNewUrlParser: true,
})
    .then(() => {
        // 2. Remove all the pets
        Pet.remove({})
        // This is just a basic development app, buy we can add a bunch of javascript stuff here if we wanted, like if the owner still exists, don't remove, etc.
            .then(deletedPets => {
                console.log("Deleted pets:", deletedPets)
                // 3. Create a bunch of new pets using the startPets array
                Pet.create(startPets)
                    .then(newPets => {
                        console.log("New pets:", newPets)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        // 4. We'll use console logs to check, if it's working or there are errors.
        console.log(error)
        // 5. At the end, close the database connection.
        mongoose.connection.close()
    })

// Note that whether there's an error or not, we always close the db connection.
