const { Comment, User, Post } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET ALL Comments
// GET route for localhost:3001/api/comments
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]

    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// CREATE a new comment
// POST route for localhost:3001/api/comments
router.post('/', withAuth, (req, res) => {
    // make sure the user is logged in before allowing them to create comments

    if(req.session){
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id

        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
});

// DELETE an existing comment
// DELETE route for localhost:3001/api/comments/:id
router.delete('/:id', withAuth, (req, res) => {

    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData){
            res.status(400).json({ message: "There is no comment associated with this ID. "})
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;