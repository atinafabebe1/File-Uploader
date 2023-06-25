const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Myfile = require('../models/myfile');
const { getFileSize } = require('../helpers/fileHelper');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const files = await Myfile.find();

    const result = files.map((file) => ({
      id: file._id,
      name: file.name,
      email: file.email,
      fileName: path.basename(file.file),
      size: getFileSize(file.file),
      uploadDate: file._id.getTimestamp()
    }));
    console.log(result);

    res.json(result);
  } catch (err) {
    console.error('Error getting files:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = new Myfile({ name, email, file: req.file.path });
    await file.save();
    res.json(file);
  } catch (err) {
    console.error('Error saving file:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await Myfile.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = file.file;

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
        return res.status(500).json({ message: 'Error deleting file' });
      }

      await Myfile.findOneAndDelete({ _id: id });
      res.json({ message: 'File deleted successfully' });
    });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
