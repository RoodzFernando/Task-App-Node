const express = require('express')
const router = express.Router()
const User = require('../models/user')
const print = require('../utils')
const auth = require('../middleware/auth')



router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({token})
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
  // try {
  //  const users = await User.find({})
  //  res.send(users)
  // } catch(e) {
  //   res.status(400).send(e)
  // }
})

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/users/:id', async (req, res) => {
  const modifiedFields = Object.keys(req.body)
  try {
    const user = await User.findById(req.params.id)
    modifiedFields.forEach(field => user[field] = req.body[field])
    await user.save()
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).send()
    res.send(user)
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({token})
  } catch (error) {
    print(error)
    res.status(400).send({'message': 'Unable to login'})
  }
})

module.exports = router