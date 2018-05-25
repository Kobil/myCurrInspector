//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var bodyParser = require('body-parser')
app.use( bodyParser.json({limit: '1mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '1mb'
}));



var request = require('request');

//var myHost = 'localhost';
var myHost = '0.0.0.0';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || myHost

var global_data = require('./global_data');
var moment = global_data.moment;

app.get('/', function (req, res) {
  let today = moment();
  let tenYearPred =  moment(today).subtract(10, "years");
  console.log("dates: from " + tenYearPred + " to " + today);
  let valuteId = '840';
  let url = "http://nbt.tj/tj/kurs/export_xml_dynamic.php?d1=" + tenYearPred.format('YYYY-MM-DD') + "&d2=" + today.format('YYYY-MM-DD') + "&cn=" + valuteId +  "&export=xml";
  console.log("url: " + url);
    request(url, (error, response, body)=>{
      request.post("http://localhost:8080/nbt").form({key : 'test', body : body});
    });

  res.render('index.html', { pageCountMessage : null});
  
});

app.post('/nbt', function(req, res){
  console.log('ok')
  console.log(req.body.key);
  console.log(req.body.body);
  res.end('ok');
});



// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});



app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
