const { Schema, model, default: mongoose } = require('mongoose');


const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [60, "Product title shouldn't be more than 60 character "],
        minlength: [3, "Product title shouldn't be less than 3 character "]

    },
    description:{
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [260, "Product title shouldn't be more than 260 character "],
        minlength: [20, "Product title shouldn't be less than 20 character "]
    },
    pricePerUnit:{
        type: Number,
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value >= 0; 
            },
            message: '{VALUE} is not a valid non-negative integer'
        },
        required: [true, 'Product unit price is required']
    },

    availableUnits:{
        type: Number,
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value >= 0; 
            },
            message: '{VALUE} is not a valid non-negative integer'
        },
        required: [true, 'Product avaible Unit is required']
    },
    minimumOrder:{
        type: Number,
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value >= 0; 
            },
            message: '{VALUE} is not a valid non-negative integer'
        },
        required: [true, 'Product minimum order is required']
    },
    maximumOrder:{
        type: Number,
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value >= 0; 
            },
            message: '{VALUE} is not a valid non-negative integer'
        }
    },
    isSold:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
}, {timeseries:true})


const Product = model('Product', productSchema)


module.exports = Product;