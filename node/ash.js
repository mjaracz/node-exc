const fs = require('fs');
const PATH = process.argv[2];

let number = 0;

fs.readFile(`${PATH}`, 'utf8', (req, res) => {
    const str = res.toString();
    const arr = str.split(`\n`);

    for(let i = 0; i < arr.length-1; i++) {
        number++;
    }
    console.log(number)
});