var express = require('express'),
    app     = express(),
    mongoose= require('mongoose'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser');
    
    
//REQUIRE ROUTES
var adminRoutes       = require('./routes/admin'),
    categoryRoutes    = require('./routes/categories'),
    subCategoryRoutes = require('./routes/sub_categories')
    
    
//REQUIRE MODELS
var Category    = require('./models/category'),
    SubCategory = require('./models/sub_category');
    
    
//APP SETUP
var DATABASEURL = (process.env.DATABASEURL || "mongodb://localhost/b2better");
mongoose.connect(DATABASEURL); 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');



app.use(async function(req, res, next) {
  try {
    res.locals.allCats = await getAllCats();
    next();
  } catch (err) {
        console.log(err);
        next(err);
  }
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





//Put data into the Database
var seedDB = require('./seed');
seedDB();






//ACTIVATE ROUTES
app.use(adminRoutes);
app.use(categoryRoutes);
app.use(subCategoryRoutes);



app.get('/', function(req, res) {
   res.render('home'); 
});




app.listen(process.env.PORT, process.env.IP, function() {
   console.log("B2Better server started!"); 
});