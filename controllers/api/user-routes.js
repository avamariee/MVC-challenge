const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            // add our other models here when they become available
            {
                model: Post,
                attributes: ['id', 'title', 'body', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
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

// POST request for localhost:3001/api/users/login
// LOG-IN as a USER

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: "There is no user with that email-address!" })
                return;
            }

            const validatePass = dbUserData.checkPassword(req.body.password);
            if (!validatePass) {
                res.status(400).json({ message: 'Password is incorrect!' });
                return;
            }

            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({ user: dbUserData, message: "Successfully logged in!" })
            })
        })
})

// POST request for localhost:3001/api/users/logout
// LOG-OUT the current USER

router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        // if user is logged in, destroy their session
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        // if user is not logged in, respond with "not found" error.
        res.status(404).end();
    }
})

// PUT request for localhost:3001/api/users/:id
// UPDATE a USER based on their ID
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            // if there is no user with this id, display 404 error
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this ID.' })
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log('There was an error! ' + err);
            res.status(500).json(err);
        })

})

// DELETE request for localhost:3001/api/users/1
// DESTROY a USER based on their ID
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this ID.' })
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log('There was an error! ' + err);
            res.status(500).json(err);
        });

})

module.exports = router;

