require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const app = express();
const PORT = 5000 || process.env.PORT;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Static files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// Route
app.get('/', (req,res) => {

    const locals = {
        title: 'NodeJs',
        description: 'Free NodeJs Server'
    }

    res.render('index', {
        locals
    })
})

app.listen(PORT, () => {
    console.log(`Listening on : http://localhost:${PORT}`);
})