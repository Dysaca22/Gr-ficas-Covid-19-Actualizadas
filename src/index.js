const express = require('express');
const app = express();
const path = require('path');

// Settings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Middlewares -- Funciones que se ejecutan antes que las rutas procesen algo

// Routes
app.use(require('./routes/index'));

// Static Files

// Listening the Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});