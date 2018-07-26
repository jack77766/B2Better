var express  = require('express'),
    router   = express.Router(),
    passport = require('passport')
    
var User     = require('../models/user')
    
    
//REGISTER FORM
router.get('/register', function(req, res) {
   res.render('register')
});


//REGISTER USER MIDDLEWARE
async function registerUser (req, res, next) {
  try {
    var user = new User({ username:req.body.username });
    await User.register(user, req.body.password);
    return next();
  } catch (e) {
    return next(e);
  }
}

//REGISTER UER ROUTE
router.post('/register', registerUser, 
            passport.authenticate('local'), 
                (req, res) => res.redirect('/') 
)


//LOGIN FORM ROUTE
router.get('/login', function(req, res) {
    res.render('login');    
});

//LOGIN USER ROUTE
router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: 'login'
}));

//LOGOUT USER ROUTE
router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

module.exports = router;