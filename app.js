//APP IMPORTS
var express           = require('express'),
    app               = express(),
    mongoose          = require('mongoose'),
    methodOverride    = require('method-override'),
    bodyParser        = require('body-parser'),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    flash             = require('connect-flash')
    
    
//REQUIRE ROUTES
var adminRoutes       = require('./routes/admin'),
    categoryRoutes    = require('./routes/categories'),
    subCategoryRoutes = require('./routes/sub_categories'),
    productRoutes     = require('./routes/products'),
    indexRoutes       = require('./routes/index')
    
    
//REQUIRE MODELS
var Category          = require('./models/category'),
    SubCategory       = require('./models/sub_category'),
    User              = require('./models/user');
    
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



app.use(require('express-session')({
    secret:"WAKA WAKA",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use(async function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.flashError   = req.flash('error');
    res.locals.flashSuccess = req.flash('success');
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
   res.render('home'); 
});




app.listen(process.env.PORT, process.env.IP, function() {
   console.log("B2Better server started!"); 
});



async function getAllCats(){
    try {
        let cats    = await Category.find({}, '-_id name', {lean:true});
        let subCats = await SubCategory.find({},  '-_id name parent.name', {lean:true});
        let allCats = {};
        //Fill allCats with all categories & sub-categories
        //in key:[value1, value2,...] form for easy processing in Views
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