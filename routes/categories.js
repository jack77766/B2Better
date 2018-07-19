var express = require('express'),
    router  = express.Router();
    
var Category    = require('../models/category'),
    SubCategory = require('../models/sub_category'),
    Product     = require('../models/product')


    
    
    
//GET DATA FOR CATEGORY PAGE
async function getData(categoryName){
    try {
        let foundCategory = await Category.findOne({name: categoryName});
        if(!foundCategory) {
            console.log(categoryName + " does not exist.");
            return null;
        }
        else {
            let foundSubCats  = await SubCategory.find({'parent.name': foundCategory.name});
            //Maybe should check is subcats is null as well
            let foundProducts = await Product.find({'category.id': foundCategory.id});
            return({category: foundCategory.name, subCats: foundSubCats, products:foundProducts})
        }
    }
    catch(err) {
        console.log(err);
    }
}


//CREATE A NEW CATEGORY FORM
router.get('/new', function(req,res) {
    res.render('categories/new');
});


//CREATE A NEW CATEGORY ROUTE
router.post('/', function(req,res) {
    let newName = req.body.category;
    Category.create({name: newName}, function(err, createdCat) {
        if(err)
            console.log(err);
        else {
            console.log("Created category: " + createdCat);
        }
    }); 
    res.redirect('/' + newName);
});


//GET CATEGORY PAGE
router.get('/:category', async(req,res) => {
    let reqCat = new RegExp(req.params.category, "i");
    let data   = await getData(reqCat);
    if(data == null) {
        res.redirect('back')
    }
    else {
        res.render('category', data);
    }
});


//EDIT CATEGORY FORM
router.get('/:category/edit', function(req, res) {
    res.render('categories/edit', {category:req.params.category}); 
});



//UPDATE CATEGORY ROUTE
router.put('/:category', function(req, res) {
    let oldName = req.params.category;
    let newName = req.body.category;
    Category.findOneAndUpdate({'name':oldName}, {'name':newName}, function(err){
        if(err) {
            console.log(err);
            res.redirect('back')
        }
    }) ;
    SubCategory.update({'parent.name': oldName}, {'parent.name': newName}, {multi:true}, function(err){
        if(err) {
            console.log(err);
            res.redirect('back');
        }
    });
    Product.update({'category.name': oldName}, {'category.name': newName}, {multi:true}, function(err){
       if(err) {
           console.log(err);
           res.redirect('back')
       } 
    });
    res.redirect('/'+ newName);
});


//DELETE CATEGORY
router.delete('/:category', function(req,res) {
    let cat = req.params.category;
    //Remove all products in the category
    Product.remove({'category.name': cat}, function(err) {
        if(err) console.log(err);
    })
    //Remove all SubCategories in the category
    SubCategory.remove({'parent.name': cat}, function(err){
        if(err) console.log(err);
    })
    //Remove Category
    Category.findOneAndDelete({'name': cat}, function(err){
        if(err) console.log(err);
    })
    res.redirect('/');
});





    

module.exports = router;