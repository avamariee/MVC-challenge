const { User } = require('../../models');
const router = require('express').Router();

// GET request for localhost:3001/api/users
// get ALL USERS
router.get('/', (req, res) => {

});

// GET request for localhost:3001/api/users/1
// get USERS by ID
router.get('/:id', (req, res) => {

})

// POST request for localhost:3001/api/users
// create a USER
router.post('/', (req, res) => {

})

// PUT request for localhost:3001/api/users/1
// UPDATE a USER based on their ID
router.put('/:id', (req, res) => {

})

// DELETE request for localhost:3001/api/users/1
// DESTROY a USER based on their ID
router.delete('/:id', (req, res) => {

})

module.exports = router;

