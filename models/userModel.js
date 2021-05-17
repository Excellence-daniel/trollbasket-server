const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  phonenumber: String,
  password: String,
  agreeToTerms: Boolean,
  receivenotification: Boolean,
  createdon: { type: Date, default: new Date() },
})

UserSchema.pre('save', function (next) {
  const user = this

  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) return next(err)

    // change the password to the hashed version
    user.password = hash
    next()
  })
})

UserSchema.methods.comparePassword = function (password) {
  try {
    var user = this

    return bcrypt.compareSync(password, user.password)
  } catch (e) {
    console.log('password compare exception:', e)
    return false
  }
}

module.exports = mongoose.model('users', UserSchema)
