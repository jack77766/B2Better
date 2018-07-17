var express = require('express'),
    router  = express.Router();
    
var Category    = require('../models/category'),
    SubCategory = require('../models/sub_category'),
    Product     = require('../models/product')
    
    
    
    
    
//GET CATEGORY PAGE
router.get('/:category', function(req,res) {
    var reqCat = new RegExp('^'+req.params.category+'$', "i");
    Category.findOne({name: reqCat}, function(err, foundCategory) {
        if(err)
          console.log(err);
        else if(foundCategory == null) {
            console.log(req.params.category + " does not exist");
            res.redirect('back');
        }
        else {
            SubCategory.find({'parent.name': foundCategory.name}, function(err, foundSubCats) {
                if(err){
                    console.log(err);
                }
                else {
                    Product.find({'category.id': foundCategory.id},function(err, foundProducts){
                        if(err)
                            console.log(err);
                        else {
                            res.render('category', {category: foundCategory.name, subCats: foundSubCats, products:foundProducts})
                        }
                    });
                }
            })
        }
        
    });
});
    
    
    

module.exports = router;