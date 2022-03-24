const express = require('express')
const print = require('./utils')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000
const app = express()

// Add a custom middleware

// app.use((req, res, next) => {
//   res.status(503).send({message: "Maintenamce interruptions!"})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => print(`Server is up on port ${port}`))