const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 */
router.get('/:id', verifyToken, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user and send OTP verification to their email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - contact_no
 *               - password
 *               - confirm_password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jhony Deo"
 *               email:
 *                 type: string
 *                 example: "useremail@example.com"
 *               contact_no:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "Strong@123"
 *               confirm_password:
 *                 type: string
 *                 example: "Strong@123"
 *     responses:
 *       200:
 *         description: A verification OTP has been sent to your email.
 *       400:
 *         description: Missing or invalid input
 *       409:
 *         description: User or email already exists
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', verifyToken, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
