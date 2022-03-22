const { connect, connection } = require('mongoose')


connect('mongodb://localhost:27017/task-manager-api')
const db = connection
db.on('error', console.error.bind('DB cannot start off'))






