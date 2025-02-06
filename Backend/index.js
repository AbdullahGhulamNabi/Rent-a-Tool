const express = require('express')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:5173'
}))

const port = 3000





app.listen(port)