const functions = require("firebase-functions");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { getActivities, postActivity, patchActivity, deleteActivity} = require('./src/activities')



const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/activities', getActivities)
app.post('/activities', postActivity)
app.patch('/activities/:activityId', patchActivity)
app.delete('/activities/:activityId', deleteActivity)

exports.app = functions.https.onRequest(app)
