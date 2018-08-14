var subcatCategorySelector     = document.querySelector('#category2');
var subcatSubCategorySelector  = document.querySelector('#subCategory2');
var productCategorySelector    = document.querySelector('#category3');
var productSubCategorySelector = document.querySelector('#subCategory3');



function updateSubs(cats, subcats) {
    
    if(cats.value) {
        var currentCategory = cats.value;
        for(var i = subcats.options.length - 1 ; i >= 0 ; i--) {
            subcats.remove(i);
        }
        subcats.options[0] = new Option("Please select a subCategory");
        for(var subCat of myCats[currentCategory]) {
             subcats.options[subcats.options.length] = new Option(subCat, subCat);
        }
    }
    
}

subcatCategorySelector.addEventListener('change', function() { updateSubs(subcatCategorySelector, subcatSubCategorySelector)});
productCategorySelector.addEventListener('change', function() { updateSubs(productCategorySelector, productSubCategorySelector)});

