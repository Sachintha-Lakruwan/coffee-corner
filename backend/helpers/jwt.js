const { expressjwt: expressJwt } = require('express-jwt')
require('dotenv').config()

const authJwt = () => {
    const secret = process.env.JWT_SECRET
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            `${api}/users/login`,
            { url: `${api}/users`, methods: ['POST'] },
            { url: new RegExp(`${api}/products(.*)`), methods: ['GET'] },
            { url: new RegExp(`${api}/categories(.*)`), methods: ['GET'] },
            `/`,
            `${api}/health`,
        ],
    })
}

async function isRevoked(req, token) {
    // Allow any authenticated user to access /users/get/me
    if (req.path.includes('/users/get/me')) {
        return false
    }

    // Allow any authenticated user to create an order
    if (req.path.includes('/orders/get/my') && req.method === 'GET') {
        return false
    }
    if (req.path.includes('/orders') && req.method === 'POST') {
        return false
    }

    // For all other routes, only allow admin users
    if (token.payload.isAdmin) {
        return false
    }
    return true
}

module.exports = authJwt
