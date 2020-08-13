// RiderController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Rider = require('./Rider.js');
var Driver = require('./Driver.js');
var list_of_drivers =  []
let num_of_drivers = 0
let old_rating = 0
let avg_rating = 0;
let num_of_rating = 0
let rating = 0;

var withinTen = [];

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDrY6cvpVkyI_9gnayzWHsLO7sfhvhQqLA'
});


//Creates a new RIDER
router.post('/', function (req, res) {
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
//Return All RIDERS
router.get('/', function (req, res) {
    Rider.find({}, function (err, riders) {
        if (err) return res.status(500).send("There was a problem finding the riders.");
        //loop
        for(let i=0; i<riders.length; i++){

            googleMapsClient.directions({
                origin: riders[i].location,
                destination: riders[i].destination

            }, function(err, response) {
                if (!err) {
                    var dis = JSON.stringify(response.json.routes[0].legs[0].distance.text);
                    dis = parseFloat(JSON.parse(dis));

                   // riders[i].cost = dis * 2.00;

                    Rider.findByIdAndUpdate({_id:riders[i]._id},{"cost": dis * 2.00}, function(err,rider){
                        if(!rider) return res.status(500).send(err);
                    });
                    //Once all drivers have been checked excute IF statement
                    if(i == drivers.length - 1 ){
                        return res.status(200).send(riders);
                    }
                };
            });
            
        };
       return res.status(200).send(riders);
    });
});

// Gets A single RIDER from the database
router.get('/:id', function (req, res) {

    Rider.findById(req.params.id, function (err, rider) {
        if (err) return res.status(500).send("There was a problem finding the rider.");
        if (!rider) return res.status(404).send("No rider found.");
        res.status(200).send(rider);
    });
});


//Return All DRIVERS within 10 miles
router.get('/:id/driver/', function (req, res) {

    Rider.findById(req.params.id, function (err, rider) {
        if (err) return res.status(500).send("There was a problem finding the rider.");
        if (!rider) return res.status(404).send("No rider found.");

        Driver.find({}, function (err, drivers) {
            if (err) return res.status(500).send("There was a problem finding the riders.");

            let inTenMiles = [];

            if(rider.preferredCarType != "" ){
            //Loop
            for(let i=0; i<drivers.length; i++){

                googleMapsClient.directions({
                    origin: rider.location,
                    destination: drivers[i].location

                }, function(err, response) {
                    if (!err) {
                        var dis = JSON.stringify(response.json.routes[0].legs[0].distance.text);
                        dis = parseFloat(JSON.parse(dis));

                        
                            if( dis < 10 && ( rider.preferredCarType == drivers[i].carType ) ){
                                inTenMiles.push( drivers[i] );
                            }

                        //Once all drivers have been checked excute IF statement
                        if(i == drivers.length - 1 ){
                            return res.status(200).send(inTenMiles);
                        }
                    }
                });
            };
            }
            else{for(let i=0; i<drivers.length; i++){

                googleMapsClient.directions({
                    origin: rider.location,
                    destination: drivers[i].location

                }, function(err, response) {
                    if (!err) {
                        var dis = JSON.stringify(response.json.routes[0].legs[0].distance.text);
                        dis = parseFloat(JSON.parse(dis));

                        
                            if( dis < 10 ){
                                inTenMiles.push( drivers[i] );
                            }

                        //Once all drivers have been checked excute IF statement
                        if(i == drivers.length - 1 ){
                            return res.status(200).send(inTenMiles);
                        }
                    }
                });
            };

            }   
        });
        //  return res.status(200).send(rider);
    });
});

// DELETES A RIDER from the database
router.delete('/:id', function (req, res) {
    Rider.findByIdAndRemove(req.params.id, function (err, rider) {
        if (err) return res.status(500).send("There was a problem deleting the rider.");
        res.status(200).send( rider.riderName +" was deleted.");
    });
});

// UPDATES A SINGLE RIDER in the database this will allow the upday of current and destination location
router.put('/:id', function (req, res) {

    Rider.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, rider) {
        if (err) return res.status(500).send("There was a problem updating the rider.");
        res.status(200).send(rider);
    });
});

// Rider Selects a Driver -- Works
router.put('/:id/select/:driverId', function (req, res) {
    var id = req.params.id;
    var driverId = req.params.driverId;

    Rider.findOne({_id: id}, function(err, rider){
        if (err) return res.status(500).send("There was a problem finding the rider.");
        if (!rider) return res.status(404).send("No rider found.");

        Driver.findOne({_id: driverId}, function(err, driver){
            if (err) return res.status(500).send("There was a problem finding the driver.");
            if (!driver) return res.status(404).send("No driver found.");

            let newBal = rider.balance - rider.cost;

            Rider.findOneAndUpdate({_id: id}, {"assignedDriver": driver.driverName, "balance": newBal}, function(err, rider){
                if (err) return res.status(500).send("There was a problem finding the rider.");
                if (!rider) return res.status(404).send("No rider found.");
            });

            Driver.findOneAndUpdate({_id: driverId}, { "assignedRider": rider.riderName, "availability": false}, function(err, rider){
                if (err) return res.status(500).send("There was a problem finding the driver.");
                if (!driver) return res.status(404).send("No driver found.");
            });

            return res.send(rider.riderName + " selected " + driver.driverName + " as their driver." +
                "\n\nYour Nuber will cost: $" + rider.cost + //Cost
                "\nYour balance is now: $" + newBal.toFixed(2)  //Remainning Balance
            );
        });
    });
});

///////////// UPDATES DRIVER RATING ////////////////////
router.put('/:id/driver/:driverId', function (req, res) {
    var driver_id = req.params.driverId;
    var new_rating = parseFloat(req.body.rating);

    if (new_rating > 5) {
        new_rating = 5;
    }

    else if (new_rating < 0) {
        new_rating = 0;
    }

    rating = rating + new_rating;
    num_of_rating = num_of_rating + 1;
    avg_rating = rating / num_of_rating;

    Driver.findOne({_id: driver_id}, function (err, driver) {
        if (err) return res.status(500).send("There was a problem finding the driver.");
        if (!driver) return res.status(404).send("No driver found.");

        driver.rating = avg_rating;

        Driver.findByIdAndUpdate({_id: driver_id}, {"rating": driver.rating}, function (err, driver) {
            if (err) return res.status(500).send("There was a problem updating the driver.");
        });

        res.status(200).send( driver);
    });
});




//As a RIDER I want to see the selected driver location -- WORKING
router.get('/driver/:driverId/', function (req, res) {
    var driverId = req.params.driverId;
    Driver.findOne({_id: driverId}, function(err, driver){
        if (err) return res.status(500).send("There was a problem finding the driver.");
        if (!driver) return res.status(404).send("No driver found.");

        res.status(200).send( driver.driverName +" current location: " + driver.location);
    });
});


module.exports = router;

