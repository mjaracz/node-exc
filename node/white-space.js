const fs = require("fs");

const PATH = process.argv[2];

const file = fs.readFileSync(`${PATH}`);
const str = file.toString();
const arr = str.split('\n');

let number = 0;
for(let i = 0; i < arr.length-1; i++) {
    number++;
}


console.log(number);