const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-__v -passwordHash')
        res.status(200).send(users)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get users',
            error: err.message,
        })
    }
})

// POST a new user
router.post('/', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: passwordHash,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
        })
        const savedUser = await user.save()
        const { passwordHash: _ph, ...userWithoutPassword } =
            savedUser.toObject()
        res.status(201).send({
            message: 'User registered successfully',
            user: userWithoutPassword,
        })
    } catch (err) {
        res.status(500).send({
            message: 'Failed to save user',
            error: err.message,
        })
    }
})

// POST login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.passwordHash
        )
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Incorrect password' })
        }
        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        // Exclude passwordHash from response
        const { passwordHash, __v, ...userData } = user.toObject()
        res.status(200).send({
            message: 'Login successful',
            user: userData,
            token: token,
        })
    } catch (err) {
        res.status(500).send({
            message: 'Login failed',
            error: err.message,
        })
    }
})

// GET user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            '-__v -passwordHash'
        )
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get user',
            error: err.message,
        })
    }
})

// GET current user (me)
router.get('/get/me', async (req, res) => {
    try {
        // req.auth is set by express-jwt middleware
        const userId = req.auth && req.auth.userId
        if (!userId) {
            return res.status(401).send({ message: 'Not authenticated' })
        }
        const user = await User.findById(userId).select('-__v -passwordHash')
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get user',
            error: err.message,
        })
    }
})

// PATCH update a user by id
router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: req.body.passwordHash,
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
            },
            { new: true }
        ).select('-__v -passwordHash')
        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send(updatedUser)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to update user',
            error: err.message,
        })
    }
})

module.exports = router
