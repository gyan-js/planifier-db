const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
//const admin = require('firebase-admin');
const service = require('./serviceAccount.json')


const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()

admin.initializeApp({
    credential: admin.credential.cert(service),
    databaseURL: "https://planifier-8a954-default-rtdb.firebaseio.com"
  });
  
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.json({message: "Hello Planifier"})
})


app.post('/storeAccessToken', (req, res) => {
    const {userId, accessToken} = req.body

    admin.database().ref(`/user/${userId}`).update({
        accessToken: accessToken
    })
    .then(() => {
        res.status(200).send("Access token stored to DB")
    })
    .catch(error => {
        console.error("Error storing access token:", error);
        res.status(500).send("Error storing access token");
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})