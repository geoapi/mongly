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
 //   _id:Number,
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
  //  _id:Number,
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
    reqid:String,
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
  }).save(function(err, response) { if (err) console.log("err saving your information come back later!");
    res.redirect('/') 
    })
});

// Get the Editor Sign Up form
app.get('/editors', function(req,res){
                    res.render("editors.jade"); 
                    });

//Editor - Write a request
app.get('/editors/:id', function(req,res){
                    res.render("editorreq.jade", {user:req.params.id});
     // for now redirect  to make some requests
    // TODO Editors' posts need to be populated to the jadeview and also shown, with ability to add for more
         });

//app.param('id', function(req, res, next, id) {
//    Editor.findOne({_id:id}, function(err, docs) {
///        req.id = docs[0];
//        next();
//    });
//});

app.post('/editors/:id', function(req,res){
// Editor.update({_id:ObjectId(req.params.id)},{title:b.title}); 

    var b = req.body;
    var rid = req.params.id;
    console.log(b, rid);

// To find anything with in editors, the id needed to poulate the requests to link them to the corresponding editor
//    Editor.findOne({_id:req.params.id}, function(err, docs) {
 //   console.log(docs._id);
    new Request({
           reqid: rid,
           title: b.title,
           description:b.description,
            }).save(function(err, response) { if (err) console.log("err saving your information come back later!")});
         console.log(b);
         res.redirect('/')
    })

// This is how we can find something by an Id for example could be used by app.param middleware better to pass id to next function
//app.post('/editors/:id', function(req,res){
//         Editor.findOne({_id:req.params.id}, function (err, b){
           // res.end(b);
         // console.log(req.params.id, b);                        
                         
//          console.log(b.name);                        
//      })}
//);

//show all tasks requested by an editor with id :id
    app.get('/etasks/:id', function(req,res){
            Request.find({reqid:'54698842edb40c8053000002'}, function(req,tasks){
            res.render('tasks.jade', {tasks:tasks});
                    });
 });




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
