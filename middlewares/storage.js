const playService = require('../services/playService');



module.exports = () => (req, res, next) => {
    //todo import and decorare services


    req.storage = {
        ...playService
    };

    next();
};