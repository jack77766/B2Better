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


//GET CATEGORY PAGE
router.get('/:category', async(req,res) => {
    let reqCat = new RegExp(req.params.category, "i");
    let data = await getData(reqCat);
    if(data == null) {
        res.redirect('back')
    }
    else {
        res.render('category', data);
    }
});



    

module.exports = router;