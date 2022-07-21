const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');
const cookieParser = require('cookie-parser');

connectDB();
const app = express();
// This is your test secret API key.
const stripe = require('stripe')('sk_test_51LCPuyEtib9JvNXIZ0a6EenEspYlhvO8YkxcdsRcrakaqyHxIER7GzmvmEDMizypaGtPWAcdTnkyOQdiNzddjfIi00hlcPDx4O');
// const express = require('express');
// const app = express();
// app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: '{{PRICE_ID}}',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
});

//


app.use(cors({
    origin: 'http://localhost:3000',
    // methods: ['GET', 'POST', 'PUT'],
    credentials: true
}))
//middlewares
app.use(cookieParser());
app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', require('./routes/getFilters'));
app.use('/api/locations', require('./routes/getLocations'));
app.use('/api/bookings', require('./routes/getBookings'));
app.use('/api/auth', require('./routes/getUsers'));



app.listen(port, () => console.log(`server started on port ${port}`));