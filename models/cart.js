
module.exports = class Cart {
    
 constructor() {
    this.items = {};
    this.totalItems = 0;
    this.totalPrice = 0;
    
 }  
    static add(cart, item, id) {
        if(!cart.items[id]) {
            cart.items[id] = {item: item, qty: 1, price: item.price};
        }
        else {
            cart.items[id].qty++;
            cart.items[id].price += item.price;
        }
        cart.totalItems++;
        cart.totalPrice += item.price;
        return cart;
    }
    
    generateArray() {
        var myArray = [];
        for(var id in this.items) {
            myArray.push(this.items[id]);
        }
        return myArray;
    }
}
