const router = require('express').Router();
const { User } = require('../../models/index');

// GET request for localhost:3001/api/users
// get ALL USERS
router.get('/', (req, res) => {
    User.findAll({
        // do not show user's passwords
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })

});

// GET request for localhost:3001/api/users/1
// get USERS by ID
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            // add our other models here when they become available
        ]
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: 'No user found with this ID.' })
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })

})

// POST request for localhost:3001/api/users
// create a USER
router.post('/', (req, res) => {

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        res.json(dbUserData);
    })

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

