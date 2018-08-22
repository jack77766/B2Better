var express  = require('express'),
    router   = express.Router(),
    passport = require('passport')
    
var User     = require('../models/user'),
    Products = require('../models/product'),
    Cart     = require('../models/cart')

//VIEW CART ROUTE
router.get('/cart', function(req,res) {
    var mySession = JSON.stringify(req.session);
    var myCart = req.session.cart;
    if(!myCart) {
        myCart = new Cart();
    }
    res.render('cart', {cart:myCart});
});

//ADD TO CART ROUTE
router.get('/cart/:id', function(req,res) {
    var productId = req.params.id;
    Products.findById(productId, function(err, foundProduct) {
        if(err){
            console.log("Could not find product to add to cart")
            res.redirect('back');
        }
        else {
            var mySession = JSON.stringify(req.session);
            var myCart = req.session.cart;
            if(!myCart) {
                myCart = new Cart();
            }
            myCart = Cart.add(myCart, foundProduct, productId);
            req.session.cart = myCart;
            console.log(myCart);
            res.redirect('/cart');
        }
    })
});
    
    
//REGISTER FORM
router.get('/register', function(req, res) {
   res.render('register')
});


//REGISTER USER MIDDLEWARE
async function registerUser (req, res, next) {
  try {
    var user = new User({ username:req.body.username.trim() });
    await User.register(user, req.body.password);
    return next();
  } catch (err) {
      req.flash('error', err.message)
      res.redirect('/register')
  }
}

//REGISTER UER ROUTE
router.post('/register', registerUser, passport.authenticate('local'), (req, res,err) => 
            {
                    req.flash('success', "You registered successfully");
                    res.redirect('/');
            },
);


//LOGIN FORM ROUTE
router.get('/login', function(req, res) {
    res.render('login');    
});

//LOGIN USER ROUTE
router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: 'login',
        failureFlash: true
}));

//LOGOUT USER ROUTE
router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

module.exports = router;