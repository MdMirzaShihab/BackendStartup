const { Schema, model } = require('mongoose');

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
        minlength: [3, "User name shouldn't be less than 3 character "],

    },
})


const users = [
    {name: 'Md Mirza Shihab', pass: 1211},
    {name: 'Sakib Kamal', pass:2111 },
    {name: 'Tarikur Islam', pass:2222 },
    
]

module.exports = users;