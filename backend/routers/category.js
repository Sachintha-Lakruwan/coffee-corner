const express = require('express')
const router = express.Router()
const Category = require('../model/category')

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().select('-__v')
        res.status(200).send(categories)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get categories',
            error: err.message,
        })
    }
})

// POST a new category
router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image,
    })
    try {
        const savedCategory = await category.save()
        res.status(201).send(savedCategory)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to save category',
            error: err.message,
        })
    }
})

// POST a list of categories
router.post('/bulk', async (req, res) => {
    if (!Array.isArray(req.body.categories)) {
        return res.status(400).send({ message: 'categories must be an array' })
    }
    // Remove 'id' field to let MongoDB generate _id automatically
    const categories = req.body.categories
    console.log(categories)
    try {
        const savedCategories = await Category.insertMany(categories, {
            ordered: false,
        })
        res.status(201).send(savedCategories)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to save categories',
            error: err.message,
        })
    }
})

// PATCH update a category by id
router.patch('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                color: req.body.color,
                icon: req.body.icon,
                image: req.body.image,
            },
            { new: true }
        )
        if (!updatedCategory) {
            return res.status(404).send({ message: 'Category not found' })
        }
        res.status(200).send(updatedCategory)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to update category',
            error: err.message,
        })
    }
})

// DELETE a category by id
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id)
        if (!deletedCategory) {
            return res.status(404).send({ message: 'Category not found' })
        }
        res.status(200).send({ message: 'Category deleted successfully' })
    } catch (err) {
        res.status(500).send({
            message: 'Failed to delete category',
            error: err.message,
        })
    }
})

module.exports = router
