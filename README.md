# OAuthHub Backend 🔐

OAuthHub is a robust, production-ready authentication service that provides a centralized OAuth solution supporting multiple providers. This backend API serves as the authentication hub for modern web applications.

## 🔗 Related Repositories

- **Frontend Repository**: [OAuthHub Frontend](https://github.com/Rakibul73/oauthhub_frontend)
- **Backend Repository**: [OAuthHub Backend](https://github.com/Rakibul73/OAuthHub)

## 🚀 Current Features

### Core Authentication
- ✅ **Multi-Provider OAuth2.0** - Google, Facebook, LinkedIn
- ✅ **Secure Token Management** - JWT token generation and validation
- ✅ **Session Management** - Express sessions with secure configuration
- ✅ **User Profile Management** - Create, read, update user profiles

### Infrastructure & Performance
- ✅ **HTTPS Support** - SSL/TLS encryption with custom certificates  
- ✅ **Clustered Architecture** - Multi-core CPU utilization for high performance
- ✅ **MongoDB Integration** - Mongoose ODM with user data persistence
- ✅ **CORS Configuration** - Cross-origin resource sharing for frontend integration

### API Features
- ✅ **RESTful API Design** - Clean, standardized endpoints
- ✅ **User Management** - Profile CRUD operations with pagination
- ✅ **Health Check Endpoints** - API status monitoring
- ✅ **Error Handling** - Comprehensive error responses

## 🏗️ Project Structure

```
OAuthHub/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # HTTPS server with clustering
│   ├── routes/
│   │   ├── authRoutes.js      # OAuth authentication routes
│   │   ├── userRoutes.js      # User management routes
│   │   └── apiRoutes.js       # API status routes
│   ├── models/
│   │   └── User.js            # User schema & model
│   └── services/
│       ├── auth.service.js    # Authentication service
│       ├── user.service.js    # User management service
│       ├── google.service.js  # Google OAuth service
│       ├── facebook.service.js # Facebook OAuth service
│       ├── linkedin.service.js # LinkedIn OAuth service
│       └── db.service.js      # Database service
├── ssl/                       # SSL certificates
├── .env                       # Environment variables
└── package.json
```
=======

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: OAuth 2.0 (Google, Facebook, LinkedIn)
- **Security**: HTTPS/SSL, Express Sessions, CORS
- **Performance**: Node.js Cluster module
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- SSL certificates (provided in `/ssl` directory)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Rakibul73/OAuthHub.git
cd OAuthHub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
SESSION_SECRET=your_super_secret_session_key

# Database
MONGO_URI=mongodb://localhost:27017/oauthhub

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://localhost:3000/auth/google/callback

# Facebook OAuth Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://localhost:3000/auth/facebook/callback

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=https://localhost:3000/auth/linkedin/callback
```

### 4. Start the Server
```bash
# Production mode with clustering
npm start

# Development mode (if you have nodemon installed)
npm run dev
```

The server will be available at `https://localhost:3000`

## 🔗 Frontend Integration

This backend is designed to work with the [OAuthHub Frontend](https://github.com/Rakibul73/oauthhub_frontend). Make sure to:

1. Set the correct API URL in your frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://localhost:3000
   ```

2. Ensure both applications are running on HTTPS for OAuth providers to work properly

## 📚 API Documentation

### Base URL
```
https://localhost:3000
```
=======





### 🔐 Authentication Endpoints

#### OAuth Initiation
| Provider | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| Google | `/auth/google` | GET | Initiates Google OAuth flow |
| Facebook | `/auth/facebook` | GET | Initiates Facebook OAuth flow |
| LinkedIn | `/auth/linkedin` | GET | Initiates LinkedIn OAuth flow |

#### OAuth Callbacks
| Provider | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| Google | `/auth/google/callback` | GET | Handles Google OAuth callback |
| Facebook | `/auth/facebook/callback` | GET | Handles Facebook OAuth callback |
| LinkedIn | `/auth/linkedin/callback` | GET | Handles LinkedIn OAuth callback |

**Example OAuth Flow:**
```bash
# Step 1: Initiate OAuth (redirects to provider)
GET https://localhost:3000/auth/google

# Step 2: Provider redirects back with code
# GET https://localhost:3000/auth/google/callback?code=xyz&state=abc

# Step 3: Server responds with tokens
{
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token", 
    "accessTokenExpireIn": 3600,
    "refreshTokenExpireIn": 7200
}
```

### 👤 User Management Endpoints

#### Get User Profile
```bash
GET /users/profile/:id

# Example
curl -X GET https://localhost:3000/users/profile/64a82743b12345678901234

# Response
{
    "_id": "64a82743b12345678901234",
    "name": "John Doe",
    "google": {
        "id": "google_user_id",
        "email": "john@gmail.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Update User Profile
```bash
PUT /users/profile/:id

# Example
curl -X PUT https://localhost:3000/users/profile/64a82743b12345678901234 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'
```

#### Get Paginated Users
```bash
GET /users/users?page=1&limit=10

# Example
curl -X GET "https://localhost:3000/users/users?page=1&limit=5"

# Response
{
    "users": [...],
    "totalPages": 10,
    "currentPage": 1,
    "totalUsers": 50
}
```

### 🔍 API Status Endpoints

#### Health Check
```bash
GET /api/status

# Response
{
    "status": "API is running",
    "timestamp": "2024-06-27T10:30:00.000Z"
}
```

#### Welcome
```bash
GET /api

# Response  
{
    "status": "Welcome to OauthHub",
    "timestamp": "2024-06-27T10:30:00.000Z"
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  google: {
    id: String,
    email: String
  },
  facebook: {
    id: String, 
    email: String
  },
  linkedin: {
    id: String,
    email: String
  },
  createdAt: Date
}
```

## 🔒 Security Features

- **HTTPS Enforcement** - All communication encrypted with SSL/TLS
- **CORS Protection** - Configured for frontend domain only
- **Session Security** - Secure session management with Express
- **OAuth State Parameter** - CSRF protection in OAuth flows
- **Environment Variables** - Sensitive data stored securely

## ⚡ Performance Features

- **Clustering** - Utilizes all available CPU cores
- **Connection Pooling** - MongoDB connection optimization
- **Async/Await** - Non-blocking I/O operations
- **Error Handling** - Comprehensive error catching and reporting

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Deployment
1. Set up MongoDB (Atlas or self-hosted)
2. Configure OAuth provider credentials
3. Set up SSL certificates
4. Configure environment variables
5. Deploy to your preferred platform (AWS, Google Cloud, etc.)

## 🔧 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `SESSION_SECRET` | Session encryption key | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | Yes |
| `FACEBOOK_APP_ID` | Facebook app ID | Yes |
| `FACEBOOK_APP_SECRET` | Facebook app secret | Yes |
| `FACEBOOK_CALLBACK_URL` | Facebook callback URL | Yes |
| `LINKEDIN_CLIENT_ID` | LinkedIn client ID | Yes |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn client secret | Yes |
| `LINKEDIN_REDIRECT_URI` | LinkedIn redirect URI | Yes |

## 🐛 Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   - Ensure certificates are in `/ssl` directory
   - Check certificate validity and paths

2. **OAuth Provider Errors**
   - Verify client IDs and secrets
   - Check callback URLs match provider settings
   - Ensure HTTPS is enabled

3. **Database Connection Issues**
   - Verify MongoDB URI
   - Check database connectivity
   - Ensure proper network access

4. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check protocol (HTTP vs HTTPS) consistency
=======





## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add appropriate error handling
- Update documentation for new features
- Test OAuth flows thoroughly
- Ensure security best practices

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Rakibul Islam**
- GitHub: [@Rakibul73](https://github.com/Rakibul73)
- LinkedIn: [Connect with me](https://linkedin.com/in/rakibul73)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database solution
- OAuth provider teams (Google, Facebook, LinkedIn) for their APIs
- Open source community for various packages used

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

For questions or support, please open an issue in the GitHub repository.
=======







