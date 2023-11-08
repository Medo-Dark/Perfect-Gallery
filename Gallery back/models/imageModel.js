const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ThemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme',
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  title:{
    type: String,
    required: true,
  },
  mutation:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Image',
  }]
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
