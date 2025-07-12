import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 🔧 Ensure folder exists
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ========== File Upload Paths ==========
const profilePath = 'uploads/profileImages';
const signaturePath = 'uploads/signatures';
const verifierPath = 'uploads/verifierSignatures';
const profilePicPath = 'uploads/profilePics';

ensureDir(profilePath);
ensureDir(signaturePath);
ensureDir(verifierPath);
ensureDir(profilePicPath);

// ========== File Filter ==========
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (jpeg, png, webp) are allowed'), false);
};

// ========== Multer Storage Logic ==========
const accountStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'signature') return cb(null, signaturePath);
        if (file.fieldname === 'verifierSignature') return cb(null, verifierPath);
        if (file.fieldname === 'profilePic') return cb(null, profilePicPath);
        if (file.fieldname === 'profileImage') return cb(null, profilePath);
        cb(null, 'uploads/others'); // fallback
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        let prefix = 'file';

        if (file.fieldname === 'signature') prefix = 'signature';
        else if (file.fieldname === 'verifierSignature') prefix = 'verifier';
        else if (file.fieldname === 'profileImage') prefix = 'profile';

        cb(null, `${prefix}-${Date.now()}${ext}`);
    }
});

// ========== Export Multer Middleware ==========
export const upload = multer({
    storage: accountStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max size
});
