const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const taskRoute = require('./routes/tasks') 
const userRoute = require('./routes/users')
const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()


app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({message: "Hello Planifier"})
})


app.use('/api/tasks', taskRoute)
app.use('/api/users', userRoute)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})