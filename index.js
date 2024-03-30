const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const service = require('./serviceAcc.json')


const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()

const mongoUri = 'mongodb+srv://sweetdeviljs05:itzezy2prog@cluster0.6rmup.mongodb.net/'
const dbName = 'planifier'
//const collectionName = 'users'

app.use(bodyParser.json())

const connectToMongo = async (collectionName) => {
    client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    await client.connect()
    return client.db(dbName).collection(collectionName)
}

app.get('/', (req, res) => {
    res.json({message: "Hello Planifier"})
})


app.post('/storeAccessToken', async (req, res) => {
    console.log("Received request to store access token");
    const { accessToken } = req.body;

    try {
      const tokenCollection = await connectToMongo('tokens');
       await tokenCollection.updateOne(
        { accessToken },
        { $set: { accessToken } },
        { upsert: true } // Create user document if it doesn't exist
      );
      res.status(200).json({ message: 'Access token stored successfully' });
    } catch (error) {
      console.error('Error storing access token:', error);
      res.status(500).send('Error storing access token');
    }
});


app.post('/addTask', async (req, res) => {
    const { accessToken, taskName, description, startTime, endTime, userName } = req.body;

    try{
        const usersCollection = await connectToMongo('tasks')
        await usersCollection.updateOne(
            {accessToken},
            {$push: {tasks: {taskName, description, startTime, endTime, userName}}},
            {upsert: true}
        );
        res.status(200).json({message: 'Task Added to DB'})
    } 
    catch(error) {
        console.log('Error adding task:', error)
        res.status(400).json({message: 'Error adding task'})
    }
})

app.get('/fetchTasks', async (req, res) => {
    const {accessToken} = req.body

    try{
        const taskCollection = await connectToMongo('tasks')
        const user = await taskCollection.findOne({accessToken});

        if(user) {
            res.status(200).json(user.tasks)
        }
        else {
            res.status(404).json({message: 'No tasks found for this accessToken'})
        }
    }
    catch (error) {
        console.log("Error fetching tasks:", error)
        res.status(400).json({message: 'Error fetching tasks'})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})