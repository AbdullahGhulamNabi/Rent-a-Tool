const express = require('express')
const cors = require('cors')
const guestUserRoutes = require('./Routes/GuestUser.js')
const loggedInUserRoutes = require('./Routes/LoggedInUser.js')
const quickLinks = require("./Routes/quickLinks.js")
const toolsRequested=require("./Routes/toolsRequested.js")
const settings = require("./Routes/settings.js")
const toolRoutes = require('./Routes/ToolRoutes.js')

const app = express()
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}))
app.use(express.static('public'))
const port = 3000

// app.use("/",guestUserRoutes)
// app.use("/dashboard",loggedInUserRoutes)
// app.use("/dashboard/quickLinks",quickLinks)
// app.use("/dashboard/settings",settings)
app.use("/toolsRequested", toolsRequested);
// app.use("/api/tools", toolRoutes)

app.listen(port)
console.log(`Server is running on port ${port}`)