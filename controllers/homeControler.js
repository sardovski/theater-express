const router = require('express').Router();

router.get('/', async (req, res) => {
    
    let user = false;
    if(res.locals.user){
        user = true;
    }

    const query = req.query.byLikes;

    
    const playData = await req.storage.getAllPlays(query);

    const ctx = {
        playData,
        user
    };


    res.render('home',ctx);

});


module.exports = router;