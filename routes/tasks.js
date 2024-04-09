const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb');
const { google } = require('googleapis');

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
    const { userId, 
        taskName, 
        taskDescrption,
        taskDate,
        startTime, 
        endTime, 
        isAlarm, 
        isImportant, 
        userName} = req.body

        if(!validateBoolean(isAlarm) || !validateBoolean(isImportant) ) {
            res.status(400).json({message: 'isAlarm and isImportant must be boolean values'})
            return;
        }
        else{
            try{
                const usersCollection = await connectToMongo('tasks')
                await usersCollection.updateOne(
                    {userId},
                    {$push: {tasks: {taskName, taskDescrption, taskDate, startTime, endTime, isAlarm, isImportant, userName}}},
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
    const {userId} = req.query

    try{
        const taskCollection = await connectToMongo('tasks')
        const user = await taskCollection.findOne({userId});

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

router.get('/fetchTasksByDate', async (req, res) => {
    const {userId, taskDate} = req.body

    try{
        const taskCollection = await connectToMongo('tasks')
        const user = await taskCollection.findOne({userId});

        if(user) {
            const taskWithSameDate = user.tasks.filter(task => task.taskDate === taskDate)
            if(taskWithSameDate.length > 0) {
                res.status(200).json(taskWithSameDate)
            }
            else{
                res.status(404).json({message: `No tasks found for this date for accessToken  `})
            }
        }
        else {
            res.status(404).json({message: `No tasks found for this date for accessToken  `})
        }
    }
    catch (error) {
        console.log("Error fetching tasks:", error)
        res.status(400).json({message: 'Error fetching tasks'})
    }
})

router.get('/fetchGoogleTasks', async (req, res) => {

    try{
        const {accessToken} = req.body;

        const oauth2Client = new google.auth.OAuth2();
        
        oauth2Client.setCredentials({access_token: accessToken})
    
        const calendar = google.calendar({version: 'v3', auth: oauth2Client})
    
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        })
    
        const tasks = response.data.items.map(event => {
            return{
                id: event.id,
                summary: event.summary,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
            }
        })
    
        res.json({tasks})
    }
    catch(error) {
        console.log("Error fetching tasks:", error)
        res.status(404).json({message: 'Error fetching tasks'})
    }
   
})

module.exports = router

//ya29.a0Ad52N3_Lz3fqss-zXO-TH1gYI5RvawmJAu7ih-pgyBVJrgZjcRlPz2FCykjbG27PlwbXHh5N4Z73N2-6ndoaa5ko1Q1Gu1WdBINUBZDitefBxXds0GFiqysS_jTHuwc2GZD8465RWyGkKHju_x1cVrE_23YG1Fpn9AaCgYKAa0SARISFQHGX2MiYvgCN9qu61hNccHIPy0gCg0169