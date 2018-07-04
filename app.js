var express = require('express'),
    app     = express(),
    mongoose= require('mongoose')
    
mongoose.connect('mongodb://localhost/b2better');
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
   res.render('home'); 
});

app.listen(process.env.PORT, process.env.IP, function(req,res) {
   console.log("B2Better server started!"); 
});