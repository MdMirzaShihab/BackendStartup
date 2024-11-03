const { Schema, model, default: mongoose } = require('mongoose');


const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        maxlength: [60, "Category name shouldn't be more than 60 character "],
        minlength: [3, "Category name shouldn't be less than 3 character "]
    },
    isBanned:{
        type:Boolean,
        default:false
    },
}, {timeseries:true})


const Category = model('Category', categorySchema)


module.exports = Category;