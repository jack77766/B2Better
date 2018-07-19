var express     = require('express'),
    router      = express.Router(),
    
    Category    = require('../models/category'),
    SubCategory = require('../models/sub_category'),
    Product     = require('../models/product');
    
    

//ADD NEW PRODUCT FORM
router.get('/:category/:sub_category/new', async(req, res) => {
    try {
        let reqCat      = new RegExp(req.params.category, "i");
        let reqSubCat   = new RegExp(req.params.sub_category, "i");
        let category    = await Category.findOne({name:reqCat});
        let subCategory = await SubCategory.findOne({name:reqSubCat});
        if(category.name === subCategory.parent.name){
            res.render('products/new', {category:category.name, sub_category:subCategory.name}); 
        }
        else {
            res.redirect('/');
        }       
    }
    catch(err) {
        console.log(err);
        res.redirect('/');
    }
});



//SUBMIT NEW PRODUCT ROUTE
router.post('/:category/:sub_category/', async(req, res) => {
    try {
        let category    = await Category.findOne({name:req.params.category});
        let subCategory = await SubCategory.findOne({name:req.params.sub_category});
        
        Product.create({'category.name':category.name, 'category.id':category._id, 
                        'sub_category.name':subCategory.name, 'sub_category.id': subCategory._id,
                        name:        req.body.name,
                        price:       req.body.price,
                        description: req.body.description
        });
        res.redirect('/'+ category.name + '/' + subCategory.name);
    }
    catch(err) {
        console.log(err);
        res.redirect('back');
    }
    
});



//SHOW PRODUCT PAGE
router.get('/:category/:sub_category/:product', function(req, res){
    Product.findById(req.params.product, function(err, foundProduct) {
        if(err) {
            console.log(err);
            res.redirect('back');
        }
        else {
           res.render('products/show', {product:foundProduct}); 
        }
    });
});


//EDIT PRODUCT FORM
router.get('/:category/:sub_category/:id/edit', function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else {
            res.render('products/edit', {category:req.params.category, sub_category: req.params.sub_category, product: foundProduct});   
        }
    });   
});



//UPDATE PRODUCT ROUTE
router.put('/:category/:sub_category/:id', function(req, res) {
    Product.findByIdAndUpdate(req.params.id, {name:req.body.name, price:req.body.price, description:req.body.description}, function(err){
            if(err){
                console.log(err);
                res.redirect('back');
            }
            else {
                res.redirect('/' + req.params.category + '/' + req.params.sub_category + '/' + req.params.id);
            }
    });
    
});



//DELETE PRODUCT ROUTE
router.delete('/:category/:sub_category/:id', function(req, res) {
   Product.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           console.log(err);
           res.redirect('back')
       }
       else {
           res.redirect('/' + req.params.category + '/' +  req.params.sub_category);
       }
   }) ;
});




    
module.exports = router;