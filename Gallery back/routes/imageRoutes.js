const express = require('express');
const router = express.Router();
const imageController = require('../controllers/ImageController');

// Create a new image
router.post('/', imageController.createImage);

// Get all image  for a user
router.get('/users/:userId', imageController.getImageByUser);


// Update image
router.put('/:imageId', imageController.EditImage);
// Delete a image
router.delete('/:imageId', imageController.deleteImage);

module.exports = router;
