require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db')

const app = express();
const PORT = 5000 || process.env.PORT;

// Connection to MongoDB
connectDB();

// middleware to pass data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Static files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// Routes
app.use('/', require('./server/routes/customer'))


// Handle 404
app.get('*', (req,res) => {
    res.status(404).render('404')
})


app.listen(PORT, () => {
    console.log(`Listening on : http://localhost:${PORT}`);
})