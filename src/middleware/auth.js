const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1]
    const decoded = jwt.verify(token, 'HelloMYName')
    // console.log(decoded)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
    if (!user) throw new Error()
    req.user = user
    req.token = token
    next()
  } catch (e) {
    console.log(e)
    res.status(401).send({message: 'Please authenticate'})
  }
}

module.exports = auth