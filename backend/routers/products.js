const express = require('express')
const router = express.Router()
const Product = require('../model/product')

// GET all products with optional category filter
router.get('/', async (req, res) => {
    let filter = {}
    if (req.query.category) {
        const categories = req.query.category.split(',')
        filter.category = { $in: categories }
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : 0
    try {
        const productsQuery = Product.find(filter).select('-__v')
        if (limit > 0) {
            productsQuery.limit(limit)
        }
        const products = await productsQuery
        res.status(200).send(products)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get products',
            error: err.message,
        })
    }
})

// GET product by id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .select('-__v')
            .populate('category')
        if (!product) {
            return res.status(404).send({ message: 'Product not found' })
        }
        res.status(200).send(product)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get product',
            error: err.message,
        })
    }
})

// POST a new product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
    })
    try {
        const savedProduct = await product.save()
        res.status(201).send(savedProduct)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to save product',
            error: err.message,
        })
    }
})

// POST a list of products
router.post('/bulk', async (req, res) => {
    if (!Array.isArray(req.body.products)) {
        return res.status(400).send({ message: 'products must be an array' })
    }
    // Remove 'id' and convert category.$oid to string if present
    const products = req.body.products.map((prod) => {
        const { id, ...productWithoutId } = prod
        let category = productWithoutId.category
        if (category && typeof category === 'object' && category.$oid) {
            category = category.$oid
        }
        return { ...productWithoutId, category }
    })
    try {
        console.log(products)
        const savedProducts = await Product.insertMany(products, {
            ordered: false,
        })
        res.status(201).send(savedProducts)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to save products',
            error: err.message,
        })
    }
})

// GET product count
router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments()
        res.status(200).send({ productCount })
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get product count',
            error: err.message,
        })
    }
})

// GET all featured products with optional limit
router.get('/get/featured', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0
    try {
        const featuredProducts = await Product.find({ isFeatured: true })
            .select('-__v')
            .limit(limit)
        res.status(200).send(featuredProducts)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get featured products',
            error: err.message,
        })
    }
})

// PATCH update a product by id
router.patch('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
                dateCreated: req.body.dateCreated,
            },
            { new: true }
        )
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' })
        }
        res.status(200).send(updatedProduct)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to update product',
            error: err.message,
        })
    }
})

module.exports = router
