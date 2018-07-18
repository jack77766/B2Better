var express = require('express'),
    app     = express(),
    mongoose= require('mongoose')
    
    
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
app.set('view engine', 'ejs');



app.use(async function(req, res, next) {
  try {
    let cats    = await getCats();
    let subCats = await getSubCats();
    let allCats = await getAllCats();
    res.locals.categories    = cats;
    res.locals.subCategories = subCats;
    res.locals.allCats       = allCats;
    next();
  } catch (err) {
        next(err);
  }
});


async function getCats() {
    try {
        let foundCategories = await Category.find({}, '-_id name');
        return foundCategories;
    }
    catch(err) {
        console.log(err);
        return null;
    }
    
}

async function getSubCats() {
    try {
        let subCats = await SubCategory.find({},  '-_id name parent.name', {lean:true});
        return subCats;
    }
    catch(err) {
        console.log(err);
        return null;
    }
}

async function getAllCats(){
    try {
        let subCats = await SubCategory.find({},  '-_id name parent.name', {lean:true});
        let allCats = {};
        //Fill allCats with all categories & sub-categories
        //in key:[value1, value2,...] form for easy processing in Views
        for(const subCat of subCats) {
            var cat = subCat.parent.name;
            var sub = subCat.name;
            if(!allCats.hasOwnProperty(cat)) {
                allCats[cat] = new Array();
                
            }
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