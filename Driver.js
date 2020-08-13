var mongoose = require('mongoose');  
var DriverSchema = new mongoose.Schema({  
  driverName: String,
  location: String,
  carType: String,
  availability: Boolean,
  rating: Number,
  assignedRider: String,
});
mongoose.model('Driver', DriverSchema);
module.exports = mongoose.model('Driver');