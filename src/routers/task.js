const express = require('express')
const Task = require('../models/task')
const router = express.Router()


router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  try {
    const task = await Task.findById(req.params.id)
    updates.forEach(field => task[field] = req.body[field])
    await task.save()
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove(req.params.id)
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router