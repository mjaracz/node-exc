const fs = require("fs");
const arr = [];
let sum = 0;

process.argv.forEach((item, index) => {
    if(index >= 2) {
        arr.push(item);
        let number = Number(item);
        sum += number;
    }
})

console.log(sum)