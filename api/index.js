const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoute = require('../routes/tasks') 
const userRoute = require('../routes/users')
const configRoute = require('../routes/config')
const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()


app.use(bodyParser.json())
app.use(cors());
app.get('/', (req, res) => {
    res.json({message: "Hello Planifier"})
})


app.use('/api/tasks', taskRoute)
app.use('/api/users', userRoute)
app.use('/api/config', configRoute)
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
