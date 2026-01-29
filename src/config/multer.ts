import multer from 'multer';

import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'src/public/uploads');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });
