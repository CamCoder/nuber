// Db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://user:Password1@blogpost-shard-00-00-0lhnk.mongodb.net:27017,blogpost-shard-00-01-0lhnk.mongodb.net:27017,blogpost-shard-00-02-0lhnk.mongodb.net:27017/test?ssl=true&replicaSet=blogpost-shard-0&authSource=admin&retryWrites=true');
