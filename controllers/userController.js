const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')[process.env.NODE_ENV || 'dev']

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

  login: async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.body.email }).exec()
      if (!user) {
        return res.status(400).json({
          message:
            'Unable to sign in. Please confirm that you have provided the correct email.',
        })
      }
      var validPassword = user.comparePassword(req.body.password)
      if (!validPassword) {
        return res.status(400).json({
          message:
            'Wrong Password. Please input the right password and try again',
        })
      }

      const token = jwt.sign(
        { email: user.email, firstname: user.firstname },
        config.secret,
        { expiresIn: 86400 },
      )
      return res.status(200).json({ ...user._doc, token })
    } catch (error) {
      console.log({ error })
      return res.status(500).json({
        message: 'Cannot log user in. Please try again later',
        error,
      })
    }
  },
}
