const fs = require('fs').promises;


const deleteImage = async (userImagePath) => {

    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log('User image file deleted successfully.');
        
    } catch (error) {
        console.error('Error accessing user image file:', error);
        
    }






    fs.access(userImagePath)
    .then(() => fs.unlink(userImagePath))
    .then(() => console.log('User image file deleted successfully.'))
    .catch((error) => console.error('Error accessing user image file:', error));
};

module.exports = { deleteImage };