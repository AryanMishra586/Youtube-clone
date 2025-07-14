import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    // cb -> callback
    cb(null, "./public/temp");
  },
  filename: function (_, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)  // optional to keep -> gives uniqueSUffixes after filename
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });