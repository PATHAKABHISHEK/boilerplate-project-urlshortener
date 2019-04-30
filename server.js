'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

mongoose.connect("mongodb://localhost/UrlDB", 
                  {useMongoClient: true}, 
                  (err) => {
                    if (err) {
                      console.log(err);
                    }else{
                      console.log("MongoDb connection Succeeded");
                    }
                  });
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({extended:true}));

// creating mongoose schema

const urlSchema = mongoose.Schema({
  full_url : {
    type : String
  }, 
  short_url : {
    type : Number
  }
});

const Url = mongoose.model('Url', urlSchema);



app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

const validate = (body) =>{
  // all host name validation will goes here
}


const get_shorturl = (body) => {
  // it will provide short url for specific url
  if(validate()){
    // here we will check database
    // if database doesn't contain that host then we will add it to database 

  }else{

  }

}

app.post('/api/shorturl/new', (req, res) => {
  
  Url.find((err, doc) => {
    if(err) {
      console.log(err);
    }else {
      var present = false
      var response_json = {}
      doc.forEach((data) => {
        if(data.full_url === req.body.url){
          present = true
          response_json = {"original_url" : data.full_url,
                           "short_url"    : data.short_url}
        }
      });
      
      if (!present){
        var url = new Url();
          url.full_url = req.body.url;
          url.save((err, doc) => {
            if (err) {
              console.log(err);
            }else {
              console.log('Successfully saved date in database');  
            }
          });
          res.send('hello world');
      }else {
        res.json(response_json);
      }
    }
  });
  

});


app.listen(port, function () {
  console.log('Node.js listening ...');
});