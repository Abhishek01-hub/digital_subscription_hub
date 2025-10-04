// Import Express and mock data from JSON files
const express = require('express');
const { users } = require('../data/users.json');
const { subscriptions } = require('../data/subscriptions.json');
const { payments } = require('../data/payments.json');
let newUserId=5

// Create a new router instance
const router = express.Router();

// Utility: Get user object by ID
function getUsersById(id) {
    return users.find(u => u.userId === id);
}

// Utility: Get index of user in the array by ID
function getUserIndexById(id) {
    return users.findIndex(u => u.userId === id);
}

// Middleware: Automatically parse :userId param and attach to req
router.param('userId', (req, res, next, id) => {
    req.userId = parseInt(id); // Converts string to number
    next(); // Proceed to route handler
});

// Utility: Standardized response format
function sendResponse(res, status, success, message, data = null) {
    res.status(status).json({ success, message, data });
}

// Route: GET /users → Return all users
router.get('/', (req, res) => {
    sendResponse(res, 200, true, "users", users);
});

// Route: POST /users → Add a new user
router.post('/', (req, res) => {
    const { name, email, createdAt } = req.body;

    // Basic validation of input types
    if (
        typeof name !== 'string' ||
        !email.includes('@') ||
        typeof createdAt !== 'string'
    ) {
        return sendResponse(res, 404, false, "Please enter all req info");
    }

    // Check for duplicate user
    const userByName=users.find(u=>u.name===name)
    const userByEmail=users.find(u=>u.email===email)
    if(userByName && userByEmail){
        return sendResponse(res,400,false,"User already exists with same name and emailId")
    }else if(userByName){
        return sendResponse(res,400,false,"User already exists with same name")
    }else if(userByEmail){
        return sendResponse(res,400,false,"User already exists with same emailId")
    }


    let userId=newUserId++
    // Add new user to array
    users.push({ userId, name, email, createdAt });

    // Return success response with updated users list
    sendResponse(res, 201, true, `User has been successfully added to hub with id:${userId}`, users);
});

// Route: GET /users/:userId → Get user by ID
router.get('/:userId', (req, res) => {
    const userId = req.userId;
    const user = getUsersById(userId);

    if (!user) {
        return sendResponse(res, 404, false, `User not found with id:${userId}`);
    }

    sendResponse(res, 200, true, "user", user);
});

// Route: PUT /users/:userId → Update user by ID
router.put('/:userId', (req, res) => {
    const userId = req.userId;
    const userIndex = getUserIndexById(userId);

    if (userIndex === -1) {
        return sendResponse(res, 200, true, `User not found with id:${userId}`);
    }

    // Merge existing user data with new fields
    users[userIndex] = {
        ...users[userIndex],
        ...req.body
    };

    sendResponse(res, 200, true, "user details has been successfully updated", users[userIndex]);
});

// Route: DELETE /users/:userId → Delete user by ID
router.delete('/:userId', (req, res) => {
    const userId = req.userId;
    const index = getUserIndexById(userId);

    if (index === -1) {
        return sendResponse(res, 404, false, `user not found with Id:${userId}`);
    }

    // Remove user from array
    users.splice(index, 1);

    sendResponse(res, 200, true, `user with id:${userId} has been successfully deleted`, users);
});

// Route: GET /users/:userId/subscriptionDetails → Get subscriptions for user
router.get('/:userId/subscriptionDetails', (req, res) => {
    const userId = req.userId;
    const user = getUsersById(userId);

    if (!user) {
        return sendResponse(res, 404, false, `user with id:${userId} doesn't exist`);
    }

    // Filter subscriptions by userId
    const userSubscriptions = subscriptions.filter(each => each.userId === userId);

    sendResponse(res, 200, true, `subscriptions subscribed by user:${userId}`, userSubscriptions);
});

// Route: GET /users/:userId/payments → Get payment history for user
router.get('/:userId/payments', (req, res) => {
    const userId = req.userId;
    const user = getUsersById(userId);

    if (!user) {
        return sendResponse(res, 404, false, `User not found with id:${userId}`);
    }

    // Get all subscriptions for the user
    const userSubscriptions = subscriptions.filter(each => each.userId === userId);

    // Extract subscription IDs
    const subscriptionIds = userSubscriptions.map(sub => sub.subscriptionId);

    // Filter payments that match user's subscriptions
    const userPayments = payments.filter(payment =>
        subscriptionIds.includes(payment.subscriptionId)
    );

    sendResponse(res, 200, true, `payments completed by user ${userId}`, userPayments);
});

// Export the router to be used in index.js
module.exports = router;