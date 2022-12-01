// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require('moment');
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


// ---------------------------------------------------------------
// A request to /api/:date? with a valid date should return a JSON object with a unix key that is a Unix timestamp of the input date in milliseconds (as type Number)
// ---------------------------------------------------------------

// function to format date sting:  should be "Fri, 25 Dec 2015 00:00:00 GMT"
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

// SCENARIO date is NOT GIVEN
app.get("/api", function (req, res) {
  var time = new Date();
  // var timeStamp = time.getTime() + 3000;
  // time = new Date(timeStamp);
  result = displayTime(time);
  res.json({unix: time.getTime(), utc: result});  
});


// SCENARIO date is  GIVEN
app.get(
  "/api/:date",
  (req, res, next) => {
    // SCENARIO date = 2015-12-25 
    var time = new Date(req.params.date);
    if (time != "Invalid Date"){
      req.time = [time];
    }
    else{
      // SCENARIO date = 1451001600000
      var time = new Date(+req.params.date);
      if (time != "Invalid Date"){
        req.time = [time];
      }
      // SCENARIO date is INVALID
      else{
        req.time = [];
      } 
    }     
    next();
  },
  (req, res) => {
    if (req.time.length>0){
      var unix = req.time[0].getTime();
      var utc = displayTime(req.time[0]);
      res.json({unix: unix, utc: utc});    
    }
    else{
      res.json({error: "Invalid Date" });
    }
  }
);
