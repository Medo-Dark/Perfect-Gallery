const Image = require('../models/imageModel');

// Create a new image entry
const createImage = async (req, res) => {
  console.log(req.body)
  try {
    const image = new Image(req.body);

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all image entries for a user
const getImageByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const image = await Image.find({ userId: userId });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update image
const EditImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { Id } = req.body;
    const image = await Image.findById(imageId);

    image.mutation.push(Id);
    const updated = await Image.findByIdAndUpdate(imageId, {mutation:image.mutation})
    if (!updated) {
      return res.status(404).json({ message: 'Image entry not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a image entry
const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const deleted = await Image.findByIdAndDelete(imageId);

    if (!deleted) {
      return res.status(404).json({ message: 'Image  not found' });
    }

    res.json({ message: 'Image entry deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createImage,
  getImageByUser,
  deleteImage,
  EditImage
};
