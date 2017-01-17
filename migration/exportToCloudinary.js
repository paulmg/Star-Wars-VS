const cloudinary = require('cloudinary');

const config = require('./config');

cloudinary.config(config.cloudinary);

module.exports = async(imageURL) => {
  let cloudinaryResult = null;
  await cloudinary.uploader.upload(imageURL, (result) => {
    cloudinaryResult = result;
  }, {
    folder: 'SWVS'
  });

  return cloudinaryResult.secure_url;
};
