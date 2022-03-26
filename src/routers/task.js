const express = require('express')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {
  const task = new Task({...req.body, owner: req.user._id})
  try {
    await task.save()
    res.status(201).send(task)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({owner: req.user._id})
    res.send(tasks)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
    const task = req.user.populate('tasks').execPopulate()
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  try {
    const task = await Task.findOne({_id: req.body.id, owner: req.user._id})
    if (!task) return res.status(404).send()
    updates.forEach(field => task[field] = req.body[field])
    await task.save()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id',auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
    if (!task) return res.status(404).send()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router