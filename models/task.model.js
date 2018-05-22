var mongoose = require('mongoose');
//const crypto = require('crypto'); 
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 50
    },
    projectName : {
        type: String,
        required : true
    },
    desc : {
        type : String,
        minlength : 20,
        maxlength : 160 
    },
    owner : {
        type : String,
        required : true 
    },
    dueDate : {
        type : Date,
        required : true
    },
    completionPercent : {
        type : Number,
        default: 0,
        min: 0,
        max: 100 
    },
    status : {
        type : String,
        default: 'Pending' 
    },
    assignedTo : {
        type : String,
        required : true 
    },
    statusUpdates :[{
        // statusId:{
        //     type: String,
        //     default :crypto.randomBytes(8).toString('hex')
        // },
        desc:{
            type: String
        },
        updateAt:{
            type: Date
        }
    }],
    watchers :[{
        type: String
    }]
}, {timestamps : true}
);

module.exports = mongoose.model('Task', taskSchema);