const fs = require('fs');
const path = require('path');

const folder = process.argv[2];
const ext = "." + process.argv[3];
ext.toString();


fs.readdir(`${folder}`, (err, res) => {
    if(err) {
        console.log(err);
    }

    const filterArr = res.filter((item) => {
        const extname = (path.extname(item).toString() === ext) ? true : false;
         
        if(extname) {
            return item
        }
    })

    filterArr.forEach(item => {
        console.log(item);
    })
})