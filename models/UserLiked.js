const mongoose= require('mongoose')
const {Schema} = mongoose;


const UserLikedSchema = new mongoose.Schema({
   
   //it is just like forign key in MySql for associating two tables
   //user is reference model name
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    movieId:{
        type:String,
        required:true
    },
    movieTitle:{
        type:String,
        required:true
    },
    movieThumb:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
})


const userlikedModel = mongoose.model('userliked',UserLikedSchema);


module.exports = userlikedModel;