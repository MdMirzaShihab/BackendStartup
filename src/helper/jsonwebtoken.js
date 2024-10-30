const jwt = require('jsonwebtoken');


// create json web token function to reuse
const createJSONWebToken = (payload, secretKey, expiresIn) => {
    
    if (typeof payload !== "object" || !payload) {
        throw new Error("payload must be an object");
    }

    if (typeof secretKey !== "string" || !secretKey) {
        throw new Error("secretKey must be a non-emepty string");
    }

    try {
        const token = jwt.sign(payload, secretKey, {expiresIn: expiresIn});
        return token;
    } catch (error) {
        console.error('Error creating JSON Web Token:', error);
        throw error;
    }

}

module.exports = { createJSONWebToken };