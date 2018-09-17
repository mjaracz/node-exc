const folder = process.argv[2];
const ext = process.argv[3];
folder.toString();
ext.toString();

const filterModule = require('./module.js');


filterModule(folder, ext, callback)


function callback(err, arr) {
    if(err) {
        console.log(err)
    }
    else {
        arr.forEach(item => {
            console.log(item);
        });
    }
}