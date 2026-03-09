const express = require('express');
const dotenv = require('dotenv').config();
const multer = require('multer');
const cors = require('cors');
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path")


app.use(express.static(path.join(__dirname, "../frontend")))

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// app.use('/uploads', express.static('uploads'));

app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/locations', require('./routes/reviewRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})