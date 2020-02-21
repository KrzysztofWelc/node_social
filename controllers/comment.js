const router = require('express').Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

const Post = require('../db/models/Post')


router.post('/add',
    auth,
    upload.single('image'),
    async (req, res) => {
            try {
                const user = req.user;
                const comment = {
                    authorId: user._id,
                    authorName: user.nickName,
                };
                if (req.body.body) comment.body = req.body.body;
                if (req.file) comment.image = req.file.buffer;

                const post = await Post.findById(req.body.postId);
                post.comments = post.comments.concat([comment]);
                await post.save();
                res.status(200).send();
            } catch (e) {
                res.status(500).send({
                    msg: e.message
                });
            }
        },
        (err, req, res, next) => {
            res.status(500).send({
                msg: err.message
            })
        })

module.exports = router