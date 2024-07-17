const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Bodyparser Middleware
app.use(bodyParser.json());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads/videos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const db = process.env.MONGO_URI;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// const express = require('express');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
// const cors = require('cors');


// const path = require('path');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());
// app.use(cors());
//  app.use(express.json());

//  app.use(bodyParser.json());


// app.use('/api/users', userRoutes);
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));



// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running on port ${PORT}`));
