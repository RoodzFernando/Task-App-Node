const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')
const { rawListeners } = require('../models/task')
const { query } = require('express')


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
  const match = {}
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  if (req.query.sortBy) {
    const [ str, man ] = req.query.sortBy.split(':')
    sort[str] = man === 'desc' ? -1 : 1
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    })
    res.send(req.user.tasks)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if (!task) return res.status(404).send()
    await task.populate({
      'path': 'owner'
    })
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