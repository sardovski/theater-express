const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const { isGuest, isUser } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register', isGuest(),//todo changes by project requirements
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').bail()
        .isAlphanumeric().withMessage('Username must contain only English letters and digits'),
    body('password')
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long').bail()
        .isAlphanumeric().withMessage('Password must contain only English letters and digits'),
    body('rePass').custom((value, { req }) => {

        if (value != req.body.password) {
            throw new Error('Passwords don\'t match');
        }

        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                //todo improve err msg
                
                throw new Error(errors.map(e=>e.msg).join('\n'));
            }

            await req.auth.register(req.body.username.trim(), req.body.password.trim());
            
            res.redirect('/'); //todo change location for specific of the project

        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username
                }
            };

            res.render('user/register',ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
   
    try {
        await req.auth.login(req.body.username.trim(), req.body.password.trim());

        res.redirect('/');

    } catch (err) {
        console.log(err.message);
        let errors = [err.message];
        if(err.type == 'credential'){
            errors = ['Incorect username or password'];
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username
            }
        };

        res.render('user/login',ctx);

    }
});

router.get('/logout', (req, res) => {
    console.log('user logout');
    req.auth.logout();
    res.redirect('/');

});

module.exports = router;