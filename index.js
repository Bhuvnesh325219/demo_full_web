const connectToMongo = require('./dbconfig/db')
const express = require('express')
const cors = require('cors')


connectToMongo();


const app = express()
const port = 2000;

//middleware

app.use(express.json())
app.use(cors())

//Available routes

//for authorizationss
app.use('/api/auth',require('./routes/auth'))

//for fetching movies 
app.use('/api/movies',require('./routes/movies'))

//welcome route
app.get('/', (req, res) => {
   res.send('Hello World welcome')
 })


app.listen(port, () => {
    console.log(`MediaStream app listening on port ${port}`  )
  })

  

