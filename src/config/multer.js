const  multer =  require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    console.log(file)
    if (file.mimetype == "image/png" || file.mimetype == "image/mp4" || file.mimetype == "image/jpeg")  {
        cb(null, true);
       } else {
         cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
        }
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 10*1024*1024, files: 1 },
        });

module.exports = upload