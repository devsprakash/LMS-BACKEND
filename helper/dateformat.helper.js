const moment = require('moment');



//set current timestamp
exports.set_current_timestamp = function(){
    return moment().format("MM/DD/YYYY HH:mm:ss");
}

exports.set_current_date = function(){
    return moment().format("MMDDYYYYHHmmss");
}

exports.add_time_current_date = function(duration, type){
    return moment().add(duration, type).format("X");
}