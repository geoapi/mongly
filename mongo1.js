/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
}

if(env === 'development') {
  var db_url = "mongodb://localhost/storedata";
//    var db_url =  "mongodb://geoapi:P@$$!tN0w@ds053090.mongolab.com:53090/mongly";
    mongoose.connect(db_url);
}
else {
       var db_url =  "mongodb://geoapi:P@$$!tN0w@ds053090.mongolab.com:53090/mongly";
       console.log("DB Connected and ready")
       mongoose.connect(db_url);
}

var Schema = mongoose.Schema;

// Editor Schema
var editorSchema = new Schema({
    _id:Number,
    name:String,
    lastname:String,
    email:String,
    password:String,
    phone:String,
    git:String,
    address:String,
    requests: [{type:Schema.Types.ObjectId, ref:'Request'}]
    });


//worker Schema
var workerSchema = new Schema({
    _id:Number,
    name:String,
    lastname:String,
    email:String,
    password:String,
    git:String,
    register_date:Date,
    picked_tasks: [{type:Schema.Types.ObjectId, ref:'Request'}]
});

// Requests (Title & Description)
var requestSchema = new Schema({
    _creator:{type:Number, ref:'Editor'},
    title:String,
    description:String,
    pickers: [{type:Number, ref:'Worker'}]
});




var Editor = mongoose.model('Editor', editorSchema);
var Request= mongoose.model('Request', requestSchema);
var Worker = mongoose.model('Worker', workerSchema);




app.get('/', function(req,res){
      res.end('we have reached the api');
    })

app.post('/editors', function(req, res) {
var b = req.body;
console.log(b);
new Editor({
  name: b.name,
  lastname:b.lastname,
  email: b.email,
  password:b.password,
  git:b.git
  }).save(function(err, respose) { if (err) res.json(err);
     res.redirect('/') 
    })
});

app.get('/editors', function(req,res){
Editor.find({}, function(err, editors) {
        res.json(editors);
    });
}
);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
