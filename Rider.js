var mongoose = require('mongoose');  
var RiderSchema = new mongoose.Schema({  
  riderName: String,
  location: String,
  destination: String,
  assignedDriver: String,
  balance: Number, 
  preferredCarType: String,
  cost: Number,
  
});
mongoose.model('Rider', RiderSchema);
module.exports = mongoose.model('Rider');