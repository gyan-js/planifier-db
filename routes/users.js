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

router.post('/add/google', async (req, res) => {
    const { accessToken, 
        userName, 
        userEmail
          } = req.body

    try{
        const usersCollection = await connectToMongo('users')
        await usersCollection.updateOne(
            {accessToken},
            {$push: {info: {userName, userEmail}}},
            {upsert: true}
        );
        res.status(200).json({message: 'User Added to DB'})
    }
    catch(error) {
        console.log('Error adding user:', error)
        res.status(400).json({message: 'Error adding user'})
    }
})

router.get('/fetch/google', async (req, res) => {
    const {accessToken} = req.body

    try{
        const usersCollection = await connectToMongo('users')
        const user = await usersCollection.findOne({accessToken});

        if(user) {
            res.status(200).json(user.info)
        }
        else {
            res.status(400).json({message: 'User not found'})
        }
    }
    catch(error){
        console.log('Error fetching user:', error)
        res.status(400).json({message: 'Error fetching user'})
    }
})

router.post('/add/email', async (req, res) => {
    const { 
        userName, 
        userEmail,
        password
          } = req.body

    try{
        const usersCollection = await connectToMongo('users')
        await usersCollection.updateOne(
            {userEmail},
            {$push: {info: {userName, password}}},
            {upsert: true}
        );
        res.status(200).json({message: 'User Added to DB'})
    }
    catch(error) {
        console.log('Error adding user:', error)
        res.status(400).json({message: 'Error adding user'})
    }
})

router.get('/fetch/email', async (req, res) => {
    const {userEmail} = req.body

    try{
        const usersCollection = await connectToMongo('users')
        const user = await usersCollection.findOne({userEmail});

        if(user) {
            res.status(200).json(user.info)
        }
        else {
            res.status(400).json({message: 'User not found'})
        }
    }
    catch(error){
        console.log('Error fetching user:', error)
        res.status(400).json({message: 'Error fetching user'})
    }
})


module.exports = router