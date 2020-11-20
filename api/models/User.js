const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: String,
  },
  { timestamps: true }
)

// hash password before saving user
userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

// method to generate token
userSchema.methods.generateAuthToken = function() {
  const user = this
  const token = jwt.sign({ id: user._id, email: user.email }, 'secret')
  return token
}

userSchema.statics.verifyAuthToken = function(token) {
  const decoded = jwt.verify(token, 'secret')
  return decoded
}

// method to verify login email, password
userSchema.statics.findByCredentials = async function(email, password) {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return { error: 'Email does not exist', code: 404 }
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return { error: 'Wrong password', code: 401 }
    }
    return user
  } catch (error) {
    console.log(error)
  }
}

module.exports = User = mongoose.model('User', userSchema)
