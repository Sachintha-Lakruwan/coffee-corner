const express = require('express')
const router = express.Router()
const Order = require('../model/order')
const OrderItem = require('../model/orderItem')
const Product = require('../model/product')

// GET all orders or orders by user
router.get('/', async (req, res) => {
    try {
        let filter = {}
        if (req.query.userId) {
            filter.user = req.query.userId
        }

        const orders = await Order.find(filter)
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: { path: 'category' },
                },
            })
            .populate('user', 'name email')
            .select('-__v')
        res.status(200).send(orders)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get orders',
            error: err.message,
        })
    }
})

// GET order by id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: { path: 'category' },
                },
            })
            .populate('user', 'name email')
            .select('-__v')

        if (!order) {
            return res.status(404).send({ message: 'Order not found' })
        }

        res.status(200).send(order)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get order',
            error: err.message,
        })
    }
})

// POST a new order
router.post('/', async (req, res) => {
    try {
        // Create order items first
        const orderItemsIds = await Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                const newOrderItem = new OrderItem({
                    product: orderItem.product,
                    quantity: orderItem.quantity,
                })
                const savedOrderItem = await newOrderItem.save()
                return savedOrderItem._id
            })
        )

        // Calculate total price
        const totalPrices = await Promise.all(
            orderItemsIds.map(async (orderItemId) => {
                const orderItem =
                    await OrderItem.findById(orderItemId).populate('product')
                const totalPrice = orderItem.product.price * orderItem.quantity
                return totalPrice
            })
        )

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

        const order = new Order({
            orderItems: orderItemsIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })

        const savedOrder = await order.save()
        res.status(201).send(savedOrder)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to create order',
            error: err.message,
        })
    }
})

// PATCH update order status by id
router.patch('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: { path: 'category' },
                },
            })
            .populate('user', 'name email')
            .select('-__v')

        if (!updatedOrder) {
            return res.status(404).send({ message: 'Order not found' })
        }

        res.status(200).send(updatedOrder)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to update order status',
            error: err.message,
        })
    }
})

// DELETE order by id
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).send({ message: 'Order not found' })
        }

        // Delete associated order items
        await OrderItem.deleteMany({ _id: { $in: order.orderItems } })

        // Delete the order
        await Order.findByIdAndDelete(req.params.id)

        res.status(200).send({
            message: 'Order and order items deleted successfully',
        })
    } catch (err) {
        res.status(500).send({
            message: 'Failed to delete order',
            error: err.message,
        })
    }
})

// GET total sales with filters
router.get('/get/totalsales', async (req, res) => {
    try {
        let filter = {}

        // Filter by user
        if (req.query.userId) {
            filter.user = req.query.userId
        }

        // Filter by date range
        if (req.query.dateFrom || req.query.dateTo) {
            filter.dateOrdered = {}
            if (req.query.dateFrom) {
                filter.dateOrdered.$gte = new Date(req.query.dateFrom)
            }
            if (req.query.dateTo) {
                filter.dateOrdered.$lte = new Date(req.query.dateTo)
            }
        }

        // Get orders with filters
        let orders = await Order.find(filter).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                populate: { path: 'category' },
            },
        })

        // Filter by product if specified
        if (req.query.productId) {
            orders = orders.filter((order) =>
                order.orderItems.some(
                    (item) =>
                        item.product._id.toString() === req.query.productId
                )
            )
        }

        // Filter by category if specified
        if (req.query.categoryId) {
            orders = orders.filter((order) =>
                order.orderItems.some(
                    (item) =>
                        item.product.category._id.toString() ===
                        req.query.categoryId
                )
            )
        }

        // Calculate total sales
        const totalSales = orders.reduce((total, order) => {
            return total + order.totalPrice
        }, 0)

        res.status(200).send({
            totalSales: totalSales,
            orderCount: orders.length,
        })
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get total sales',
            error: err.message,
        })
    }
})

// GET orders for the authenticated user
router.get('/get/my', async (req, res) => {
    try {
        // Get user ID from JWT token
        const userId = req.auth.id

        const orders = await Order.find({ user: userId })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: { path: 'category' },
                },
            })
            .populate('user', 'name email')
            .select('-__v')
            .sort({ dateOrdered: -1 }) // Sort by newest first

        res.status(200).send(orders)
    } catch (err) {
        res.status(500).send({
            message: 'Failed to get user orders',
            error: err.message,
        })
    }
})

module.exports = router
