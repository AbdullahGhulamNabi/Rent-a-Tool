const express = require('express')
const cors = require('cors')
const guestUserRoutes = require('./Routes/GuestUser.js')
const loggedInUserRoutes = require('./Routes/LoggedInUser.js')
const toolRoutes = require('./Routes/ToolRoutes.js')

const app = express()
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}))
app.use(express.static('public'))
const port = 3000

app.use("/",guestUserRoutes)
app.use("/dashboard",loggedInUserRoutes)
app.use("/api/tools", toolRoutes)

app.listen(port)
console.log(`Server is running on port ${port}`)