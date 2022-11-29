// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// function to format date: should be "Fri, 25 Dec 2015 00:00:00 GMT"
const displayTime = (time) => {
  //format date
  const optionsDate = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit"
    };
  let text = time.toLocaleDateString('en-DE', optionsDate);

  //format time
  const optionsTime ={
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
  const shortTime = new Intl.DateTimeFormat('en-DE', optionsTime);
  let textTime = shortTime.format(time);

  //concatenate date and time
  text = text + " "+ textTime + " GMT";
  return text;
}

// A request to /api/:date? with a valid date should return a JSON object with a unix key that is a Unix timestamp of the input date in milliseconds (as type Number)
app.get("/api/:date", function (req, res) {
  console.log(req.params.date +" - " +req.ip);
  var time = new Date(req.params.date);
  if (time != "Invalid Date"){
    // /api/:date? with a valid date should return a JSON 
    result = displayTime(time);
    res.json({unix: time.getTime(), utc: result});    
  }
  else{
    var time = new Date(+req.params.date);
    // A request to /api/1451001600000 should return a JSON Object
    if (time != "Invalid Date"){
      result = displayTime(time);
      res.json({unix: time.getTime(), utc: result});    
    }
    else{
      // If the input date string is invalid,
      res.json({error: "Invalid Date" });
    } 
  }
});

// An empty date parameter (/api/)  should return the current time 
app.get("/api/", function (req, res) {
  var time = new Date();
  result = displayTime(time);
  res.json({unix: time.getTime(), utc: result});  
});
