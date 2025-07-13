// middleware/uploadCSV.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure CSV upload directory exists
const csvUploadPath = 'uploads/csv';
if (!fs.existsSync(csvUploadPath)) {
    fs.mkdirSync(csvUploadPath, { recursive: true });
}

// File filter for CSV
const csvFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' && file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

// Multer storage config
const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, csvUploadPath),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `import-${Date.now()}${ext}`);
    },
});

export const uploadCSV = multer({
    storage: csvStorage,
    fileFilter: csvFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
