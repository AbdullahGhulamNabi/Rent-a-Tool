const express = require('express')
const cors = require('cors')
const guestUserRoutes = require('./Routes/GuestUser.js')
const loggedInUserRoutes = require('./Routes/LoggedInUser.js')


const app = express()
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173'
}))
const port = 3000

app.use("/",guestUserRoutes)
// app.use("/dashboard",loggedInUserRoutes)





app.listen(port)