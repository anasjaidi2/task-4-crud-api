const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')

const router = express.Router()

// 1- Add one user or an array of users (use sample-users.json to add five).
router.post('/users', async (req, res) => {
    try {
        const inputIsArray = Array.isArray(req.body)
        const data = inputIsArray ? req.body : [req.body]

        if (data.length === 0) {
            return res.status(400).send({ error: 'Please provide at least one user' })
        }

        const createdUsers = await User.insertMany(data)
        res.status(201).send(createdUsers)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// 2- Get all users.
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// 3- Get one user by _id.
router.get('/users/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ error: 'Invalid user ID' })
        }

        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

// 4- Update allowed fields and return the updated user.
router.patch('/users/:id', async (req, res) => {
    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'city']
    const updatesAreValid = requestedUpdates.every((field) => allowedUpdates.includes(field))

    if (!updatesAreValid) {
        return res.status(400).send({ error: 'Allowed fields are name, age, and city only' })
    }

    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ error: 'Invalid user ID' })
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// 5- Delete one user by _id and return a confirmation message.
router.delete('/users/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({ error: 'Invalid user ID' })
        }

        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }

        res.status(200).send({
            message: 'User deleted successfully',
            deletedUser: user
        })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router
