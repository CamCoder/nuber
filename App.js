// app.js
var express = require('express');
var app = express();
var db = require('./Db');

var AdminController = require('./AdminController');
var DriverController = require('./DriverController');
var RiderController = require('./RiderController');

//The admin request ends in /admin
app.use('/admin', AdminController);

//The driver request ends in /driver
app.use('/driver', DriverController);

//The rider request ends in /rider
app.use('/rider', RiderController);

module.exports = app;

