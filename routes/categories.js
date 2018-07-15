var express = require('express'),
    router  = express.Router();
    
var Category = require('../models/category'),
    Product  = require('../models/product')
    
    
    
//GET CATEGORY PAGE
router.get('/:category', function(req,res) {
    console.log(req.params.category)
    Category.findOne({name: new RegExp('^'+req.params.category+'$', "i")}, function(err, foundCategory) {
        if(err)
          console.log(err);
        else {
            Product.find({'category.id': foundCategory.id},function(err, foundProducts){
                if(err)
                    console.log(err);
                else {
                    res.render('category', {products:foundProducts})
                }
            });
        }
    });
});
    
    
    

module.exports = router;