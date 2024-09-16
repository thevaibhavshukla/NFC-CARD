const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
// mongoose.connect('mongodb+srv://vaibhavshukla2910:vaibhavshukla2910@cluster0.zu9ug.mongodb.net/NFC-CARD?retryWrites=true&w=majority&appName=Cluster0')

const connection = mongoose.connection

connection.on('error', err => console.log(err))

connection.on('connected' , () => console.log('Mongo DB Connection Successfull'))