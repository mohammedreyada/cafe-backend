const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    available: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);