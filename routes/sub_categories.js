var express = require('express'),
    router  = express.Router();

var Category    = require('../models/category'),
    SubCategory = require('../models/sub_category'),
    Product     = require('../models/product');
    

//GET A SUBCATEGORY PAGE
router.get('/:category/:sub_category', function(req,res){
    let reqCat    = new RegExp('^'+req.params.category     +'$', "i");
    let reqSubCat = new RegExp('^'+req.params.sub_category +'$', "i");
    
    Category.findOne({name: reqCat }, function(err, foundCategory) {
        if(err)
            console.log(err);
        else {
            SubCategory.findOne({name: reqSubCat}, function(err, foundSubCategory) {
                if(err)
                    console.log(err);
                else {
                    if(!foundSubCategory.parent.id.equals(foundCategory.id)) {
                        console.log('Sub-category: ' + foundSubCategory.name + ' does not belong to category: ' + foundCategory.name);
                        res.redirect('back');
                    }
                    else {
                        Product.find({'category.id': foundCategory.id, 'sub_category.id': foundSubCategory.id}, function(err, foundProducts){
                            if(err) 
                                console.log(err);
                            else {
                                res.render('sub_category', {sub_category: foundSubCategory.name, products: foundProducts});
                            }
                            
                        });
                    }
                }
            });
        }
    })
});




module.exports = router;