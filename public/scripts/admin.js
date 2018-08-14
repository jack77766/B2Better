var categorySelector    = document.querySelector('#category2');
var subCategorySelector = document.querySelector('#subCategory');
var catButton           = document.querySelector('#categoryButton');
var subCatButton        = document.querySelector('#subCategoryButton');

function updateSubs() {
    
    if(categorySelector.value) {
        var currentCategory = categorySelector.value;
        for(var i = subCategorySelector.options.length - 1 ; i >= 0 ; i--) {
            subCategorySelector.remove(i);
        }
        subCategorySelector.options[0] = new Option("Please select a subCategory");
        for(var subCat of myCats[currentCategory]) {
             subCategorySelector.options[subCategorySelector.options.length] = new Option(subCat, subCat);
        }
    }
    
}

categorySelector.addEventListener('change', updateSubs);
//Make the button that wasn't clicked null so when can tell 
//which button was pressed at route
catButton.addEventListener('onClick', function() {
    subCategorySelector = null;
});
subCatButton.addEventListener('onClick', function() {
    categorySelector = null;
});

