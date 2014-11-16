var mongoose = require('mongoose');
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


