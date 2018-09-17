const fs = require('fs');
const path = require('path');


module.exports = (folder, ext, callback) => {
    fs.readdir(folder, function(err, list) {
        if(err) {
            callback(err)
        }
        else {
            const filterArr = list.filter((item) => {
                const extname = (path.extname(item).toString() ===`.${ext}`) ? true : false;                
                if(extname) {
                    return item
                }
            })
            callback(null, filterArr);
        }
    })
};