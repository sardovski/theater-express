const router = require('express').Router();
const { isUser } = require('../middlewares/guards');

const { parseError } = require('../util/parsers');
// const { route } = require('./homeControler');


router.get('/create', isUser(), (req, res) => {

    res.render('play/create');
});

router.post('/create', isUser(), async (req, res) => {

    try {
        //todo extract data from body

        const playData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            public: Boolean(req.body.public),
            author: req.user._id
        };

        await req.storage.createPlay(playData);

        res.redirect('/');

    } catch (err) {
        //todo parse errors
        // console.log(err.message);

        const ctx = {
            errors: parseError(err),
            playData: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public),
            }

        };

        res.render('play/create', ctx);
    }
});

router.get('/details/:id', async (req, res) => {
    const playId = req.params.id;


    try {
        const play = await req.storage.getPlayById(playId);

        play.isAuthor = req.user && req.user._id == play.author;
        play.isUser = Boolean(req.user);
        play.liked = req.user && play.userLiked.find(u=>u._id == req.user._id);

        res.render('play/details', play);
    } catch (error) {

        res.redirect('/404');
        console.log(error.message);
    }

});

router.get('/edit/:id', isUser(), async (req, res) => {

    try {
        const playData = await req.storage.getPlayById(req.params.id);


        res.render('play/edit', { playData });

    } catch (err) {

    }

});

router.post('/edit/:id', isUser(), async (req, res) => {

    try {
        await req.storage.editPlay(req.params.id, req.body);

        res.redirect('/play/details/' + req.params.id);


    } catch (err) {
        console.log(err.message);
        const ctx = {
            errors: parseError(err),
            playData: req.body
        };
        ctx.playData._id = req.params.id;

        res.render('play/edit', ctx);
    }



});


router.get('/delete/:id', isUser(), async (req, res) => {
    
    
    try {
        const play = await req.storage.getPlayById(req.params.id);
        if(play.author != req.user._id){
            throw Error('You are not owner,delete denied!');
        }

        await req.storage.deletePlay(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.mesage);
        res.redirect('/play/details/' + req.params.id);
    }

});


router.get('/like/:id', isUser(), async (req, res) => {



    try {
        const play = await req.storage.getPlayById(req.params.id);
        if (play.author == req.user._id) {
            throw new Error('You can not like your own play');
        }

        await req.storage.likePlay(req.params.id, req.user._id);
        res.redirect('/play/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/play/details/' + req.params.id);
    }

});

module.exports = router;