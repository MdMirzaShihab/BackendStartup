const fs = require('fs').promises;


// delete user image
const deleteImage = async (userImagePath) => {

    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log('User image file deleted successfully.');
        
    } catch (error) {
        console.error('Error accessing user image file:', error);
        
    }
};

module.exports = { deleteImage };