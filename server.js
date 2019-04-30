'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

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




app.post('/api/shorturl/new', (req, res) => {
  const regular_expression = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
  if(regular_expression.test(req.body.url)){
      
  let database_length = 0;
  Url.find((err, doc) => {
    if(err) {
      console.log(err);
    }else {
      var full_url_present = false
      var response_json = {}
      database_length = doc.length;
      doc.forEach((data) => {
        if(data.full_url === req.body.url){
          full_url_present = true
          response_json = {"original_url" : data.full_url,
                           "short_url"    : data.short_url}
        }
      });
      
      if (!full_url_present){
        var url = new Url();
          url.full_url = req.body.url;
          url.short_url = (database_length + 1);
          response_json = {"original_url" : url.full_url, 
                          "short_url" : url.short_url}
          url.save((err, doc) => {
            if (err) {
              console.log(err);
            }else {
              console.log('Successfully saved date in database');  
            }
          });
          
          res.json(response_json);
      }else {
        res.json(response_json);
      }
    }
  });
 
  }
  
  else {
    res.send('Nothing to show');
  }
  

});

app.get('/api/shorturl/:shorturl', (req, res) =>{
  Url.find((err, doc) => {
    if(err){
      console.log(err);
    }else{
      let short_url_present = false;
      let short_urls_full_url = '';
      doc.forEach((data) => {
        if(data.short_url == req.params.shorturl){
          short_url_present = true;
          short_urls_full_url = data.full_url;
        }
      });
      if(short_url_present){
        res.redirect(short_urls_full_url);
      }else{
        res.send('No such short url present');
      }

    }
  })
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});