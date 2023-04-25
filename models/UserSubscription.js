const mongoose= require('mongoose')
const {Schema} = mongoose;


const UserSubscriptionSchema = new mongoose.Schema({
   
   //it is just like forign key in MySql for associating two tables
   //user is reference model name
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    subscribed:{
     type:Boolean,
     default:false
    },
    planType:{
     type:String,
     default:"monthly"
    },
    paymentinfo:{
        
     payment_id:{
     type:String,
     required:true
    },
     order_id:{
     type:String,
     required:true 
     }

    },
    timestamp:{
        type:Date,
        default:Date.now
    },
})


const usersubscriptionModel = mongoose.model('usersubscription',UserSubscriptionSchema);


module.exports = usersubscriptionModel;