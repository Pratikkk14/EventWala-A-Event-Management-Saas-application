const express = require('express');
require('dotenv').config();
const connectToMongo = require('./DB/MongoDB_Connection');
const DB_Router = require("./Routes/DB_Router");
const explore_events = require('./Routes/explore-events');
const explore_venues = require('./Routes/explore-venues');
const Vendor_Router = require('./Routes/Vendor_Router');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

connectToMongo(process.env.MONGODB_URI);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4000',
  credentials: true,
  optionsSuccessStatus: 200
};

//Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// Routes
app.use("/api/DB_Routes", DB_Router);
app.use("/api/explore-events", explore_events);
app.use("/api/explore-venues", explore_venues);
app.use("/api/vendors", Vendor_Router);

// Health check route for root
app.get('/', (req, res) => {
    res.send('EventWala Backend is running!');
});



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`);
})