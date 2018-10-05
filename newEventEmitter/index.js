const events = require('events');
const fs = require('fs');
const watchDir = './watch';
const processedDir = './done';

function Watcher(watchDir, processedDir) {
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

Watcher.prototype = new events.EventEmitter();

Watcher.prototype.watch = function() {
  var watcher = this;
  fs.readdir(this.watchDir, function(err, files) {
    if(err) throw err;
    for(var index in files) {
      watcher.emit('process', files[index])
    };
  })
}

Watcher.prototype.start = function() {
  var watcher = this;
  fs.watchFile(watchDir, function() {
    watcher.watch();
  })
}

var watcher = new Watcher(watchDir, processedDir)
watcher.on('process', function process(file) {
  var watchFile = this.watchDir + '/' + file;
  var processedFile = this.processedDir + '/' + file.toLowerCase();
  
  fs.rename(watchFile, processedFile, function(err) {
    if (err) throw err;
  })
})

watcher.start();