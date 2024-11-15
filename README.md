# OAuthHub

OAuthHub is a robust authentication service that provides a centralized authentication solution using various OAuth providers.

## Project Structure

```
OAuthHub/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   ├── apiRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── models/
│   │   └── User.js
│   └── config/
│       └── passportConfig.js
└── package.json
```

## Features

- OAuth2.0 Authentication
- User Management
- RESTful API
- Passport.js Integration
- Modular Route Structure

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for user data storage)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/OAuthHub.git
cd OAuthHub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add necessary environment variables:
```env
PORT=3001
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/facebook/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/auth/linkedin/callback
```

## Usage

To start the server:

```bash
npm start
```

For development with nodemon:
```bash
npm run dev
```

## API Routes

- `/auth/*` - Authentication routes
- `/api/*` - API endpoints
- `/user/*` - User management routes





## Authentication Routes

### Google OAuth

```bash
# Initiate Google OAuth flow
curl -X GET http://localhost:3001/auth/google

# Callback URL (handled by the server)
# http://localhost:3001/auth/google/callback
```

### Facebook OAuth

```bash
# Initiate Facebook OAuth flow
curl -X GET http://localhost:3001/auth/facebook

# Callback URL (handled by the server)
# http://localhost:3001/auth/facebook/callback
```

### LinkedIn OAuth

```bash
# Initiate LinkedIn OAuth flow
curl -X GET http://localhost:3001/auth/linkedin

# Callback URL (handled by the server)
# http://localhost:3001/auth/linkedin/callback
```

## User Routes

### Get User Profile

Retrieves a specific user's profile by ID.

```bash
# GET /profile/:id
curl -X GET http://localhost:3001/users/profile/64a82743b12345678901234

# Response (200 OK)
{
    "_id": "64a82743b12345678901234",
    "name": "John Doe",
    "email": "john@example.com",
    "provider": "google"
}

# Error Response (404 Not Found)
{
    "message": "User not found"
}
```

### Update User Profile

Updates a user's profile information.

```bash
# PUT /profile/:id
curl -X PUT http://localhost:3001/users/profile/64a82743b12345678901234 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }'

# Response (200 OK)
{
    "_id": "64a82743b12345678901234",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "provider": "google"
}

# Error Response (404 Not Found)
{
    "message": "User not found"
}
```

### Get Paginated Users

Retrieves a paginated list of users with sorting options.

```bash
# GET /users
# Parameters:
# - page (default: 1)
# - limit (default: 10)
# - sort (default: { createdAt: -1 })

# Get first page with 10 users
curl -X GET "http://localhost:3001/users/users"

# Get second page with 5 users
curl -X GET "http://localhost:3001/users/users?page=2&limit=5"

# Response (200 OK)
{
    "users": [
        {
            "_id": "64a82743b12345678901234",
            "name": "John Doe",
            "email": "john@example.com",
            "provider": "google"
        },
        // ... more users
    ],
    "totalPages": 5,
    "currentPage": 1,
    "totalUsers": 50
}
```

## API Status Routes

### Check API Status

```bash
# GET /api/status
curl -X GET http://localhost:3001/api/status

# Response (200 OK)
{
    "status": "API is running",
    "timestamp": "2023-07-20T10:30:00.000Z"
}
```

### Welcome Endpoint

```bash
# GET /api
curl -X GET http://localhost:3001/api

# Response (200 OK)
{
    "status": "Welcome to OauthHub",
    "timestamp": "2023-07-20T10:30:00.000Z"
}
```

## Error Responses

All endpoints may return the following error response in case of server errors:

```json
{
    "message": "Server error",
    "error": "Error details message"
}
```

## Notes

1. All OAuth authentication flows require browser interaction and cannot be fully tested with curl commands.
2. The callback URLs are handled automatically by the server after successful OAuth authentication.
3. For protected routes, you may need to include authentication tokens in the headers (implementation dependent).
4. All responses are in JSON format.
5. Default pagination returns 10 items per page.





## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.







