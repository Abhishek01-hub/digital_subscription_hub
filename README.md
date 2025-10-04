# digital_subscription_hub

This is a digital subscription hub API Backend of users,services,subscription and payment

# Routes and the Endpoints

# /users
GET: Get all the list of users in the hub
POST: Register a new user


# /users/{id}
GET: Get a user by their ID
PUT: Updating a user by their ID
DELETE: Deleting a user by their ID

# /users/{id}/subscriptionDetails
GET: Get a user subscription details by their ID 
    >>Date of subscription
    >>status ?
    >>valid till ?

# /users/{id}/payment
GET: Get a users payment history by their ID
    >>Date,Time
    >>subscribed to ?
    >>method ?
    >>status

# /services
GET: Get all the services available in the hub
POST: Add a new service to the hub

# /services/{id}
GET: Get service details by their ID
PUT: Update service details by their ID

# /subscriptions
POST: Subscribe a user to a service

# /subscriptions/{id}
PUT: Renew/Cancel subscription

# /subscriptions/expired
GET: List all expired subscriptions

# /subscriptions/active
GET: List all active subscriptions

# /payment
POST: Record a payment

# /payment/{id}
GET: Get payment history of a user by their ID