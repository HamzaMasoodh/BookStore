const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
        unique: true, 
    },
    items: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
