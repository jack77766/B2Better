var express = require('express'),
    router  = express.Router();

var Category    = require('../models/category'),
    SubCategory = require('../models/sub_category'),
    Product     = require('../models/product');
    




//GET DATA FOR SUB-CATEGORY PAGE
async function getData(category, subCategory) {
    let foundCategory    = await Category.findOne({name: category });
    let foundSubCategory = await SubCategory.findOne({name: subCategory});
    if(!foundSubCategory.parent.id.equals(foundCategory.id)) {
        console.log('Sub-category: ' + foundSubCategory.name + ' does not belong to category: ' + foundCategory.name);
        return null;
    }
    let foundProducts = await Product.find({'category.id': foundCategory.id, 'sub_category.id': foundSubCategory.id});
    return ({sub_category: foundSubCategory.name, products: foundProducts}); 
    
}

//GET A SUBCATEGORY PAGE
router.get('/:category/:sub_category', async (req,res) => {
    let reqCat    = new RegExp(req.params.category    , "i");
    let reqSubCat = new RegExp(req.params.sub_category, "i");
    let data = await getData(reqCat, reqSubCat);
    if (!data) {
        res.redirect('back');
    }
    else{
        res.render('sub_category', data);
    }
});



module.exports = router;