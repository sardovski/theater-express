const Play = require('../models/Play');

async function getAllPlays(byLikes) {
    let plays;

    if(byLikes){
        //WRONG SORTING NEED TO ADD FIELDS IN MODEL
        plays = await Play.find({ public: true }).sort({ userLiked: 'desc' }).lean();
    }else{

        plays = await Play.find({ public: true }).sort({ createAt: -1 }).lean();
    }

    return plays;
}

async function getPlayById(id) {

    return await Play.findById(id).lean();
}

async function createPlay(playData) {
    const pattern = new RegExp(`^${playData.title}$`, 'i');
    const existing = await Play.findOne({ title: { $regex: pattern } });

    console.log(existing);
    if (existing) {
        throw new Error('Name of the play already exits');
    }
    const play = new Play(playData);

    await play.save();

    return play;
}

async function editPlay(id, playData) {
    const play = await Play.findById(id);

    play.title = playData.title;
    play.description = playData.description;
    play.imageUrl = playData.imageUrl;
    
    await play.save();
    return play;

}

async function deletePlay(id) {
    await Play.findByIdAndDelete(id);
}

async function likePlay(playId,userId) {
    const play = await Play.findById(playId);
//WRONG SORT NEED TO HAVE 1 MORE FIELD THAT CONTAINS COUNTS LIKED, WHEN IT PUSH TO userLIked array
    play.userLiked.push(userId);

    await play.save();

}

module.exports = {
    getAllPlays,
    getPlayById,
    createPlay,
    editPlay,
    deletePlay,
    likePlay
};