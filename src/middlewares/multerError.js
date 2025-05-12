const multer = require("multer");
const { err } = require('../utils/responses');
const handleError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json(err('', "file is too large"));
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json(err('', "File limit reached"));
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json(err('', "File must be of type jpeg/png/mp4"));
    }
  }
}

module.exports = handleError