const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

module.exports = {
  register: async (req, res) => {
    try {
      let user = new userModel(req.body)
      user = await user.save()

      const token = jwt.sign(
        { email: user.email, firstname: user.firstname },
        config.secret,
        { expiresIn: 86400 },
      )

      return res.status(201).json({ ...user._doc, token })
    } catch (error) {
      return res.status(500).json({
        message: 'Cannot create user at the moment. Please try again',
        error,
      })
    }
  },
}
