function asyncFunction() {
  setTimeout(callback, 200)
};

let color = 'niebieski';

(function callback(color) {
  console.log(color)
})(color)

color = 'czerwony'