const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb+srv://sweetdeviljs05:itzezy2prog@cluster0.6rmup.mongodb.net/'
const dbName = 'planifier'

const connectToMongo = async (collectionName) => {
    client = new MongoClient(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    await client.connect()
    return client.db(dbName).collection(collectionName)
}

const validateBoolean = (value) => {
    return typeof value === 'boolean';
};


router.post('/addTask', async (req, res) => {
    const { accessToken, 
        taskId,
        taskName, 
        taskDescrption, 
        startTime, 
        endTime, 
        isAlarm, 
        isImportant, 
        userName} = req.body

        if( !validateBoolean(isAlarm) || !validateBoolean(isImportant) ) {
            res.status(400).json({message: 'isAlarm and isImportant must be boolean values'})
            return;
        }
        else{
            try{
                const usersCollection = await connectToMongo('tasks')
                await usersCollection.updateOne(
                    {accessToken},
                    {$push: {tasks: {taskName, taskDescrption, startTime, endTime, isAlarm, isImportant, userName}}},
                    {upsert: true}
                );
                res.status(200).json({message: 'Task Added to DB'})
            }
            catch(error) {
                console.log('Error adding task:', error)
                res.status(400).json({message: 'Error adding task'})
            }
        }   
})

router.get('/fetchTasks', async (req, res) => {
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

module.exports = router