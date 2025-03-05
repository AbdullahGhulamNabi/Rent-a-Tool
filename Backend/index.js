const express = require('express')
const cors = require('cors')
const guestUserRoutes = require('./Routes/GuestUser.js')


const app = express()
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173'
}))

app.use("/",guestUserRoutes)

const port = 3000





app.listen(port)