const admin = require('firebase-admin')
const serviceAccount = require('../../credentials.json')

let db

function authDB() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        })
    }
   db = admin.firestore()
}

exports.getActivities = (req, res) => {
    authDB()
    db.collection('activities').get()   //.where('userId', '==', userId)
    .then(collection => {
        const activityResults = collection.docs.map(activity => {
            let newActivity = activity.data()
            newActivity.id =activity.id
            return newActivity
        })
        res.status(200).json(activityResults)
    })
    .catch(err => res.status(500).send('error getting activities:' + err))
}

exports.postActivity = (req, res) => {
    if(!req.body || !req.body.name || !req.body.userId){
        res.status(401).send('Missing new Activity data')
    }
    authDB()
    const newActivityRequest = req.body
    let now = admin.firestore.FieldValue.serverTimestamp()
    let newActivity = {
        name: req.body.name,
        totalDuration: 0,
        userid: req.body.userId,
        logs: [],
        created: now,
        updated: now,
    }
    db.collection('activities').add(newActivity)
    .then(() => {
        this.getActivities(req, res)
    })
    .catch(err => res.status(500).send('error creating activity:' + err))
}

exports.patchActivity = (req, res) => {
    if(!req.body || !req.body.duration || !req.params.activityId ){ //|| !req.params.userId
        res,status(400).send('invalid request')
    }
    authDB()
    let now = admin.firestore.FieldValue.serverTimestamp()
    db.collection('activities').doc(req.params.activityId).update({
        updated: now,
        logs: admin.firestore.FieldValue.arrayUnion(req.body),
        totalDuration: admin.firestore.FieldValue.increment(Number(req.body.duration))
    })
    .then(() => {
        this.getActivities(req, res)
    })
    .catch(err => res.status(500).send('error updating activity:' + err))

}