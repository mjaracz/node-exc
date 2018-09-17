const http = require('http');
const httpGet = require('./modul-callback.js');
const bl = require('bl');

let count = 0;
var arr = [];

const get = function(index) {
	
	http.get(process.argv[2 + index], (respons) => {
		respons.pipe(bl((err, data) => {
			if(err) {
				console.error(err)
			}

			arr.push(data.toString());
			// console.log(arr)
		}))
	});
	console.log(arr)

}


for(let i = 0; i < 3; i++) {
	get(i);
	count++;
}

if(count === 3) {
	arr.map(item => console.log(item));
}
