var mongoose = require('mongoose');

var subCategorySchema = new mongoose.Schema({
    name: String,
    parent: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Parent'
        }
    }
});

module.exports = mongoose.model('Sub-Category', subCategorySchema);
