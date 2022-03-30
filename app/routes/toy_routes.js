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


// UPDATE
// PATCH /toys/<pet_id>/<toy_id>
router.patch('/toys/:petId/:toyId', requireToken, removeBlanks, (req, res, next) => {
    const toyId = req.params.toyId
    const petId = req.params.petId

    Pet.findById(petId)
        .then(handle404)
        .then(pet => {
            const theToy = pet.toys.id(toyId)
            console.log('this is the original toy', theToy)
            requireOwnership(req, pet)

            theToy.set(req.body.toy)

            return pet.save()
        })
        // .then(data => {
        //     const { theToy, pet } = data
        //     // console.log('this is data in update', data)
        //     console.log('this is the toy in req.body', req.body.toy)
        //     console.log('type from req.body', typeof req.body.toy.isSqueaky)
        //     console.log('theToy', theToy)
        //     console.log('pet', pet)
        //     theToy.name = req.body.toy.name
        //     theToy.description = req.body.toy.description
        //     if (req.body.toy.isSqueaky) {
        //         theToy.isSqueaky = true
        //     } else {
        //         theToy.isSqueaky = false
        //     }
        //     theToy.condition = req.body.toy.condition
            
        //     // theToy.set({ toy: req.body.toy })
        //     console.log('theToy after updating', theToy)

        //     return pet.save()
        // })
        .then(() => res.sendStatus(204))
        .catch(next)
})


// DELETE -> delete a toy
// DELETE /toys/<pet_id>/<toy_id>
router.delete("/toys/:petId/:toyId", requireToken, (req, res, next) => {
    // Saving both IDs to variables for easy reference later
    const toyId = req.params.toyId
    const petId = req.params.petId
    // Find the pet in the db
    Pet.findById(petId)
        // If pet not found, throw 404.
        .then(handle404)
        .then (pet => {
            // Get the specific subdocument by its id
            const theToy = pet.toys.id(toyId)
            // Require that t he deleter is the owner of the pet
            requireOwnership(req, pet)
            // Call remove on the toy we got on the line above requireOwnership
            theToy.remove()

            return pet.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

//
// End routes
/////////////////////


// Keep at bottom of file
module.exports = router
