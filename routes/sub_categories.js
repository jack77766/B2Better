var express = require('express'),
    router  = express.Router();

var Category    = require('../models/category'),
    SubCategory = require('../models/sub_category'),
    Product     = require('../models/product');
    




//GET DATA FOR SUB-CATEGORY PAGE
async function getData(category, subCategory) {
    let foundCategory    = await Category.findOne({name: category });
    let foundSubCategory = await SubCategory.findOne({'parent.name':category, name: subCategory});
    if(!foundSubCategory.parent.id.equals(foundCategory.id)) {
        console.log('Sub-category: ' + foundSubCategory.name + ' does not belong to category: ' + foundCategory.name);
        return null;
    }
    //GET ALL THE PRODUCTS THAT BELONG TO THE CATEGORY/SUBCATEGORY AND RETURN THEM
    let foundProducts = await Product.find({'category.id': foundCategory.id, 'sub_category.id': foundSubCategory.id});
    return ({category:foundCategory.name, sub_category: foundSubCategory.name, products: foundProducts}); 
    
}


//CREATE A NEW SUBCATEGORY FORM
router.get('/:category/new', function(req, res) {
   res.render('sub_categories/new', {category:req.params.category}); 
});



//CREATE A NEW SUBCATEGORY
router.post('/:category/', function(req,res) {
   let cat = req.params.category;
   let subCat = req.body.sub_category;
   //FIND THE CATEGORY THIS SUBCATEGORY SHOULD BELONG TO
   Category.findOne({name:cat}, '_id name', function(err, parentCat){
          if(err) console.log(err);
          else {
              //ADD THE NEW SUBCATEGORY
              SubCategory.create({name:subCat, parent:{id:parentCat._id, name:parentCat.name}}, function(err, createdSubCat) {
                 if(err) console.log(err);
                 else {
                     res.redirect('/' + cat + '/' + subCat);
                 }
              });
          }
   });
});




//GET A SUBCATEGORY PAGE
router.get('/:category/:sub_category', async (req,res) => {
    let reqCat    = new RegExp(req.params.category    , "i");
    let reqSubCat = new RegExp(req.params.sub_category, "i");
    //REQUEST PRODUCT DATA TO DISPLAY
    let data = await getData(reqCat, reqSubCat);
    if (!data) {
        res.redirect('back');
    }
    else{
        res.render('sub_category', data);
    }
});


//EDIT A SUBCATEGORY FORM
router.get('/:category/:sub_category/edit', function(req, res){
   res.render('sub_categories/edit', {category:req.params.category, sub_category:req.params.sub_category}) ;
});



//UPDATE A SUBCATEGORY
router.put('/:category/:sub_category', function(req,res) {
    let parentCat = req.params.category;
    let oldSubCat = req.params.sub_category;
    let newSubCat = req.body.sub_category;
    //CHANGE THE SUBCATEGORY'S NAME
    SubCategory.findOneAndUpdate({name:oldSubCat, 'parent.name':parentCat}, {name:newSubCat}, function(err) {
        if(err) {
            console.log(err);
            res.redirect('back');
        }
    });
    //UPDATE ALL PRODUCTS OF THAT SUBCATEGORY TO NEW NAME
    Product.update({'category.name':parentCat, 'sub_category.name':oldSubCat}, {'sub_category.name':newSubCat},
                    {multi:true},function(err) {
        if(err){
            console.log(err);
            res.redirect('back');
        }
    });
    res.redirect('/'+parentCat+'/'+newSubCat);
});



//DELETE A SUBCATEGORY
router.delete('/:category/:sub_category', function(req,res) {
    let cat    = req.params.category;
    let subCat = req.params.sub_category;
    Product.remove({'category.name':cat, 'sub_category.name':subCat}, function(err){
        if(err) {
            console.log(err);
            res.redirect('back');
        }
    })
    SubCategory.findOneAndDelete({'parent.name': cat, name: subCat}, function(err) {
        if(err){
            console.log(err);
            res.redirect('back');
        }
    })
     res.redirect('/' + cat);
});



module.exports = router;