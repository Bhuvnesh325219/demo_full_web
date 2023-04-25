const mongoose= require('mongoose')



//const mongoURI='mongodb://127.0.0.1:27017/mediatestdatabase';
const mongoURI = 'mongodb+srv://user:userpass@cluster0.srjlthb.mongodb.net/test';


const connectToMongo=async()=>{
     mongoose.connect(mongoURI,()=>{
        
         console.log("Database connected successfully")
     })
   







}













/*
const connectToMongo=async()=>{
    try{
     await mongoose.connect(mongoURI,()=>{
        console.log("success")
     })
    }catch(err){
        console.log("Failed to connect",err)
    }
}
*/



module.exports=connectToMongo;


