//Dependencies
const express = require('express');
const app = express(); 
const morgan = require('morgan');
//Routers
const admin = require('./routes/admin');
//Middleware
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound'); 
const cors = require('./middleware/cors');
require('dotenv').config();

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/admin', admin);

app.use(notFound);

app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on port 8080');
}); 