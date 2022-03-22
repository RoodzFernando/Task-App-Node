const { Schema, model } = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const print = require('../utils')
const jwt = require('jsonwebtoken')


const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    trim: true,
    validate (value) {
      if (value < 0) throw new Error('Age should be a positive value')
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate (value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid')
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate (value) {
      if (value.includes('password')) throw new Error('your password cannot contain "password"')
    }
  },
  tokens: [{
    token: {
      type:String,
      required: true
    }
  }]
})
// Signature JWT
const signature = 'HelloMYName'
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, signature, {'expiresIn': '2 minutes'})
  this.tokens = this.tokens.concat({token})
  await this.save()
  return token
}

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({email})
  const isMatch = await bcrypt.compare(password, user.password)
  print(isMatch)
  if (!user) throw new Error('Unable to login')
  if (!isMatch) throw new Error('Unable to login')
  return user
}

userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

module.exports = model('User', userSchema)