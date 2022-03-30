// Import our dependencies, middlware, and models.
const express = require("express")
const passport = require("passport")

const Pet = require("../models/pet")

/////////////////////
// Middleware
//
const customErrors = require("../../lib/custom_errors")
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate("bearer", { session: false })
const removeBlanks = require("../../lib/remove_blank_fields")
const router = express.Router()
//
// End middleware
/////////////////////



//////////////////////
// Routes
//
// POST -> create a toy
// POST /toys/<pet_id>
router.post("/toys/:petId", (req, res, next) => {
    // 1. Get our toy from req.body
    const toy = req.body.toy
    // 2. Get our petID from req.params.id
    const petId = req.params.petId
    // 3. Find the pet
    Pet.findById(petId)
        // handle what happens when no pet is found
        .then(handle404)
        // 4. Push the toy to the toys array
        .then(pet => {
            console.log("This is the pet:", pet)
            console.log("This is the toy:", toy)
            pet.toys.push(toy)
            // 5. Save the pet
            return pet.save()
        })
        // 6. Then we send the pet as JSON
        .then(pet => res.status(201).json({ pet: pet }))
        // 7. Catch errors and send to the handler
        .catch(next)
})


// PATCH -> update a toy
// PATCH /toys/<pet_id>/<toy_id>
// 
// DELETE -> delete a toy
// DELETE /toys/<pet_id>/<toy_id>
//
// End routes
/////////////////////


// Keep at bottom of file
module.exports = router
