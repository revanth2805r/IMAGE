const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

mongoose
  .connect(
    "mongodb+srv://mailtorevanth28:xj4RCdmbPAEC38fi@cluster0.dvwfv4b.mongodb.net/images?retryWrites=true&w=majority&appName=Cluster0",)
  .then(() => {
    console.log(`Connected to MongoDB Atlas`);
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define Mongoose schema and model for image metadata
const imageSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  size: Number
});

const Image = mongoose.model('Image', imageSchema);

// Define route to handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // Save metadata to MongoDB Atlas
  const image = new Image({
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  image.save()
    .then(() => {
      res.send('File uploaded and metadata saved to MongoDB Atlas.');
    })
    .catch(err => {
      console.error('Error saving image metadata to MongoDB Atlas:', err);
      res.status(500).send('Internal Server Error');
    });
});
