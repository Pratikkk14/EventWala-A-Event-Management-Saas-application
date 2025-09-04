const express = require('express');
const dotenv = require('dotenv');

const connectToMongo = require('./Services/MongoDB_Connection');

const app = express();
const PORT = 1000;
dotenv.config();

connectToMongo(process.env.MONGODB_URI);

app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`);
})