require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/file', fileRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
