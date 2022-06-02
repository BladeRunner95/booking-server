const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');

connectDB();
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    // methods: ['GET', 'POST', 'PUT'],
    // credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', require('./routes/getFilters'));
app.use('/api/locations', require('./routes/getLocations'));
app.use('/api/bookings', require('./routes/getBookings'));

app.use(errorHandler);

app.listen(port, () => console.log(`server started on port ${port}`));