const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require('./api/routes/user');
const childRoutes = require('./api/routes/child');
const districtRoutes = require('./api/routes/district');
const stateRoutes = require('./api/routes/state');

mongoose.connect(
    "mongodb+srv://Himanshu:saroha7895@cluster0.lequp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useMongoClient: true
    }
  );
  mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/child', childRoutes);
app.use('/district', districtRoutes);
app.use('/state', stateRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message 
        }
    });
});

module.exports = app;