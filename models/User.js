const mongoose= require('mongoose')
const {Schema} = mongoose;

const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },

})


const userModel= mongoose.model('users',UserSchema);

//userModel.createIndexes();
module.exports = userModel