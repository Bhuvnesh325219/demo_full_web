const express = require('express')
const User = require('../models/User')
const UserLiked = require('../models/UserLiked')
const UserSubscription =require('../models/UserSubscription')
const router = express.Router();
const {body,validator, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUser')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const JWT_SECRET = "itismymediastreamapp";

//API-1 Create the User using POST "api/auth/createUser" , No Login required
router.post("/createUser",[
  
    //check validations
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter valid password').isLength({min:5})

],async (req,res)=>{
    
    const errors =  validationResult(req);
     let success=false; 
    //if the error then return bad request
    if(!errors.isEmpty()){
        return res.status(400).json({success:success,errors: errors.array()});
    }

    try {
        
    
    //check the user already exist with this email
    let user = await User.findOne({email:req.body.email});
      
    if(user){
        return res.status(400).json({success:success,error:"User already exist"})
    } 
     
    const salt = await bcrypt.genSalt(10);
    let securePassword =   await bcrypt.hash(req.body.password,salt);

     user = await User.create({
        name:req.body.name,
        password:securePassword,
        email:req.body.email
    })

    //const usersubscription = new UserSubscription();
    //const json = await usersubscription.save();
     



    const data={
        user:{
            id:user.id
        }
    }
    const authtoken =  jwt.sign(data,JWT_SECRET)
      //console.log(authtoken) 
      
    success=true;
    //.then(user=>res.json(user))
     res.json({success:success,authtoken:authtoken,users:user})
    } catch (error) {
        console.error(error)
        res.status(500).send({success:success,error:"Sorry error occured"})
    }

})










//API-2 Login the User using POST "api/auth/login" , No Login required
router.post('/login',[

 //check validations
 body('email','Enter a valid email').isEmail(),
 body('password','Enter cant be blank').exists()
],
async(req,res)=>{

    const errors =  validationResult(req);
    let success=false;
 //if the error then return bad request
 if(!errors.isEmpty()){
    return res.status(400).json({success:success,errors: errors.array()});
 }


const {email,password} = req.body;

 try {
    
let user =await  User.findOne({email});

if(!user){
    return res.status(400).json({success:success,error:"Please try to login with correct credentials"})
}


const passwordCompare = await bcrypt.compare(password,user.password);

if(!passwordCompare){
    return res.status(400).json({success:success,error:"Please try to login with correct credentials"})
}


const data={
    user:{
        id:user.id
    }
}
const authtoken =  jwt.sign(data,JWT_SECRET)
success=true; 
res.json({success:success,authtoken:authtoken})
  
 } catch (error) {
    console.error(error)
    res.status(500).send({success:success,error:"Internal server error occured"})
 }


})















//API-3 Get logged in User details using POST "api/auth/getUser" ,Login required
router.post('/getUser',fetchUser,async(req,res)=>{
       
    let success=false;
    
    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password")
        
        if(user) success=true;

        res.send({success:success,user:user})
        } catch (error) {
            console.error(error)
            res.status(500).send("Internal server error occured")
        }
})













//API-4 Like the movie by user using POST "api/auth/likeMovie" ,Login required
router.post('/likeMovie/:id',fetchUser,async(req,res)=>{
     
    let success=false;
    
try {

    let alreadyLiked = await UserLiked.findOne({user:req.user.id,movieId:req.params.id})
     if(alreadyLiked){
        return res.status(400).json({success:success,error:"User Already Liked this"})
     }

    const userlike = new UserLiked({user:req.user.id,movieId:req.params.id,movieTitle:req.body.title,movieThumb:req.body.thumb});
    const saveduserlike = await userlike.save()
    
    if(saveduserlike) success=true;
    
    res.json({success:success,saveduserlike:saveduserlike})
    
} catch (error) {
    console.error(error)
    res.status(500).send("Sorry error occured")
}

})










//API-5 dislike the movie by user using DELETE "api/auth/dislikeMovie" ,Login required
//here id === object id in database
router.delete('/dislikeMovie/:id',fetchUser,async(req,res)=>{
 
     let success=false; 

    try {    
       let likeMovie = await UserLiked.findOne({user:req.user.id,movieId:req.params.id});
       if(!likeMovie) {
        return res.status(404).send({success:success,error:"Movie not found"})
       }
       
     
       //check the logged in user authorized or not for this note
      if(likeMovie.user.toString()!==req.user.id){
        return res.status(404).send({success:success,error:"You are not Authorized"})
       }
       
       
       //likeMovie =await UserLiked.findByIdAndDelete(req.params.id)
       const savedlikeMovie = await UserLiked.findOneAndDelete({user:req.user.id,movieId:req.params.id})

       if(savedlikeMovie) success=true;

       res.json({success:success,savedlikeMovie:savedlikeMovie})
       

    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry error occured")
    }
    
    })
    
    



//API-6 Fetch all liked of user using GET "api/auth/fetchLikes" ,Login required
router.get('/fetchLikes',fetchUser,async(req,res)=>{
     

      
    try {
        const likes = await UserLiked.find({user:req.user.id})
        res.json(likes)      
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry error occured")
    }


  
})



//API-7 take subscriptions by user using POST "api/auth/subscribe" ,Login required
router.post('/subscribe/:plantype',fetchUser,async(req,res)=>{
    
    let success=false;
    try {

        let alreadySubscribed = await UserSubscription.findOne({user:req.user.id})
         if(alreadySubscribed){
            return res.status(400).json({success:success,error:"User Already subscribed"})
         }



         
    
        const userSubscribed = new UserSubscription({user:req.user.id,subscribed:true,planType:req.params.plantype,paymentinfo:{payment_id:req.body.paymentinfo.razorpay_payment_id,order_id:req.body.paymentinfo.razorpay_order_id}});
        const saveduserSubscribed = await userSubscribed.save()  
        if(saveduserSubscribed) success=true;

        res.json({success:success,saveduserSubscribed:saveduserSubscribed})
        
    } catch (error) {
        console.error(error)
        res.status(500).send("Sorry error occured")
    }


})





//API-8 Check user have subscription or not using GET "api/auth/checkSubscribe" ,Login required
router.get('/checkSubscribe',fetchUser,async(req,res)=>{
    
   try {
    const subscribed = await UserSubscription.find({user:req.user.id})
    res.json(subscribed)

   } catch (error) {
    console.error(error)
    res.status(500).send("Sorry error occured")
   }


})













//API-9 Create order for payment  using POST "api/auth/createOrder" ,Login required
const YOUR_KEY_ID='rzp_test_2wiNgOY5T4ASm8';
const YOUR_SECRET = 'kDubgpdj34xre2RO4nf4a3UF'

router.post('/createOrder',(req,res)=>{
   
   
let instance = new Razorpay({ 
    key_id: YOUR_KEY_ID, 
    key_secret: YOUR_SECRET })

var options = {
  amount: req.body.amount*100, //convert in peso  
  currency: "INR",
};
instance.orders.create(options, function(err, order) {
    if(err){
        return res.send({code:500,message:err})
    }
    return res.send({code:200,message:"Order created",data:order})
});


})









//API-9 Verify order for payment  using POST "api/auth/verifyOrder" ,Login required
router.post("/verifyOrder",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
    
     var expectedSignature = crypto.createHmac('sha256', 'kDubgpdj34xre2RO4nf4a3UF')
                                     .update(body.toString())
                                     .digest('hex');
                                   
     
     if(expectedSignature === req.body.response.razorpay_signature){
       res.send({code:200,message:"Signature Valid"});}
       else{
        res.send({code:500,message:"Signature Invalid"});
       }
     });
   





    


//export the router
module.exports = router