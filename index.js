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
      const usersCollection = await connectToMongo('tokens');
       await usersCollection.updateOne(
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


app.post('/addTask', (req, res) => {
    /**const { accessToken, taskName, description, startTime, endTime } = req.body;y

    admin.auth().verifyIdToken(accessToken)
    .then((decodedToken) => {
        const userId = decodedToken.uid

        const taskRef = admin.database().ref(`tasks/${userId}`)
        const newTaskRef = taskRef.push();

        newTaskRef.set({taskName, taskDescription, startTime, endTime})
        .then(() => res.status(200).send("Task added to DB"))
        .catch((error) => res.status(500).send("Error in adding tasks to DB"))
    })
    .catch((error) => {
        console.log("Error verifying access token:", error)
        res.status(401).send("Unauthorized access")
    })**/
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})