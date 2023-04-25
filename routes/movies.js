const express = require('express')
const router = express.Router();
const Movies = require('../models/Movie')



//API-1 fetch all (subscriptions) movies GET "api/auth/fetchAllMovies" ,No Login required
//susbscription required for these movies

router.get('/fetchAllMovies',async(req,res)=>{
    
    const movies = await Movies.find({});
  try {
   
    res.send(movies);
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error occured")
  }


})












module.exports = router