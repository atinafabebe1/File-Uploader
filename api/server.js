require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

// Create Express app
const app = express();

// Set up middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema for the file
const myfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  file: String, // store the file path in the filebase
});

// Create a model based on the schema
const Myfile = mongoose.model("Myfile", myfileSchema);

// Set up file storage and handling using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Define the routes
app.get("/file", async (req, res) => {
  const files = await Myfile.find();

  const result = files.map((file) => ({
    id: file._id,
    name: file.name,
    email: file.email,
    fileName: file.file.split("/").pop(), // extract the file name from the path
    size: getFileSize(file.file), // get the file size using a helper function
    uploadDate: file._id.getTimestamp(), // get the upload date from the MongoDB ObjectId
  }));
  res.json(result);
});

// Helper function to get the file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes.toFixed(2);
  } catch (err) {
    console.error(`Error getting file size for ${filePath}:`, err);
    return null;
  }
}

app.post("/file", upload.single("file"), async (req, res) => {
  const { name, email } = req.body;
  const file = new Myfile({ name, email, file: req.file.path }); // store the file path in the filebase
  await file.save();
  res.json(file);
});

app.delete("/file/:id", async (req, res) => {
  const { id } = req.params;
  const file = await Myfile.findById(id);
  if (file) {
    const filePath = file.file;
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
        res.status(500).json({ message: "Error deleting file" });
      } else {
        await Myfile.findOneAndDelete({ _id: id });
        res.json({ message: "File deleted successfully" });
      }
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

port = process.env.PORT || 3001;
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port} `);
});
