const fs = require('fs')
const request = require('request')
const htmlparser = require('htmlparser')
const configFilename = './rss_feeds.txt'

function checkForRSSFile () {
  fs.exists(configFilename, function(exists) {
    if(!exists) return next(new Error('Nie znaleziono pliku z kanalem RSS: ' + configFilename))

    next(null, configFilename)
  })
}

function readRSSFile (configFilename) {
  fs.readFile(configFilename, function(err, feedList) {
    if(err) return next(err)

    feedList = feedList
                .toString()
                .replace(/^\s+|\s+$/g, '')
                .split("\n");
    const random = Math.floor(Math.random()*feedList.length)
    next(null, feedList[random]);
  });
}

function downloadRSSFeed (feedUrl) {
  request({uri: feedUrl}, function(err, res, body) {
    if (err) return next(err)
    if (res.statusCode != 200)
      return next(new Error('Niewłaściwy kod stanu odpowiedzi'))
    
    next(null, body)
  })
}

function parserRSSFeed(rss) {
  const handler = new htmlparser.RssHandler()
  const parser = new htmlparser.Parser(handler)
  parser.parseComplete(rss)

  if(!handler.dom.items.length)
    return next(new Error('Nie znaleziono elementow RSS'))

  let item = handler.dom.items.shift();
  console.log(item.title)
  console.log(item.link)
}

const tasks = [ checkForRSSFile,
                readRSSFile,
                downloadRSSFeed,
                parserRSSFeed ];

function next(err, result) {
  if (err) throw err;

  const currentTask = tasks.shift()

  if(currentTask) {
    currentTask(result)
  }
}