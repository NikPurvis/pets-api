// Import our dependencies, middlware, and models.
const express = require("express")
const passport = require("passport")

// Pull in our model
const Pet = require("../models/pet")

////////////////
// Middleware
////////////////
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

/////////////////////
// End middleware
/////////////////////



//////////////////////
// Routes
//////////////////////
//
//
//
/////////////////////
// End routes
/////////////////////



// Keep at bottom of file
module.exports = router
