var express = require('express'),
    app     = express(),
    mongoose= require('mongoose')
    
    
//REQUIRE ROUTES
var adminRoutes       = require('./routes/admin'),
    categoryRoutes    = require('./routes/categories'),
    subCategoryRoutes = require('./routes/sub_categories')
    
    
//APP SETUP
var DATABASEURL = (process.env.DATABASEURL || "mongodb://localhost/b2better");
mongoose.connect(DATABASEURL); 
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

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