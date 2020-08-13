// DriverController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Rider = require('./Rider.js');
var Driver = require('./Driver.js');

//Creates a new Driver
router.post('/', function (req, res) {
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
//Return All Drivers
router.get('/', function (req, res) {
    Driver.find({}, function (err, Drivers){
        if (err) return res.status(500).send("There was a problem finding the drivers.");
        res.status(200).send(Drivers);
    });
});


// Gets A single Driver from the database
router.get('/:id', function (req, res) {
    Driver.findById(req.params.id, function (err, driver){
        if (err) return res.status(500).send("There was a problem finding the driver.");
        if (!driver) return res.status(404).send("No driver matching that ID.");
        res.status(200).send(driver);
    });
});

// DELETES A Driver from the database
router.delete('/:id', function (req, res){
    Driver.findByIdAndRemove(req.params.id, function (err, Driver){
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send( Driver.name +" was deleted.");
    });
});

// UPDATES A SINGLE Driver in the database
router.put('/:id', function (req, res){
    Driver.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, driver){
        if (err) return res.status(500).send("There was a problem updating the driver.");
        res.status(200).send(driver);
    });
});

//Get a single rider LOCATION and DESTINATION
router.get('/rider/:riderId', function (req, res) {
    var riderId = req.params.riderId;
    Rider.findOne({_id: riderId}, function(err, rider){
        if (err) return res.status(500).send("There was a problem finding the rider.");
        if (!rider) return res.status(404).send("No rider matching that ID.");
        res.status(200).send('Rider Location: ' + rider.location + '\nRider Destination: ' + rider.destination);
    });
});

module.exports = router;