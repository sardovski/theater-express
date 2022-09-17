const authControler = require('../controllers/authControler');
const playControler = require('../controllers/playControler');
const homeControler = require('../controllers/homeControler');

module.exports = (app) => {
    app.use('/auth', authControler);
    app.use('/play', playControler);
    app.use('/', homeControler);
};