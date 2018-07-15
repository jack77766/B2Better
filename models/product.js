var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String,
  category: {
      name: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Category'        
      }
  },
  sub_category: {
    name: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Sub-Categoy'
    }
  },
  price: Number, 
  description: String,
  date: { type: Date, default: Date.now }
   
})

module.exports = mongoose.model('Product', productSchema);