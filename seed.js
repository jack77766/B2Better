var Category    = require('./models/category'),
    SubCategory = require('./models/sub_category'),
    Product     = require('./models/product')



var categories = ['Men\'s', 'Women\'s', 'Children\'s', 'Baby\'s'];


var sub_categories = [
        {name: 'Shirts', parent: 'Men\'s'},    {name: 'Pants', parent: 'Men\'s'}, {name: 'Men\'s Shoes', parent: 'Men\'s'},
        {name: 'Blouses', parent: 'Women\'s'}, {name: 'Skirts', parent: 'Women\'s'}, {name: 'Women\'s Shoes', parent: 'Women\'s'},
        {name: 'Tops', parent: 'Children\'s'}, {name: 'Bottoms', parent: 'Children\'s'},
        {name: 'Onesies', parent: 'Baby\'s'},  {name: 'Bodies', parent: 'Baby\'s'}
    ];
    
var products = [
    {name: 'blue shirt' , category: 'Men\'s' , sub_category: 'Shirts', price: 40 , description: "elegant blue shirt"},
    {name: 'black striped pants' , category: 'Men\'s' , sub_category: 'Pants', price: 80 , description: "sharp looking black striped pants"},
    {name: 'wing-tip loafers' , category: 'Men\'s' , sub_category: 'Men\'s Shoes', price: 60 , description: "comfortable camel wing-tip loafers"},
    {name: 'red blouse' , category: 'Women\'s' , sub_category: 'Blouses', price: 30 , description: "stunning red blouse"},
    {name: 'flowered skirt' , category: 'Women\'s' , sub_category: 'Skirts', price: 60 , description: "beautifull white flowered skirt"},
    {name: 'black flats' , category: 'Women\'s' , sub_category: 'Women\'s Shoes', price: 35 , description: "elegant black flats"},
    {name: 'printed tees' , category: 'Children\'s' , sub_category: 'Tops', price: 12, description: "cool animal/cartoon printed tees"},
    {name: 'colored shorts' , category: 'Children\'s' , sub_category: 'Bottoms', price: 20 , description: "cool colored cargo shorts"},
    {name: 'animal onesies' , category: 'Baby\'s' , sub_category: 'Onesies', price: 10 , description: "Cute animal inspired onesies"},
    {name: '2 short-sleeve bodies' , category: 'Baby\'s' , sub_category: 'Bodies', price: 7 , description: "2 cute short-sleeve bodies"},
    
    ];
    
    
    
async function addCats() {
    try {
        for (const category of categories){
            await Category.create({name:category});
            console.log("Created Category: " + category)
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function addSubs(){
    try {

        for(const sub of sub_categories) {
            var foundParent = await Category.findOne({name: sub.parent});
            let newSub = {name:sub.name, parent: {name:foundParent.name, id: foundParent._id}};
            let createdSub = await SubCategory.create(newSub);
            await console.log("Created sub-category: " + createdSub.name + " with Parent: " + createdSub.parent.name);
        }
    }
    catch(err) {
        console.log(err);
    }
}

async function addProducts(){
    try {
        for(const product of products) {
            let foundCategory    = await Category.findOne({name: product.category});
            let foundSubCategory = await SubCategory.findOne({name: product.sub_category});
            if(!foundSubCategory.parent.id.equals(foundCategory.id)){
                console.log("This sub-category doesnt belong to that category");
            }
            else {
                Product.create({name: product.name, category: { name: foundCategory.name, id: foundCategory.id }, 
                                sub_category: {name: foundSubCategory.name, id: foundSubCategory.id}, 
                                price: product.price, description: product.description
                }, function(err, createdProduct){
                                if(err)
                                    console.log(err);
                                else
                                    console.log("Created product: " + createdProduct.name +
                                        " in: " + createdProduct.category.name +"/" + createdProduct.sub_category.name);
                            });
            }
        
        }
    }
    catch(err) {
        console.log(err);
    }
}
    


async function seedDB(){
    await Product.remove({});
    await SubCategory.remove({});
    await Category.remove({});
    await addCats();
    await addSubs();
    await addProducts();
                    
}

module.exports = seedDB;