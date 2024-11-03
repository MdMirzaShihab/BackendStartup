const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require('../secret');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        maxlength: [30, "User name shouldn't be more than 30 character "],
        minlength: [3, "User name shouldn't be less than 3 character "]
    },
    email:{
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: (v) => {
                return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
            },
            message: "please enter a valid email"

        }

    },
    password:{
        type: String,
        required: [true, 'User password is required'],
        minlength: [7, "User password shouldn't be less than 6 character "],
        set: (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
    },

    image:{
        type:Buffer,
        contentType:String,
        required: [true, 'user image is required'],
    },
    address:{
        type:String,
        required: [true, 'user adderess is required'],
    },
    phone:{
        type:String,
        required: [true, 'user phone is required'],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
}, {timeseries:true})


const User = model('User', userSchema)


module.exports = User;