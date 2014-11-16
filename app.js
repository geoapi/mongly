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
app.set('port', process.env.PORT || 2000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
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
    mongoose.connect(db_url);
}
else {
 // var db_url = "mongodb://printvoid:nodecrud@ds063869.mongolab.com:63869/nodecrud";
 // mongoose.connect(db_url);
    //TODO Add mongolab please
    var db_url = "mongodb://localhost/storedata";
    // var db_url = "mongodb://printvoid:nodecrud@ds063869.mongolab.com:63869/nodecrud";
    console.log("DB locally Connected not production ready")
    mongoose.connect(db_url);
    console.log("Go and define a mongoDB on Mongolab and connect the uri in app.js please")
}

mongoose.connect(db_url);
var Schema = mongoose.Schema;

// Editor Schema
var editorSchema = Schema({
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
var workerSchema = Schema({
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
var requestSchema = Schema({
    _creator:{type:Number, ref:'Editor'},
    title:String,
    description:String,
    pickers: [{type:Number, ref:'Worker'}]
});




var Editor = mongoose.model('Editor', editorSchema);
var Request= mongoose.model('Request', requestSchema);
var Worker = mongoose.model('Worker', workerSchema);




app.get('/', routes.index);
app.get('/users', function(req, res) {
    Users.find({}, function(err, docs) {
        res.render('users', {users: docs});
    });
});

app.get('/users/new', function(req, res) {
    res.render('users/new');
});

app.post('/users', function(req, res) {
    var b = req.body;
    new Users({
        name: b.name,
        email: b.email,
        phone: b.phone
    }).save(function(err, user) {
            if(err) res.json(err);
            res.redirect('/users/' + user.name);
        })
});

// In Arabic this is what brings name from DB calling next will let below functions see name
app.param('name', function(req, res, next, name) {
    Users.find({name:name}, function(err, docs) {
        req.user = docs[0];
        next();
    });
});
//SHOW
app.get('/users/:name', function(req, res) {
    res.render('users/show', {user:req.user});
});

//EDIT
app.get('/users/:name/edit', function(req, res){
    res.render('users/edit', { user:req.user});
});

//UPDATE
app.put('/users/:name', function(req, res) {
    var b = req.body;
        Users.update(
        { name: req.params.name },
        {name: b.name, email: b.email, phone: b.phone},
            function(err) {
                res.redirect('/users/' + b.name);
            }
    )
});

//DELETE
app.delete('/users/:name', function(req, res) {
    Users.remove({name:req.params.name}, function(err) {
        res.redirect('/users');
    })
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
