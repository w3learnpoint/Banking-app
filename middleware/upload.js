import multer from 'multer';
import path from 'path';
import fs from 'fs';

const folderPath = 'uploads/profilePics';
if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folderPath),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = 'user-' + Date.now() + ext;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (jpeg, png, webp) are allowed'), false);
};

export const uploadProfilePic = multer({ storage, fileFilter });
