var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
//var session = require('express-session');
//var passport = require('./auth');
//require passport
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine','jade');


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
//Session
app.use(express.session({
        secret:"here are my secret word!!@!",
        saveUninitialized:true,
        resave:true}));

//passport usage
app.use(passport.initialize());
app.use(passport.session());

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
       console.log("DB Connected and ready");
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


// Letting auth sees Workers


app.use(app.router);

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        console.log("hello!");
        Worker.find({ email: email}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user[0].password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
            });
    }
));


passport.serializeUser(function(user, done) {
    //done(null, user[0]._id.id);
    done(null, user[0]);
});

passport.deserializeUser(function(user, done) {
//    Worker.findOne(id, function(err, user) {
        done(null, user);
  //  });
});

//check if the user is authenticated or not, this function return true or false and will be used to protect a route

function hasAuth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

app.get('/', function(req,res){
      res.render('index.jade');
    });

//ById
//Log in

//app.get('/login', function(req,res){
//    res.render('login.jade');
//})


//login with passport support test

app.get('/login', routes.login);

//app.use(function(req, res, next) {
//    var sess = req.session
//    console.log(sess);
//});

//POST LOG IN MY WAY
//app.post('/login', function(req,res){
//     var b=req.body;
//     Worker.find({email: b.email},function(err,docs){
//         if (err){return res.json(err)} //when there is no email found return correct log to user, and when password is not correct check later TODO
//         else if(b.password===docs[0].password )
//         {   sess.email = b.email;
//             sess.sid = docs[0]._id;
//             console.log(req.session);
//         }
//     })
//       console.log(req.session);
//    res.redirect('/slydr');
//})

//POST LOG IN PASSPORT WAY not working yet TODO

app.post('/login', passport.authenticate('local',{
          failureRedirect :'/login',
          successRedirect :'/slydr'}
));


app.get('/slydr', hasAuth, function(req,res){
  res.render('slydr.jade', {title:'hi'});
  console.log('woooha');
});

//app.post('/slydr', function(req,res){
//    // if (!req.session) {res.redirect('/login')}
//    // else
//    res.render('slydr.jade', {title:'hi'});
//    console.log('Heyyyy!');
//});

app.post('/editors', function(req, res) {
var b = req.body;
console.log(b);
new Editor({
  name: b.name,
  lastname:b.lastname,
  email: b.email,
  password:b.password,
  git:b.git
  }).save(function(err, res) { if (err) console.log("err saving your information come back later!");
    res.redirect('/slydr', {user:b.name})
    })
});

// Get the Editor Sign Up form
app.get('/editors', function(req,res){
                    res.render("editors.jade"); 
                    });
//list all editors
app.get('/alleditors', function(req,res) {
    Editor.find({}, function (err, docs) {
        if (err) {return res.json(err)}
        console.log(docs);
        res.render("alleditors.jade", {docs: docs});
    });
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

// To find anything with in editors, the id needed to populate the requests to link them to the corresponding editor
//    Editor.findOne({_id:req.params.id}, function(err, docs) {
 //   console.log(docs._id);
    new Request({
           reqid: rid,
           title: b.title,
           description:b.description
            }).save(function(err, response) { if (err) console.log("err saving your information come back later!")});
         console.log(b);
         res.redirect('/')
    });

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
            Request.find({reqid:req.params.id}, function(req,tasks){
            res.render('tasks.jade', {tasks:tasks});
                    });
 });


//doing a post to tasks required by an editor
app.post('/editorstest/:id', function(req,res){
// Editor.update({_id:ObjectId(req.params.id)},{title:b.title});

    var b = req.body;
    var rid = req.params.id;
// To find anything with in editors, the id needed to populate the requests to link them to the corresponding editor
//    Editor.findOne({_id:req.params.id}, function(err, docs) {
    //   console.log(docs._id);
    new Request({
        reqid: rid, //extra remove later
        title: b.title,
        description:b.description
        }).save(function(err, response) { if (err) console.log("err saving your information come back later!")});
    console.log(b);
    res.redirect('/editors/'+rid)
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

