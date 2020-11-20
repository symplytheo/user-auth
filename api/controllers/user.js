const User = require('../models/User')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ 
      state: 'SUCCESS',
      message: 'Loaded all users successfully',
      total: users.length,
      data: users
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

exports.getUser = async (req, res) => {
  try {
    const token = req.headers['x-access-token']
    if (!token) {
      res.status(403).json({
        state: 'ERROR',
        message: 'x-access-token is not provided',
      })
    }
    const payload = User.verifyAuthToken(token)
    const user = await User.findOne({ _id: payload.id })
    res.status(200).json({
      state: 'SUCCESS',
      message: 'Loaded user details successfully',
      data: user
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const isUser = await User.find({ email })
    if (isUser.length >= 1) {
      res.status(409).json({
        state: 'ERROR',
        message: 'Email is already in use'
      })
    } else if (!name || !email || !password) {
      let message = ''
      if (!name) message = 'Name is required'
      if (!email) message = 'Email is required'
      if (!password) message = 'Password is required'
      res.status(400).json({
        state: 'ERROR',
        message
      })
    } else {
      const user = await User.create({ name, email, password })
      const token = user.generateAuthToken()
      res.status(201).json({
        state: 'SUCCESS',
        message: 'Registeration was successful',
        data: user,
        token
      })
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const updates = { name, email } = req.body
    const token = req.headers['x-access-token']
    if (!token) {
      res.status(403).json({
        state: 'ERROR',
        message: 'x-access-token is not provided',
      })
    }
    let data = {}
    for (const key of Object.keys(updates)) {
      if (updates[key] !== null || updates[key] !== '') {
        data[key] = updates[key]
      }
    }
    const payload = User.verifyAuthToken(token)
    data.id = payload.id
    await User.updateOne({ _id: payload.id }, { ...data })
    res.status(200).json({
      state: 'SUCCESS',
      message: 'User profile was updated successfully',
      data
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      let message = ''
      if (!email) message = 'Email is required'
      if (!password) message = 'Password is required'
      res.status(400).json({ state: 'ERROR', message })
    }
    const user = await User.findByCredentials(email, password)
    if (user.error) {
      res.status(user.code).json({ state: 'ERROR', message: user.error })
    }
    const token = user.generateAuthToken()
    res.status(200).json({
      state: 'SUCCESS',
      message: 'Login was successful',
      token
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.find({ _id: id })
    if (user.length >= 1 ) {
      await User.deleteOne({ _id: id })
      res.status(200).json({
        state: 'SUCCESS',
        message: 'User was deleted successfully',
      })
    } else {
      res.status(404).json({ state: 'ERROR', message: 'User does not exist' })
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
}
