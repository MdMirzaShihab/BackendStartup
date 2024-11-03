const { body } = require("express-validator");

// validate user registration
const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("name is required, please enter your name")
        .isLength({ min: 3 })
        .withMessage("name must be at least 3 characters long")
        .isLength({ max: 30 })
        .withMessage("name must be at most 30 characters long"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required, please enter your email")
        .isEmail()
        .withMessage("please enter a valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required, please enter your password")
        .isLength({ min: 7 })
        .withMessage("password must be at least 7 characters long")
        .isLength({ max: 30 })
        .withMessage("password must be at most 30 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,30}$/)
        .withMessage("password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("phone is required, please enter your phone number")
        .matches(/^01[3-9]\d{8}$/)
        .withMessage("please enter a valid phone number"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("address is required, please enter your address")
        .isLength({ min: 7 })
        .withMessage("password must be at least 7 characters long")
        .isLength({ max: 50 })
        .withMessage("password must be at most 50 characters long"),

    body("image")
        .custom((value, { req }) => {
            if (!req.file || !req.file.buffer) {
                throw new Error("User image is required");
            }
            return true;
        })
        .withMessage("User image is required")
];

module.exports = { validateUserRegistration };
