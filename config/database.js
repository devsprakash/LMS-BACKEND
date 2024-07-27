/* mongoose configuration*/
const mongoose = require('mongoose');

const {MONGODB_URI} = require('../keys/keys')
//database configuration

console.log('MONGODB_URI.........',MONGODB_URI)

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', function(){
    console.log('Database Connection Established.');
});

mongoose.connection.on('error', function(err){
    console.log('Mongodb connection failed. '+err);
    mongoose.disconnect();
});

mongoose.connection.once('open', function() {
	console.log('MongoDB connection opened!');
});

mongoose.connection.on('reconnected', function () {
	console.log('MongoDB reconnected!');
});

mongoose.connection.on('disconnected', function() {
	console.log('MongoDB disconnected!');
	mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true},/*{server:{auto_reconnect:true}}*/);
});
	
module.export = mongoose;