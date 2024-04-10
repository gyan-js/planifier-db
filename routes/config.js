const express = require('express')
const router = express.Router();

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function getDateString() {
    const date = new Date()

    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];

    const dayOfMonth = date.getDate();

    const suffix = (dayOfMonth >= 11 && dayOfMonth <= 13) ? 'th' : (dayOfMonth % 10 === 1) ? 'st' : (dayOfMonth % 10 === 2) ? 'nd' : (dayOfMonth % 10 === 3) ? 'rd' : 'th';

    const currentDate = dayOfMonth+suffix+' '+month+','+' '+dayOfWeek;
    return currentDate
}

router.get('/fetchDate', (req,res) => {
    const date = getDateString()
    res.status(200).json(date)
})

module.exports = router