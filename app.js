//APP IMPORTS
var express           = require('express'),
    app               = express(),
    mongoose          = require('mongoose'),
    methodOverride    = require('method-override'),
    bodyParser        = require('body-parser'),
    session           = require('express-session'),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    flash             = require('connect-flash'),
    MongoStore        = require('connect-mongo')(session),
    dotenv            = require('dotenv').config()
    
    
//REQUIRE ROUTES
var adminRoutes       = require('./routes/admin'),
    categoryRoutes    = require('./routes/categories'),
    subCategoryRoutes = require('./routes/sub_categories'),
    productRoutes     = require('./routes/products'),
    indexRoutes       = require('./routes/index')
    
    
//REQUIRE MODELS
var Category          = require('./models/category'),
    SubCategory       = require('./models/sub_category'),
    User              = require('./models/user'),
    Cart              = require('./models/cart')
    
//DATABASE SETUP
var DATABASEURL = (process.env.DATABASEURL || "mongodb://localhost/b2better");
mongoose.connect(DATABASEURL); 
    //Put seed data into the Database
var seedDB = require('./seed');
seedDB();



//APP SETUP
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(flash());



app.use(session({
    secret:"WAKA WAKA",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 *1000}
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use(async function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.testString   = "This is a test String.";
    res.locals.testObject   = {cat:'Mens', subCat: 'diapers'};
    res.locals.flashError   = req.flash('error');
    res.locals.flashSuccess = req.flash('success');
    res.locals.session      = req.session;
  try {
    res.locals.allCats = await getAllCats();
    next();
  } catch (err) {
        console.log(err);
        next(err);
  }
});




//ACTIVATE ROUTES
app.use(adminRoutes);
app.use(indexRoutes);
app.use(categoryRoutes);
app.use(subCategoryRoutes);
app.use(productRoutes);



app.get('/', function(req, res) {
    // if((!req.session.cart) && (req.isAuthenticated())) {
    //     req.session.cart = new Cart();
    //     console.log("Cart created");
    // }
   res.render('home'); 
});



const PORT = process.env.PORT || 3000;
const IP = process.env.IP || 'localhost';
app.listen(PORT, IP, function() {
   console.log("B2Better server started!"); 
});



async function getAllCats(){
    try {
        let cats    = await Category.find({}, '-_id name', {lean:true});
        let subCats = await SubCategory.find({},  '-_id name parent.name', {lean:true});
        let allCats = {};
        //Fill allCats with all categories & sub-categories
        //in key:[value1, value2,...]form where(key = the category and value = it's sub-categories) 
        //for easy processing in Views
        for(const cat of cats) {
            allCats[cat.name] = new Array();
        }
        for(const subCat of subCats) {
            var cat = subCat.parent.name;
            var sub = subCat.name;
            allCats[cat].push(sub);
        }
        return allCats;
    }
    catch(err) {
        console.log(err);
        return null;
    }
}