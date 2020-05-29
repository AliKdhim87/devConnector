const multer = require('multer');
var cloudinary = require('cloudinary');

const cloudinaryStorage = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: 'dicrwfyvs',
  api_key: '163494596653774',
  api_secret: 'vyveyQj6spLQckqCe3YhWv385bU',
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'avatar',
  allowedFormats: ['jpg', 'jpeg', 'png'],
  transformation: [
    {
      width: 200,
      height: 200,
      crop: 'limit',
      // gravity: 'face',
      crop: 'thumb',
      quality: 'auto',
    },
  ],

  filename: function (req, file, cb) {
    cb(undefined, file.filename);
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;
