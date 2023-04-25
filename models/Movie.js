const mongoose= require('mongoose')
const {Schema} = mongoose;


const MovieSchema = new mongoose.Schema({
   
   //it is just like forign key in MySql for associating two tables
   //user is reference model name
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:"General"
    },
    sources:{
        type:String,
        default:"No media url"
    },
    thumb:{
        type:String,
        default:"No thumbnail url"
    },
    release_year:{
        type:String,
        default:"2000"
    },
    movie_hrs:{
        type:String,
        default:"0 hrs"
    },
    like_count:{
        type:String,
        default:"0 likes"
    },
    timestamp:{
        type:Date,
        default:Date.now
    },

})


const moviesModel = mongoose.model('movies',MovieSchema);


module.exports = moviesModel;