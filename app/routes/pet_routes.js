// Import our dependencies, middlware, and models.
const express = require("express")
const passport = require("passport")

// Pull in our model
const Pet = require("../models/pet")

////////////////
// Middleware
//
// Helps us detect certain situations and send custom errors.
const customErrors = require("../../lib/custom_errors")
// This function sends a 404 when non-existent document is requested
const handle404 = customErrors.handle404
// Middleware that can send a 401 when a user tries to access something they don't own
const requireOwnership = customErrors.requireOwnership
// requireToken is passed as a second arg to router.<verb> and makes it so a token MUST be passed for that route to be available --> also sets req.user
const requireToken = passport.authenticate("bearer", { session: false })
// Removes any blank fields from req.body, so any time we're expecting some form data. This will be especially handy in update because of how PATCH works.
const removeBlanks = require("../../lib/remove_blank_fields")

// Instantiate our router
const router = express.Router()
//
// End middleware
/////////////////////



//////////////////////
// Routes
//
// INDEX
// GET /pets
router.get("/pets", (req, res, next) => {
    // we will allow access to view all the pets, by skipping 'requireToken'
    // if we wanted to make this a protected resource, we'd just need to add that middleware as the second arg to our get(like we did in create for our post)
    Pet.find()
        .populate("owner") // Will link in the owner document in the index view.
        .then(pets => {
            // pets will be an array of mongoose documents
            // so we want to turn them into POJO (plain ol' js objects)
            // remember that map returns a new array
            return pets.map(pet => pet.toObject())
        })
        .then(pets => res.status(200).json({ pets }))
        .catch(next)
})

// SHOW
// GET /pets/624470c12ed7079ead53d4df
router.get("/pets/:id", (req, res, next) => {
    // we get the id from req.params.id -> :id
    Pet.findById(req.params.id)
        .populate("owner")
        .then(handle404)
        // if its successful, respond with an object as json
        .then(pet => res.status(200).json({ pet: pet.toObject() }))
        // otherwise pass to error handler
        .catch(next)
})

// CREATE
// We use "next" because we have our custom middleware handling under our routes in server.js. When a request happens, it first goes to server.js, it finds the route (so reads petRoutes), and then either does what petRoutes wants it to do, or passes the request down to the error handler and says "something went wrong".
router.post("/pets", requireToken, (req, res, next) => {
    // We brought in requireToken so we can have access to req.user.
    req.body.pet.owner = req.user.id

    Pet.create(req.body.pet)
        .then(pet => {
            // Send a successful response like this:
            res.status(201).json({ pet: pet.toObject() })
            // toObject turns it from BSON (binary javascript object notation, from database) to javascript object notation (JSON) so we can do stuff with it.
        })
        // If an error occurs, pass it to the error handler.
        .catch(next)
})

// UPDATE
// PATCH /pets/624470c12ed7079ead53d4df
router.patch("/pets/:id", requireToken, removeBlanks, (req, res, next) => {
    // If the client atttempts to change the owner of the pet, we can disallow that from the beginning.
    delete req.body.owner
    // 1. Find pet by ID
    Pet.findById(req.params.id)
        // 2. Handle 404
        .then(handle404)
        // 3. Require ownership and update pet
        .then(pet => {
            requireOwnership(req, pet)
            return pet.updateOne(req.body.pet)
        // 4. Send 204 No Content if successful
        .then(() => res.sendStatus(204))
        })
        // 5. Pass to error handler if not successful
        .catch(next)
})

// REMOVE
// DELETE /pets/624470c12ed7079ead53d4df
router.delete("/pets/:id", requireToken, (req, res, next) => {
    // 1. Find the pet by ID
    Pet.findById(req.params.id)
    // 2. Handle the 404 if any    
        .then(handle404)
    // 3. Use requireOwnership middleware to make sure the right person is making this request. We don't want to use remove by in the query then, so we can evoke this function.
        .then(pet => {
            // requireOwnership needs two arguments: the request and the document itself
            requireOwnership(req, pet)
            // Delete if the middleware doesn't throw an error
            pet.deleteOne()
        })
        // 4. Send back a 204 no content status
        .then(() => res.sendStatus(204))
        // 5. If error occurs, pass to the handler
        .catch(next)
})
//
// End routes
/////////////////////


// Keep at bottom of file
module.exports = router
