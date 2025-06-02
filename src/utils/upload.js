const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);

      fs.rename(file.path, filePath, (err) => {
        if (err) {
          fs.unlink(file.path, () => {});
          return reject(err);
        }

        resolve(`/uploads/${fileName}`);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  uploadFile
};