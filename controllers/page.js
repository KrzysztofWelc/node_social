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
            limit: 3,
            skip: 3 * (parseInt(req.params.page, 10) - 1),
            sort: {
                createdAt: -1
            }
        });

        res.send(posts)
    } catch (e) {
        res.status(500).send({
            msg: e.message
        });
    }
})

module.exports = router;