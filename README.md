# caterpie

Heroku Link: https://nuber-caterpie.herokuapp.com/  (NOT ACTIVE)

Administrators can access the API via /admin/

    CREATE an Admin 
      POST to /admin/
    REMOVE an Admin
      DELETE to /admin/adminId
    CREATE a Rider 
      POST to /admin/rider
    REMOVE a Rider
      DELETE to /admin/rider/riderId
    CREATE a Driver
      POST to /admin/driver
    REMOVE a Driver
      DELETE to /admin/driver/driverId
      
    ADMIN schema is as follows
        {  
             name: String,
        }
     
Drivers can access the API via /driver/

    CREATE a Driver 
      POST to /driver/
    REMOVE an Driver
      DELETE to /driver/driverId
    UPDATE a Driver
      PUT to /driver/driverId
    See Drivers assigned rider location and destination 
      GET to /driver/rider/riderId
    DRIVER schema is as follows:
    {  
      driverName: String,
      location: String,
      carType: String,            
      availability: Boolean,     // Will default to TRUE
      rating: Number,           // Will default to 0
      assignedRider: String,   // Will default to ""
    }
 
Riders can access the API via /rider/
    
    CREATE a Rider 
      POST to /rider/
    REMOVE an Rider
      DELETE to /rider/riderId
    UPDATE a Rider
      PUT to /rider/riderId
    See Drivers within 10 miles
      GET to /rider/riderId/driver
    UPDATE Driver Rating:
      PUT /rider/riderID/driver/driverID
    SELECT a Driver
      PUT /rider/riderID/select/driverID
    GET drivers within 10 miles
      GET /rider/riderID/driver/
    RIDER schema is as follows:
    {  
      riderName: String,
      location: String,
      destination: String,
      assignedDriver: String, // will default to ""
      balance: Number, 
      preferredCarType: String, 
      cost: Number            //Will default to 0
    }

Four features

    COST OF RIDE
        When the rider GETS the drivers within 10 miles the cost of the ride if they choose to select the driver will store under the respective driver.
    BALANCE
        The rider will have a balance. After a rider selects a driver the cost and remaining balance will be display.
    SELECT PREFERRED CAR TYPE
        When creating a rider you can choose to specify a car type. When the rider gets drivers only the drivers within 10 miles and with the preferred car type will be returned.
    DRIVER RATING
        Every driver will have a rating. The driver rating will reflect the average of all ratings received. 
    
    
