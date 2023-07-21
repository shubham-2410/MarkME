const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    maxlength: 20,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    maxlength: 20,
    minlength: 3,
  },
  div:{
    type: String,
    required: [true, 'Please division'],
    maxlength: 1,
    minlength: 1,
    trim: true, // Add trim property to remove leading/trailing whitespace
    uppercase: true
  },
  branch:{
    type: String,
    required: [true, 'Please select branch'],
    trim: true, // Add trim property to remove leading/trailing whitespace
    uppercase: true
  },
  rollNo:{
    type: String,
    require: [true,'Please Roll Number'],
  },
  mobileNo:{
    type:Number,
    require: [true , 'Please provide mobile number'],
    minlength: 10,
    maxlength: 10,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  confPassword: {
    type: String,
    minlength: 6,
  },
  teacher:{
    type:Boolean,
    defaule:false,
  }
})

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('student', UserSchema)
