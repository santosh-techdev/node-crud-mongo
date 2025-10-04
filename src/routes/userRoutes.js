const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', verifyToken, getUsers);

module.exports = router;
