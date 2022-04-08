const { Schema, model } = require('mongoose')

const TaskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {timestamps: true})

module.exports = model('Task', TaskSchema)