const express = require('express');
require('dotenv').config();
const connectToMongo = require('./DB/MongoDB_Connection');
const DB_Router = require("./Routes/DB_Router");
// const profileRouter = require('./Routes/profile_Router');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 1000;

connectToMongo(process.env.MONGODB_URI);

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use("/api/DB_Routes", DB_Router);
// app.use("/api/profile", profileRouter);

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