require('dotenv').config()
const { connect, connection } = require('mongoose')
const URL = process.env['DB_URL']
connect(URL)
const db = connection
db.on('error', console.error.bind('DB cannot start off'))






