
const constants = require('../config/constants');
const _ = require('lodash');



exports.sendResponse = (res, statusCode, status, message, data, lang= 'en') => {

    try{
            
        appLanguageList = constants.APP_LANGUAGE;    
        const msg = ((appLanguageList.indexOf(lang) != -1)) ? require(`../lang/${lang}/message`) : require(`../lang/en/message`)
    
        let obj = message.split(".");
        keyName = obj[0];
        subKey = obj[1];
    
        const resMessage = msg[keyName][subKey];
    
        res.writeHead(statusCode, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({
            "status": status,
            "message": resMessage,
            "data": data
        }));
        res.end();

    } catch (err) {
        throw err
    }
}

