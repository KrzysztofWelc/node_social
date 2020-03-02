const router = require('express').Router();
const auth = require('../middleware/auth');

const Post = require('../db/models/Post');


router.get('/main/:page', auth, async (req, res) => {
    const user = req.user;
    try {
        await user.populate('follows').execPopulate();
        const follows = user.follows;

        const query = follows.map(follow => ({
            owner: follow.followedId
        }));
        const posts = await Post.find({
            $or: query
        }, null, {
            limit: 5,
            skip: 5 * (parseInt(req.params.page, 10) - 1),
            sort: {
                createdAt: -1
            }
        });

        res.send({
            posts,
            user: req.user
        })
    } catch (e) {
        res.status(500).send({
            msg: e.message
        });
    }
})

router.get('/me/posts/:page', auth, async (req, res) => {
    try {
        const user = req.user;
        const posts = await Post.find({
            owner: user._id
        }, null, {
            limit: 5,
            skip: 5 * (parseInt(req.params.page, 10) - 1),
            sort: {
                createdAt: -1
            }
        });
        res.status(200).send(posts);
    } catch (e) {
        res.status(500).send({
            msg: e.message
        });
    }
})

module.exports = router;