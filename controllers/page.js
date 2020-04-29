const router = require('express').Router();
const auth = require('../middleware/auth');

const Post = require('../db/models/Post');
const Like = require("../db/models/Like");


router.get('/main/:page', auth, async (req, res) => {
    const user = req.user;
    try {
        await user.populate('follows').execPopulate();
        const follows = user.follows;

        const query = follows.map(follow => ({
            owner: follow.followedId
        }));

        let posts;
        if(query.length){
            posts = await Post.find({
                $or: query
            }, null, {
                limit: 5,
                skip: 5 * (parseInt(req.params.page, 10) - 1),
                sort: {
                    createdAt: -1
                }
            });
        }else{
            posts = []
        }

        res.status(200).send({
            posts,
            user: req.user
        })
    } catch (e) {
        res.status(500).send({
            msg: e.message
        });
    }
})

router.get('/newest/:page', async (req, res) => {
    try {
        const posts = await Post.find(null, null, {
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

router.get('/me/likes/:page', auth, async (req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.params.page, 10);
        const likes = await Like.find({
            owner: user._id
        }, null, {
            limit: 5,
            skip: 5 * (page - 1),
            sort: {
                createdAt: -1
            }
        });
        if (likes.length === 0) {
            res.status(200).send([])
        }
        const query = likes.map(like => ({
            _id: like.post
        }));
        // console.log(query);


        const posts = await Post.find({
            $or: query
        });
        res.status(200).send(posts);
    } catch (e) {
        res.status(500).send({
            msg: e.message
        });
    }
})

router.get('/user/:id/:page', async (req, res) => {
    const userId = req.params.id;
    const page = parseInt(req.params.page, 10);
    try {
        const posts = await Post.find({
            owner: userId
        }, null, {
            limit: 5,
            skip: 5 * page - 1,
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