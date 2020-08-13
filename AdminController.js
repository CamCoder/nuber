// AdminController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Admin = require('./Admin.js');
var Rider = require('./Rider.js');
var Driver = require('./Driver.js');

// CREATES A NEW ADMIN
router.post('/', function (req, res) {
    Admin.create({
            name: req.body.name,
        }, 
        function (err, admin) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(admin);
        });
});
// RETURNS ALL THE Admins IN THE DATABASE
router.get('/', function (req, res) {
    Admin.find({}, function (err, admins) {
        if (err) return res.status(500).send("There was a problem finding the admins.");
        res.status(200).send(admins);
    });
});


// GETS A SINGLE Admin FROM THE DATABASE
router.get('/:id', function (req, res) {
    Admin.findById(req.params.id, function (err, admin) {
        if (err) return res.status(500).send("There was a problem finding the admin.");
        if (!admin) return res.status(404).send("No admin found.");
        res.status(200).send(admin);
    });
});

// DELETES A Admin FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Admin.findByIdAndRemove(req.params.id, function (err, admin) {
        if (err) return res.status(500).send("There was a problem deleting the admin.");
        res.status(200).send( admin.name +" was deleted.");
    });
});

// UPDATES A SINGLE Admin IN THE DATABASE
router.put('/:id', function (req, res) {
    
    Admin.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, admin) {
        if (err) return res.status(500).send("There was a problem updating the admin.");
        res.status(200).send(admin);
    });
});

/* Admin can add/remove  riders */

// Admin can CREATE A NEW riders
router.post('/rider', function (req, res) {
    Rider.create({
            riderName: req.body.riderName,
            location: req.body.location,
            destination: req.body.destination,
            balance: req.body.balance,
            assignedDriver: "",
            preferredCarType: req.body.preferredCarType,
            cost: 0,
        },
        function (err, rider) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(rider);
        });
});

// Admin can DELETE A rider FROM THE DATABASE
router.delete('/rider/:id', function (req, res) {
    Rider.findByIdAndRemove(req.params.id, function (err, rider) {
        if (err) return res.status(500).send("There was a problem deleting the rider.");
        res.status(200).send( rider.riderName +" was deleted.");
    });
});

/* Admin can add/remove Drivers */

// Admin can CREATE A NEW Driver
router.post('/driver', function (req, res) {
    Driver.create({
            driverName : req.body.driverName,
            location: req.body.location,
            carType: req.body.carType,
            availability: true,
            rating: 0,
            assignedRider: "",
        },
        function (err, driver){
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(driver);
        });
});

// Admin can DELETE A Driver FROM THE DATABASE
router.delete('/driver/:id', function (req, res) {
    Driver.findByIdAndRemove(req.params.id, function (err, driver) {
        if (err) return res.status(500).send("There was a problem deleting the driver.");
        res.status(200).send( "The driver was deleted.");
        });
});
module.exports = router;
