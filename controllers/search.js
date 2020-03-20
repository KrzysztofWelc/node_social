const router = require('express').Router();
const User = require('../db/models/User');

router.get('/preview/:phrase', async(req, res)=>{
    const phrase = req.params.phrase || '';

    try {
        const previews = await User.find({$or:[
                {email: {$regex: phrase}},
                {nickName: {$regex: phrase}}
            ]}, null, {
            limit: 5
        });
        res.status(200).send(previews);
    }catch(e){
        res.status(500).send({msg: e.message});
    }
});

router.get('/:phrase', async(req, res)=>{
    const phrase = req.params.phrase || '';

    try {
        const profiles = await User.find({$or:[
                {email: {$regex: phrase}},
                {nickName: {$regex: phrase}}
            ]});
        res.status(200).send(profiles);
    }catch(e){
        res.status(500).send({msg: e.message});
    }
});

module.exports = router;