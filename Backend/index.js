const express = require('express');
require('dotenv').config();

const connectToMongo = require('./DB/MongoDB_Connection');

const app = express();
const PORT = process.env.PORT || 1000;

connectToMongo(process.env.MONGODB_URI);

app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`);
})