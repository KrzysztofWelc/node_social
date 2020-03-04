const router = require('express').Router()
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const Post = require('../db/models/Post')
const sharp = require('sharp');


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
                if (req.file) {
                    const buffer = req.file.buffer;
                    const image = await sharp(buffer).resize({
                        width: 350
                    }).jpeg().toBuffer();
                    comment.image = image;
                }
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

router.patch('/',
    auth,
    upload.single('image'),
    async (req, res) => {
            try {
                const {
                    postId,
                    commentId,
                    body
                } = req.body;
                const userId = req.user._id;

                const post = await Post.findById(postId);
                const comment = post.comments.id(commentId);
                if (String(comment.authorId) == String(userId)) {
                    if (body) comment.body = body;
                    if (req.file) {
                        const buffer = req.file.buffer;
                        const image = await sharp(buffer).resize({
                            width: 350
                        }).jpeg().toBuffer();
                        comment.image = image;
                    }
                    await post.save();
                    res.status(200).send();
                } else {
                    res.status(401).send({
                        msg: 'you are not author of this post'
                    });
                }
            } catch (e) {
                res.status(500).send({
                    msg: e.message
                });
            }
        },
        (err, req, res, next) => {
            res.status(500).send({
                msg: err.message
            });
        })

router.delete('/',
    auth,
    async (req, res) => {
        try {
            const user = req.user;
            const postId = req.body.postId;
            const commentId = req.body.commentId;

            const post = await Post.findById(postId);
            const comment = post.comments.id(commentId);

            if (String(comment.authorId) == String(user._id)) {
                comment.remove();
                await post.save();
                res.status(200).send();
            } else {
                res.status(401).send({
                    msg: 'you are not author of this comment'
                })
            }
        } catch (e) {
            res.status(500).send({
                msg: e.message
            })
        }
    }
)
router.get('/:post/:comment/image', async (req, res) => {
    try {
        const postId = req.params.post;
        const commentId = req.params.comment;

        const post = await Post.findById(postId);
        const comment = post.comments.id(commentId);
        if (!post || !comment.image || !comment) {
            throw new Error("no such an image");
        }

        res.set("Content-Type", "image/jpg");
        res.send(comment.image);

    } catch (e) {
        res.status(500).send({
            msg: e.message
        });
    }
})

module.exports = router