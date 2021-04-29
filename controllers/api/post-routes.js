const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET request for localhost:3001/api/posts
// GET all POSTS
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'body',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            // add comment model
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },

            {
                // include the User model so it can pull the user data
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log('There was an error!' + err);
        });
});

// GET request for localhost:3001/api/posts/:id
// GET a POST by ID
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'body',
            'created_at'
        ],
        include: [
            // include comment model when created
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },

            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this ID. ' })
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log('There was an error!' + err);
            res.status(500).json(err);
        });
})

// POST request for localhost:3001/api/posts
// CREATE a new POST
router.post('/', withAuth, (req, res) => {
    Post.create({
        // title, body, post_url, user_id
        title: req.body.title,
        body: req.body.body,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log('There was an error!' + err);
            res.status(500).json(err)
        });

});

// PUT request for localhost:3001/api/posts/:id
// UPDATE an existing POST
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        body: req.body.body
    },
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this ID.' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log('There was an error!' + err);
            res.status(500).json(err);
        })
})

// DELETE request for localhost:3001/api/posts/:id
// DESTROY an existing POST
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(400).json({ message: 'No post found with this ID.' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log('There was an error!' + err);
            res.status(500).json(err);
        })

})

module.exports = router;